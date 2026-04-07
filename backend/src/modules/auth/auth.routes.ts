import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { env } from "../../config/env";
import { requireAuth } from "../../middleware/auth";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post("/login", (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json({
      message: "Invalid login payload.",
      issues: parsed.error.flatten()
    });
  }

  const { email, password } = parsed.data;
  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    return response.status(401).json({ message: "Email or password is incorrect." });
  }

  const token = jwt.sign({ email, role: "admin" }, env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return response.json({
    token,
    user: {
      email,
      role: "admin"
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
