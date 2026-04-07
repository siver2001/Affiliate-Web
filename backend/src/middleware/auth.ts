import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";

interface JwtPayload {
  email: string;
  role: "admin";
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return response.status(401).json({ message: "Missing authorization token." });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    request.user = { email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return response.status(401).json({ message: "Invalid or expired token." });
  }
}
