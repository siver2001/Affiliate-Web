import { Prisma } from "@prisma/client";

const categoryWithChildrenArgs = Prisma.validator<Prisma.CategoryDefaultArgs>()({
  include: {
    children: true,
    _count: {
      select: {
        products: true
      }
    }
  }
});

export type CategoryWithChildren = Prisma.CategoryGetPayload<typeof categoryWithChildrenArgs>;

const productWithRelationsArgs = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    category: true,
    images: {
      orderBy: {
        sortOrder: "asc"
      }
    },
    productTags: {
      include: {
        tag: true
      }
    }
  }
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelationsArgs>;

export function serializeCategory(category: CategoryWithChildren) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    type: category.type,
    description: category.description,
    parentId: category.parentId,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    productCount: category._count?.products ?? 0,
    children: category.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      type: child.type,
      description: child.description,
      parentId: child.parentId,
      createdAt: child.createdAt.toISOString(),
      updatedAt: child.updatedAt.toISOString()
    }))
  };
}

export function serializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    socialDescription: product.socialDescription,
    suitableFor: product.suitableFor,
    pros: product.pros,
    cons: product.cons,
    price: product.price ? Number(product.price) : null,
    thumbnail: product.thumbnail,
    shopeeUrl: product.shopeeUrl,
    lazadaUrl: product.lazadaUrl,
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
    sortOrder: product.sortOrder,
    categoryId: product.categoryId,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          type: product.category.type,
          description: product.category.description,
          parentId: product.category.parentId,
          createdAt: product.category.createdAt.toISOString(),
          updatedAt: product.category.updatedAt.toISOString()
        }
      : null,
    images: product.images
      .slice()
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
        altText: image.altText,
        sortOrder: image.sortOrder
      })),
    tags: product.productTags.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

export const productWithRelationsInclude = productWithRelationsArgs.include;
