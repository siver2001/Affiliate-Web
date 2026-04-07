import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { EmptyState } from "../../components/common/empty-state";
import { LoadingBlock } from "../../components/common/loading-block";
import { SectionHero } from "../../components/category/section-hero";
import { ProductCard } from "../../components/product/product-card";
import { getCategories } from "../../services/categories";
import { getProducts } from "../../services/products";
import type { Section } from "../../types/entities";

function getSectionAccent(section: Section) {
  return section === "pets"
    ? "from-[#1f4d46] to-[#3a8578] text-white"
    : "from-[#f06a4e] to-[#d79037] text-white";
}

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
      title: "Cac mon cho thu cung de xem, de chon va de cap nhat noi dung.",
      description:
        "Danh sach tap trung vao nhu cau thuc te: an uong, ve sinh, cham soc va phu kien. Moi card deu co mo ta ngan, CTA ro va link mua di thang toi affiliate.",
      accent: "bg-[linear-gradient(140deg,#1f4d46,#2a6a5f)]"
    },
    gadgets: {
      eyebrow: "Smart utility",
      title: "Meo vat va thiet bi nho gon cho ban lam viec, bep va goc song.",
      description:
        "Nhom san pham danh cho cac mon tien ich co the review nhanh, de chot va co nhieu ngu canh dung thuc te.",
      accent: "bg-[linear-gradient(140deg,#f06a4e,#d79139)]"
    }
  }[section];

  const sectionCategories = categoriesQuery.data?.filter((category) => category.type === section) ?? [];

  return (
    <div className="space-y-8">
      <SectionHero {...copy} />

      <section className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="sticky top-32 h-fit overflow-hidden rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <div className={`rounded-[1.8rem] bg-gradient-to-br ${getSectionAccent(section)} p-5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]`}>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-white/65">Sidebar picks</p>
                <p className="mt-1 font-serif text-2xl">Danh muc con</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/76">
              Chon nhanh mot nhom de xem cac mon de dang bai va copy affiliate ngay.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {sectionCategories.map((category, index) => (
              <Link
                className="group flex items-center justify-between rounded-[1.6rem] border border-ink/8 bg-canvas/70 px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                key={category.id}
                style={{ animationDelay: `${index * 70}ms` }}
                to={`/category/${category.slug}`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-ink/30">{section === "pets" ? "Pet lane" : "Utility lane"}</p>
                  <p className="mt-2 font-serif text-xl text-ink">{category.name}</p>
                </div>
                <div className="rounded-full border border-ink/8 bg-white p-2 text-ink/35 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                  <ArrowUpRight size={15} />
                </div>
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
              description="Chua co san pham da publish cho nhom noi dung nay."
              title="Danh muc dang trong"
            />
          )}
        </div>
      </section>
    </div>
  );
}
