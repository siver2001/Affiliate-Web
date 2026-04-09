import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useAuth } from "../../hooks/use-auth";
import { login } from "../../services/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

type FormValues = z.infer<typeof schema>;

const highlights = [
  "Cập nhật danh mục và sản phẩm nhanh trong một màn hình.",
  "Lưu link Shopee, giá và bộ ảnh để chốt bài đăng dễ hơn.",
  "Copy sẵn nội dung affiliate để đem đi comment Facebook."
];

export function AdminLoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      auth.login(data.token, data.user);
      toast.success("Đăng nhập thành công.");
      navigate("/admin/dashboard");
    },
    onError: (error: any) => {
      let message: string;
      if (error.code === "ECONNABORTED") {
        message = "Hết thời gian chờ. Server đang khởi động, vui lòng thử lại.";
      } else if (!error.response) {
        message = "Không thể kết nối đến server. Kiểm tra kết nối mạng.";
      } else {
        message = error.response?.data?.message || "Không đăng nhập được. Kiểm tra lại email hoặc mật khẩu.";
      }
      toast.error(message);
    }
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-soft lg:grid-cols-[0.95fr,1.05fr]">
        <div className="relative overflow-hidden bg-[linear-gradient(155deg,#163f39_0%,#21584f_45%,#2f7468_100%)] p-10 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#f26a4b]/25 blur-3xl" />
            <div className="absolute left-16 top-36 h-px w-40 bg-white/30" />
            <div className="absolute left-24 top-44 h-px w-24 bg-white/20" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-2 text-[11px] uppercase tracking-[0.32em] text-white/75">
              <Sparkles size={12} />
              Admin auth
            </div>
            <h1 className="mt-6 max-w-lg font-serif text-5xl leading-[1.08]">
              Đăng nhập để quản lý sản phẩm và dòng nội dung bán hàng gọn, nhanh, dễ dàng.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/78">
              Đây là khu vực để cập nhật giá, ảnh, danh mục và link affiliate. Mọi thay đổi được gom lại để bạn có thể
              lên bài và copy nội dung đi comment ngay sau khi lưu.
            </p>

            <div className="mt-10 space-y-3">
              {highlights.map((item, index) => (
                <div
                  className="flex items-start gap-3 rounded-[1.7rem] border border-white/10 bg-white/7 px-4 py-4 backdrop-blur-sm"
                  key={item}
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white/14 text-[11px] font-bold text-white">
                    0{index + 1}
                  </span>
                  <p className="text-sm leading-6 text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mx-auto max-w-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-coral/10 text-coral">
              <LockKeyhole size={24} />
            </div>
            <h2 className="mt-6 font-serif text-4xl">Welcome back</h2>
            <p className="mt-2 text-sm text-ink/55">Đăng nhập để tiếp tục cập nhật gian hàng affiliate của bạn.</p>

            <form
              autoComplete="off"
              className="mt-8 space-y-5"
              onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/75">Email</label>
                <Input {...form.register("email")} autoComplete="off" placeholder="you@example.com" type="email" />
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.email?.message}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink/75">Mật khẩu</label>
                <Input
                  {...form.register("password")}
                  autoComplete="off"
                  placeholder="Enter password"
                  type="password"
                />
                <p className="mt-1 text-xs text-red-500">{form.formState.errors.password?.message}</p>
              </div>
              <Button className="w-full justify-center" disabled={loginMutation.isPending} type="submit">
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập admin"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
