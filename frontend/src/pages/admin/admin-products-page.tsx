import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { LoadingBlock } from "../../components/common/loading-block";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { deleteProduct, getProducts } from "../../services/products";

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";

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

      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft">
        <div className="grid grid-cols-[1.4fr,0.9fr,0.7fr,0.7fr] gap-4 border-b border-ink/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-ink/45">
          <span>Sản phẩm</span>
          <span>Danh mục</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>
        {(productsQuery.data?.items ?? []).map((product) => (
          <div
            className="grid grid-cols-[1.4fr,0.9fr,0.7fr,0.7fr] gap-4 border-b border-ink/8 px-6 py-5 last:border-b-0"
            key={product.id}
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{product.name}</p>
              <p className="mt-1 truncate text-sm text-ink/60">{product.shortDescription}</p>
            </div>
            <p className="text-sm text-ink/70">{product.category?.name ?? "Chưa gán"}</p>
            <div className="flex gap-2">
              <Badge>{product.isPublished ? "Published" : "Draft"}</Badge>
              {product.isFeatured ? <Badge className="bg-coral/10 text-coral">Featured</Badge> : null}
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/admin/products/${product.id}/edit`}>
                <Button variant="outline">Sửa</Button>
              </Link>
              <Button
                onClick={() => deleteMutation.mutate(product.id)}
                variant="ghost"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
