import type { AuthUser } from "../types/entities";
import { api } from "./api";

export async function login(payload: { email: string; password: string }) {
  const response = await api.post<{ token: string; user: AuthUser }>("/auth/login", payload);
  return response.data;
}

export async function fetchMe() {
  const response = await api.get<{ user: AuthUser }>("/auth/me");
  return response.data.user;
}
