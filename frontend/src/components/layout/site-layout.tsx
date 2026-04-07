import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categories";

export function SiteLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen selection:bg-sage/20 selection:text-sage">
      {/* --- SIDEBAR DRAWER --- */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-700 bg-ink/60 backdrop-blur-md ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />
      
      <aside className={`fixed top-0 left-0 bottom-0 z-[101] w-[340px] bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border-r border-ink/5 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex flex-col h-full p-10">
          <div className="flex items-center justify-between mb-16">
            <h3 className="text-3xl font-serif">Khám phá</h3>
            <button onClick={closeSidebar} className="p-3 -mr-3 hover:bg-canvas rounded-full transition-all">
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            <Link 
              to="/" 
              onClick={closeSidebar}
              className={`group flex items-center justify-between p-5 rounded-3xl transition-all duration-300 ${
                location.pathname === "/" ? "bg-sage text-white shadow-lg shadow-sage/20" : "hover:bg-canvas text-ink/70"
              }`}
            >
              <span className="font-semibold tracking-tight">Tất cả sản phẩm</span>
              <ArrowUpRight size={18} className={`transition-transform duration-300 ${location.pathname === "/" ? "translate-x-1 -translate-y-1" : "opacity-30"}`} />
            </Link>
            
            <div className="pt-8 pb-4 px-4">
               <span className="text-[10px] uppercase tracking-[0.4em] font-black text-ink/20">Các gian hàng</span>
            </div>

            {categories?.map((cat) => (
              <Link 
                key={cat.id}
                to={`/category/${cat.slug}`} 
                onClick={closeSidebar}
                className={`group flex items-center justify-between px-6 py-5 rounded-[2rem] transition-all duration-500 ${
                  location.pathname === `/category/${cat.slug}` 
                    ? "bg-ink text-white shadow-2xl shadow-ink/20 translate-x-2" 
                    : "hover:bg-canvas text-ink/60 hover:text-ink hover:translate-x-1"
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-lg font-serif tracking-tight">{cat.name}</span>
                  <span className={`text-[10px] mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity`}>
                    {cat.description || "Danh mục chọn lọc"}
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                  location.pathname.includes(cat.slug) ? "bg-white/10" : "bg-ink/5 opacity-0 group-hover:opacity-100"
                }`}>
                  <ArrowUpRight size={14} />
                </div>
              </Link>
            ))}
          </nav>

          <footer className="mt-12 pt-8 border-t border-ink/5">
            <Link to="/admin/login" onClick={closeSidebar} className="flex items-center gap-2 group text-[10px] uppercase tracking-[0.25em] font-bold text-ink/30 hover:text-pine transition-all">
              <span>Hệ thống quản trị</span>
              <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </footer>
        </div>
      </aside>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-ink/5 px-6 lg:px-16 h-24 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="group flex items-center gap-4 hover:text-sage transition-all"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span className="h-[1.5px] w-full bg-current rounded-full" />
              <span className="h-[1.5px] w-2/3 bg-current rounded-full transition-all group-hover:w-full" />
              <span className="h-[1.5px] w-full bg-current rounded-full" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold hidden sm:inline-block">Danh mục</span>
          </button>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
          <span className="font-serif text-3xl lg:text-4xl tracking-tighter leading-none group-hover:italic transition-all">Affiliate Hub.</span>
          <span className="text-[8px] uppercase tracking-[0.5em] font-bold text-ink/30 mt-1">Prime Selections</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <button className="p-3 hover:bg-canvas rounded-full transition-all">
            <Search size={22} className="text-ink/80" />
          </button>
        </div>
      </header>

      {/* --- CONTENT --- */}
      <main className="min-h-screen">
        {children || <div className="p-12 text-center text-ink/20">Chưa có nội dung.</div>}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-ink text-white py-8 px-6 lg:px-16 border-t border-white/5">
        <div className="max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">
            &copy; 2026 Affiliate Hub / Tinh tuyển từ Shopee.
          </p>
          <div className="flex gap-8">
             <Link to="/admin/login" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors font-bold">Admin Portal</Link>
             <span className="text-[10px] uppercase tracking-[0.2em] text-white/10 font-bold">Terms of quality.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
