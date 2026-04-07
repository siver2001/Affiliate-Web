import { randomUUID } from "node:crypto";

import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "../../middleware/auth";
import { store } from "../../lib/store";
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

router.get("/", (request, response) => {
  const items = store
    .getProducts({
      section: typeof request.query.section === "string" ? request.query.section : undefined,
      categorySlug: typeof request.query.category === "string" ? request.query.category : undefined,
      search: typeof request.query.search === "string" ? request.query.search : undefined,
      featured: parseBoolean(request.query.featured),
      published: parseBoolean(request.query.published)
    })
    .sort((left, right) => right.sortOrder - left.sortOrder || right.updatedAt.localeCompare(left.updatedAt))
    .map((product) => ({
      ...product,
      category: store.getCategoryById(product.categoryId)
    }));

  return response.json({ items, total: items.length });
});

router.get("/:slug", (request, response) => {
  const product = store.getProductBySlug(request.params.slug);
  if (!product) {
    return response.status(404).json({ message: "Product not found." });
  }

  const category = store.getCategoryById(product.categoryId);
  const related = store
    .getProducts({})
    .filter(
      (item) =>
        item.id !== product.id &&
        (item.categoryId === product.categoryId ||
          store.getCategoryById(item.categoryId)?.type === category?.type)
    )
    .slice(0, 3)
    .map((item) => ({
      ...item,
      category: store.getCategoryById(item.categoryId)
    }));

  return response.json({
    item: {
      ...product,
      category
    },
    related
  });
});

router.post("/", requireAuth, (request, response) => {
  const parsed = productSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid product payload.",
      issues: parsed.error.flatten()
    });
  }

  const product = store.createProduct({
    ...parsed.data,
    slug: slugify(parsed.data.slug || parsed.data.name),
    fullDescription: parsed.data.fullDescription ?? null,
    socialDescription: parsed.data.socialDescription ?? null,
    suitableFor: parsed.data.suitableFor ?? null,
    pros: parsed.data.pros ?? null,
    cons: parsed.data.cons ?? null,
    price: parsed.data.price ?? null,
    thumbnail: parsed.data.thumbnail ?? null,
    shopeeUrl: parsed.data.shopeeUrl ?? null,
    lazadaUrl: parsed.data.lazadaUrl ?? null,
    images: parsed.data.images.map((image, index) => ({
      id: randomUUID(),
      imageUrl: image.imageUrl,
      altText: image.altText ?? null,
      sortOrder: image.sortOrder ?? index
    })),
    tags: parsed.data.tags.map((tag) => ({
      id: tag.id ?? randomUUID(),
      name: tag.name,
      slug: slugify(tag.slug || tag.name)
    }))
  });

  return response.status(201).json({ item: product });
});

router.put("/:id", requireAuth, (request, response) => {
  const productId = String(request.params.id);
  const parsed = productSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid product payload.",
      issues: parsed.error.flatten()
    });
  }

  const payload = parsed.data;
  const product = store.updateProduct(productId, {
    ...payload,
    slug: payload.slug ? slugify(payload.slug) : undefined,
    images: payload.images
      ? payload.images.map((image, index) => ({
          id: randomUUID(),
          imageUrl: image.imageUrl,
          altText: image.altText ?? null,
          sortOrder: image.sortOrder ?? index
        }))
      : undefined,
    tags: payload.tags
      ? payload.tags.map((tag) => ({
          id: tag.id ?? randomUUID(),
          name: tag.name,
          slug: slugify(tag.slug || tag.name)
        }))
      : undefined
  });

  if (!product) {
    return response.status(404).json({ message: "Product not found." });
  }

  return response.json({ item: product });
});

router.delete("/:id", requireAuth, (request, response) => {
  const deleted = store.deleteProduct(String(request.params.id));
  if (!deleted) {
    return response.status(404).json({ message: "Product not found." });
  }

  return response.status(204).send();
});

export const productsRouter = router;
