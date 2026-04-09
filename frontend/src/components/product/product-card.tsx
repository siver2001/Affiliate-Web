import { ArrowUpRight, Copy } from "lucide-react";
import { toast } from "sonner";

import { buildAffiliateCopyText } from "../../lib/affiliate-copy";
import { copyProductToClipboard } from "../../lib/clipboard";
import { formatCurrency } from "../../lib/format";
import type { Product } from "../../types/entities";

export function ProductCard({ product }: { product: Product }) {
  async function handleCopyAffiliate() {
    if (!product.shopeeUrl) {
      return;
    }

    try {
      await copyProductToClipboard(buildAffiliateCopyText(product), product.thumbnail);
      toast.success("Đã copy thành công.");
    } catch (error) {
      console.error("Failed to copy affiliate content:", error);
      toast.error("Không thể copy nội dung.");
    }
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white transition-all duration-500 hover:shadow-xl animate-reveal">
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <img
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          src={product.thumbnail ?? "https://images.unsplash.com/photo-1544648397-72fa8f1b802e?auto=format&fit=crop&q=80&w=800"}
        />

        <div className="pointer-events-none absolute left-2 top-2 z-10">
          <span className="rounded-md border border-ink/5 bg-white/90 px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest text-ink backdrop-blur-sm">
            {product.category?.name || "New"}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          {product.shopeeUrl && (
            <a
              className="flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-coral shadow-lg transition-all group-hover:translate-y-0 hover:bg-coral hover:text-white"
              href={product.shopeeUrl}
              rel="noreferrer"
              target="_blank"
            >
              <span className="text-[10px] font-black">S.</span>
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 pb-3">
        <div className="flex-1">
          <h3 className="min-h-[2.5em] line-clamp-2 font-serif text-sm leading-tight tracking-tight transition-colors duration-300 group-hover:text-ink">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[11px] font-bold text-ink/80">{formatCurrency(product.price)}</span>
            <ArrowUpRight className="text-ink/10 transition-all group-hover:text-ink" size={10} />
          </div>
        </div>

        <div className="mt-3">
          {product.shopeeUrl && (
            <div className="grid grid-cols-[minmax(0,1fr),auto] gap-2">
              <a
                className="flex h-8 items-center justify-center rounded-lg bg-[#FF4D00]/5 text-[8px] font-black uppercase tracking-[0.1em] text-[#FF4D00] transition-all hover:bg-[#FF4D00] hover:text-white"
                href={product.shopeeUrl}
                rel="noreferrer"
                target="_blank"
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
