export type Section = "pets" | "gadgets";

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: Section;
  description: string | null;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
}

export interface Product {
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
  category?: Category | null;
  images: ProductImage[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  email: string;
  role: "admin";
}
