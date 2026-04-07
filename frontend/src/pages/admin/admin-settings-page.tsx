import { Badge } from "../../components/ui/badge";

export function AdminSettingsPage() {
  const checks = [
    "Frontend env: VITE_API_BASE_URL",
    "Backend env: DATABASE_URL, DIRECT_URL, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD",
    "Supabase: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_STORAGE_BUCKET",
    "Deploy: frontend tren Vercel, backend tren Render hoac Railway"
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
        <Badge>Deployment ready</Badge>
        <h1 className="mt-4 font-serif text-4xl">Thiet lap he thong</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70">
          Day la man hinh checklist nhanh de doi chieu voi README khi cau hinh moi truong, Supabase va deploy sau
          MVP.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {checks.map((item) => (
          <article className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft" key={item}>
            <p className="text-sm leading-7 text-ink/75">{item}</p>
          </article>
        ))}
      </div>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-8 shadow-soft">
        <h2 className="font-serif text-3xl">Luong khuyen nghi</h2>
        <div className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
          <p>1. Dung Supabase project va lay chuoi ket noi PostgreSQL.</p>
          <p>2. Chay Prisma migrate va chuyen auth sang user table thuc.</p>
          <p>3. Ket noi frontend toi backend domain production.</p>
          <p>4. Chuyen upload anh sang Supabase Storage bang service role key.</p>
        </div>
      </section>
    </div>
  );
}
