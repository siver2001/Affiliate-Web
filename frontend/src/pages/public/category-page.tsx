import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { EmptyState } from "../../components/common/empty-state";
import { LoadingBlock } from "../../components/common/loading-block";
import { ProductCard } from "../../components/product/product-card";
import { getCategories } from "../../services/categories";
import { getProducts } from "../../services/products";

export function CategoryPage() {
  const { slug = "" } = useParams();
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const productsQuery = useQuery({
    queryKey: ["products", "category", slug],
    queryFn: () => getProducts({ category: slug, published: true }),
    enabled: Boolean(slug)
  });

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <LoadingBlock label="Đang lục tìm kho báu..." />;
  }

  const category = categoriesQuery.data?.find((item) => item.slug === slug);
  if (!category) {
    return (
      <div className="py-32 flex items-center justify-center">
         <EmptyState
           description="Chúng tôi không tìm thấy danh mục bạn yêu cầu."
           title="Rất tiếc..."
         />
      </div>
    );
  }

  const products = productsQuery.data?.items ?? [];

  return (
    <div className="py-24 px-6 lg:px-16 max-w-[1920px] mx-auto min-h-screen">
      {/* Category Header */}
      <section className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 animate-reveal border-b border-ink/5 pb-16">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-sage underline decoration-sage/30 underline-offset-8">
               Chuyên mục: {category.type}
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none">
            {category.name}.
          </h1>
        </div>
        <div className="max-w-md">
           <p className="text-ink/60 text-lg italic leading-relaxed">
             {category.description || "Gợi ý chọn lọc những món đồ tốt nhất trong chuyên mục " + category.name + "." }
           </p>
        </div>
      </section>

      {/* Grid */}
      <section>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center">
             <EmptyState
               description="Hiện danh mục này chưa có sản phẩm. Hãy quay lại sau nhe!"
               title="Danh mục đang được cập nhật"
             />
          </div>
        )}
      </section>
    </div>
  );
}
