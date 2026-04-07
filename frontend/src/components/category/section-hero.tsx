import { motion } from "framer-motion";

import { Badge } from "../ui/badge";

export function SectionHero({
  eyebrow,
  title,
  description,
  accent
}: {
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-soft"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="p-8 sm:p-10">
          <Badge>{eyebrow}</Badge>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-ink/70">{description}</p>
        </div>
        <div className={`min-h-56 ${accent} p-8`}>
          <div className="flex h-full flex-col justify-between rounded-[2rem] border border-white/50 bg-white/15 p-6 text-white backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">Mobile first curated hub</p>
            <p className="max-w-sm font-serif text-3xl leading-tight">
              Nội dung gọn, CTA rõ, dễ chỉnh sửa trong admin.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
