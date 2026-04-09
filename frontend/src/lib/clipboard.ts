/**
 * Copies text and, when supported, also tries to include the product image.
 * Falls back to text only if image copying fails.
 */
export async function copyProductToClipboard(text: string, imageUrl?: string | null) {
  try {
    if (!imageUrl || !window.ClipboardItem) {
      await navigator.clipboard.writeText(text);
      return "text-only";
    }

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Image fetch failed");

    const blob = await response.blob();

    try {
      const data = [
        new ClipboardItem({
          "text/plain": new Blob([text], { type: "text/plain" }),
          [blob.type]: blob
        })
      ];

      await navigator.clipboard.write(data);
      return "text-and-image";
    } catch (clipError) {
      console.warn("Rich clipboard failed, falling back to text only", clipError);
      await navigator.clipboard.writeText(text);
      return "text-only";
    }
  } catch (error) {
    console.error("Master clipboard failure:", error);
    await navigator.clipboard.writeText(text);
    return "text-only";
  }
}
