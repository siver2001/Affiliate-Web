import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth";
import { store } from "../../lib/store";
import { slugify } from "../../utils/slugify";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  type: z.enum(["pets", "gadgets"]),
  description: z.string().nullable().optional(),
  parentId: z.string().nullable().optional()
});

router.get("/", (_request, response) => {
  const categories = store.getCategories().map((category) => ({
    ...category,
    children: store.getCategories().filter((item) => item.parentId === category.id),
    productCount: store.getProducts({ categorySlug: category.slug }).length
  }));

  return response.json({ items: categories });
});

router.post("/", requireAuth, (request, response) => {
  const parsed = categorySchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid category payload.",
      issues: parsed.error.flatten()
    });
  }

  const category = store.createCategory({
    ...parsed.data,
    slug: slugify(parsed.data.slug || parsed.data.name),
    description: parsed.data.description ?? null,
    parentId: parsed.data.parentId ?? null
  });

  return response.status(201).json({ item: category });
});

router.put("/:id", requireAuth, (request, response) => {
  const categoryId = String(request.params.id);
  const parsed = categorySchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid category payload.",
      issues: parsed.error.flatten()
    });
  }

  const category = store.updateCategory(categoryId, {
    ...parsed.data,
    slug: parsed.data.slug ? slugify(parsed.data.slug) : undefined
  });

  if (!category) {
    return response.status(404).json({ message: "Category not found." });
  }

  return response.json({ item: category });
});

router.delete("/:id", requireAuth, (request, response) => {
  const deleted = store.deleteCategory(String(request.params.id));
  if (!deleted) {
    return response.status(400).json({
      message: "Unable to delete category. Remove linked products first."
    });
  }

  return response.status(204).send();
});

export const categoriesRouter = router;
