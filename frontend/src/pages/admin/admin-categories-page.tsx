import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { LoadingBlock } from "../../components/common/loading-block";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { createCategory, deleteCategory, getCategories } from "../../services/categories";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  type: z.enum(["pets", "gadgets"]),
  description: z.string().optional(),
  parentId: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      type: "pets",
      description: "",
      parentId: ""
    }
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Đã tạo danh mục.");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Đã xóa danh mục.");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Không xóa được danh mục đang có sản phẩm liên kết.");
    }
  });

  if (categoriesQuery.isLoading) {
    return <LoadingBlock label="Đang tải danh mục..." />;
  }

  const categories = categoriesQuery.data ?? [];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h1 className="font-serif text-4xl">Tạo danh mục</h1>
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Tên danh mục</label>
            <Input {...form.register("name")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Slug</label>
            <Input {...form.register("slug")} placeholder="Để trống để backend tự sinh" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Nhóm nội dung</label>
            <select
              className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
              {...form.register("type")}
            >
              <option value="pets">Thú cưng</option>
              <option value="gadgets">Mẹo vặt</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Mô tả</label>
            <Textarea {...form.register("description")} />
          </div>
          <Button className="w-full justify-center" disabled={createMutation.isPending} type="submit">
            {createMutation.isPending ? "Đang lưu..." : "Tạo danh mục"}
          </Button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <h2 className="font-serif text-4xl">Danh mục hiện có</h2>
        <div className="mt-6 space-y-3">
          {categories.map((category) => (
            <article className="flex items-start justify-between gap-4 rounded-[1.5rem] bg-canvas p-4" key={category.id}>
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="mt-1 text-sm text-ink/60">{category.description}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ink/45">{category.slug}</p>
              </div>
              <Button onClick={() => deleteMutation.mutate(category.id)} variant="ghost">
                <Trash2 size={16} />
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
