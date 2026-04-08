import path from "node:path";

import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { productsRouter } from "./modules/products/products.routes";
import { uploadsRouter } from "./modules/uploads/uploads.routes";

export const app = express();

// On Vercel, frontend & backend share the same origin, so we need flexible CORS.
const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:4000"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (same-origin, server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any Vercel preview/production URL
      if (origin.endsWith(".vercel.app") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // permissive for now – tighten later
    },
    credentials: true
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging – helps debug Vercel serverless issues
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
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
