/**
 * Compresses an image file to be under a certain size (default 4MB)
 * by reducing quality if necessary.
 */
export async function compressImage(file: File, maxSizeMB: number = 4): Promise<File> {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size <= maxSizeBytes) {
    return file;
  }

  // Load image into a bitmap
  const bitmap = await createImageBitmap(file);
  
  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  
  // Draw to canvas
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0);
  
  // Start compression quality at 0.8
  let quality = 0.8;
  let compressedBlob: Blob | null = null;
  
  // Iteratively reduce quality if still too large (max 3 tries)
  for (let i = 0; i < 3; i++) {
    compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
    
    if (!compressedBlob || compressedBlob.size <= maxSizeBytes) break;
    quality -= 0.2;
  }
  
  if (!compressedBlob) return file;

  // Preserve original name but change extension if we converted to jpeg
  const originalName = file.name.substring(0, file.name.lastIndexOf("."));
  const newName = `${originalName}.jpg`;
  
  return new File([compressedBlob], newName, {
    type: "image/jpeg",
    lastModified: Date.now()
  });
}
