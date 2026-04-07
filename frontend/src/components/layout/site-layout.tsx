import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../../services/categories";
import type { Category } from "../../types/entities";

function getRootAccent(slug: string) {
  return slug === "pets"
    ? "from-[#1d4a43] via-[#2c6a60] to-[#4c9687]"
    : "from-[#f06a4e] via-[#df8143] to-[#d2a24a]";
}

function getRootEyebrow(slug: string) {
  return slug === "pets" ? "Pet picks" : "Smart utility";
}

function getCurrentRootSlug(pathname: string, categories: Category[]) {
  if (pathname.startsWith("/category/")) {
    const currentSlug = pathname.replace("/category/", "");
    const currentCategory = categories.find((item) => item.slug === currentSlug);

    if (currentCategory?.parentId) {
      return categories.find((item) => item.id === currentCategory.parentId)?.slug ?? null;
    }

    return currentCategory?.slug ?? null;
  }

  return null;
}

function getChildCategories(categories: Category[], parentId: string) {
  return categories.filter((item) => item.parentId === parentId);
}

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRootSlug, setActiveRootSlug] = useState<string | null>(null);
  const location = useLocation();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const allCategories = categories ?? [];
  const rootCategories = allCategories.filter((item) => !item.parentId);
  const fallbackRootSlug = rootCategories[0]?.slug ?? null;

  useEffect(() => {
    const currentRootSlug = getCurrentRootSlug(location.pathname, allCategories);
    setActiveRootSlug(currentRootSlug ?? fallbackRootSlug);
  }, [allCategories, fallbackRootSlug, location.pathname]);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen selection:bg-sage/20 selection:text-sage">
      <div
        className={`fixed inset-0 z-[100] bg-ink/60 backdrop-blur-md transition-opacity duration-700 ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed bottom-0 left-0 top-0 z-[101] w-[420px] border-r border-white/10 bg-[linear-gradient(180deg,#f7f4ee_0%,#ffffff_24%,#f7f8f8_100%)] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden p-8">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#2f7468]/12 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-56 w-56 rounded-full bg-[#f26a4b]/12 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-ink/35">Category drawer</p>
              <h3 className="mt-3 font-serif text-3xl text-ink">Chọn danh mục</h3>
            </div>
            <button
              className="rounded-full border border-ink/8 p-3 transition-all hover:bg-white"
              onClick={closeSidebar}
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative z-10 mt-6">
            <Link
              className={`group relative block overflow-hidden rounded-[2rem] border px-5 py-5 transition-all duration-500 ${
                location.pathname === "/"
                  ? "border-transparent bg-[linear-gradient(135deg,#1e4c45,#2d6e64)] text-white shadow-[0_18px_50px_rgba(31,77,70,0.26)]"
                  : "border-ink/8 bg-white/80 text-ink/75 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white"
              }`}
              onClick={closeSidebar}
              to="/"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] opacity-65">Overview</p>
                  <p className="mt-2 font-serif text-2xl tracking-tight">Tất cả sản phẩm</p>
                </div>
                <div className="rounded-full border border-current/10 p-2 opacity-70 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>
          </div>

          <div className="relative z-10 mt-8 min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="grid gap-3">
              {rootCategories.map((root) => {
                const isActive = activeRootSlug === root.slug;
                const childCategories = getChildCategories(allCategories, root.id);
                const childCount = childCategories.length;

                return (
                  <div key={root.id} className="space-y-3">
                    <button
                      className={`group relative w-full overflow-hidden rounded-[2rem] border px-5 py-5 text-left transition-all duration-500 ${
                        isActive
                          ? `border-transparent bg-gradient-to-br ${getRootAccent(root.slug)} text-white shadow-[0_20px_55px_rgba(15,23,42,0.18)]`
                          : "border-ink/8 bg-white/82 text-ink/75 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white"
                      }`}
                      onClick={() => setActiveRootSlug(root.slug)}
                      onFocus={() => setActiveRootSlug(root.slug)}
                      onMouseEnter={() => setActiveRootSlug(root.slug)}
                      type="button"
                    >
                      <div
                        className={`absolute inset-y-0 right-0 w-28 bg-gradient-to-l ${
                          isActive ? "from-white/18 to-transparent" : "from-transparent to-transparent"
                        }`}
                      />
                      <div className="relative flex items-center justify-between gap-4">
                        <div>
                          <p className={`text-[10px] uppercase tracking-[0.32em] ${isActive ? "text-white/68" : "text-ink/30"}`}>
                            {getRootEyebrow(root.slug)}
                          </p>
                          <p className={`mt-2 font-serif text-[2rem] leading-none ${isActive ? "text-white" : "text-ink"}`}>
                            {root.name}
                          </p>
                          <p className={`mt-3 text-xs ${isActive ? "text-white/72" : "text-ink/45"}`}>
                            {childCount} lựa chọn bên trong
                          </p>
                        </div>
                        <div
                          className={`flex h-11 w-11 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                            isActive
                              ? "border-white/15 bg-white/10 text-white"
                              : "border-ink/8 bg-ink/[0.03] text-ink/35 group-hover:translate-x-1 group-hover:text-ink"
                          }`}
                        >
                          <ChevronRight
                            size={18}
                            className={`transition-transform duration-300 ${isActive ? "rotate-90" : "rotate-0"}`}
                          />
                        </div>
                      </div>
                    </button>

                    <div
                      className={`grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0">
                        {childCount > 0 ? (
                          <div className="rounded-[1.8rem] border border-ink/8 bg-white/78 p-4 shadow-[0_18px_50px_rgba(16,24,40,0.06)] backdrop-blur-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[10px] uppercase tracking-[0.28em] text-ink/32">Danh mục con</p>
                                <p className="mt-2 font-serif text-2xl text-ink">{root.name}</p>
                              </div>
                              <span className="rounded-full bg-ink/5 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-ink/35">
                                {childCount} mục
                              </span>
                            </div>

                            <div className="grid gap-3">
                              {childCategories.map((category, index) => {
                                const isCurrent = location.pathname === `/category/${category.slug}`;

                                return (
                                  <Link
                                    className={`group flex items-center justify-between rounded-[1.4rem] border px-4 py-4 transition-all duration-300 ${
                                      isCurrent
                                        ? "border-transparent bg-[linear-gradient(135deg,#1f4d46,#2b6b60)] text-white shadow-[0_14px_32px_rgba(31,77,70,0.18)]"
                                        : "border-ink/8 bg-canvas/65 text-ink/72 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white"
                                    }`}
                                    key={category.id}
                                    onClick={closeSidebar}
                                    style={{ animationDelay: `${index * 45}ms` }}
                                    to={`/category/${category.slug}`}
                                  >
                                    <div>
                                      <p className={`font-serif text-xl ${isCurrent ? "text-white" : "text-ink"}`}>{category.name}</p>
                                      <p className={`mt-1 text-[11px] ${isCurrent ? "text-white/70" : "text-ink/40"}`}>
                                        {category.productCount ?? 0} sản phẩm
                                      </p>
                                    </div>
                                    <div
                                      className={`rounded-full border p-2 transition-all duration-300 ${
                                        isCurrent
                                          ? "border-white/15 bg-white/10 text-white"
                                          : "border-ink/8 bg-white text-ink/35 group-hover:translate-x-1 group-hover:text-ink"
                                      }`}
                                    >
                                      <ArrowUpRight size={15} />
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-[1.8rem] border border-dashed border-ink/10 bg-white/70 px-5 py-4 text-sm text-ink/45">
                            Nhóm này hiện chưa có danh mục con.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <footer className="relative z-10 mt-6 border-t border-ink/8 pt-6">
            <Link
              className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/34 transition-all hover:text-pine"
              onClick={closeSidebar}
              to="/admin/login"
            >
              <span>Hệ thống quản trị</span>
              <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </footer>
        </div>
      </aside>

      <header className="sticky top-0 z-50 flex h-24 items-center justify-between border-b border-ink/5 bg-white/90 px-6 backdrop-blur-xl lg:px-16">
        <div className="flex items-center gap-12">
          <button className="group flex items-center gap-4 transition-all hover:text-sage" onClick={() => setIsSidebarOpen(true)} type="button">
            <div className="flex w-6 flex-col gap-1.5">
              <span className="h-[1.5px] w-full rounded-full bg-current" />
              <span className="h-[1.5px] w-2/3 rounded-full bg-current transition-all group-hover:w-full" />
              <span className="h-[1.5px] w-full rounded-full bg-current" />
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.3em] sm:inline-block">Danh mục</span>
          </button>
        </div>

        <Link className="group absolute left-1/2 flex -translate-x-1/2 flex-col items-center" to="/">
          <span className="leading-none font-serif text-3xl tracking-tighter transition-all group-hover:italic lg:text-4xl">
            Affiliate Hub.
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.5em] text-ink/30">Prime Selections</span>
        </Link>

        <div className="flex items-center gap-6">
          <button className="rounded-full p-3 transition-all hover:bg-canvas" type="button">
            <Search className="text-ink/80" size={22} />
          </button>
        </div>
      </header>

      <main className="min-h-screen">{children || <div className="p-12 text-center text-ink/20">Chưa có nội dung.</div>}</main>

      <footer className="border-t border-white/5 bg-ink px-6 py-8 text-white lg:px-16">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">&copy; 2026 Affiliate Hub / Tinh tuyển từ Shopee.</p>
          <div className="flex gap-8">
            <Link className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white" to="/admin/login">
              Admin Portal
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">Terms of quality.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
