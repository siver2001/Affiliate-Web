import { promises as fs } from "node:fs";
import path from "node:path";

import { Router } from "express";
import multer from "multer";

import { env } from "../../config/env";
import { getSupabaseAdmin } from "../../lib/supabase";
import { requireAuth } from "../../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", requireAuth, upload.single("file"), async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "Image file is required." });
  }

  const safeName = request.file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const storagePath = `products/${fileName}`;
    const uploadResult = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, request.file.buffer, {
        contentType: request.file.mimetype,
        upsert: true
      });

    if (uploadResult.error) {
      return response.status(500).json({
        message: "Supabase upload failed.",
        details: uploadResult.error.message
      });
    }

    const publicUrl = supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .getPublicUrl(storagePath).data.publicUrl;

    return response.status(201).json({
      item: {
        url: publicUrl,
        storage: "supabase"
      }
    });
  }

  const uploadDir = path.resolve(process.cwd(), "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const targetPath = path.join(uploadDir, fileName);
  await fs.writeFile(targetPath, request.file.buffer);

  return response.status(201).json({
    item: {
      url: `/uploads/${fileName}`,
      storage: "local"
    }
  });
});

export const uploadsRouter = router;
