import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { LoadingBlock } from "../../components/common/loading-block";
import { EmptyState } from "../../components/common/empty-state";
import { ProductCard } from "../../components/product/product-card";
import { getProducts } from "../../services/products";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const productsQuery = useQuery({
    queryKey: ["products", "all-home", query],
    queryFn: () => getProducts({ search: query, published: true })
  });

  if (productsQuery.isLoading) {
    return <LoadingBlock label="Đang chọn lọc tinh hoa..." />;
  }

  const products = productsQuery.data?.items ?? [];

  return (
    <div className="py-24 px-6 lg:px-16 max-w-[1920px] mx-auto">
      {/* Main Grid */}
      <section>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center border-y border-ink/5">
             <EmptyState
               description="Hiện tại chúng tôi đang cập nhật thêm sản phẩm. Hãy quay lại sau nhé!"
               title="Chưa có sản phẩm phù hợp"
             />
          </div>
        )}
      </section>
    </div>
  );
}
