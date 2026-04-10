/**
 * Smart English Tag Suggestion Engine
 * Matches Vietnamese product names/descriptions to curated English tags.
 * Priority: longer phrases over shorter keywords to avoid false matches.
 */

interface TagRule {
  /** Vietnamese keywords/phrases to match (order matters: longer phrase = higher priority) */
  keywords: string[];
  /** English tags to apply when matched */
  tags: string[];
}

// Rules sorted longest-phrase-first to prevent partial false matches
// e.g. "túi xách" should match before "túi"
const rules: TagRule[] = [
  // ─── PETS - CATS ────────────────────────────────────────────────
  { keywords: ["đồ chơi mèo", "chơi mèo", "đùa cho mèo"], tags: ["cat-toy", "cat-enrichment", "pet-play"] },
  { keywords: ["thức ăn mèo", "hạt mèo", "súp mèo", "pate mèo", "snack mèo", "bánh thưởng mèo"], tags: ["cat-food", "cat-treats", "pet-nutrition"] },
  { keywords: ["khay vệ sinh mèo", "cát vệ sinh", "khay cát"], tags: ["litter-box", "cat-hygiene", "odor-control"] },
  { keywords: ["áo mèo", "quần áo mèo", "trang phục mèo"], tags: ["cat-clothing", "pet-fashion"] },
  { keywords: ["nhà mèo", "lều mèo", "cũi mèo", "giường mèo"], tags: ["cat-bed", "cat-house", "pet-furniture"] },
  { keywords: ["bát mèo", "chén mèo", "máng ăn mèo"], tags: ["cat-bowl", "pet-feeder"] },
  { keywords: ["vòng cổ mèo", "dây dắt mèo"], tags: ["cat-collar", "cat-leash", "pet-accessory"] },
  { keywords: ["cào móng mèo", "trụ cào", "bàn cào"], tags: ["cat-scratcher", "scratching-post"] },
  { keywords: ["mèo"], tags: ["cat", "feline", "pet-care"] },

  // ─── PETS - DOGS ────────────────────────────────────────────────
  { keywords: ["thức ăn chó", "hạt chó", "pate chó", "snack chó", "bánh thưởng chó"], tags: ["dog-food", "dog-treats", "pet-nutrition"] },
  { keywords: ["đồ chơi chó", "bóng chó"], tags: ["dog-toy", "dog-play", "pet-play"] },
  { keywords: ["áo chó", "quần áo chó", "trang phục chó"], tags: ["dog-clothing", "pet-fashion"] },
  { keywords: ["nhà chó", "cũi chó", "giường chó"], tags: ["dog-bed", "dog-crate", "pet-furniture"] },
  { keywords: ["vòng cổ chó", "dây xích chó", "dây dắt chó"], tags: ["dog-collar", "dog-leash", "pet-accessory"] },
  { keywords: ["bát chó", "chén chó", "máng ăn chó"], tags: ["dog-bowl", "pet-feeder"] },
  { keywords: ["chó", "cún"], tags: ["dog", "canine", "pet-care"] },

  // ─── PETS - GENERAL ─────────────────────────────────────────────
  { keywords: ["thú cưng", "vật nuôi"], tags: ["pet", "animal-care"] },
  { keywords: ["lông thú", "cắt lông", "tắm thú"], tags: ["pet-grooming", "fur-care"] },
  { keywords: ["máy sấy lông", "sấy lông thú"], tags: ["pet-dryer", "grooming-tool"] },
  { keywords: ["cá cảnh", "hồ cá", "bể cá"], tags: ["fish", "aquarium", "aquatic"] },
  { keywords: ["chim", "lồng chim"], tags: ["bird", "bird-cage", "avian"] },
  { keywords: ["thỏ"], tags: ["rabbit", "small-pet"] },
  { keywords: ["hamster", "chuột hamster"], tags: ["hamster", "small-pet"] },

  // ─── FASHION - CLOTHING ───────────────────────────────────────────
  { keywords: ["áo hoodie", "áo khoác hoodie"], tags: ["hoodie", "sweatshirt", "streetwear", "outerwear"] },
  { keywords: ["áo khoác"], tags: ["jacket", "outerwear", "layering"] },
  { keywords: ["áo sơ mi"], tags: ["shirt", "formal-wear", "top"] },
  { keywords: ["áo thun", "áo phông"], tags: ["t-shirt", "casual-wear", "streetwear"] },
  { keywords: ["áo len"], tags: ["sweater", "knitwear", "winter-fashion"] },
  { keywords: ["quần jean", "quần bò"], tags: ["jeans", "denim", "casual-wear"] },
  { keywords: ["quần short", "quần đùi"], tags: ["shorts", "casual-wear", "summer-fashion"] },
  { keywords: ["quần thể thao"], tags: ["sweatpants", "activewear", "sportswear"] },
  { keywords: ["váy ngắn", "chân váy"], tags: ["skirt", "mini-skirt", "feminine-fashion"] },
  { keywords: ["đầm", "váy đầm"], tags: ["dress", "feminine-fashion", "ootd"] },
  { keywords: ["đồ bộ", "bộ đồ"], tags: ["matching-set", "loungewear"] },
  { keywords: ["đồ ngủ", "bộ ngủ"], tags: ["pajamas", "sleepwear", "loungewear"] },
  { keywords: ["đồ lót", "nội y"], tags: ["underwear", "lingerie"] },
  { keywords: ["bra", "áo ngực"], tags: ["bra", "women-fashion", "comfort"] },
  { keywords: ["giày thể thao", "giày sneaker"], tags: ["sneakers", "athletic-shoes", "streetwear"] },
  { keywords: ["giày cao gót", "giày gót cao"], tags: ["heels", "formal-shoes", "women-shoes"] },
  { keywords: ["boots", "giày boots", "bốt"], tags: ["boots", "footwear", "fashion"] },
  { keywords: ["dép lào", "dép xỏ ngón", "sandal"], tags: ["sandals", "open-toe", "summer-fashion"] },
  { keywords: ["dép", "dép nhà"], tags: ["slippers", "indoor-footwear"] },
  { keywords: ["giày"], tags: ["shoes", "footwear"] },
  { keywords: ["túi xách", "túi tote", "túi clutch"], tags: ["handbag", "tote-bag", "fashion-accessory"] },
  { keywords: ["ba lô", "balo"], tags: ["backpack", "bag", "everyday-carry"] },
  { keywords: ["ví", "ví da", "ví tiền"], tags: ["wallet", "leather-goods", "accessory"] },
  { keywords: ["thắt lưng", "dây lưng"], tags: ["belt", "accessory", "fashion"] },
  { keywords: ["mũ", "nón"], tags: ["hat", "cap", "headwear"] },
  { keywords: ["kính mắt", "kính râm"], tags: ["sunglasses", "eyewear", "accessory"] },
  { keywords: ["đồng hồ"], tags: ["watch", "timepiece", "accessory"] },
  { keywords: ["trang sức", "nhẫn", "vòng tay", "dây chuyền", "bông tai"], tags: ["jewelry", "accessory", "fashion"] },
  { keywords: ["áo", "vải", "quần áo"], tags: ["clothing", "apparel", "fashion"] },
  { keywords: ["thể thao"], tags: ["sportswear", "activewear", "fitness"] },
  { keywords: ["cotton"], tags: ["cotton", "breathable", "natural-fiber"] },
  { keywords: ["lụa", "silk"], tags: ["silk", "luxury-fabric"] },
  { keywords: ["mùa đông", "đông"], tags: ["winter-fashion", "cold-weather"] },
  { keywords: ["mùa hè", "hè"], tags: ["summer-fashion", "warm-weather"] },
  { keywords: ["unisex"], tags: ["unisex", "gender-neutral"] },

  // ─── TECHNOLOGY & GADGETS ────────────────────────────────────────
  { keywords: ["máy hút bụi", "hút bụi"], tags: ["vacuum-cleaner", "home-cleaning", "smart-home"] },
  { keywords: ["máy lọc không khí", "lọc không khí", "lọc khí"], tags: ["air-purifier", "air-quality", "home-health"] },
  { keywords: ["máy lọc nước", "lọc nước"], tags: ["water-purifier", "home-health", "drinking-water"] },
  { keywords: ["máy massage", "massage cổ", "massage lưng", "massage tay", "massage chân"], tags: ["massage-device", "relaxation", "wellness"] },
  { keywords: ["máy sấy tóc", "sấy tóc"], tags: ["hair-dryer", "hair-care", "beauty-tool"] },
  { keywords: ["máy cạo râu", "cạo râu", "dao cạo"], tags: ["shaver", "grooming", "men-care"] },
  { keywords: ["tai nghe không dây", "airpods", "earbuds"], tags: ["wireless-earbuds", "audio", "bluetooth"] },
  { keywords: ["tai nghe"], tags: ["headphones", "audio", "music"] },
  { keywords: ["loa bluetooth", "loa di động"], tags: ["bluetooth-speaker", "portable-audio", "wireless"] },
  { keywords: ["loa"], tags: ["speaker", "audio"] },
  { keywords: ["bàn phím cơ", "bàn phím gaming"], tags: ["mechanical-keyboard", "gaming", "setup"] },
  { keywords: ["bàn phím"], tags: ["keyboard", "peripheral", "setup"] },
  { keywords: ["chuột gaming", "chuột máy tính"], tags: ["computer-mouse", "peripheral", "gaming"] },
  { keywords: ["đèn led", "đèn rgb", "đèn thông minh"], tags: ["led-light", "smart-lighting", "rgb", "aesthetic"] },
  { keywords: ["camera an ninh", "camera giám sát", "webcam"], tags: ["camera", "security", "surveillance"] },
  { keywords: ["sạc không dây", "sạc nhanh"], tags: ["wireless-charging", "fast-charge", "power-delivery"] },
  { keywords: ["pin dự phòng", "sạc dự phòng", "powerbank"], tags: ["power-bank", "portable-charger", "on-the-go"] },
  { keywords: ["cáp sạc", "dây sạc"], tags: ["charging-cable", "accessory"] },
  { keywords: ["điện thoại", "smartphone"], tags: ["smartphone", "mobile", "tech"] },
  { keywords: ["tablet", "ipad", "máy tính bảng"], tags: ["tablet", "mobile-device", "tech"] },
  { keywords: ["smartwatch", "đồng hồ thông minh"], tags: ["smartwatch", "wearable", "fitness-tracker"] },
  { keywords: ["laptop", "máy tính xách tay"], tags: ["laptop", "computer", "workspace"] },
  { keywords: ["máy in", "printer"], tags: ["printer", "office-equipment"] },
  { keywords: ["robot lau nhà", "robot hút bụi"], tags: ["robot-vacuum", "smart-home", "auto-cleaning"] },
  { keywords: ["không dây", "wireless"], tags: ["wireless", "cordless"] },
  { keywords: ["bluetooth"], tags: ["bluetooth", "wireless-tech"] },
  { keywords: ["thông minh", "smart"], tags: ["smart", "intelligent", "automation"] },
  { keywords: ["mini", "nhỏ gọn"], tags: ["portable", "compact", "travel-friendly"] },

  // ─── HOME & LIVING ───────────────────────────────────────────────
  { keywords: ["đèn ngủ", "đèn bàn", "đèn đọc sách"], tags: ["desk-lamp", "reading-light", "ambient-lighting"] },
  { keywords: ["đèn trang trí", "đèn fairy", "đèn dây"], tags: ["fairy-lights", "decorative-lighting", "aesthetic"] },
  { keywords: ["đèn"], tags: ["lighting", "lamp", "home-decor"] },
  { keywords: ["quạt thông gió", "quạt trần", "quạt đứng", "quạt bàn"], tags: ["fan", "cooling", "airflow", "home-appliance"] },
  { keywords: ["máy lạnh", "điều hòa"], tags: ["air-conditioner", "cooling", "home-appliance"] },
  { keywords: ["chăn điện", "đệm điện", "chân sưởi"], tags: ["electric-blanket", "heating", "winter-comfort"] },
  { keywords: ["gối", "gối ngủ", "gối ôm"], tags: ["pillow", "bedding", "comfort", "sleep"] },
  { keywords: ["chăn", "mền", "chăn bông"], tags: ["blanket", "bedding", "cozy", "comfort"] },
  { keywords: ["ga giường", "bộ ga", "vỏ gối"], tags: ["bed-sheets", "bedding-set", "home-textile"] },
  { keywords: ["kệ sách", "giá sách", "tủ sách"], tags: ["bookshelf", "storage", "organization"] },
  { keywords: ["kệ"], tags: ["shelf", "rack", "organization"] },
  { keywords: ["hộp đựng", "hộp lưu trữ"], tags: ["storage-box", "organizer", "declutter"] },
  { keywords: ["hộp"], tags: ["box", "container", "storage"] },
  { keywords: ["tủ quần áo", "tủ đựng đồ"], tags: ["wardrobe", "closet-organization", "storage"] },
  { keywords: ["gương"], tags: ["mirror", "home-decor", "furniture"] },
  { keywords: ["tranh treo", "tranh trang trí", "poster"], tags: ["wall-art", "home-decor", "aesthetic"] },
  { keywords: ["cây cảnh", "chậu cây", "đất trồng", "phân bón"], tags: ["indoor-plant", "gardening", "green-living"] },
  { keywords: ["nến thơm", "tinh dầu", "xịt thơm phòng", "khuếch tán"], tags: ["scented-candle", "aroma", "fragrance", "home-ambiance"] },
  { keywords: ["trang trí", "decor"], tags: ["home-decor", "interior", "aesthetic"] },
  { keywords: ["văn phòng", "bàn làm việc", "góc học tập"], tags: ["workspace", "office", "productivity"] },
  { keywords: ["học tập", "học sinh", "sinh viên"], tags: ["study", "education", "student"] },

  // ─── KITCHEN & DINING ────────────────────────────────────────────
  { keywords: ["nồi chiên không dầu", "air fryer"], tags: ["air-fryer", "healthy-cooking", "kitchen-gadget"] },
  { keywords: ["nồi cơm điện", "nồi cơm"], tags: ["rice-cooker", "kitchen-appliance"] },
  { keywords: ["máy pha cà phê", "bình pha cà phê", "cà phê"], tags: ["coffee-maker", "coffee", "kitchen-gadget"] },
  { keywords: ["máy xay sinh tố", "máy xay", "blender"], tags: ["blender", "kitchen-appliance", "healthy-living"] },
  { keywords: ["lò vi sóng", "lò nướng"], tags: ["microwave", "oven", "kitchen-appliance"] },
  { keywords: ["nồi lẩu điện", "lẩu"], tags: ["electric-pot", "hotpot", "dining"] },
  { keywords: ["bộ nồi", "nồi inox", "nồi chống dính"], tags: ["cookware-set", "non-stick", "cooking"] },
  { keywords: ["chảo chống dính", "chảo inox"], tags: ["non-stick-pan", "frying-pan", "cooking"] },
  { keywords: ["dao làm bếp", "dao bếp", "bộ dao"], tags: ["kitchen-knife", "knife-set", "cooking-tool"] },
  { keywords: ["thìa", "muỗng", "thìa gỗ"], tags: ["utensil", "cooking-tool", "kitchen"] },
  { keywords: ["thớt"], tags: ["cutting-board", "kitchen", "prep-tool"] },
  { keywords: ["bộ bát đũa", "chén dĩa", "bộ ăn"], tags: ["dining-set", "tableware", "kitchenware"] },
  { keywords: ["bình nước", "bình giữ nhiệt", "tumbler"], tags: ["water-bottle", "tumbler", "hydration", "eco-friendly"] },
  { keywords: ["ca", "cốc", "ly"], tags: ["cup", "mug", "drinkware"] },
  { keywords: ["hộp cơm", "hộp đựng thức ăn", "hộp bento"], tags: ["lunch-box", "meal-prep", "food-storage"] },
  { keywords: ["bọc thực phẩm", "túi zip", "hộp bảo quản"], tags: ["food-storage", "meal-prep", "kitchen"] },
  { keywords: ["bếp từ", "bếp điện"], tags: ["induction-cooker", "electric-stove", "kitchen-appliance"] },
  { keywords: ["tạp dề", "yếm bếp"], tags: ["apron", "cooking", "kitchen"] },
  { keywords: ["bếp", "nấu ăn", "nấu bếp"], tags: ["cooking", "kitchen", "culinary"] },

  // ─── BEAUTY & PERSONAL CARE ─────────────────────────────────────
  { keywords: ["kem dưỡng da", "kem dưỡng ẩm", "serum", "toner", "lotion"], tags: ["skincare", "moisturizer", "beauty", "skin-health"] },
  { keywords: ["kem chống nắng", "chống nắng spf"], tags: ["sunscreen", "spf", "sun-protection", "skincare"] },
  { keywords: ["mặt nạ da", "mặt nạ giấy", "sheet mask"], tags: ["face-mask", "skincare", "beauty-routine"] },
  { keywords: ["son môi", "son kem", "son bóng"], tags: ["lipstick", "lip-gloss", "makeup", "cosmetics"] },
  { keywords: ["phấn trang điểm", "kem nền", "phấn phủ"], tags: ["foundation", "makeup", "cosmetics"] },
  { keywords: ["mascara", "kẻ mắt", "phấn mắt"], tags: ["eye-makeup", "mascara", "cosmetics"] },
  { keywords: ["nước hoa", "perfume"], tags: ["perfume", "fragrance", "luxury-scent"] },
  { keywords: ["dầu gội", "dầu xả", "kem ủ tóc"], tags: ["shampoo", "hair-care", "conditioner"] },
  { keywords: ["sữa tắm", "xà phòng tắm"], tags: ["body-wash", "shower-gel", "personal-care"] },
  { keywords: ["kem đánh răng", "bàn chải", "tăm nước"], tags: ["dental-care", "oral-hygiene", "personal-care"] },
  { keywords: ["lăn khử mùi", "xịt khử mùi"], tags: ["deodorant", "personal-care", "hygiene"] },
  { keywords: ["bông tẩy trang", "miếng tẩy trang"], tags: ["cotton-pad", "makeup-remover", "skincare"] },
  { keywords: ["máy rửa mặt", "máy sóng âm rửa mặt"], tags: ["face-cleansing-device", "skincare", "beauty-tech"] },
  { keywords: ["uốn tóc", "máy uốn tóc", "máy làm tóc"], tags: ["hair-curler", "hair-styling", "beauty-tool"] },
  { keywords: ["cắt tóc", "tỉa tóc"], tags: ["hair-scissors", "hair-grooming"] },
  { keywords: ["thực phẩm chức năng", "vitamin", "supplement"], tags: ["supplement", "wellness", "health", "nutrition"] },
  { keywords: ["dụng cụ tập gym", "tập thể dục", "tập gym", "tạ", "bộ tạ"], tags: ["fitness-equipment", "gym", "workout", "exercise"] },
  { keywords: ["yoga", "thảm yoga", "dây yoga"], tags: ["yoga", "mindfulness", "fitness"] },

  // ─── QUALITY SIGNALS ─────────────────────────────────────────────
  { keywords: ["cao cấp", "hàng hiệu", "xa xỉ", "luxury", "premium"], tags: ["premium", "luxury"] },
  { keywords: ["chính hãng", "authentic", "chính thức"], tags: ["authentic", "branded"] },
  { keywords: ["giá rẻ", "siêu rẻ", "tiết kiệm", "tiết kiệm chi phí"], tags: ["budget-friendly", "affordable"] },
  { keywords: ["sale", "khuyến mãi", "giảm giá", "flash sale"], tags: ["on-sale", "deal"] },
  { keywords: ["combo", "bộ", "bộ sản phẩm"], tags: ["bundle", "set", "value-pack"] },
  { keywords: ["chống nước", "chống thấm", "waterproof"], tags: ["waterproof", "durable"] },
  { keywords: ["thông minh", "tự động", "automatic"], tags: ["smart", "automatic"] },
];

/**
 * Removes Vietnamese diacritics (tonal marks) for fuzzy matching.
 */
function removeDiacritics(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function suggestEnglishTags(productName: string, categoryType?: string): string[] {
  const suggestedTags = new Set<string>();
  const name = productName.toLowerCase().trim();
  const nameNorm = removeDiacritics(name); // diacritic-free version for fallback

  // 1. Base category context tag
  const categoryTagMap: Record<string, string[]> = {
    pets: ["pet-care", "animal-friendly"],
    gadgets: ["tech", "lifestyle-gadget"],
    fashion: ["fashion", "style"],
    home: ["home-living", "lifestyle"],
  };
  if (categoryType && categoryTagMap[categoryType]) {
    categoryTagMap[categoryType].forEach(t => suggestedTags.add(t));
  }

  // 2. Rule-based matching (phrase-first, most specific wins)
  for (const rule of rules) {
    for (const kw of rule.keywords) {
      const kwNorm = removeDiacritics(kw.toLowerCase());
      if (name.includes(kw) || nameNorm.includes(kwNorm)) {
        rule.tags.forEach(t => suggestedTags.add(t));
        break; // Only apply first matching keyword per rule
      }
    }
  }

  // 3. Shopee pattern: many products start with [Combo X gói] – detect combo
  if (/\[combo|combo\s*\d+|bộ\s*\d+|gói\s*\d+|\d+\s*in\s*1/i.test(name)) {
    suggestedTags.add("bundle");
    suggestedTags.add("value-pack");
  }

  // 4. Detect quantities/counts in name → likely bulk/multi-pack
  if (/\d+\s*(hộp|gói|cái|chiếc|đôi|bộ|lọ|chai|túi)/i.test(name)) {
    suggestedTags.add("multipack");
  }

  return Array.from(suggestedTags).slice(0, 8);
}
