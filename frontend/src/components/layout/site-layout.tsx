import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronRight, Menu, Search, Sparkles, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCategories } from "../../services/categories";

function getCategoryAccent(type: string | null | undefined) {
  return type === "pets"
    ? "from-[#204e47] to-[#4e9487] text-white"
    : "from-[#f26a4b] to-[#d89a3d] text-white";
}

function getCategoryMeta(type: string | null | undefined) {
  return type === "pets" ? "Pet picks" : "Smart utility";
}

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

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
        className={`fixed bottom-0 left-0 top-0 z-[101] w-[350px] border-r border-white/10 bg-[linear-gradient(180deg,#f7f4ee_0%,#ffffff_24%,#f7f8f8_100%)] shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-full flex-col overflow-hidden p-8">
          <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#2f7468]/12 blur-3xl" />
          <div className="absolute bottom-8 right-0 h-52 w-52 rounded-full bg-[#f26a4b]/12 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-ink/35">Category drawer</p>
              <h3 className="mt-3 font-serif text-3xl text-ink">Chon nhanh danh muc</h3>
            </div>
            <button className="rounded-full border border-ink/8 p-3 transition-all hover:bg-white" onClick={closeSidebar}>
              <X size={22} />
            </button>
          </div>

          <div className="relative z-10 mt-8 rounded-[2rem] border border-ink/8 bg-white/75 p-5 shadow-[0_18px_50px_rgba(16,24,40,0.08)] backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#204e47,#3d8779)] text-white">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Goi y theo ngach</p>
                <p className="text-xs leading-5 text-ink/50">Mo drawer, chon danh muc, vao thang danh sach can dang bai.</p>
              </div>
            </div>
          </div>

          <nav className="relative z-10 mt-8 flex-1 space-y-3 overflow-y-auto pr-1">
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
                  <p className="mt-2 font-serif text-2xl tracking-tight">Tat ca san pham</p>
                </div>
                <div className="rounded-full border border-current/10 p-2 opacity-70 transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>

            <div className="px-2 pt-6">
              <span className="text-[10px] uppercase tracking-[0.38em] font-bold text-ink/24">Bo suu tap danh muc</span>
            </div>

            {categories?.map((cat, index) => {
              const isActive = location.pathname === `/category/${cat.slug}`;
              return (
                <Link
                  className={`group relative block overflow-hidden rounded-[2rem] border px-5 py-5 transition-all duration-500 ${
                    isActive
                      ? `border-transparent bg-gradient-to-br ${getCategoryAccent(cat.type)} shadow-[0_20px_55px_rgba(15,23,42,0.16)]`
                      : "border-ink/8 bg-white/82 text-ink/75 hover:-translate-y-0.5 hover:border-ink/15 hover:bg-white"
                  }`}
                  key={cat.id}
                  onClick={closeSidebar}
                  style={{ animationDelay: `${index * 60}ms` }}
                  to={`/category/${cat.slug}`}
                >
                  <div
                    className={`absolute inset-y-0 right-0 w-24 bg-gradient-to-l ${
                      isActive ? "from-white/18 to-transparent" : "from-ink/0 to-transparent"
                    }`}
                  />
                  <div className="relative flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.26em] ${
                          isActive ? "bg-white/14 text-white/80" : "bg-ink/5 text-ink/38"
                        }`}
                      >
                        {getCategoryMeta(cat.type)}
                      </span>
                      <p className={`mt-3 font-serif text-2xl leading-none ${isActive ? "text-white" : "text-ink"}`}>
                        {cat.name}
                      </p>
                      <p
                        className={`mt-3 line-clamp-2 text-xs leading-5 ${
                          isActive ? "text-white/72" : "text-ink/48"
                        }`}
                      >
                        {cat.description || "Danh muc chon loc cho bai dang affiliate."}
                      </p>
                    </div>
                    <div
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-white/15 bg-white/10 text-white"
                          : "border-ink/8 bg-ink/[0.03] text-ink/35 group-hover:translate-x-1 group-hover:text-ink"
                      }`}
                    >
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <footer className="relative z-10 mt-8 border-t border-ink/8 pt-6">
            <Link
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-ink/34 transition-all hover:text-pine"
              onClick={closeSidebar}
              to="/admin/login"
            >
              <span>He thong quan tri</span>
              <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </footer>
        </div>
      </aside>

      <header className="sticky top-0 z-50 flex h-24 items-center justify-between border-b border-ink/5 bg-white/90 px-6 backdrop-blur-xl lg:px-16">
        <div className="flex items-center gap-12">
          <button className="group flex items-center gap-4 transition-all hover:text-sage" onClick={() => setIsSidebarOpen(true)}>
            <div className="flex w-6 flex-col gap-1.5">
              <span className="h-[1.5px] w-full rounded-full bg-current" />
              <span className="h-[1.5px] w-2/3 rounded-full bg-current transition-all group-hover:w-full" />
              <span className="h-[1.5px] w-full rounded-full bg-current" />
            </div>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.3em] sm:inline-block">Danh muc</span>
          </button>
        </div>

        <Link className="group absolute left-1/2 flex -translate-x-1/2 flex-col items-center" to="/">
          <span className="font-serif text-3xl tracking-tighter leading-none transition-all group-hover:italic lg:text-4xl">
            Affiliate Hub.
          </span>
          <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.5em] text-ink/30">Prime Selections</span>
        </Link>

        <div className="flex items-center gap-6">
          <button className="rounded-full p-3 transition-all hover:bg-canvas">
            <Search className="text-ink/80" size={22} />
          </button>
        </div>
      </header>

      <main className="min-h-screen">{children || <div className="p-12 text-center text-ink/20">Chua co noi dung.</div>}</main>

      <footer className="border-t border-white/5 bg-ink px-6 py-8 text-white lg:px-16">
        <div className="mx-auto flex max-w-[1920px] flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">&copy; 2026 Affiliate Hub / Tinh tuyen tu Shopee.</p>
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
