import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { authRouter } from "./modules/auth/auth.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";
import { productsRouter } from "./modules/products/products.routes";
import { uploadsRouter } from "./modules/uploads/uploads.routes";

export const app = express();

// Support Same-Origin on Vercel
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Test connection route - CALL THIS TO CHECK IF SERVER IS LIVE
app.get("/api/auth/test-conn", (_req, res) => {
  res.json({ 
    status: "alive", 
    time: new Date().toISOString(),
    env_admin: Boolean(env.ADMIN_EMAIL) 
  });
});

// Request logging
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Routes
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/uploads", uploadsRouter);

app.use("/api", apiRouter);

// Root path handler for Vercel
app.get("/", (_req, res) => {
  res.json({ message: "Affiliate Hub API is running" });
});

app.use((_request, response) => {
  response.status(404).json({ message: "Route not found." });
});

