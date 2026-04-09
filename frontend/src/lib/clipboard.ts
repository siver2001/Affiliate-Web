import { toast } from "sonner";

/**
 * Copies multiple formats (text and image) to the clipboard.
 * Falls back to text only if image copying fails (CORS or browser limit).
 */
export async function copyProductToClipboard(text: string, imageUrl?: string | null) {
  try {
    if (!imageUrl || !window.ClipboardItem) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Try to copy both image and text
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Image fetch failed");
    
    const blob = await response.blob();
    
    // Most browsers only support png in clipboard. 
    // If the image is jpg/webp, we'd need a canvas conversion, 
    // but many modern browsers (Chrome/Safari) now handle multiple formats 
    // or can at least handle the blob if we label it correctly.
    // However, to be safe, we only try to copy if it's png or we just try-catch.
    
    try {
      const data = [
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          [blob.type]: blob
        })
      ];
      await navigator.clipboard.write(data);
      return true;
    } catch (clipError) {
      console.warn("Rich clipboard failed, falling back to text + image URL hint", clipError);
      // Fallback: append image URL to text so platforms like Telegram/Discord can preview it
      const richText = `${text}\n\n[Ảnh sản phẩm]: ${imageUrl}`;
      await navigator.clipboard.writeText(richText);
      return "text-plus-url";
    }
  } catch (error) {
    console.error("Master clipboard failure:", error);
    await navigator.clipboard.writeText(text);
    return "text-only";
  }
}
