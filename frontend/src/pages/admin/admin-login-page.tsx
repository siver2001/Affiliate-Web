import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LockKeyhole } from "lucide-react";
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

export function AdminLoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      auth.login(data.token, data.user);
      toast.success("Đăng nhập thành công.");
      navigate("/admin/dashboard");
    },
    onError: () => {
      toast.error("Không đăng nhập được. Kiểm tra lại email hoặc mật khẩu.");
    }
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-8 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-soft lg:grid-cols-[0.95fr,1.05fr]">
        <div className="bg-[linear-gradient(145deg,#1f4d46,#2d6e64)] p-10 text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Admin auth</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight">
            Đăng nhập để chỉnh nội dung, media và link affiliate.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
            Trang đăng nhập này dùng JWT flow đơn giản theo spec. Có thể thay bằng user table
            trên Prisma và mật khẩu hash khi bạn nối Supabase thật.
          </p>
        </div>

        <div className="p-8 sm:p-12">
          <div className="mx-auto max-w-md">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-coral/10 text-coral">
              <LockKeyhole size={24} />
            </div>
            <h2 className="mt-6 font-serif text-4xl">Welcome back</h2>
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
