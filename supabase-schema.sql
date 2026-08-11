-- ==========================================================
-- Adult Catalog — Supabase schema
-- วางสคริปต์นี้ทั้งหมดใน Supabase Dashboard > SQL Editor แล้วกด Run
-- ==========================================================

create extension if not exists pgcrypto;

-- ถ้าเคยรันสคริปต์นี้เวอร์ชันก่อนหน้า (ตอนที่ตาราง products ยังไม่มีคอลัมน์ category)
-- ไปแล้ว ให้รันคำสั่งนี้เพิ่มเพื่ออัปเดตตารางเดิมแทนการสร้างใหม่:
--
-- alter table products add column if not exists category text not null default 'อื่นๆ';
-- alter table products add constraint products_category_check check (category in (
--   'อาหารเสริม','เครื่องดื่ม','สเปรย์','ตุ๊กตายาง','ดิลโด้','ไข่สั่น','ปลอก','อื่นๆ'
-- ));

-- ----------------------------------------------------------
-- ตาราง contact_settings (มีแถวเดียวเสมอ — เบอร์โทร + ลิงก์ LINE)
-- ----------------------------------------------------------
create table if not exists contact_settings (
  id int primary key default 1,
  phone_number text,
  line_url text,
  updated_at timestamptz not null default now(),
  constraint contact_settings_single_row check (id = 1)
);

insert into contact_settings (id)
values (1)
on conflict (id) do nothing;

-- ข้อความสั้นๆ แสดงเหนือหมวดหมู่สินค้าที่หน้าร้าน (ไม่บังคับ)
alter table contact_settings add column if not exists tagline text;

-- ธีมสีปุ่มกดของหน้าร้าน เลือกได้จากพรีเซ็ตที่กำหนดไว้ (ดู THEME_PRESETS ใน lib/types.ts)
alter table contact_settings add column if not exists theme text not null default 'rose';
alter table contact_settings drop constraint if exists contact_settings_theme_check;
alter table contact_settings add constraint contact_settings_theme_check check (theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีข้อความของหน้าร้าน แยกอิสระทีละจุด (ชื่อสินค้า / ราคาสินค้า / ข้อความสั้นๆ เหนือหมวดหมู่) จากธีมสีปุ่มกด
alter table contact_settings drop column if exists text_theme;

alter table contact_settings add column if not exists name_theme text not null default 'white';
alter table contact_settings drop constraint if exists contact_settings_name_theme_check;
alter table contact_settings add constraint contact_settings_name_theme_check check (name_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

alter table contact_settings add column if not exists price_theme text not null default 'gold';
alter table contact_settings drop constraint if exists contact_settings_price_theme_check;
alter table contact_settings add constraint contact_settings_price_theme_check check (price_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

alter table contact_settings add column if not exists tagline_theme text not null default 'pastel-gray';
alter table contact_settings drop constraint if exists contact_settings_tagline_theme_check;
alter table contact_settings add constraint contact_settings_tagline_theme_check check (tagline_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีรายละเอียดสินค้า (คำอธิบายสินค้าในหน้าป๊อปอัป) แยกอิสระจากจุดอื่น
alter table contact_settings add column if not exists description_theme text not null default 'pastel-gray';
alter table contact_settings drop constraint if exists contact_settings_description_theme_check;
alter table contact_settings add constraint contact_settings_description_theme_check check (description_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีพื้นหลังหน้าร้าน (main ของหน้าร้าน) แยกอิสระจากจุดอื่น
alter table contact_settings add column if not exists bg_theme text not null default 'black';
alter table contact_settings drop constraint if exists contact_settings_bg_theme_check;
alter table contact_settings add constraint contact_settings_bg_theme_check check (bg_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีตัวหนังสือปุ่มหมวดหมู่ตอนถูกเลือก แยกอิสระจากธีมสีปุ่มกด (ซึ่งคุมแค่พื้นหลัง/ขอบ)
alter table contact_settings add column if not exists pill_text_theme text not null default 'black';
alter table contact_settings drop constraint if exists contact_settings_pill_text_theme_check;
alter table contact_settings add constraint contact_settings_pill_text_theme_check check (pill_text_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีตัวหนังสือป้ายส่วนลด แยกอิสระจากธีมสีปุ่มกด (ซึ่งคุมแค่พื้นหลังของป้าย)
alter table contact_settings add column if not exists badge_text_theme text not null default 'black';
alter table contact_settings drop constraint if exists contact_settings_badge_text_theme_check;
alter table contact_settings add constraint contact_settings_badge_text_theme_check check (badge_text_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ธีมสีพื้นหลัง/ตัวหนังสือปุ่ม "โทรสั่งซื้อ" แยกอิสระจากจุดอื่น (เดิม fixed เป็นสีทอง ไม่อยู่ในระบบธีมเลย)
alter table contact_settings add column if not exists call_bg_theme text not null default 'gold';
alter table contact_settings drop constraint if exists contact_settings_call_bg_theme_check;
alter table contact_settings add constraint contact_settings_call_bg_theme_check check (call_bg_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

alter table contact_settings add column if not exists call_text_theme text not null default 'black';
alter table contact_settings drop constraint if exists contact_settings_call_text_theme_check;
alter table contact_settings add constraint contact_settings_call_text_theme_check check (call_text_theme in (
  'rose','blue','indigo','violet','purple','pink','red','orange','amber','green','emerald',
  'cyan','sky','slate','pastel-blue','pastel-pink','pastel-mint','pastel-lavender','pastel-gray','black','white','gold'
));

-- ----------------------------------------------------------
-- ตาราง banners (แบนเนอร์หมุนอัตโนมัติบนสุดของหน้าบ้าน)
-- ----------------------------------------------------------
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists banners_position_idx on banners (position);

-- ----------------------------------------------------------
-- ตาราง products
-- ----------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'อื่นๆ' check (category in (
    'อาหารเสริม','เครื่องดื่ม','สเปรย์','ตุ๊กตายาง','ดิลโด้','ไข่สั่น','ปลอก','อื่นๆ'
  )),
  description text,
  price numeric not null default 0,
  original_price numeric,
  cover_image_url text not null,
  gallery_images text[] not null default '{}',
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ราคาปกติ (ราคาก่อนลด) ใช้โชว์ป้ายขีดฆ่า + เปอร์เซ็นต์ส่วนลดที่หน้าบ้าน — เว้นว่างได้ ถ้าไม่ต้องการโชว์ส่วนลด
alter table products add column if not exists original_price numeric;

create index if not exists products_category_idx on products (category);
create index if not exists products_position_idx on products (position);
create index if not exists products_created_at_idx on products (created_at desc);

-- ----------------------------------------------------------
-- Storage buckets (public read เพื่อให้ลูกค้าดูรูปได้โดยไม่ต้อง login)
-- ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('banner-images', 'banner-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- ==========================================================
-- Row Level Security
--
-- เช่นเดียวกับโปรเจกต์ phone-catalog: ระบบนี้ "ไม่มีระบบ Login"
-- เพื่อความรวดเร็วในการใช้งานหน้าแอดมินผ่านมือถือ นโยบายด้านล่าง
-- จึงเปิดให้ทุกคนที่ถือ anon key อ่าน/เขียน/ลบข้อมูลได้
--
-- ความปลอดภัยจึงอยู่ที่การ "ไม่เผยแพร่ลิงก์ /admin-manage" เท่านั้น
-- เหมาะกับร้านเล็กที่เจ้าของร้านคนเดียว/ครอบครัวเป็นคนดูแล
-- ==========================================================

alter table contact_settings enable row level security;
alter table banners enable row level security;
alter table products enable row level security;

drop policy if exists "public read contact_settings" on contact_settings;
create policy "public read contact_settings" on contact_settings
  for select using (true);

drop policy if exists "public write contact_settings" on contact_settings;
create policy "public write contact_settings" on contact_settings
  for update using (true) with check (true);

drop policy if exists "public read banners" on banners;
create policy "public read banners" on banners
  for select using (true);

drop policy if exists "public insert banners" on banners;
create policy "public insert banners" on banners
  for insert with check (true);

drop policy if exists "public update banners" on banners;
create policy "public update banners" on banners
  for update using (true) with check (true);

drop policy if exists "public delete banners" on banners;
create policy "public delete banners" on banners
  for delete using (true);

drop policy if exists "public read products" on products;
create policy "public read products" on products
  for select using (true);

drop policy if exists "public insert products" on products;
create policy "public insert products" on products
  for insert with check (true);

drop policy if exists "public update products" on products;
create policy "public update products" on products
  for update using (true) with check (true);

drop policy if exists "public delete products" on products;
create policy "public delete products" on products
  for delete using (true);

-- Storage object policies
drop policy if exists "public read banner-images" on storage.objects;
create policy "public read banner-images" on storage.objects
  for select using (bucket_id = 'banner-images');

drop policy if exists "public write banner-images" on storage.objects;
create policy "public write banner-images" on storage.objects
  for insert with check (bucket_id = 'banner-images');

drop policy if exists "public update banner-images" on storage.objects;
create policy "public update banner-images" on storage.objects
  for update using (bucket_id = 'banner-images');

drop policy if exists "public delete banner-images" on storage.objects;
create policy "public delete banner-images" on storage.objects
  for delete using (bucket_id = 'banner-images');

drop policy if exists "public read product-images" on storage.objects;
create policy "public read product-images" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "public write product-images" on storage.objects;
create policy "public write product-images" on storage.objects
  for insert with check (bucket_id = 'product-images');

drop policy if exists "public update product-images" on storage.objects;
create policy "public update product-images" on storage.objects
  for update using (bucket_id = 'product-images');

drop policy if exists "public delete product-images" on storage.objects;
create policy "public delete product-images" on storage.objects
  for delete using (bucket_id = 'product-images');
