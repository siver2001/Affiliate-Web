import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../../components/common/empty-state";
import { LoadingBlock } from "../../components/common/loading-block";
import { ProductCard } from "../../components/product/product-card";
import { getProducts } from "../../services/products";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";

  const productsQuery = useQuery({
    queryKey: ["products", "search", query],
    queryFn: () => getProducts({ search: query, published: true }),
    enabled: Boolean(query)
  });

  const clearSearch = () => setParams({});

  return (
    <div className="py-24 px-6 lg:px-16 max-w-[1920px] mx-auto min-h-screen">
      {/* Search Header */}
      <section className="mb-24 animate-reveal">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink/30">Kết quả cho:</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none italic pb-4 border-b-4 border-sage/10">
            {query ? `“${query}”` : "Tìm kiếm."}
          </h1>
          
          <form
            className="relative w-full max-w-md group"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const nextQuery = String(formData.get("query") || "").trim();
              setParams(nextQuery ? { q: nextQuery } : {});
            }}
          >
            <input 
              key={query}
              defaultValue={query} 
              name="query" 
              placeholder="Nhập tên món đồ..." 
              className="w-full bg-transparent border-b-2 border-ink/10 py-4 text-2xl font-serif focus:outline-none focus:border-sage transition-all placeholder:text-ink/10"
            />
            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-ink/40 hover:text-sage">
              <SearchIcon size={24} />
            </button>
            {query && (
               <button onClick={clearSearch} type="button" className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-ink/20 hover:text-coral transition-colors">
                  <X size={18} />
               </button>
            )}
          </form>
        </div>
      </section>

      {/* Grid */}
      <section>
        {!query ? (
          <div className="py-32 flex flex-col items-center">
             <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mb-6">
                <SearchIcon className="text-sage" size={24} />
             </div>
             <p className="text-ink/40 font-serif text-xl italic">Hãy nhập từ khóa để bắt đầu tìm kiếm...</p>
          </div>
        ) : productsQuery.isLoading ? (
          <LoadingBlock label="Đang lục tìm trong kho lưu trữ..." />
        ) : productsQuery.data?.items.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {productsQuery.data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex items-center justify-center border-y border-ink/5">
             <EmptyState
               description={`Chúng tôi không tìm thấy kết quả nào cho "${query}". Hãy thử với từ khóa khác.`}
               title="Rất tiếc..."
             />
          </div>
        )}
      </section>
    </div>
  );
}
