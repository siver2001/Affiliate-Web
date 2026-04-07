import path from "node:path";

import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { productsRouter } from "./modules/products/products.routes";
import { uploadsRouter } from "./modules/uploads/uploads.routes";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    mode: "local-fallback-ready"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/uploads", uploadsRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});
