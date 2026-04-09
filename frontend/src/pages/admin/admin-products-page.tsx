import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2 } from "lucide-react";

import { LoadingBlock } from "../../components/common/loading-block";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { deleteProduct, getProducts } from "../../services/products";
import type { Product } from "../../types/entities";

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const productsQuery = useQuery({
    queryKey: ["admin-products", search],
    queryFn: () => getProducts(search ? { search } : {})
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });

  if (productsQuery.isLoading) {
    return <LoadingBlock label="Đang tải danh sách sản phẩm..." />;
  }

  const allItems = productsQuery.data?.items ?? [];
  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const currentItems = allItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of table
    document.getElementById("admin-product-table")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-serif text-4xl">Quản lý sản phẩm</h1>
        </div>
        <Link to="/admin/products/new">
          <Button>
            <Plus className="mr-2" size={16} />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <form
        className="flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const nextValue = String(formData.get("query") || "").trim();
          setSearchParams(nextValue ? { q: nextValue } : {});
        }}
      >
        <Input defaultValue={search} name="query" placeholder="Tìm theo tên, tag, mô tả..." />
        <Button type="submit" variant="secondary">
          <Search className="mr-2" size={16} />
          Lọc
        </Button>
      </form>

      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft" id="admin-product-table">
        <div className="grid grid-cols-[1.4fr,0.9fr,0.7fr,0.7fr] gap-4 border-b border-ink/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink/45">
          <span>Sản phẩm</span>
          <span>Danh mục</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>
        
        {/* Scrollable area for items */}
        <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden">
          {currentItems.length > 0 ? (
            currentItems.map((product: Product) => (
              <div
                className="grid grid-cols-[1.4fr,0.9fr,0.7fr,0.7fr] gap-4 border-b border-ink/8 px-6 py-5 last:border-b-0 hover:bg-canvas/30 transition-colors"
                key={product.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="mt-1 truncate text-sm text-ink/60">{product.shortDescription}</p>
                </div>
                <p className="text-sm text-ink/70">{product.category?.name ?? "Chưa gán"}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={product.isPublished ? "default" : "secondary"}>
                    {product.isPublished ? "PUBLISHED" : "DRAFT"}
                  </Badge>
                  {product.isFeatured ? <Badge className="bg-coral/10 text-coral">FEATURED</Badge> : null}
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" className="h-8 py-0">Sửa</Button>
                  </Link>
                  <Button
                    onClick={() => {
                      if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
                        deleteMutation.mutate(product.id);
                      }
                    }}
                    variant="ghost"
                    className="h-8 w-8 p-0 text-ink/30 hover:text-coral"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-ink/40">Không tìm thấy sản phẩm nào.</div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink/10 bg-canvas/20 px-6 py-4">
            <p className="text-xs font-medium text-ink/50 uppercase tracking-widest">
              Trang {currentPage} / {totalPages} (Tổng {allItems.length} SP)
            </p>
            <div className="flex gap-2">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="mr-1" size={14} />
                Trước
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                size="sm"
                variant="outline"
              >
                Sau
                <ChevronRight className="ml-1" size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
