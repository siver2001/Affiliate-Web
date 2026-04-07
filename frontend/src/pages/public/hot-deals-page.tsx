import { useQuery } from "@tanstack/react-query";

import { LoadingBlock } from "../../components/common/loading-block";
import { ProductCard } from "../../components/product/product-card";
import { SectionHero } from "../../components/category/section-hero";
import { getProducts } from "../../services/products";

export function HotDealsPage() {
  const productsQuery = useQuery({
    queryKey: ["products", "hot-deals"],
    queryFn: () => getProducts({ featured: true, published: true })
  });

  if (productsQuery.isLoading) {
    return <LoadingBlock label="Đang tải deal nổi bật..." />;
  }

  return (
    <div className="space-y-8">
      <SectionHero
        accent="bg-[linear-gradient(140deg,#f06a4e,#f2b972)]"
        description="Những món đang được ưu tiên hiển thị nhờ trạng thái featured trong admin. Đây là khu vực phù hợp cho CTA mạnh và các deal đang cần đẩy."
        eyebrow="Hot deals"
        title="Các món nổi bật đang được ưu tiên hiển thị trên toàn site."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {productsQuery.data?.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
