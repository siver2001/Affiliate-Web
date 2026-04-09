import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoadingBlock } from "../../components/common/loading-block";
import { EmptyState } from "../../components/common/empty-state";
import { ProductCard } from "../../components/product/product-card";
import { getProducts } from "../../services/products";

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const productsQuery = useQuery({
    queryKey: ["products", "all-home", query],
    queryFn: () => getProducts({ search: query, published: true })
  });

  if (productsQuery.isLoading) {
    return <LoadingBlock label="Đang chọn lọc tinh hoa..." />;
  }

  const allProducts = productsQuery.data?.items ?? [];
  const PAGE_SIZE = 18; // 3 rows on 6-col grid, or 6 rows if he meant 3 cols.
  const totalPages = Math.max(1, Math.ceil(allProducts.length / PAGE_SIZE));
  
  // Use state or URL param for page. Let's use URL param for shareable links
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
  const currentPage = isNaN(pageParam) ? 1 : Math.max(1, Math.min(pageParam, totalPages));

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allProducts.slice(start, start + PAGE_SIZE);
  }, [allProducts, currentPage]);

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      if (page === 1) prev.delete("page");
      else prev.set("page", String(page));
      return prev;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
     pages.push(i);
    }
    return pages;
  };

  return (
    <div className="py-24 px-6 lg:px-16 max-w-[1920px] mx-auto min-h-screen flex flex-col">
      {/* Main Grid */}
      <section className="flex-1">
        {allProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            {currentProducts.map((product) => (
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 transition-colors hover:bg-ink/5 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
          </button>
          
          {getPageNumbers().map(num => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                currentPage === num 
                  ? "bg-coral text-white shadow-md shadow-coral/20 hover:bg-[#d95d42]" 
                  : "text-ink/70 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 transition-colors hover:bg-ink/5 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
