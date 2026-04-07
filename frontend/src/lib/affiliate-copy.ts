import type { Product } from "../types/entities";

function getAffiliateIntro(product: Product) {
  return product.shortDescription.trim();
}

export function buildAffiliateCopyText(product: Product) {
  const lines = [product.name.trim(), getAffiliateIntro(product)];

  if (product.shopeeUrl) {
    lines.push(product.shopeeUrl);
  }

  return lines.filter(Boolean).join("\n");
}
