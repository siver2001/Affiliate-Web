import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { LoadingBlock } from "../components/common/loading-block";
import { AdminLayout } from "../components/layout/admin-layout";
import { SiteLayout } from "../components/layout/site-layout";
import { ProtectedRoute } from "./protected-route";

const HomePage = lazy(() => import("../pages/public/home-page").then((module) => ({ default: module.HomePage })));
const CategoryPage = lazy(() =>
  import("../pages/public/category-page").then((module) => ({ default: module.CategoryPage }))
);
const SearchPage = lazy(() => import("../pages/public/search-page").then((module) => ({ default: module.SearchPage })));
const AdminLoginPage = lazy(() =>
  import("../pages/admin/admin-login-page").then((module) => ({ default: module.AdminLoginPage }))
);
const AdminDashboardPage = lazy(() =>
  import("../pages/admin/admin-dashboard-page").then((module) => ({ default: module.AdminDashboardPage }))
);
const AdminProductsPage = lazy(() =>
  import("../pages/admin/admin-products-page").then((module) => ({ default: module.AdminProductsPage }))
);
const AdminProductFormPage = lazy(() =>
  import("../pages/admin/admin-product-form-page").then((module) => ({ default: module.AdminProductFormPage }))
);
const AdminCategoriesPage = lazy(() =>
  import("../pages/admin/admin-categories-page").then((module) => ({ default: module.AdminCategoriesPage }))
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-canvas"><LoadingBlock /></div>}>
        <Routes>
          <Route element={<SiteLayout><Outlet /></SiteLayout>} path="/">
            <Route element={<HomePage />} index />
            <Route element={<CategoryPage />} path="category/:slug" />
            <Route element={<SearchPage />} path="search" />
          </Route>

          <Route element={<AdminLoginPage />} path="/admin/login" />
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />} path="/admin">
              <Route element={<Navigate replace to="/admin/dashboard" />} index />
              <Route element={<AdminDashboardPage />} path="dashboard" />
              <Route element={<AdminProductsPage />} path="products" />
              <Route element={<AdminProductFormPage />} path="products/new" />
              <Route element={<AdminProductFormPage />} path="products/:id/edit" />
              <Route element={<AdminCategoriesPage />} path="categories" />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
