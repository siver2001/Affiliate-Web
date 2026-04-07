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

router.post("/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid login payload.",
      issues: parsed.error.flatten()
    });
  }

  const { email, password } = parsed.data;
  const prisma = getPrismaClient();
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user && env.ADMIN_EMAIL && env.ADMIN_PASSWORD) {
    if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
      const passwordHash = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          role: "admin"
        }
      });
    }
  }

  if (!user) {
    return response.status(401).json({ message: "Email or password is incorrect." });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    return response.status(401).json({ message: "Email or password is incorrect." });
  }

  const token = jwt.sign({ email: user.email, role: user.role }, env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return response.json({
    token,
    user: {
      email: user.email,
      role: user.role
    }
  });
});

router.post("/logout", (_request, response) => {
  return response.status(204).send();
});

router.get("/me", requireAuth, (request, response) => {
  return response.json({ user: request.user });
});

export const authRouter = router;
