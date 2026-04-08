import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { productWithRelationsInclude, serializeProduct } from "../../lib/catalog";
import { getPrismaClient } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";
import { slugify } from "../../utils/slugify";

const router = Router();

const imageSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0)
});

const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional()
});

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  shortDescription: z.string().min(10),
  fullDescription: z.string().nullable().optional(),
  socialDescription: z.string().nullable().optional(),
  suitableFor: z.string().nullable().optional(),
  pros: z.string().nullable().optional(),
  cons: z.string().nullable().optional(),
  price: z.number().nullable().optional(),
  thumbnail: z.string().url().nullable().optional(),
  shopeeUrl: z.string().url().nullable().optional(),
  lazadaUrl: z.string().url().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  categoryId: z.string(),
  images: z.array(imageSchema).default([]),
  tags: z.array(tagSchema).default([])
});

function parseBoolean(value: unknown) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
}

router.get("/", async (request, response) => {
  const section = typeof request.query.section === "string" ? request.query.section : undefined;
  const categorySlug = typeof request.query.category === "string" ? request.query.category : undefined;
  const search = typeof request.query.search === "string" ? request.query.search : undefined;
  const featured = parseBoolean(request.query.featured);
  const published = parseBoolean(request.query.published);
  const prisma = getPrismaClient();

  const where: Prisma.ProductWhereInput = {
    ...(section || categorySlug
      ? {
          category: {
            is: {
              ...(section ? { type: section } : {}),
              ...(categorySlug ? { slug: categorySlug } : {})
            }
          }
        }
      : {}),
    ...(typeof featured === "boolean" ? { isFeatured: featured } : {}),
    ...(typeof published === "boolean" ? { isPublished: published } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { shortDescription: { contains: search, mode: "insensitive" } },
            { fullDescription: { contains: search, mode: "insensitive" } },
            { socialDescription: { contains: search, mode: "insensitive" } },
            {
              category: {
                is: {
                  name: { contains: search, mode: "insensitive" }
                }
              }
            },
            {
              productTags: {
                some: {
                  tag: {
                    name: { contains: search, mode: "insensitive" }
                  }
                }
              }
            }
          ]
        }
      : {})
  };

  const items = await prisma.product.findMany({
    where,
    include: productWithRelationsInclude,
    orderBy: [{ sortOrder: "desc" }, { updatedAt: "desc" }]
  });

  return response.json({ items: items.map(serializeProduct), total: items.length });
});

router.get("/:slug", async (request, response) => {
  const prisma = getPrismaClient();
  const product = await prisma.product.findUnique({
    where: { slug: request.params.slug },
    include: productWithRelationsInclude
  });
  if (!product) {
    return response.status(404).json({ message: "Product not found." });
  }

  const related = await prisma.product.findMany({
    where: {
      id: {
        not: product.id
      },
      isPublished: true,
      OR: [
        { categoryId: product.categoryId },
        product.category?.type
          ? {
              category: {
                is: {
                  type: product.category.type
                }
              }
            }
          : undefined
      ].filter(Boolean) as Prisma.ProductWhereInput[]
    },
    include: productWithRelationsInclude,
    orderBy: [{ sortOrder: "desc" }, { updatedAt: "desc" }],
    take: 3
  });

  return response.json({
    item: serializeProduct(product),
    related: related.map(serializeProduct)
  });
});

router.post("/", requireAuth, async (request, response) => {
  const parsed = productSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid product payload.",
      issues: parsed.error.flatten()
    });
  }

  const prisma = getPrismaClient();
  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: slugify(parsed.data.slug || parsed.data.name),
      shortDescription: parsed.data.shortDescription,
      fullDescription: parsed.data.fullDescription ?? null,
      socialDescription: parsed.data.socialDescription ?? null,
      suitableFor: parsed.data.suitableFor ?? null,
      pros: parsed.data.pros ?? null,
      cons: parsed.data.cons ?? null,
      price: parsed.data.price ?? null,
      thumbnail: parsed.data.thumbnail ?? null,
      shopeeUrl: parsed.data.shopeeUrl ?? null,
      lazadaUrl: parsed.data.lazadaUrl ?? null,
      isFeatured: parsed.data.isFeatured,
      isPublished: parsed.data.isPublished,
      sortOrder: parsed.data.sortOrder,
      categoryId: parsed.data.categoryId,
      images: {
        create: parsed.data.images.map((image, index) => ({
          imageUrl: image.imageUrl,
          altText: image.altText ?? null,
          sortOrder: image.sortOrder ?? index
        }))
      },
      productTags: {
        create: parsed.data.tags.map((tag) => ({
          tag: {
            connectOrCreate: {
              where: {
                slug: slugify(tag.slug || tag.name)
              },
              create: {
                name: tag.name,
                slug: slugify(tag.slug || tag.name)
              }
            }
          }
        }))
      }
    },
    include: productWithRelationsInclude
  });

  return response.status(201).json({ item: serializeProduct(product) });
});

router.put("/:id", requireAuth, async (request, response) => {
  const productId = String(request.params.id);
  const parsed = productSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid product payload.",
      issues: parsed.error.flatten()
    });
  }

  const payload = parsed.data;
  const prisma = getPrismaClient();
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true }
  });
  if (!existing) {
    return response.status(404).json({ message: "Product not found." });
  }

  const data: Prisma.ProductUpdateInput = {
    ...(payload.name !== undefined ? { name: payload.name } : {}),
    ...(payload.slug !== undefined ? { slug: slugify(payload.slug) } : {}),
    ...(payload.shortDescription !== undefined ? { shortDescription: payload.shortDescription } : {}),
    ...(payload.fullDescription !== undefined ? { fullDescription: payload.fullDescription ?? null } : {}),
    ...(payload.socialDescription !== undefined ? { socialDescription: payload.socialDescription ?? null } : {}),
    ...(payload.suitableFor !== undefined ? { suitableFor: payload.suitableFor ?? null } : {}),
    ...(payload.pros !== undefined ? { pros: payload.pros ?? null } : {}),
    ...(payload.cons !== undefined ? { cons: payload.cons ?? null } : {}),
    ...(payload.price !== undefined ? { price: payload.price ?? null } : {}),
    ...(payload.thumbnail !== undefined ? { thumbnail: payload.thumbnail ?? null } : {}),
    ...(payload.shopeeUrl !== undefined ? { shopeeUrl: payload.shopeeUrl ?? null } : {}),
    ...(payload.lazadaUrl !== undefined ? { lazadaUrl: payload.lazadaUrl ?? null } : {}),
    ...(payload.isFeatured !== undefined ? { isFeatured: payload.isFeatured } : {}),
    ...(payload.isPublished !== undefined ? { isPublished: payload.isPublished } : {}),
    ...(payload.sortOrder !== undefined ? { sortOrder: payload.sortOrder } : {}),
    ...(payload.categoryId !== undefined ? { category: { connect: { id: payload.categoryId } } } : {})
  };

  if (payload.images) {
    data.images = {
      deleteMany: {},
      create: payload.images.map((image, index) => ({
        imageUrl: image.imageUrl,
        altText: image.altText ?? null,
        sortOrder: image.sortOrder ?? index
      }))
    };
  }

  if (payload.tags) {
    data.productTags = {
      deleteMany: {},
      create: payload.tags.map((tag) => ({
        tag: {
          connectOrCreate: {
            where: {
              slug: slugify(tag.slug || tag.name)
            },
            create: {
              name: tag.name,
              slug: slugify(tag.slug || tag.name)
            }
          }
        }
      }))
    };
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data,
    include: productWithRelationsInclude
  });

  return response.json({ item: serializeProduct(product) });
});

router.delete("/:id", requireAuth, async (request, response) => {
  const deleted = await getPrismaClient().product.deleteMany({
    where: { id: String(request.params.id) }
  });
  if (deleted.count === 0) {
    return response.status(404).json({ message: "Product not found." });
  }

  return response.status(204).send();
});

export const productsRouter = router;
