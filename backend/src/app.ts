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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/uploads", uploadsRouter);

// Support both /api prefix (local) and root (Vercel serverless)
app.use("/api", apiRouter);
app.use("/", apiRouter);

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});
