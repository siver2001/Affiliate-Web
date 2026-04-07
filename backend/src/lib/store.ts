import { randomUUID } from "node:crypto";

import { seedCategories, seedProducts } from "../data/mock-data";
import { slugify } from "../utils/slugify";

export type SectionType = "pets" | "gadgets";

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  type: SectionType;
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TagRecord {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImageRecord {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string | null;
  socialDescription: string | null;
  suitableFor: string | null;
  pros: string | null;
  cons: string | null;
  price: number | null;
  thumbnail: string | null;
  shopeeUrl: string | null;
  lazadaUrl: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  categoryId: string;
  images: ProductImageRecord[];
  tags: TagRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  email: string;
  role: "admin";
}

export interface ProductQuery {
  section?: string;
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
}

type ProductMutation = Omit<ProductRecord, "id" | "createdAt" | "updatedAt">;
type CategoryMutation = Omit<CategoryRecord, "id" | "createdAt" | "updatedAt">;

class InMemoryStore {
  private categories = [...seedCategories];
  private products = [...seedProducts];

  getCategories() {
    return this.categories.map((category) => ({ ...category }));
  }

  getCategoryById(id: string) {
    return this.categories.find((category) => category.id === id) ?? null;
  }

  getCategoryBySlug(slug: string) {
    return this.categories.find((category) => category.slug === slug) ?? null;
  }

  createCategory(input: CategoryMutation) {
    const now = new Date().toISOString();
    const category: CategoryRecord = {
      id: randomUUID(),
      ...input,
      slug: input.slug || slugify(input.name),
      createdAt: now,
      updatedAt: now
    };
    this.categories.push(category);
    return { ...category };
  }

  updateCategory(id: string, input: Partial<CategoryMutation>) {
    const index = this.categories.findIndex((category) => category.id === id);
    if (index === -1) {
      return null;
    }
    const current = this.categories[index];
    const updated: CategoryRecord = {
      ...current,
      ...input,
      slug: input.slug ? slugify(input.slug) : current.slug,
      updatedAt: new Date().toISOString()
    };
    this.categories[index] = updated;
    return { ...updated };
  }

  deleteCategory(id: string) {
    const hasProducts = this.products.some((product) => product.categoryId === id);
    if (hasProducts) {
      return false;
    }
    const index = this.categories.findIndex((category) => category.id === id);
    if (index === -1) {
      return false;
    }
    this.categories.splice(index, 1);
    return true;
  }

  getProducts(query: ProductQuery = {}) {
    return this.products.filter((product) => {
      const category = this.getCategoryById(product.categoryId);
      if (!category) {
        return false;
      }
      if (query.section && category.type !== query.section) {
        return false;
      }
      if (query.categorySlug && category.slug !== query.categorySlug) {
        return false;
      }
      if (typeof query.featured === "boolean" && product.isFeatured !== query.featured) {
        return false;
      }
      if (typeof query.published === "boolean" && product.isPublished !== query.published) {
        return false;
      }
      if (query.search) {
        const needle = query.search.toLowerCase();
        const haystack = [
          product.name,
          product.shortDescription,
          product.fullDescription,
          product.socialDescription,
          category.name,
          ...product.tags.map((tag) => tag.name)
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) {
          return false;
        }
      }
      return true;
    });
  }

  getProductBySlug(slug: string) {
    const product = this.products.find((item) => item.slug === slug);
    return product ? { ...product, images: [...product.images], tags: [...product.tags] } : null;
  }

  getProductById(id: string) {
    const product = this.products.find((item) => item.id === id);
    return product ? { ...product, images: [...product.images], tags: [...product.tags] } : null;
  }

  createProduct(input: ProductMutation) {
    const now = new Date().toISOString();
    const product: ProductRecord = {
      id: randomUUID(),
      ...input,
      slug: input.slug || slugify(input.name),
      createdAt: now,
      updatedAt: now
    };
    this.products.unshift(product);
    return { ...product, images: [...product.images], tags: [...product.tags] };
  }

  updateProduct(id: string, input: Partial<ProductMutation>) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return null;
    }
    const current = this.products[index];
    const updated: ProductRecord = {
      ...current,
      ...input,
      slug: input.slug ? slugify(input.slug) : current.slug,
      updatedAt: new Date().toISOString()
    };
    this.products[index] = updated;
    return { ...updated, images: [...updated.images], tags: [...updated.tags] };
  }

  deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }
    this.products.splice(index, 1);
    return true;
  }
}

export const store = new InMemoryStore();
