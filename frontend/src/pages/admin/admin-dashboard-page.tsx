import { useQuery } from "@tanstack/react-query";
import { Layers3, PackageCheck, Sparkle, Tags } from "lucide-react";

import { LoadingBlock } from "../../components/common/loading-block";
import { Badge } from "../../components/ui/badge";
import { getCategories } from "../../services/categories";
import { getProducts } from "../../services/products";

export function AdminDashboardPage() {
  const productsQuery = useQuery({ queryKey: ["admin-products"], queryFn: () => getProducts() });
  const categoriesQuery = useQuery({ queryKey: ["admin-categories"], queryFn: getCategories });

  if (productsQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingBlock label="Đang tổng hợp dashboard..." />;
  }

  const products = productsQuery.data?.items ?? [];
  const categories = categoriesQuery.data ?? [];
  const stats = [
    { label: "Tổng sản phẩm", value: products.length, icon: PackageCheck },
    { label: "Đang featured", value: products.filter((item) => item.isFeatured).length, icon: Sparkle },
    { label: "Danh mục", value: categories.length, icon: Layers3 },
    {
      label: "Tag đang dùng",
      value: new Set(products.flatMap((item) => item.tags.map((tag) => tag.slug))).size,
      icon: Tags
    }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
        <Badge>Overview</Badge>
        <h1 className="mt-4 font-serif text-4xl">Dashboard quản trị nội dung</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70">
          Khu vực này tập trung vào các chỉ số giúp bạn biết hiện có bao nhiêu sản phẩm, danh
          mục và nội dung nổi bật đang được đẩy ra ngoài public site.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft" key={stat.label}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-ink/60">{stat.label}</p>
                <Icon className="text-pine" size={18} />
              </div>
              <p className="mt-6 font-serif text-5xl">{stat.value}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-3xl">Sản phẩm mới cập nhật</h2>
          <div className="mt-5 space-y-3">
            {products.slice(0, 5).map((product) => (
              <div className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3" key={product.id}>
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-ink/60">{product.category?.name ?? "Chưa có danh mục"}</p>
                </div>
                <Badge>{product.isPublished ? "Published" : "Draft"}</Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <h2 className="font-serif text-3xl">Danh mục chính</h2>
          <div className="mt-5 space-y-3">
            {categories.map((category) => (
              <div className="rounded-2xl bg-canvas px-4 py-3" key={category.id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{category.name}</p>
                  <span className="text-xs uppercase tracking-[0.25em] text-ink/45">{category.type}</span>
                </div>
                <p className="mt-1 text-sm text-ink/60">{category.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
