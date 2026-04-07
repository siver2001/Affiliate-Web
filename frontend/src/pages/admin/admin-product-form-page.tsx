import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { LoadingBlock } from "../../components/common/loading-block";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { getCategories } from "../../services/categories";
import { createProduct, getProducts, updateProduct } from "../../services/products";
import { uploadImage } from "../../services/uploads";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(10),
  price: z.string().optional(),
  shopeeUrl: z.string().optional(),
  tagsText: z.string().optional(),
  imagesText: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0)
});

type FormValues = z.infer<typeof schema>;

function appendImageUrl(currentValue: string, nextUrl: string) {
  const trimmed = currentValue.trim();
  return trimmed ? `${trimmed}\n${nextUrl}` : nextUrl;
}

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const productsQuery = useQuery({ queryKey: ["admin-products"], queryFn: () => getProducts() });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      shortDescription: "",
      price: "",
      shopeeUrl: "",
      tagsText: "",
      imagesText: "",
      isFeatured: false,
      isPublished: true,
      sortOrder: 0
    }
  });

  const currentProduct = productsQuery.data?.items.find((item) => item.id === id);

  useEffect(() => {
    if (!currentProduct) {
      return;
    }

    form.reset({
      name: currentProduct.name,
      slug: currentProduct.slug,
      categoryId: currentProduct.categoryId,
      shortDescription: currentProduct.shortDescription,
      price: currentProduct.price ? String(currentProduct.price) : "",
      shopeeUrl: currentProduct.shopeeUrl ?? "",
      tagsText: currentProduct.tags.map((tag) => tag.name).join(", "),
      imagesText: currentProduct.images.map((image) => image.imageUrl).join("\n"),
      isFeatured: currentProduct.isFeatured,
      isPublished: currentProduct.isPublished,
      sortOrder: currentProduct.sortOrder
    });
  }, [currentProduct, form]);

  const uploadMutation = useMutation({
    mutationFn: uploadImage,
    onSuccess: (item) => {
      const currentImages = form.getValues("imagesText") ?? "";
      form.setValue("imagesText", appendImageUrl(currentImages, item.url), {
        shouldDirty: true,
        shouldTouch: true
      });
      toast.success(`Da upload anh qua ${item.storage} va chen URL vao danh sach anh.`);
    },
    onError: () => {
      toast.error("Khong upload duoc anh.");
    }
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const imageUrls = values.imagesText
        ?.split("\n")
        .map((item) => item.trim())
        .filter(Boolean) ?? [];

      const payload = {
        name: values.name,
        slug: values.slug,
        categoryId: values.categoryId,
        shortDescription: values.shortDescription,
        fullDescription: null,
        socialDescription: null,
        suitableFor: null,
        pros: null,
        cons: null,
        price: values.price ? Number(values.price) : null,
        thumbnail: imageUrls[0] || null,
        shopeeUrl: values.shopeeUrl || null,
        lazadaUrl: null,
        isFeatured: values.isFeatured,
        isPublished: values.isPublished,
        sortOrder: Number(values.sortOrder),
        images: imageUrls.map((imageUrl, index) => ({
          imageUrl,
          altText: values.name,
          sortOrder: index
        })),
        tags:
          values.tagsText
            ?.split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((name) => ({ name })) ?? []
      };

      if (id) {
        return updateProduct(id, payload);
      }

      return createProduct(payload);
    },
    onSuccess: () => {
      toast.success(id ? "Da cap nhat san pham." : "Da tao san pham.");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    },
    onError: () => {
      toast.error("Khong luu duoc san pham.");
    }
  });

  if (categoriesQuery.isLoading || productsQuery.isLoading) {
    return <LoadingBlock label="Dang chuan bi form..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <div>
          <h1 className="font-serif text-4xl">{id ? "Chinh sua san pham" : "Tao san pham moi"}</h1>
          <p className="mt-2 text-sm text-ink/70">Form da duoc rut gon chi giu cac truong can thiet.</p>
        </div>
        <Link to="/admin/products">
          <Button variant="outline">Quay lai danh sach</Button>
        </Link>
      </div>

      <form
        className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <section className="space-y-6 rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Ten san pham</label>
              <Input {...form.register("name")} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Slug</label>
              <Input {...form.register("slug")} placeholder="De trong de backend tu sinh" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Danh muc</label>
              <select
                className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm"
                {...form.register("categoryId")}
              >
                <option value="">Chon danh muc</option>
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Gia tham khao</label>
              <Input {...form.register("price")} placeholder="259000" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-ink/70">Sort order</label>
              <Input {...form.register("sortOrder", { valueAsNumber: true })} type="number" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink/70">Mo ta ngan</label>
            <Textarea {...form.register("shortDescription")} />
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
            <h2 className="font-serif text-3xl">Affiliate va media</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Shopee URL</label>
                <Input {...form.register("shopeeUrl")} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-ink/70">Danh sach anh</label>
                  <div>
                    <input
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          uploadMutation.mutate(file);
                        }
                        event.currentTarget.value = "";
                      }}
                      ref={fileInputRef}
                      type="file"
                    />
                    <Button
                      className="px-4 py-2 text-xs"
                      disabled={uploadMutation.isPending}
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                      variant="outline"
                    >
                      <ImagePlus className="mr-2" size={14} />
                      {uploadMutation.isPending ? "Dang upload..." : "Upload anh"}
                    </Button>
                  </div>
                </div>
                <Textarea {...form.register("imagesText")} placeholder="Moi dong mot URL anh" />
                <p className="mt-2 text-xs text-ink/50">Co the dan URL san co hoac bam Upload anh de chen tu dong.</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/70">Tags</label>
                <Input {...form.register("tagsText")} placeholder="pet, easy-clean, workspace" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-ink/75">
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register("isFeatured")} />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" {...form.register("isPublished")} />
                  Published
                </label>
              </div>
            </div>
          </div>

          <Button className="w-full justify-center" disabled={mutation.isPending} type="submit">
            {mutation.isPending ? "Dang luu..." : id ? "Cap nhat san pham" : "Tao san pham"}
          </Button>
        </section>
      </form>
    </div>
  );
}
