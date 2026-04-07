import type { CategoryRecord, ProductRecord } from "../lib/store";

const now = new Date().toISOString();

export const seedCategories: CategoryRecord[] = [
  {
    id: "cat-pets-root",
    name: "Thú cưng",
    slug: "pets",
    type: "pets",
    description: "Đồ dùng, chăm sóc và phụ kiện cho chó mèo.",
    parentId: null,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-pets-food",
    name: "Ăn uống",
    slug: "pets-food",
    type: "pets",
    description: "Đồ ăn và dụng cụ ăn uống cho thú cưng.",
    parentId: "cat-pets-root",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-pets-clean",
    name: "Vệ sinh",
    slug: "pets-clean",
    type: "pets",
    description: "Các sản phẩm vệ sinh, khử mùi và chăm sóc hàng ngày.",
    parentId: "cat-pets-root",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-gadgets-root",
    name: "Mẹo vặt & thiết bị",
    slug: "gadgets",
    type: "gadgets",
    description: "Thiết bị nhỏ gọn, tiện ích gia đình và công nghệ mini.",
    parentId: null,
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-gadgets-desk",
    name: "Đồ bàn làm việc",
    slug: "desk-setup",
    type: "gadgets",
    description: "Các món giúp góc làm việc gọn và hiệu quả hơn.",
    parentId: "cat-gadgets-root",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "cat-gadgets-home",
    name: "Đồ gia dụng",
    slug: "home-tools",
    type: "gadgets",
    description: "Tiện ích nhỏ giúp nhà cửa ngăn nắp và tiện dụng hơn.",
    parentId: "cat-gadgets-root",
    createdAt: now,
    updatedAt: now
  }
];

export const seedProducts: ProductRecord[] = [
  {
    id: "prd-pets-bowl",
    name: "Bát ăn chống trượt cho chó mèo",
    slug: "bat-an-chong-truot-cho-cho-meo",
    shortDescription: "Bát inox đế cao su, dễ vệ sinh và hạn chế xê dịch khi thú cưng ăn.",
    fullDescription:
      "Bát ăn chống trượt phù hợp cho cả chó và mèo, phần lòng inox sạch sẽ, phần đế cao su hạn chế đổ thức ăn ra sàn. Thiết kế đơn giản, phù hợp dùng hàng ngày.",
    socialDescription:
      "Ai nuôi chó mèo mà hay bị cảnh bát ăn chạy khắp nhà thì thử loại đế cao su này, khá gọn và dễ rửa.",
    suitableFor: "Chó mèo nhỏ và vừa, hộ gia đình cần giải pháp ăn uống gọn gàng.",
    pros: "Dễ rửa, bền, chống trượt tốt.",
    cons: "Không phù hợp với thú cưng ăn rất nhanh nếu cần bát slow feeder.",
    price: 79000,
    thumbnail: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
    shopeeUrl: "https://shopee.vn/",
    lazadaUrl: "https://www.lazada.vn/",
    isFeatured: true,
    isPublished: true,
    sortOrder: 10,
    categoryId: "cat-pets-food",
    images: [
      {
        id: "img-pets-bowl-1",
        imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
        altText: "Bát ăn chống trượt cho chó mèo",
        sortOrder: 0
      }
    ],
    tags: [
      { id: "tag-pet", name: "pet", slug: "pet" },
      { id: "tag-easy-clean", name: "easy-clean", slug: "easy-clean" }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prd-pets-litter",
    name: "Xẻng vệ sinh cát mèo lọc nhanh",
    slug: "xeng-ve-sinh-cat-meo-loc-nhanh",
    shortDescription: "Lỗ lọc đều, cầm chắc tay, phù hợp dọn khay cát mỗi ngày.",
    fullDescription:
      "Xẻng nhựa dày, phần lưới lọc vừa phải để giữ cát sạch và giảm thất thoát. Kiểu dáng nhẹ, dễ dùng, phù hợp với người mới nuôi mèo.",
    socialDescription:
      "Món nhỏ nhưng dùng hàng ngày rất đáng tiền, dọn cát nhanh hơn hẳn loại xẻng mềm.",
    suitableFor: "Người nuôi mèo trong căn hộ và cần dụng cụ vệ sinh gọn.",
    pros: "Nhẹ, dễ thao tác, lọc nhanh.",
    cons: "Không hợp với hạt cát quá to.",
    price: 49000,
    thumbnail: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
    shopeeUrl: "https://shopee.vn/",
    lazadaUrl: "https://www.lazada.vn/",
    isFeatured: false,
    isPublished: true,
    sortOrder: 8,
    categoryId: "cat-pets-clean",
    images: [
      {
        id: "img-pets-litter-1",
        imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80",
        altText: "Xẻng vệ sinh cát mèo",
        sortOrder: 0
      }
    ],
    tags: [{ id: "tag-cat", name: "cat", slug: "cat" }],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prd-gadgets-lamp",
    name: "Đèn màn hình chống chói cho bàn làm việc",
    slug: "den-man-hinh-chong-choi-cho-ban-lam-viec",
    shortDescription: "Chiếu sáng gọn gàng phía trên màn hình, đỡ chiếm diện tích bàn.",
    fullDescription:
      "Đèn màn hình là giải pháp phù hợp cho góc làm việc nhỏ, giúp ánh sáng tập trung lên bàn phím và mặt bàn mà không hắt thẳng vào mắt. Có thể chỉnh nhiệt màu và độ sáng.",
    socialDescription:
      "Nếu bàn làm việc chật mà vẫn cần đủ sáng thì kiểu đèn treo màn hình này khá hợp lý.",
    suitableFor: "Người làm việc nhiều giờ trên laptop hoặc màn hình rời.",
    pros: "Tiết kiệm không gian, ánh sáng dịu, setup gọn.",
    cons: "Cần màn hình đủ dày để kẹp chắc.",
    price: 399000,
    thumbnail: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    shopeeUrl: "https://shopee.vn/",
    lazadaUrl: "https://www.lazada.vn/",
    isFeatured: true,
    isPublished: true,
    sortOrder: 9,
    categoryId: "cat-gadgets-desk",
    images: [
      {
        id: "img-gadgets-lamp-1",
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
        altText: "Đèn màn hình cho bàn làm việc",
        sortOrder: 0
      }
    ],
    tags: [
      { id: "tag-workspace", name: "workspace", slug: "workspace" },
      { id: "tag-led", name: "led", slug: "led" }
    ],
    createdAt: now,
    updatedAt: now
  },
  {
    id: "prd-gadgets-vacuum",
    name: "Máy hút bụi mini cầm tay",
    slug: "may-hut-bui-mini-cam-tay",
    shortDescription: "Gọn nhẹ, hút bụi bàn phím, ô tô và các góc nhỏ trong nhà.",
    fullDescription:
      "Máy hút bụi mini phù hợp cho các bề mặt nhỏ như bàn làm việc, khe ghế và ngăn kéo. Kiểu dáng nhỏ giúp dễ cất, phù hợp nhu cầu dọn nhanh hằng ngày.",
    socialDescription:
      "Nhà ai hay có bụi li ti ở bàn làm việc hoặc trong xe thì máy hút mini khá tiện, lôi ra là dùng được ngay.",
    suitableFor: "Gia đình cần dọn nhanh các khu vực nhỏ.",
    pros: "Nhẹ, tiện, dễ cất.",
    cons: "Không thay thế được máy hút bụi công suất lớn.",
    price: 259000,
    thumbnail: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    shopeeUrl: "https://shopee.vn/",
    lazadaUrl: "https://www.lazada.vn/",
    isFeatured: false,
    isPublished: true,
    sortOrder: 7,
    categoryId: "cat-gadgets-home",
    images: [
      {
        id: "img-gadgets-vacuum-1",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
        altText: "Máy hút bụi mini cầm tay",
        sortOrder: 0
      }
    ],
    tags: [
      { id: "tag-cleaning", name: "cleaning", slug: "cleaning" },
      { id: "tag-home", name: "home", slug: "home" }
    ],
    createdAt: now,
    updatedAt: now
  }
];
