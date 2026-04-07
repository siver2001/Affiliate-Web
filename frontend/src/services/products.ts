import type { Product } from "../types/entities";
import { api } from "./api";

export interface ProductFilters {
  section?: string;
  category?: string;
  search?: string;
  featured?: boolean;
  published?: boolean;
}

export interface ProductMutationPayload {
  name: string;
  slug?: string;
  categoryId: string;
  shortDescription: string;
  fullDescription?: string | null;
  socialDescription?: string | null;
  suitableFor?: string | null;
  pros?: string | null;
  cons?: string | null;
  price?: number | null;
  thumbnail?: string | null;
  shopeeUrl?: string | null;
  lazadaUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  images?: Array<{
    imageUrl: string;
    altText?: string | null;
    sortOrder?: number;
  }>;
  tags?: Array<{
    id?: string;
    name: string;
    slug?: string;
  }>;
}

export async function getProducts(filters: ProductFilters = {}) {
  const response = await api.get<{ items: Product[]; total: number }>("/products", {
    params: filters
  });
  return response.data;
}

export async function getProduct(slug: string) {
  const response = await api.get<{ item: Product; related: Product[] }>(`/products/${slug}`);
  return response.data;
}

export async function createProduct(payload: ProductMutationPayload) {
  const response = await api.post<{ item: Product }>("/products", payload);
  return response.data.item;
}

export async function updateProduct(id: string, payload: ProductMutationPayload) {
  const response = await api.put<{ item: Product }>(`/products/${id}`, payload);
  return response.data.item;
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
}
