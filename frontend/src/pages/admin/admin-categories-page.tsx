import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Plus, Sparkles, Trash2, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { LoadingBlock } from "../../components/common/loading-block";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../services/categories";
import type { Category } from "../../types/entities";

const schema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự."),
  slug: z.string().optional(),
  type: z.enum(["pets", "gadgets"]),
  description: z.string().optional(),
  parentId: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

function normalizePayload(values: FormValues, categories: Category[]) {
  const parentId = values.parentId?.trim() || undefined;
  const parent = parentId ? categories.find((item) => item.id === parentId) : null;

  return {
    name: values.name.trim(),
    slug: values.slug?.trim() || undefined,
    description: values.description?.trim() || undefined,
    parentId,
    type: parent?.type ?? values.type
  };
}

function getSectionLabel(type: Category["type"]) {
  return type === "pets" ? "Thú cưng" : "Đời sống";
}

function getSectionAccent(type: Category["type"]) {
  return type === "pets"
    ? "from-[#214f47] via-[#2f6d63] to-[#5ca18f]"
    : "from-[#f26a4b] via-[#dd8448] to-[#d1a652]";
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
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

  const categories = categoriesQuery.data ?? [];
  const rootCategories = useMemo(() => categories.filter((item) => !item.parentId), [categories]);
  const selectedParentId = form.watch("parentId");
  const selectedParent = rootCategories.find((item) => item.id === selectedParentId) ?? null;

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => createCategory(normalizePayload(values, categories)),
    onSuccess: () => {
      toast.success("Đã tạo danh mục.");
      form.reset({
        name: "",
        slug: "",
        type: "pets",
        description: "",
        parentId: ""
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!editingId) throw new Error("No editing ID");
      return updateCategory(editingId, normalizePayload(values, categories));
    },
    onSuccess: () => {
      toast.success("Đã cập nhật danh mục.");
      setEditingId(null);
      form.reset({
        name: "",
        slug: "",
        type: "pets",
        description: "",
        parentId: ""
      });
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
      toast.error("Không thể xóa danh mục đang có sản phẩm hoặc danh mục con liên kết.");
    }
  });

  if (categoriesQuery.isLoading) {
    return <LoadingBlock label="Đang tải danh mục..." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.94fr,1.06fr]">
      <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-soft">
        <div className="relative overflow-hidden border-b border-ink/8 bg-[radial-gradient(circle_at_top_left,#e2f0ec_0%,#f9f7f1_40%,#ffffff_100%)] p-6">
          <div className="absolute -left-8 top-0 h-32 w-32 rounded-full bg-[#2f6d63]/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#f26a4b]/10 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink/40">Category control</p>
            <h1 className="mt-3 font-serif text-4xl text-ink">Quản lý danh mục</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-[1.6rem] border border-ink/8 bg-canvas/70 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-3 text-pine shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">Luồng nên dùng</p>
                <p className="mt-1 text-sm leading-6 text-ink/60">
                  Tạo nhóm cha trước như <span className="font-medium text-ink">Thú cưng</span>, sau đó bấm{" "}
                  <span className="font-medium text-ink">Thêm mục con</span> ngay trong danh sách bên phải để tạo các mục
                  con như Ăn uống, Vệ sinh, Đồ chơi.
                </p>
              </div>
            </div>
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit((values) => {
              if (editingId) {
                updateMutation.mutate(values);
              } else {
                createMutation.mutate(values);
              }
            })}
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">
                Tên danh mục {editingId ? "(Đang sửa)" : ""}
              </label>
              <Input {...form.register("name")} placeholder="Ví dụ: Ăn uống cho mèo" />
              {form.formState.errors.name ? (
                <p className="mt-2 text-sm text-red-500">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Slug</label>
                <Input {...form.register("slug")} placeholder="Để trống để hệ thống tự sinh" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Nhóm cha</label>
                <select
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm disabled:opacity-50"
                  disabled={Boolean(editingId && !rootCategories.find(c => c.id === editingId))}
                  {...form.register("parentId")}
                >
                  <option value="">Không có, đây là nhóm cha</option>
                  {rootCategories
                    .filter(c => c.id !== editingId) // Don't allow selecting self as parent
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Hệ nội dung</label>
                <select
                  className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm disabled:bg-canvas"
                  disabled={Boolean(selectedParent)}
                  {...form.register("type")}
                >
                  <option value="pets">Thú cưng</option>
                  <option value="gadgets">Đời sống</option>
                </select>
                <p className="mt-2 text-xs text-ink/45">
                  {selectedParent
                    ? `Đang kế thừa hệ “${getSectionLabel(selectedParent.type)}” từ nhóm cha ${selectedParent.name}.`
                    : "Dùng cho nhóm cha. Nếu chọn nhóm cha ở trên thì hệ nội dung sẽ tự kế thừa."}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Mô tả ngắn</label>
                <Textarea {...form.register("description")} placeholder="Tùy chọn, để nội bộ dễ quản lý." rows={4} />
              </div>
            </div>

            {selectedParent ? (
              <div className="rounded-[1.5rem] border border-[#2f6d63]/15 bg-[#2f6d63]/6 px-4 py-3 text-sm text-ink/70">
                Danh mục mới sẽ được tạo dưới nhóm cha <span className="font-semibold text-ink">{selectedParent.name}</span>.
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <Button className="justify-center px-6" disabled={createMutation.isPending || updateMutation.isPending} type="submit">
                {editingId 
                  ? (updateMutation.isPending ? "Đang lưu..." : "Cập nhật danh mục") 
                  : (createMutation.isPending ? "Đang lưu..." : "Tạo danh mục")}
              </Button>
              {editingId ? (
                <Button
                  onClick={() => {
                    setEditingId(null);
                    form.reset({
                      name: "",
                      slug: "",
                      type: "pets",
                      description: "",
                      parentId: ""
                    });
                  }}
                  type="button"
                  variant="outline"
                >
                  Hủy sửa
                </Button>
              ) : selectedParent ? (
                <Button
                  onClick={() => form.setValue("parentId", "")}
                  type="button"
                  variant="outline"
                >
                  Bỏ chọn nhóm cha
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </section>

      <section className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-ink/40">Category map</p>
            <h2 className="mt-3 font-serif text-4xl text-ink">Cấu trúc hiện tại</h2>
          </div>
          <div className="rounded-[1.4rem] border border-ink/8 bg-canvas/70 px-4 py-3 text-sm text-ink/60">
            {categories.length} danh mục đang hoạt động
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {rootCategories.map((root) => {
            const children = categories.filter((item) => item.parentId === root.id);

            return (
              <article className="overflow-hidden rounded-[1.8rem] border border-ink/8 bg-canvas/55" key={root.id}>
                <div className={`relative overflow-hidden bg-gradient-to-r ${getSectionAccent(root.type)} px-5 py-5 text-white`}>
                  <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/15 to-transparent" />
                  <div className="relative flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/65">{getSectionLabel(root.type)}</p>
                      <h3 className="mt-2 font-serif text-3xl">{root.name}</h3>
                      <p className="mt-2 text-sm text-white/75">{children.length} mục con</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="rounded-full bg-white text-ink hover:bg-white/90 border-none px-4"
                        onClick={() => {
                          form.setValue("parentId", root.id);
                          form.setValue("type", root.type);
                          form.setFocus("name");
                        }}
                        type="button"
                        variant="ghost"
                      >
                        <Plus className="mr-2" size={16} />
                        Thêm mục con
                      </Button>
                      <Button
                        className="rounded-full bg-white text-ink hover:bg-white/90 border-none px-3"
                        onClick={() => {
                          setEditingId(root.id);
                          form.reset({
                            name: root.name,
                            slug: root.slug ?? "",
                            type: root.type,
                            description: root.description ?? "",
                            parentId: root.parentId ?? ""
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        type="button"
                        variant="ghost"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        className="rounded-full bg-white text-ink hover:bg-white/90 border-none px-3"
                        onClick={() => deleteMutation.mutate(root.id)}
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {root.description ? <p className="mb-4 text-sm leading-6 text-ink/60">{root.description}</p> : null}

                  {children.length > 0 ? (
                    <div className="grid gap-3">
                      {children.map((child) => (
                        <div
                          className="flex items-start justify-between gap-4 rounded-[1.4rem] border border-ink/8 bg-white px-4 py-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                          key={child.id}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="rounded-full bg-pine/8 p-2 text-pine">
                                <FolderTree size={14} />
                              </div>
                              <div>
                                <p className="font-medium text-ink">{child.name}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink/40">{child.slug}</p>
                              </div>
                            </div>
                            {child.description ? <p className="mt-3 text-sm leading-6 text-ink/58">{child.description}</p> : null}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-canvas px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-ink/45">
                              {child.productCount ?? 0} SP
                            </span>
                            <Button
                              onClick={() => {
                                setEditingId(child.id);
                                form.reset({
                                  name: child.name,
                                  slug: child.slug ?? "",
                                  type: child.type,
                                  description: child.description ?? "",
                                  parentId: child.parentId ?? ""
                                });
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              type="button"
                              variant="ghost"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button onClick={() => deleteMutation.mutate(child.id)} type="button" variant="ghost">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[1.4rem] border border-dashed border-ink/10 bg-white/70 px-4 py-4 text-sm text-ink/50">
                      Nhóm này chưa có mục con. Bấm <span className="font-medium text-ink">Thêm mục con</span> để tạo nhanh.
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {rootCategories.length === 0 ? (
            <div className="rounded-[1.8rem] border border-dashed border-ink/12 bg-canvas/60 px-6 py-8 text-center text-sm text-ink/50">
              Chưa có nhóm cha nào. Hãy tạo danh mục đầu tiên ở khung bên trái.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
