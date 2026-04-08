import { Router } from "express";
import { z } from "zod";

import { getPrismaClient } from "../../lib/prisma";
import { serializeCategory } from "../../lib/catalog";
import { requireAuth } from "../../middleware/auth";
import { slugify } from "../../utils/slugify";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  type: z.enum(["pets", "gadgets"]),
  description: z.string().nullable().optional(),
  parentId: z.string().nullable().optional()
});

router.get("/", async (_request, response) => {
  const prisma = getPrismaClient();
  const categories = await prisma.category.findMany({
    include: {
      children: {
        orderBy: [{ name: "asc" }]
      },
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: [{ type: "asc" }, { parentId: "asc" }, { name: "asc" }]
  });

  return response.json({ items: categories.map(serializeCategory) });
});

router.post("/", requireAuth, async (request, response) => {
  const parsed = categorySchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid category payload.",
      issues: parsed.error.flatten()
    });
  }

  const prisma = getPrismaClient();
  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.slug || parsed.data.name),
      description: parsed.data.description ?? null,
      parentId: parsed.data.parentId ?? null
    },
    include: {
      children: true,
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  return response.status(201).json({ item: serializeCategory(category) });
});

router.put("/:id", requireAuth, async (request, response) => {
  const categoryId = String(request.params.id);
  const parsed = categorySchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid category payload.",
      issues: parsed.error.flatten()
    });
  }

  const prisma = getPrismaClient();
  const exists = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true }
  });
  if (!exists) {
    return response.status(404).json({ message: "Category not found." });
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...parsed.data,
      slug: parsed.data.slug ? slugify(parsed.data.slug) : undefined
    },
    include: {
      children: true,
      _count: {
        select: {
          products: true
        }
      }
    }
  });

  return response.json({ item: serializeCategory(category) });
});

router.delete("/:id", requireAuth, async (request, response) => {
  const categoryId = String(request.params.id);
  const prisma = getPrismaClient();
  const childCount = await prisma.category.count({
    where: { parentId: categoryId }
  });
  const productCount = await prisma.product.count({
    where: { categoryId }
  });

  if (childCount > 0 || productCount > 0) {
    return response.status(400).json({
      message: "Unable to delete category. Remove linked child categories and products first."
    });
  }

  const deleted = await prisma.category.deleteMany({
    where: { id: categoryId }
  });
  if (deleted.count === 0) {
    return response.status(404).json({ message: "Category not found." });
  }

  return response.status(204).send();
});

export const categoriesRouter = router;
