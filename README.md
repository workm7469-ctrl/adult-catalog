# แค็ตตาล็อกสินค้า (Adult Catalog)

เว็บแค็ตตาล็อกสินค้าแบบดูอย่างเดียว (browse-only) สำหรับให้ลูกค้าเลือกชมสินค้าก่อนสั่งซื้อผ่านโทร/LINE
สร้างด้วย **Next.js (App Router) + Tailwind CSS + Supabase**

- หน้าบ้าน (`/`) — แบนเนอร์หมุนอัตโนมัติด้านบน + แท็บกรองหมวดหมู่สินค้า + การ์ดสินค้า (รูปปก/ชื่อ/ราคา) กดเข้าไปดูรูปสไลด์+รายละเอียดเต็ม พร้อมปุ่ม **โทรสั่งซื้อ** และ **สั่งซื้อทาง LINE**
- หลังบ้าน (`/admin-manage`) — จัดการแบนเนอร์ จัดการสินค้า (พร้อมเลือกหมวดหมู่) และตั้งค่าเบอร์โทร/ลิงก์ LINE **ไม่มีระบบ login** (เข้าได้ทันทีผ่านลิงก์ตรง)

หมวดหมู่สินค้าที่กำหนดไว้ (แก้ไขได้ที่ `lib/types.ts` และ constraint ในตาราง `products` หากต้องการเปลี่ยนภายหลัง):
อาหารเสริม · เครื่องดื่ม · สเปรย์ · ตุ๊กตายาง · ดิลโด้ · ไข่สั่น · ปลอก · อื่นๆ

> หมายเหตุ: โปรเจกต์นี้ไม่มีวีดีโอโดยตั้งใจ (ตัดสินใจไว้แล้วเพื่อเลี่ยงข้อจำกัดพื้นที่/แบนด์วิดท์ฟรีของ Supabase และความเสี่ยงเรื่องนโยบายแพลตฟอร์มวีดีโอ) ใช้รูปภาพล้วน

## 1) ติดตั้งและรันโปรเจกต์

ต้องมี [Node.js](https://nodejs.org) เวอร์ชัน 18 ขึ้นไป

```bash
npm install
npm run dev
```

เปิด http://localhost:3000 สำหรับหน้าบ้าน และ http://localhost:3000/admin-manage สำหรับหลังบ้าน

## 2) ตั้งค่า Supabase

1. สร้างโปรเจกต์ใหม่ที่ [supabase.com](https://supabase.com) (แนะนำให้แยกโปรเจกต์ Supabase คนละตัวกับ phone-catalog เดิม เพื่อไม่ให้ข้อมูลปนกัน)
2. ไปที่เมนู **SQL Editor** แล้ววางโค้ดทั้งหมดจากไฟล์ [`supabase-schema.sql`](./supabase-schema.sql) แล้วกด **Run**
   - สร้างตาราง `banners`, `products`, `contact_settings`, Storage bucket `banner-images` และ `product-images` (public) พร้อม RLS policy ที่จำเป็น
3. ไปที่ **Settings > API** คัดลอกค่า `Project URL` และ `anon public` key
4. คัดลอกไฟล์ `.env.local.example` เป็น `.env.local` แล้วนำค่าที่ได้มาใส่:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

5. รัน `npm run dev` ใหม่อีกครั้งให้ค่า env ถูกโหลด

## 3) ใช้งานหลังบ้าน (Admin)

- เข้าไปที่ `/admin-manage`
- แท็บ **สินค้า**: ดูรายการทั้งหมด จัดลำดับด้วยปุ่ม "ขึ้น/ลง" แก้ไข หรือลบสินค้า
- แท็บ **เพิ่มสินค้า**: กรอกชื่อ/ราคา/รายละเอียด เลือกรูปปก (จำเป็น) และรูปประกอบเพิ่มเติมได้หลายรูป
- แท็บ **แบนเนอร์**: อัปโหลดรูปแบนเนอร์ใหม่ จัดลำดับการหมุน หรือลบออก
- แท็บ **ช่องทางสั่งซื้อ**: ตั้งค่าเบอร์โทรและลิงก์ LINE ที่จะไปแสดงผลเป็นปุ่มในหน้ารายละเอียดสินค้า

> ⚠️ **ข้อควรระวังเรื่องความปลอดภัย**: หน้า `/admin-manage` ไม่มีการล็อกอิน ความปลอดภัยจึงขึ้นอยู่กับการ **ไม่เผยแพร่ลิงก์นี้ให้คนอื่น** เท่านั้น หากต้องการเพิ่มความปลอดภัยภายหลัง แนะนำให้เพิ่ม Supabase Auth แล้วปรับ RLS policy ในไฟล์ `supabase-schema.sql`

## 4) Deploy ขึ้น Vercel

1. Push โค้ดนี้ขึ้น GitHub repository (แยกจาก repo ของ phone-catalog)
2. ไปที่ [vercel.com](https://vercel.com) → New Project → เลือก repository นี้
3. ใส่ Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. กด Deploy — จะได้ลิงก์เว็บสำหรับหน้าบ้าน (ส่งให้ลูกค้าดูได้เลย) และลิงก์ `/admin-manage` สำหรับตัวเอง

## โครงสร้างโปรเจกต์

```
app/
  page.tsx                 หน้าบ้าน (banner + product grid + modal)
  admin-manage/page.tsx    หลังบ้าน (แบนเนอร์ / สินค้า / ช่องทางสั่งซื้อ)
  layout.tsx, globals.css
components/
  BannerCarousel.tsx        แบนเนอร์หมุนอัตโนมัติ
  CategoryFilter.tsx        แท็บกรองหมวดหมู่สินค้า
  ProductCard.tsx, ProductModal.tsx
  admin/BannerManager.tsx, admin/ProductForm.tsx, admin/ProductList.tsx, admin/ContactSettingsForm.tsx
lib/
  supabaseClient.ts, types.ts, utils.ts
supabase-schema.sql         SQL สำหรับสร้างตาราง + storage bucket + policy
```

## เทคโนโลยีที่ใช้

- **Next.js 14** (App Router) + TypeScript + **Tailwind CSS**
- **Supabase** — Postgres database + Storage
- ฟอนต์: Noto Serif Thai (หัวข้อ/ราคา), IBM Plex Sans Thai (เนื้อหา)
