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
  const adminEmail = (env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPass = env.ADMIN_PASSWORD || "";

  console.log(`[auth] Attempting login for: ${email}`);
  console.log(`[auth] Env admin configured: ${Boolean(adminEmail && adminPass)}`);

  // Prefer env-based admin auth so login does not block on database connectivity.
  if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
    console.log("[auth] Env-based admin match – returning token");
    return response.json(buildAuthResponse(email, "admin"));
  }

  console.log("[auth] Env admin did not match – trying database lookup");

  let user = null;

  try {
    const prisma = getPrismaClient();

    // Race the DB query against a timeout to prevent infinite hangs on serverless cold starts
    const timeoutMs = 8000;
    const dbPromise = prisma.user.findUnique({ where: { email } });
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("Database query timed out")), timeoutMs)
    );

    user = await Promise.race([dbPromise, timeoutPromise]);
    console.log(`[auth] DB lookup result: ${user ? "found" : "not found"}`);
  } catch (error) {
    console.error("[auth] Failed to query user during login.", error);
    return response.status(503).json({
      message: "Dich vu dang tam thoi loi. Thu dang nhap lai sau it phut."
    });
  }

  if (!user) {
    return response.status(401).json({
      message: "Tai khoan khong ton tai hoac khong khop voi tai khoan admin da cau hinh."
    });
  }

  const isValidPassword = await bcrypt.compare(password, (user as any).passwordHash);
  if (!isValidPassword) {
    return response.status(401).json({ message: "Mat khau khong chinh xac." });
  }

  console.log("[auth] DB user password match – returning token");
  return response.json(buildAuthResponse((user as any).email, (user as any).role));
});

router.post("/logout", (_request, response) => {
  return response.status(204).send();
});

router.get("/me", requireAuth, (request, response) => {
  return response.json({ user: request.user });
});

export const authRouter = router;
