# affiliate-product-hub – README / Implementation Spec

## 1. Tổng quan dự án

Đây là hệ thống website quản lý và hiển thị sản phẩm affiliate theo 2 nhóm nội dung chính:

1. **Thú cưng**
2. **Mẹo vặt / Review thiết bị**

Mục tiêu của dự án là tạo một website vừa có thể:
- hiển thị sản phẩm đẹp, rõ ràng, dễ xem trên điện thoại
- cho người dùng bấm vào link Shopee / Lazada
- cho quản trị viên tự sửa nội dung trực tiếp trên web
- lưu mô tả sản phẩm để dùng lại khi comment / đăng bài trên mạng xã hội
- dễ mở rộng sau này

Dự án này ưu tiên:
- giao diện đẹp
- dễ dùng
- dễ chỉnh sửa
- dễ nâng cấp
- code rõ ràng để AI hoặc developer khác có thể tiếp tục phát triển

---


## 1.1. Tên dự án chính thức

Tên dự án chính thức được chốt cho toàn bộ hệ thống là:

- **Project name:** `affiliate-product-hub`

Quy ước sử dụng:
- dùng `affiliate-product-hub` cho tên repo GitHub
- dùng `affiliate-product-hub-frontend` cho frontend repo hoặc package nếu tách riêng
- dùng `affiliate-product-hub-backend` cho backend repo hoặc package nếu tách riêng
- dùng tên này nhất quán trong tài liệu, môi trường deploy, CI/CD, và prompt cho AI/dev

---

## 2. Kiến trúc công nghệ chính thức

Kiến trúc được chốt cho dự án này là:

- **Frontend:** React.js + Vite + TypeScript
- **Styling/UI:** Tailwind CSS + shadcn/ui + lucide-react
- **Backend API:** Node.js + Express.js + TypeScript
- **ORM:** Prisma
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Deploy Frontend:** Vercel
- **Deploy Backend:** Vercel hoặc Render/Railway
- **Auth admin:** JWT-based auth hoặc session auth
- **Form + Validation:** react-hook-form + zod
- **Data fetching:** TanStack Query + axios

Tài liệu này sẽ chỉ bám theo kiến trúc trên. AI hoặc developer không nên đổi stack trừ khi có yêu cầu mới.

---

## 3. Vì sao chọn kiến trúc này

### 3.1. Vì sao dùng Vercel
- deploy frontend React rất nhanh
- hợp với Vite
- preview deployment tiện
- dễ nối domain
- dễ quản lý environment variables

### 3.2. Vì sao dùng Supabase
- dùng được **PostgreSQL cloud**
- có free tier để bắt đầu
- có thể dùng luôn **Storage** cho ảnh
- dễ lấy connection string để dùng với Prisma
- phù hợp MVP và dễ scale dần

### 3.3. Vì sao dùng Prisma
- schema rõ ràng
- dễ migrate database
- hợp với PostgreSQL
- dễ cho AI đọc và tiếp tục code
- giúp code backend sạch hơn

### 3.4. Vì sao dùng React + Tailwind + shadcn/ui
- giao diện hiện đại
- component dễ tái sử dụng
- mobile-friendly
- AI có thể generate UI khá tốt với stack này
- rất phù hợp dự án cần dashboard/admin

### 3.5. Vì sao vẫn dùng Node.js + Express
- dễ chủ động backend
- dễ tách business logic
- dễ làm admin API, upload API, auth API
- rõ ràng hơn nếu sau này muốn mở rộng tracking click, analytics, import/export

---

## 4. Mục tiêu nghiệp vụ

Website phải đáp ứng các nhu cầu sau:

### 4.1. Với người xem
- xem sản phẩm theo nhóm
- tìm kiếm sản phẩm
- xem mô tả ngắn
- xem chi tiết sản phẩm
- bấm link Shopee / Lazada
- xem các sản phẩm liên quan
- xem theo danh mục rõ ràng

### 4.2. Với quản trị viên
- đăng nhập admin
- thêm / sửa / xóa sản phẩm
- thay ảnh
- thay link affiliate
- sửa mô tả trực tiếp trên web
- phân loại sản phẩm theo danh mục
- có thêm ô mô tả dành riêng cho comment mạng xã hội
- copy nhanh mô tả để đăng bài / comment

---

## 5. Phạm vi nội dung

Website có 2 mảng chính:

### 5.1. Mảng Thú cưng
Danh mục gợi ý:
- ăn uống
- vệ sinh
- đồ chơi
- chăm sóc sức khỏe
- phụ kiện
- chó
- mèo

### 5.2. Mảng Mẹo vặt / Review thiết bị
Danh mục gợi ý:
- đồ gia dụng
- thiết bị nhà bếp
- phụ kiện điện thoại
- đồ bàn làm việc
- đồ công nghệ mini
- đồ tiện ích sinh hoạt
- thiết bị vệ sinh / dọn dẹp

---

## 6. Cấu trúc hệ thống

Hệ thống gồm 3 phần chính:

### 6.1. Frontend public
Chạy bằng **React + Vite** và deploy trên **Vercel**.

Phần này dùng cho:
- trang chủ
- danh mục sản phẩm
- chi tiết sản phẩm
- tìm kiếm
- điều hướng người dùng

### 6.2. Admin frontend
Có thể nằm chung project React hoặc là phần route riêng trong cùng app.

Phần này dùng cho:
- đăng nhập admin
- dashboard
- quản lý sản phẩm
- quản lý danh mục
- chỉnh mô tả trực tiếp
- upload ảnh
- copy mô tả social

### 6.3. Backend API
Xây bằng **Node.js + Express + TypeScript**.

Phần này dùng cho:
- auth
- CRUD sản phẩm
- CRUD danh mục
- upload ảnh
- query dữ liệu
- kết nối Prisma với Supabase PostgreSQL

---

## 7. Cách deploy đúng với kiến trúc này

## 7.1. Frontend
- deploy lên **Vercel**
- frontend gọi API qua domain backend
- cấu hình biến môi trường cho frontend nếu cần

## 7.2. Backend
Có 2 hướng:

### Hướng A – Deploy backend riêng
- deploy Express API lên **Render** hoặc **Railway**
- frontend trên Vercel gọi sang backend domain riêng

Đây là hướng ổn định hơn cho Express truyền thống.

### Hướng B – Chạy API trên Vercel
- cần chuyển Express hoặc route handler theo cách phù hợp với Vercel serverless/functions
- dùng được, nhưng cần cẩn thận với cấu trúc backend

**Khuyến nghị:** với dự án này, nên:
- **Frontend:** Vercel
- **Backend:** Render hoặc Railway
- **Database:** Supabase
- **Storage:** Supabase Storage

Vẫn đúng kiến trúc Vercel + Supabase + Prisma + React + Node/Express, nhưng dễ vận hành hơn.

---

## 8. Công nghệ chi tiết

### 8.1. Frontend
- React.js
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
- react-router-dom
- react-hook-form
- zod
- @hookform/resolvers
- @tanstack/react-query
- axios
- framer-motion
- sonner
- clsx
- date-fns

### 8.2. Backend
- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL (Supabase)
- jsonwebtoken
- bcrypt
- cors
- dotenv
- multer

### 8.3. Database và storage
- Supabase PostgreSQL
- Supabase Storage

---

## 9. Biến môi trường cần có

## 9.1. Frontend `.env`
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 9.2. Backend `.env`
```env
PORT=4000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_STORAGE_BUCKET=product-images
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### Ghi chú
- `DATABASE_URL` dùng cho Prisma
- `DIRECT_URL` nên dùng nếu cần migrate ổn định hơn với Supabase
- `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng ở backend, không đưa ra frontend
- `SUPABASE_ANON_KEY` có thể dùng cho frontend nếu cần public access
- nếu backend upload ảnh thông qua server thì chỉ cần service role key ở backend

---

## 10. Cấu trúc trang

### 10.1. Public pages
- `/` – Trang chủ
- `/pets` – Trang sản phẩm thú cưng
- `/gadgets` – Trang mẹo vặt / review thiết bị
- `/category/:slug` – Danh mục con
- `/product/:slug` – Chi tiết sản phẩm
- `/search` – Kết quả tìm kiếm
- `/hot-deals` – Deal nổi bật
- `/about` – Giới thiệu

### 10.2. Admin pages
- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/:id/edit`
- `/admin/categories`
- `/admin/media`
- `/admin/settings`

---

## 11. Cấu trúc giao diện chính

### 11.1. Trang chủ
Trang chủ cần có:
- hero section giới thiệu ngắn
- 2 lối vào lớn:
  - Thú cưng
  - Mẹo vặt & thiết bị
- sản phẩm nổi bật
- deal hot
- sản phẩm mới cập nhật
- search box
- footer

### 11.2. Trang danh mục
- tiêu đề danh mục
- mô tả ngắn
- bộ lọc
- danh sách sản phẩm dạng grid
- phân trang hoặc load more

### 11.3. Card sản phẩm
Mỗi sản phẩm hiển thị dạng box / card gồm:
- ảnh
- tên sản phẩm
- mô tả ngắn
- tag
- giá tham khảo
- nút xem chi tiết
- nút mua Shopee
- nút mua Lazada

### 11.4. Trang chi tiết sản phẩm
Phải có:
- gallery ảnh
- tên sản phẩm
- giá tham khảo
- mô tả
- phù hợp với ai
- ưu điểm
- lưu ý
- link Shopee
- link Lazada
- sản phẩm liên quan

---

## 12. Box mô tả sản phẩm

Mỗi sản phẩm cần có nhiều lớp nội dung khác nhau.

### 12.1. `shortDescription`
Dùng để hiển thị nhanh trên card sản phẩm hoặc danh sách.

Yêu cầu:
- ngắn gọn
- rõ ràng
- dễ đọc
- không quá quảng cáo

### 12.2. `fullDescription`
Dùng cho trang chi tiết sản phẩm.

Có thể bao gồm:
- công dụng
- ưu điểm
- nhược điểm / lưu ý
- phù hợp với ai
- trường hợp sử dụng

### 12.3. `socialDescription`
Dùng để copy mang đi comment hoặc đăng bài trên mạng xã hội.

Yêu cầu:
- tự nhiên
- ngắn
- không quá spam
- đủ để dẫn người xem về website hoặc link

---

## 13. Chức năng quản trị nội dung trực tiếp trên web

Đây là yêu cầu rất quan trọng.

Admin phải có thể tự chỉnh sửa toàn bộ nội dung ngay trên web, không cần sửa code.

### 13.1. Trường dữ liệu mỗi sản phẩm
- tên sản phẩm
- slug
- danh mục chính
- danh mục phụ
- ảnh đại diện
- gallery ảnh
- mô tả ngắn
- mô tả chi tiết
- mô tả comment / social
- giá tham khảo
- link Shopee
- link Lazada
- tag
- trạng thái nổi bật
- trạng thái hiển thị / ẩn
- thứ tự ưu tiên
- ngày cập nhật

### 13.2. Hành động admin
- thêm sản phẩm mới
- chỉnh sửa sản phẩm
- xóa sản phẩm
- lưu nháp
- publish
- copy mô tả web
- copy mô tả comment
- preview ngoài web
- bật / tắt hiển thị

---

## 14. Tính năng chính cần làm

### 14.1. Public features
- xem danh sách sản phẩm
- xem chi tiết sản phẩm
- tìm kiếm
- lọc theo danh mục
- responsive mobile
- click outbound link

### 14.2. Admin features
- login/logout
- CRUD sản phẩm
- CRUD danh mục
- upload ảnh
- copy nhanh mô tả
- phân loại tag
- đánh dấu sản phẩm nổi bật

### 14.3. Tính năng nâng cao về sau
- thống kê click vào link Shopee/Lazada
- sắp xếp sản phẩm theo hiệu quả
- import/export CSV
- lịch sử chỉnh sửa
- role admin/editor
- SEO metadata
- tracking UTM
- blog review

---

## 15. Database schema gợi ý

### 15.1. Bảng categories
```prisma
model Category {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  type        String?
  description String?
  parentId    String?
  parent      Category?   @relation("CategoryToCategory", fields: [parentId], references: [id])
  children    Category[]  @relation("CategoryToCategory")
  products    Product[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### 15.2. Bảng products
```prisma
model Product {
  id               String         @id @default(cuid())
  name             String
  slug             String         @unique
  shortDescription String
  fullDescription  String?
  socialDescription String?
  suitableFor      String?
  pros             String?
  cons             String?
  price            Decimal?
  thumbnail        String?
  shopeeUrl        String?
  lazadaUrl        String?
  isFeatured       Boolean        @default(false)
  isPublished      Boolean        @default(true)
  sortOrder        Int            @default(0)
  categoryId       String
  category         Category       @relation(fields: [categoryId], references: [id])
  images           ProductImage[]
  productTags      ProductTag[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}
```

### 15.3. Bảng product_images
```prisma
model ProductImage {
  id        String   @id @default(cuid())
  productId String
  imageUrl  String
  altText   String?
  sortOrder Int      @default(0)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}
```

### 15.4. Bảng tags
```prisma
model Tag {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  productTags ProductTag[]
}
```

### 15.5. Bảng product_tags
```prisma
model ProductTag {
  productId String
  tagId     String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([productId, tagId])
}
```

### 15.6. Bảng users
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   @default("admin")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 16. Prisma config với Supabase

Prisma schema cần cấu hình datasource như sau:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Lưu ý
- `DATABASE_URL` dùng cho Prisma Client runtime
- `DIRECT_URL` dùng cho migrate nếu cần kết nối trực tiếp ổn định hơn
- Supabase sẽ cung cấp connection string PostgreSQL

---

## 17. Supabase Storage

Tạo bucket tên ví dụ:
- `product-images`

Ảnh sản phẩm có thể upload theo 2 cách:

### Cách 1 – Upload qua backend
- frontend gửi file lên backend Express
- backend dùng `SUPABASE_SERVICE_ROLE_KEY` upload file vào Supabase Storage
- backend trả về public URL hoặc signed URL

### Cách 2 – Upload trực tiếp từ frontend
- frontend upload trực tiếp bằng Supabase client
- cần cấu hình policy cẩn thận

**Khuyến nghị:** ban đầu nên dùng **upload qua backend** để kiểm soát tốt hơn.

---

## 18. API cần có

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Products
- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Upload
- `POST /api/uploads/image`

---

## 19. Kiến trúc thư mục đề xuất

### 19.1. Frontend
```bash
src/
  components/
    ui/
    layout/
    product/
    category/
    common/
  pages/
    public/
    admin/
  hooks/
  lib/
  services/
  types/
  routes/
  styles/
```

### 19.2. Backend
```bash
src/
  modules/
    auth/
    users/
    products/
    categories/
    tags/
    uploads/
  middleware/
  utils/
  config/
  lib/
  prisma/
  app.ts
  server.ts
```

---

## 20. Luồng hoạt động từng bước

### 20.1. Luồng người dùng
1. mở website
2. chọn 1 trong 2 mảng chính
3. xem danh mục
4. xem card sản phẩm
5. bấm vào trang chi tiết
6. đọc mô tả
7. bấm link Shopee hoặc Lazada

### 20.2. Luồng admin
1. đăng nhập admin
2. vào dashboard
3. thêm hoặc chọn sản phẩm cần sửa
4. cập nhật mô tả / ảnh / link
5. lưu thay đổi
6. preview ngoài web
7. publish

### 20.3. Luồng dùng lại mô tả để comment
1. admin mở sản phẩm
2. copy ô `socialDescription`
3. mang đi comment hoặc đăng bài trên social
4. có thể dẫn người xem về website hoặc link trực tiếp

---

## 21. UI/UX yêu cầu

Website phải:
- dễ đọc trên mobile
- card sản phẩm rõ ràng
- khoảng trắng tốt
- icon đẹp
- nút CTA dễ bấm
- giao diện sạch
- không rối
- dễ chỉnh màu / font / spacing

### Gợi ý phong cách
- tối giản
- hiện đại
- bo góc mềm
- shadow nhẹ
- card rõ
- màu trung tính, điểm nhấn bằng màu thương hiệu

---

## 22. Thư viện UI đề xuất cụ thể

- tailwindcss
- shadcn/ui
- lucide-react
- framer-motion
- react-hook-form
- zod
- @hookform/resolvers
- @tanstack/react-query
- axios
- sonner
- embla-carousel-react
- date-fns

---


## 23. GitHub workflow

Dự án phải được quản lý mã nguồn bằng GitHub.

### 23.1. Tên repository đề xuất
Nếu dùng 1 repo:
- `affiliate-product-hub`

Nếu tách 2 repo:
- `affiliate-product-hub-frontend`
- `affiliate-product-hub-backend`

### 23.2. Cấu trúc repository khuyến nghị
Khuyến nghị 2 hướng:

#### Hướng A – Monorepo
Một repo duy nhất:
```bash
affiliate-product-hub/
  frontend/
  backend/
  README.md
```

Ưu điểm:
- quản lý dễ hơn khi dự án còn nhỏ
- AI/dev dễ đọc tổng thể
- đồng bộ version dễ hơn
- chỉ cần 1 repo để bàn giao

#### Hướng B – Tách 2 repo
- frontend repo riêng
- backend repo riêng

Ưu điểm:
- tách biệt frontend/backend rõ ràng
- deploy độc lập dễ hơn

**Khuyến nghị hiện tại:** dùng **monorepo** với tên `affiliate-product-hub`.

### 23.3. Branch strategy
Nên dùng các branch sau:
- `main`: branch production
- `develop`: branch tích hợp tính năng
- `feature/<feature-name>`: branch làm từng tính năng
- `fix/<bug-name>`: branch sửa lỗi
- `chore/<task-name>`: branch cho việc kỹ thuật/chỉnh cấu hình

Ví dụ:
- `feature/admin-product-form`
- `feature/supabase-storage-upload`
- `fix/login-validation`

### 23.4. Commit convention
Nên dùng commit message rõ ràng theo chuẩn:

```bash
feat: add product management page
fix: correct product slug validation
chore: setup prisma migrations
docs: update README deployment guide
refactor: reorganize product service layer
style: improve admin form spacing
```

Các prefix nên dùng:
- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `style`
- `test`

### 23.5. Pull request workflow
Luồng làm việc đề xuất:
1. tạo branch mới từ `develop`
2. code xong thì push branch lên GitHub
3. mở Pull Request vào `develop`
4. review code
5. test xong thì merge
6. khi stable thì merge `develop` vào `main`

### 23.6. GitHub + Vercel workflow
Frontend deploy flow:
1. code frontend được push lên GitHub
2. kết nối repo GitHub với Vercel
3. Vercel tự build và deploy mỗi lần push
4. branch `main` dùng cho production
5. Pull Request có thể tạo preview deployment

### 23.7. GitHub + Backend deploy workflow
Backend deploy flow:
1. code backend được push lên GitHub
2. Render hoặc Railway kết nối với repo GitHub
3. mỗi lần merge branch production thì backend tự deploy lại
4. biến môi trường được quản lý ở Render/Railway

### 23.8. File cần có trong repo
Repo nên có các file cơ bản:
- `README.md`
- `.gitignore`
- `.env.example`
- `package.json`
- `tsconfig.json`
- tài liệu setup môi trường
- tài liệu deploy

### 23.9. `.env.example`
Phải có file `.env.example` để AI/dev khác biết cần những biến môi trường nào.
Không commit file `.env` thật lên GitHub.

### 23.10. GitHub Actions (tùy chọn)
Có thể thêm GitHub Actions sau:
- lint check
- type check
- build check
- test check

Ví dụ các workflow:
- chạy `npm run lint`
- chạy `npm run build`
- chạy `npm run test`

### 23.11. Yêu cầu bắt buộc với AI/dev
Nếu AI hoặc developer bắt đầu code dự án này thì phải:
- tạo repo GitHub tên `affiliate-product-hub`
- commit code theo từng phần rõ ràng
- không push secret hoặc `.env` thật
- dùng Pull Request nếu làm theo team workflow
- giữ README luôn đồng bộ với codebase

---

## 24. Roadmap triển khai

### Phase 1 – MVP
Mục tiêu:
- có website public
- có admin
- có CRUD sản phẩm
- có 2 nhóm sản phẩm chính
- có card đẹp
- có product detail
- có thể sửa mô tả trực tiếp

Cần làm:
1. setup Supabase project
2. lấy PostgreSQL connection string
3. setup backend Node.js + Express + Prisma
4. setup frontend React + Vite + Tailwind + shadcn
5. tạo database schema
6. làm login admin
7. làm CRUD products
8. làm upload ảnh qua Supabase Storage
9. làm public pages
10. deploy frontend lên Vercel
11. deploy backend lên Render hoặc Railway

### Phase 2 – Tối ưu vận hành
- copy nhanh socialDescription
- filter nâng cao
- featured products
- sort order
- category management
- tag management

### Phase 3 – Mở rộng
- tracking click
- analytics
- import CSV
- SEO
- blog review
- email collection

---

## 25. Ưu tiên khi AI bắt đầu code

AI hoặc developer phải làm theo đúng thứ tự này:

### Bước 1
Khởi tạo:
- frontend React + Vite + TS
- backend Express + TS
- Supabase project

### Bước 2
Cấu hình Supabase:
- tạo Postgres project
- lấy `DATABASE_URL`
- lấy `DIRECT_URL`
- tạo storage bucket `product-images`

### Bước 3
Thiết kế database:
- categories
- products
- product_images
- tags
- users

### Bước 4
Cấu hình Prisma + migrate

### Bước 5
Xây API CRUD cho products và categories

### Bước 6
Xây frontend public:
- home
- pets page
- gadgets page
- product detail

### Bước 7
Xây admin:
- login
- dashboard
- product form
- category form
- upload image
- copy socialDescription

### Bước 8
Deploy và test

---

## 26. Quy tắc code

- dùng TypeScript toàn bộ
- chia component rõ ràng
- tách business logic khỏi UI
- dùng schema validation
- dùng reusable components
- không hard-code dữ liệu sản phẩm trong component
- mọi dữ liệu sản phẩm phải đọc từ API / database
- form phải có validation
- ảnh phải có alt text
- route admin cần bảo vệ

---

## 27. Tiêu chuẩn hoàn thành

Một bản đầu tiên được xem là hoàn thành khi:
- có trang chủ đẹp, responsive
- có 2 nhóm chính: thú cưng và mẹo vặt / thiết bị
- có admin login
- có thể thêm / sửa / xóa sản phẩm
- có thể sửa mô tả trực tiếp trên web
- có trường socialDescription
- có upload ảnh lên Supabase Storage
- có nút mua Shopee / Lazada
- có thể deploy online

---

## 28. Lệnh khởi tạo gợi ý

### Frontend
```bash
npm create vite@latest affiliate-hub-frontend -- --template react-ts
cd affiliate-hub-frontend
npm install
npm install react-router-dom axios @tanstack/react-query react-hook-form zod @hookform/resolvers framer-motion lucide-react sonner clsx date-fns embla-carousel-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Backend
```bash
mkdir affiliate-hub-backend
cd affiliate-hub-backend
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt multer prisma @prisma/client @supabase/supabase-js
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken @types/bcrypt @types/multer
npx prisma init
```

### shadcn/ui
```bash
npx shadcn@latest init
```

---

## 29. Kết luận

Đây là một dự án affiliate hub có định hướng:
- gọn
- thực dụng
- đẹp
- dễ dùng
- dễ cập nhật
- dễ mở rộng

Kiến trúc được chốt là:
- **Frontend:** React.js + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express.js + TypeScript
- **ORM:** Prisma
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Frontend Deploy:** Vercel
- **Backend Deploy:** Render/Railway hoặc Vercel nếu phù hợp

Mọi phần trong hệ thống phải được thiết kế để người quản trị:
- tự thay đổi mô tả
- tự thay đổi link
- tự thay đổi ảnh
- tự dùng lại nội dung để comment / giới thiệu trên social

---

## 30. Ghi chú cuối cùng cho AI

Nếu AI đọc file này để bắt đầu code thì phải hiểu:
1. đây là website affiliate hub có admin chỉnh sửa nội dung trực tiếp
2. có 2 mảng nội dung chính: thú cưng và mẹo vặt / review thiết bị
3. mỗi sản phẩm có nhiều lớp mô tả, trong đó `socialDescription` là rất quan trọng
4. giao diện phải đẹp, mobile-first, dễ dùng
5. backend dùng Express + Prisma + Supabase Postgres
6. frontend deploy trên Vercel
7. ảnh sản phẩm ưu tiên lưu trên Supabase Storage
