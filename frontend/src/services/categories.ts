import type { Category } from "../types/entities";
import { api } from "./api";

export async function getCategories() {
  const response = await api.get<{ items: Category[] }>("/categories");
  return response.data.items;
}

export async function createCategory(payload: Partial<Category>) {
  const response = await api.post<{ item: Category }>("/categories", payload);
  return response.data.item;
}

export async function updateCategory(id: string, payload: Partial<Category>) {
  const response = await api.put<{ item: Category }>(`/categories/${id}`, payload);
  return response.data.item;
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}
