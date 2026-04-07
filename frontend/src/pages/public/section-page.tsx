import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { EmptyState } from "../../components/common/empty-state";
import { LoadingBlock } from "../../components/common/loading-block";
import { SectionHero } from "../../components/category/section-hero";
import { ProductCard } from "../../components/product/product-card";
import { getCategories } from "../../services/categories";
import { getProducts } from "../../services/products";
import type { Section } from "../../types/entities";

export function SectionPage({ section }: { section: Section }) {
  const productsQuery = useQuery({
    queryKey: ["products", section],
    queryFn: () => getProducts({ section, published: true })
  });
  const categoriesQuery = useQuery({
    queryKey: ["categories", section],
    queryFn: getCategories
  });

  if (productsQuery.isLoading || categoriesQuery.isLoading) {
    return <LoadingBlock />;
  }

  const copy = {
    pets: {
      eyebrow: "Pet picks",
      title: "Các món cho thú cưng dễ xem, dễ chọn và dễ cập nhật nội dung.",
      description:
        "Danh sách tập trung vào nhu cầu thực tế: ăn uống, vệ sinh, chăm sóc và phụ kiện. Mỗi card đều có mô tả ngắn, CTA rõ và link mua đi thẳng tới affiliate.",
      accent: "bg-[linear-gradient(140deg,#1f4d46,#2a6a5f)]"
    },
    gadgets: {
      eyebrow: "Smart utility",
      title: "Mẹo vặt và thiết bị nhỏ gọn cho bàn làm việc, bếp và góc sống.",
      description:
        "Nhóm sản phẩm dành cho các món tiện ích có thể review nhanh, dễ chốt trong socialDescription và có nhiều ngữ cảnh dùng thực tế.",
      accent: "bg-[linear-gradient(140deg,#f06a4e,#d79139)]"
    }
  }[section];

  const sectionCategories = categoriesQuery.data?.filter((category) => category.type === section) ?? [];

  return (
    <div className="space-y-8">
      <SectionHero {...copy} />

      <section className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <aside className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.25em] text-ink/45">Danh mục con</p>
          <div className="mt-4 space-y-3">
            {sectionCategories.map((category) => (
              <Link
                className="block rounded-2xl bg-canvas px-4 py-3 text-sm font-medium text-ink/75 transition hover:bg-sand"
                key={category.id}
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          {productsQuery.data?.items.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {productsQuery.data.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              description="Chưa có sản phẩm đã publish cho nhóm nội dung này."
              title="Danh mục đang trống"
            />
          )}
        </div>
      </section>
    </div>
  );
}
