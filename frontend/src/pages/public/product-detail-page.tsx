import { useQuery } from "@tanstack/react-query";
import { Copy, ShoppingBag } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { EmptyState } from "../../components/common/empty-state";
import { LoadingBlock } from "../../components/common/loading-block";
import { ProductCard } from "../../components/product/product-card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { buildAffiliateCopyText } from "../../lib/affiliate-copy";
import { formatCurrency } from "../../lib/format";
import { getProduct } from "../../services/products";
import { copyProductToClipboard } from "../../lib/clipboard";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const productQuery = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    enabled: Boolean(slug)
  });

  if (productQuery.isLoading) {
    return <LoadingBlock label="Đang tải chi tiết sản phẩm..." />;
  }

  if (!productQuery.data?.item) {
    return (
      <EmptyState
        description="Slug sản phẩm không tồn tại hoặc API chưa trả dữ liệu."
        title="Không tìm thấy sản phẩm"
      />
    );
  }

  const { item, related } = productQuery.data;
  const gallery = item.images.length
    ? item.images
    : item.thumbnail
      ? [{ id: "thumb", imageUrl: item.thumbnail, altText: item.name, sortOrder: 0 }]
      : [];

  async function handleCopyAffiliate() {
    try {
      const result = await copyProductToClipboard(buildAffiliateCopyText(item), item.thumbnail);
      if (result === true) {
        toast.success("Đã copy nội dung và ảnh.");
      } else if (result === "text-plus-url") {
        toast.info("Đã copy nội dung + link ảnh (không thể copy trực tiếp ảnh).");
      } else {
        toast.success("Đã copy nội dung affiliate.");
      }
    } catch (error) {
      console.error("Failed to copy affiliate content:", error);
      toast.error("Không thể copy nội dung.");
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1fr,0.92fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft">
            <img
              alt={gallery[0]?.altText ?? item.name}
              className="aspect-[4/3] w-full object-cover"
              src={gallery[0]?.imageUrl ?? "https://placehold.co/1000x700?text=No+Image"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {gallery.map((image) => (
              <img
                alt={image.altText ?? item.name}
                className="aspect-square rounded-[1.5rem] object-cover"
                key={image.id}
                src={image.imageUrl}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
          <Badge>{item.category?.name ?? "Sản phẩm"}</Badge>
          <h1 className="mt-4 font-serif text-4xl leading-tight">{item.name}</h1>
          <p className="mt-4 text-base leading-8 text-ink/70">{item.shortDescription}</p>

          <div className="mt-6 rounded-[2rem] bg-canvas p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">Giá tham khảo</p>
            <p className="mt-2 text-2xl font-semibold text-pine">{formatCurrency(item.price)}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-ink" key={tag.id}>
                #{tag.name}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {item.shopeeUrl ? (
              <>
                <a href={item.shopeeUrl} rel="noreferrer" target="_blank">
                  <Button>
                    <ShoppingBag className="mr-2" size={16} />
                    Mua trên Shopee
                  </Button>
                </a>
                <Button onClick={handleCopyAffiliate} variant="outline">
                  <Copy className="mr-2" size={16} />
                  Copy nội dung + link
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-ink/45">Related picks</p>
          <h2 className="mt-2 font-serif text-3xl">Sản phẩm liên quan</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
