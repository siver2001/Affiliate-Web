import { Link } from "react-router-dom";

import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
        <Badge>About the project</Badge>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight">
          Affiliate Product Hub được dựng để vừa bán hàng tốt hơn, vừa vận hành nội dung gọn hơn.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-ink/75">
          Hệ thống gom hai mảng nội dung chính là thú cưng và mẹo vặt hoặc review thiết bị,
          với trọng tâm vào card sản phẩm rõ ràng, mobile-first và admin có thể tự chỉnh sửa
          trực tiếp trên giao diện.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {[
          "Public app React + Vite + TypeScript, ưu tiên responsive.",
          "Admin nằm chung app, quản lý mô tả, media, link affiliate.",
          "Backend Express + Prisma + Supabase-ready, có fallback local để demo nhanh."
        ].map((item) => (
          <article className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft" key={item}>
            <p className="text-sm leading-7 text-ink/75">{item}</p>
          </article>
        ))}
      </section>

      <div className="flex gap-3">
        <Link to="/pets">
          <Button>Xem mảng thú cưng</Button>
        </Link>
        <Link to="/admin/dashboard">
          <Button variant="outline">Mở admin</Button>
        </Link>
      </div>
    </div>
  );
}
