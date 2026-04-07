import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-ink/15 bg-white/70 p-8 text-center shadow-soft">
      <h3 className="font-serif text-2xl text-ink">{title}</h3>
      <p className="mt-3 text-sm text-ink/70">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
