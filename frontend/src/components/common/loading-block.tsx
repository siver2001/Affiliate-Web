export function LoadingBlock({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 text-center shadow-soft">
      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pine/15 border-t-pine" />
      <p className="mt-4 text-sm text-ink/70">{label}</p>
    </div>
  );
}
