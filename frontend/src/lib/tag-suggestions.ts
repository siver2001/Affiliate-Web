const tagMap: Record<string, string[]> = {
  // --- PETS ---
  "mèo": ["cat", "kitty", "feline"],
  "chó": ["dog", "puppy", "canine"],
  "thú cưng": ["pet-friendly", "animal-care"],
  "ăn": ["food", "feeding"],
  "uống": ["water", "drinking"],
  "vệ sinh": ["cleaning", "hygiene"],
  "cát": ["litter"],
  "đồ chơi": ["toy", "playtime"],
  "lông": ["grooming", "fur"],
  "mát": ["cooling"],
  "ấm": ["warm", "cozy"],
  "nhà": ["house", "bed"],
  "chuồng": ["cage", "crate"],

  // --- ELECTRONICS & GADGETS (Thiết bị) ---
  "máy": ["device", "gadget", "electronic"],
  "hút bụi": ["vacuum", "cleaning-tech"],
  "thông minh": ["smart-home", "automatic", "ai-powered"],
  "không dây": ["wireless", "cordless"],
  "bluetooth": ["bluetooth"],
  "pin": ["battery", "rechargeable"],
  "sạc": ["charging", "power-bank"],
  "mini": ["portable", "compact", "mini"],
  "điện thoại": ["mobile", "smartphone", "accessary"],
  "tai nghe": ["audio", "headphones", "earbuds"],
  "loa": ["speaker", "audio"],
  "màn hình": ["display", "monitor"],
  "bàn phím": ["keyboard", "setup"],
  "chuột": ["mouse", "gaming"],

  // --- HOME & LIFESTYLE (Đời sống) ---
  "đời sống": ["lifestyle", "home-living"],
  "trang trí": ["decor", "interior", "aesthetic"],
  "phòng ngủ": ["bedroom", "rest"],
  "phòng khách": ["living-room"],
  "văn phòng": ["office", "workspace", "productivity"],
  "học tập": ["study", "education"],
  "đèn": ["lighting", "lamp", "ambiance"],
  "quạt": ["fan", "cooling", "airflow"],
  "thơm": ["fragrance", "scented", "aroma"],
  "túi": ["bag", "storage"],
  "kệ": ["shelf", "organization"],
  "hộp": ["box", "organizer"],
  "gối": ["pillow", "comfort"],
  "chăn": ["blanket", "bedding"],

  // --- CLOTHING & FASHION (Quần áo) ---
  "áo": ["top", "apparel", "clothing"],
  "quần": ["bottoms", "pants", "trousers"],
  "váy": ["dress", "skirt", "fashion"],
  "giày": ["footwear", "shoes", "sneakers"],
  "dép": ["sandals", "slippers"],
  "túi xách": ["handbag", "fashion-accessory"],
  "vải": ["fabric", "textile"],
  "cotton": ["cotton", "breathable"],
  "thể thao": ["sportswear", "activewear", "gym"],
  "mùa hè": ["summer-vibes", "seasonal"],
  "mùa đông": ["winter", "outdoor"],
  "unisex": ["unisex", "gender-neutral"],

  // --- KITCHEN & DINING ---
  "bếp": ["kitchen", "cooking", "culinary"],
  "nồi": ["pot", "cookware"],
  "chảo": ["pan", "non-stick"],
  "ly": ["glassware", "cup"],
  "chén": ["bowl", "dining"],
  "bình": ["bottle", "container"],
  "nước": ["hydration", "drinkware"]
};

export function suggestEnglishTags(productName: string, categoryType?: string): string[] {
  const suggestedTags = new Set<string>();
  const lowerName = productName.toLowerCase();

  // 1. Contextual tags based on category
  if (categoryType === "pets") suggestedTags.add("pet-care");
  if (categoryType === "gadgets") suggestedTags.add("tech-lifestyle");
  if (lowerName.includes("áo") || lowerName.includes("quần") || lowerName.includes("váy")) {
    suggestedTags.add("fashion");
  }

  // 2. Keyword mapping (Smart Matching)
  for (const [key, tags] of Object.entries(tagMap)) {
    if (lowerName.includes(key)) {
      tags.forEach(t => suggestedTags.add(t));
    }
  }

  // 3. Fallback/General Quality Tags
  if (lowerName.includes("tốt") || lowerName.includes("xịn") || lowerName.includes("cao cấp")) {
    suggestedTags.add("premium");
  }
  if (lowerName.includes("rẻ") || lowerName.includes("tiết kiệm")) {
    suggestedTags.add("budget-friendly");
  }

  return Array.from(suggestedTags).slice(0, 8); // Max 8 high-quality tags
}
