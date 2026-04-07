import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-3xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-coral focus:ring-4 focus:ring-coral/10",
        className
      )}
      {...props}
    />
  );
}
