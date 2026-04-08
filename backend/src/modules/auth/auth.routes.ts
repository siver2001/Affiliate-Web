import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../../config/env";
import { getPrismaClient } from "../../lib/prisma";
import { requireAuth } from "../../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

function buildAuthResponse(email: string, role: string) {
  const token = jwt.sign({ email, role }, env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return {
    token,
    user: {
      email,
      role
    }
  };
}

router.post("/login", async (request, response) => {
  console.log("[auth] POST /login - start");

  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    console.log("[auth] Invalid login payload");
    return response.status(400).json({
      message: "Invalid login payload.",
      issues: parsed.error.flatten()
    });
  }

  const { email: rawEmail, password } = parsed.data;
  const email = rawEmail.toLowerCase().trim();
  
  // Explicitly trim and lowercase from env to be safe
  const adminEmail = (env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPass = (env.ADMIN_PASSWORD || "").trim();

  console.log(`[auth] Attempting login: [${email}] vs admin: [${adminEmail}]`);
  
  // 1. Check Env-based Admin FIRST (Very strict)
  // If either is empty, it means .env didn't load correctly
  if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
    console.log("[auth] SUCCESS: Admin credentials match from .env");
    return response.json(buildAuthResponse(email, "admin"));
  }

  console.log("[auth] FAILED: Admin env match failed. env.ADMIN_EMAIL exists? " + Boolean(adminEmail));


  let user = null;
  try {
    const prisma = getPrismaClient();
    
    // Set a short timeout for DB direct query to avoid long hangs
    user = await prisma.user.findUnique({ 
      where: { email },
    }).catch(err => {
      console.error("[auth] Prisma inner error:", err.message);
      throw err; // Re-throw to be caught by outer try-catch
    });
    
    console.log(`[auth] DB lookup result: ${user ? "User found" : "User NOT found"}`);
  } catch (error: any) {
    console.error("[auth] DATABASE CRITICAL ERROR:", error.message);
    
    // If DB is dead but user might be trying to log in with admin env, 
    // tell them their admin credentials didn't match even if DB is down.
    return response.status(503).json({
      message: "Kết nối Database thất bại. Nếu bạn là Admin, hãy kiểm tra lại Email/Password trong file .env hoặc Vercel Settings.",
      error: error.message
    });
  }

  if (!user) {
    return response.status(401).json({
      message: "Tài khoản không tồn tại. Lưu ý: Email/Password bạn vừa nhập không khớp với tài khoản Admin mặc định."
    });
  }

  const isValidPassword = await bcrypt.compare(password, (user as any).passwordHash);
  if (!isValidPassword) {
    return response.status(401).json({ message: "Mật khẩu không chính xác." });
  }

  console.log("[auth] DB user password match – SUCCESS");
  return response.json(buildAuthResponse((user as any).email, (user as any).role));
});

router.post("/logout", (_request, response) => {
  return response.status(204).send();
});

router.get("/me", requireAuth, (request, response) => {
  return response.json({ user: request.user });
});

export const authRouter = router;
