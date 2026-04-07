import { Copy, FolderTree, LayoutDashboard, LogOut, Package } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";

const items = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "San pham", icon: Package },
  { to: "/admin/categories", label: "Danh muc", icon: FolderTree }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="grid min-h-[calc(100vh-7rem)] gap-6 lg:grid-cols-[280px,1fr]">
      <aside className="rounded-[2rem] border border-ink/10 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/45">Admin console</p>
            <h1 className="mt-2 font-serif text-3xl">Affiliate Hub</h1>
          </div>
          <div className="rounded-2xl bg-sand p-3 text-pine">
            <Copy size={18} />
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-canvas p-4 text-sm text-ink/75">
          <p className="font-medium text-ink">{auth.user?.email ?? "Admin"}</p>
          <p className="mt-1">Quan ly san pham, danh muc va link affiliate.</p>
        </div>

        <nav className="mt-6 space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-pine text-white" : "text-ink/70 hover:bg-canvas"
                  }`
                }
                key={item.to}
                to={item.to}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <Button
          className="mt-6 w-full justify-center"
          onClick={() => {
            auth.logout();
            navigate("/admin/login");
          }}
          variant="outline"
        >
          <LogOut className="mr-2" size={16} />
          Dang xuat
        </Button>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
