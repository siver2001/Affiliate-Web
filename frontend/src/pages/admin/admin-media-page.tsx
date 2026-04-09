import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { uploadImage } from "../../services/uploads";
import { compressImage } from "../../utils/image-compression";

export function AdminMediaPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (item) => {
      setUploadedUrl(item.url);
      toast.success(`Upload thành công qua ${item.storage}.`);
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || "Upload ảnh thất bại.";
      toast.error(msg);
    }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="font-serif text-4xl">Upload media</h1>
        <p className="mt-3 text-sm leading-7 text-ink/70">
          Endpoint này ưu tiên upload qua backend. Nếu có Supabase env thì sẽ lên Storage,
          nếu chưa cấu hình Supabase Storage thì hệ thống sẽ báo rõ để bạn hoàn thiện môi trường production.
        </p>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-[2rem] border border-dashed border-ink/15 bg-canvas px-6 py-12 text-center">
          <ImagePlus className="text-coral" size={28} />
          <span className="mt-4 text-sm font-medium">Chọn ảnh để upload</span>
          <input
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) {
                try {
                  const finalFile = await compressImage(file, 4);
                  uploadMutation.mutate(finalFile);
                } catch (error) {
                  console.error("Compression error:", error);
                  uploadMutation.mutate(file);
                }
              }
              event.currentTarget.value = "";
            }}
            type="file"
          />
        </label>
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-4xl">Kết quả upload</h2>
        {uploadedUrl ? (
          <div className="mt-6 space-y-4">
            <img alt="Uploaded preview" className="aspect-video w-full rounded-[1.5rem] object-cover" src={uploadedUrl} />
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
