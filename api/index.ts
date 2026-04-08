import { app } from "../backend/src/app";

// Vercel serverless function entry point
console.log("[serverless] Init api/index.ts");

// Middleware to log incoming requests to Vercel logs
app.use((req, _res, next) => {
  console.log(`[Vercel Request] ${req.method} ${req.url}`);
  next();
});

export default app;
