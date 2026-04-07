import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { uploadImage } from "../../services/uploads";

export function AdminMediaPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (item) => {
      setUploadedUrl(item.url);
      toast.success(`Upload thành công qua ${item.storage}.`);
    },
    onError: () => {
      toast.error("Upload ảnh thất bại.");
    }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="font-serif text-4xl">Upload media</h1>
        <p className="mt-3 text-sm leading-7 text-ink/70">
          Endpoint này ưu tiên upload qua backend. Nếu có Supabase env thì sẽ lên Storage,
          nếu chưa có thì rơi về local uploads để bạn vẫn demo được flow.
        </p>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-ink/15 bg-canvas px-6 py-12 text-center">
          <ImagePlus className="text-coral" size={28} />
          <span className="mt-4 text-sm font-medium">Chọn ảnh để upload</span>
          <input
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadMutation.mutate(file);
              }
            }}
            type="file"
          />
        </label>
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-4xl">Kết quả upload</h2>
        {uploadedUrl ? (
          <div className="mt-6 space-y-4">
            <img alt="Uploaded preview" className="aspect-video w-full rounded-[1.5rem] object-cover" src={uploadedUrl.startsWith("/") ? `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000"}${uploadedUrl}` : uploadedUrl} />
            <div className="rounded-[1.5rem] bg-canvas p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-ink/45">Image URL</p>
              <p className="mt-2 break-all text-sm text-ink/75">{uploadedUrl}</p>
            </div>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(uploadedUrl);
                toast.success("Đã copy URL ảnh.");
              }}
              variant="outline"
            >
              <Link2 className="mr-2" size={16} />
              Copy URL
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-ink/60">Chưa có file nào được upload.</p>
        )}
      </section>
    </div>
  );
}
