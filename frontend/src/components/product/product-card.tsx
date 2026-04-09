import { ArrowUpRight, Copy } from "lucide-react";
import { toast } from "sonner";

import { buildAffiliateCopyText } from "../../lib/affiliate-copy";
import { formatCurrency } from "../../lib/format";
import { copyProductToClipboard } from "../../lib/clipboard";
import type { Product } from "../../types/entities";

export function ProductCard({ product }: { product: Product }) {
  async function handleCopyAffiliate() {
    if (!product.shopeeUrl) {
      return;
    }

    try {
      const result = await copyProductToClipboard(buildAffiliateCopyText(product), product.thumbnail);
      if (result === true) {
        toast.success("Đã copy nội dung và ảnh.");
      } else if (result === "text-plus-url") {
        toast.info("Đã copy nội dung + link ảnh (không thể copy ảnh trực tiếp).");
      } else {
        toast.success("Đã copy nội dung affiliate.");
      }
    } catch (error) {
      console.error("Failed to copy affiliate content:", error);
      toast.error("Không thể copy nội dung.");
    }
  }

  return (
    <article className="group relative flex flex-col bg-white overflow-hidden rounded-2xl border border-ink/5 transition-all duration-500 hover:shadow-xl animate-reveal">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={product.thumbnail ?? "https://images.unsplash.com/photo-1544648397-72fa8f1b802e?auto=format&fit=crop&q=80&w=800"}
        />
        
        {/* Floating Badge (Only Category) */}
        <div className="absolute top-2 left-2 pointer-events-none z-10">
          <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm text-ink text-[7px] font-black uppercase tracking-widest rounded-md border border-ink/5">
            {product.category?.name || "New"}
          </span>
        </div>

        {/* Hover Overlay with tiny links */}
        <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          {product.shopeeUrl && (
            <a 
              href={product.shopeeUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-coral shadow-lg hover:bg-coral hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <span className="font-black text-[10px]">S.</span>
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pb-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-serif text-sm tracking-tight leading-tight group-hover:text-ink transition-colors duration-300 line-clamp-2 min-h-[2.5em]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[11px] font-bold text-ink/80">{formatCurrency(product.price)}</span>
            <ArrowUpRight size={10} className="text-ink/10 group-hover:text-ink transition-all" />
          </div>
        </div>

        <div className="mt-3">
          {product.shopeeUrl && (
            <div className="grid grid-cols-[minmax(0,1fr),auto] gap-2">
              <a 
                href={product.shopeeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="h-8 bg-[#FF4D00]/5 hover:bg-[#FF4D00] text-[#FF4D00] hover:text-white rounded-lg flex items-center justify-center text-[8px] uppercase tracking-[0.1em] font-black transition-all"
              >
                Shopee
              </a>
              <button
                className="h-8 min-w-8 rounded-lg border border-ink/10 bg-white px-2 text-ink/70 transition-all hover:border-[#FF4D00]/30 hover:bg-[#FF4D00]/5 hover:text-[#FF4D00]"
                onClick={handleCopyAffiliate}
                type="button"
              >
                <Copy className="mx-auto" size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
