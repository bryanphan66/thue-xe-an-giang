# SPEC.md — Web App Giới Thiệu Dịch Vụ Cho Thuê Xe Vùng Quê

> Tài liệu kỹ thuật (spec) để đưa vào Claude Code. Đọc trước khi viết code.
> Nguyên tắc xuyên suốt: **đơn giản tối đa cho người dùng không rành công nghệ (nông dân).**

---

## 1. Tổng quan & mục tiêu

Web app một trang chủ + vài trang phụ, giới thiệu dịch vụ cho thuê xe ở vùng quê
(mới có đường cao tốc nên bà con phát sinh nhu cầu đi xa: khám bệnh, đám cưới,
rước dâu, ra sân bay...). Mục tiêu: bà con **xem được xe, biết giá, và bấm gọi/Zalo
để thuê ngay**.

Mục tiêu phụ: làm nền tảng để sau này **nhiều chủ xe khác cùng tham gia** (multi-vendor),
dù hiện tại chỉ có 1 chiếc xe của chủ chính.

### Quyết định đã chốt
- **Cách đặt xe:** CHỈ gọi điện / nhắn Zalo. Không có form đặt online, không có lịch đặt, không có đăng nhập cho khách.
- **Quản lý dữ liệu:** dùng **Supabase**. Chủ tự thêm/sửa xe và đối tác qua bảng dữ liệu Supabase (Table Editor), KHÔNG cần sửa code, KHÔNG cần xây trang admin riêng ở giai đoạn này.
- **Loại dịch vụ:** hỗ trợ **cả tự lái và có tài xế (chủ xe lái)**.

---

## 2. Đối tượng người dùng

| Nhóm | Mô tả | Hành động chính |
|------|-------|-----------------|
| Khách thuê | Bà con nông thôn, chủ yếu dùng điện thoại, không rành công nghệ | Xem xe, xem giá → bấm GỌI hoặc ZALO |
| Chủ xe khác (đối tác) | Hộ dân khác có xe muốn cho thuê | Bấm gọi/Zalo hoặc gửi form ngắn để xin tham gia |
| Chủ chính (bạn / quản trị) | Người vận hành | Nhận cuộc gọi; quản lý dữ liệu trong Supabase |

---

## 3. Phạm vi (Scope)

### Trong phạm vi (làm ngay)
- Trang chủ giới thiệu dịch vụ, xe, giá, nút gọi/Zalo nổi bật.
- Danh sách xe lấy từ Supabase (giai đoạn đầu hiển thị 1 xe).
- Trang chi tiết từng xe (ảnh, giá tự lái / có tài xế, mô tả).
- Khu vực "Loại dịch vụ" (khám bệnh, đám cưới, rước dâu, sân bay, đi xa...).
- Khu vực đánh giá / lời nhận xét của khách (tăng độ tin cậy).
- Trang/khu vực "Bạn có xe muốn cho thuê?" cho đối tác (gọi/Zalo + form ngắn tùy chọn).
- Nút gọi (`tel:`), Zalo (`https://zalo.me/<số>`), chỉ đường Google Maps.
- Mobile-first, chữ to, ít chữ, ảnh thật.
- **Khung i18n có sẵn, mặc định và ưu tiên tiếng Việt** (dễ thêm ngôn ngữ khác sau).

### Ngoài phạm vi (KHÔNG làm giai đoạn này)
- Đặt xe online, chọn ngày giờ, thanh toán online.
- Đăng nhập / tài khoản khách.
- Trang admin tự xây (dùng Supabase Table Editor thay thế).
- App di động native.
- Dịch sẵn nhiều ngôn ngữ (chỉ làm khung i18n + tiếng Việt; ngôn ngữ khác thêm sau khi cần).

---

## 4. Tính năng chi tiết

### 4.1. Trang chủ (`/`)
- Hero: tên dịch vụ + 1 câu mô tả ngắn ("Cho thuê xe đi khám bệnh, đám cưới, rước dâu...") + **2 nút lớn: GỌI NGAY / NHẮN ZALO** (luôn nổi, kể cả khi cuộn — sticky bottom bar trên mobile).
- Khối "Loại dịch vụ": các thẻ có icon to: Đi khám bệnh, Đám cưới – Rước dâu, Ra sân bay, Đi xa/việc gấp.
- Khối "Xe của chúng tôi": hiển thị các xe (từ Supabase), mỗi xe có ảnh, số chỗ, giá, nút "Xem chi tiết" + nút gọi.
- Khối "Tự lái hay có tài xế?": giải thích ngắn 2 hình thức và lưu ý (tự lái cần bằng lái + đặt cọc; có tài xế thì chủ xe lái).
- Khối "Khách nói gì": vài lời nhận xét.
- Khối "Bạn có xe muốn cho thuê?": kêu gọi đối tác liên hệ.
- Footer: tên chủ, địa chỉ (xã/huyện), số điện thoại, Zalo, Facebook, bản đồ.

### 4.2. Trang chi tiết xe (`/xe/[id]`)
- Bộ ảnh thật của xe (carousel đơn giản).
- Thông tin: tên xe, loại (4/7/16 chỗ), số chỗ, mô tả.
- Bảng giá rõ ràng: **Giá tự lái** (theo ngày) và **Giá có tài xế** (theo ngày / theo chuyến) + ghi chú (đi về trong ngày, phụ phí xa...).
- Tên + ảnh chủ xe (tăng tin cậy).
- Nút GỌI / ZALO to ở cuối và sticky.

### 4.3. Khu vực đối tác (`/cho-thue-xe` hoặc khối trên trang chủ)
- Giải thích: "Nhà bạn có xe rảnh? Liên hệ để được giới thiệu cùng chúng tôi, có thêm khách."
- Cách 1 (chính): nút gọi/Zalo cho chủ chính.
- Cách 2 (tùy chọn): form ngắn (Tên, Số điện thoại, Loại xe, Ghi chú) → lưu vào bảng `partner_inquiries` trên Supabase. Sau khi gửi: hiện thông báo "Đã nhận, chúng tôi sẽ gọi lại" + mở Zalo.

### 4.4. Quản trị (KHÔNG xây trang riêng)
- Chủ chính đăng nhập **Supabase Dashboard → Table Editor** để:
  - Thêm/sửa/xóa xe (bảng `cars`), thêm ảnh (`car_photos`).
  - Bật/tắt xe đang cho thuê (`available`).
  - Xem các yêu cầu đối tác (`partner_inquiries`).
  - Duyệt đánh giá (`testimonials.approved`).
- Cần viết 1 file hướng dẫn ngắn `HUONG-DAN-QUAN-LY.md` (tiếng Việt, có ảnh chụp màn hình) cho chủ chính.

---

## 5. Kiến trúc & công nghệ

- **Next.js (App Router)** + TypeScript.
- **Tailwind CSS** — mobile-first.
- **Supabase** (Postgres + Storage cho ảnh) làm backend dữ liệu. Đọc dữ liệu phía server bằng `@supabase/supabase-js`.
- Dữ liệu xe đọc qua **Server Components** (ưu tiên SEO + tốc độ). Không cần realtime.
- **Hosting: Vercel.** Domain trỏ về sau.
- **i18n:** dùng `next-intl` với App Router. Locale mặc định `vi` (ưu tiên tiếng Việt), cấu trúc `app/[locale]/...`. Toàn bộ chuỗi hiển thị đặt trong file `messages/vi.json` (không hard-code chữ trong component). Tạo sẵn `messages/en.json` rỗng/đối chiếu để sau dễ bổ sung; chưa cần hiển thị bộ chọn ngôn ngữ ở giai đoạn này. Lưu ý: chỉ chuỗi giao diện mới i18n; dữ liệu xe/giá trong Supabase giữ nguyên tiếng Việt.
- Bảo mật đọc: bật RLS, policy cho phép `select` công khai các bảng hiển thị; `insert` công khai chỉ cho `partner_inquiries` và `testimonials` (chờ duyệt).

### Biến môi trường (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_PHONE=84xxxxxxxxx      # số điện thoại chủ chính
NEXT_PUBLIC_ZALO=84xxxxxxxxx       # số Zalo
NEXT_PUBLIC_FACEBOOK_URL=...
NEXT_PUBLIC_MAP_URL=...            # link Google Maps
```

---

## 6. Mô hình dữ liệu (Supabase SQL)

> Thiết kế multi-vendor ngay từ đầu: hiện chỉ 1 `owner` + 1 `car`, sau này thêm là xong, không sửa code.

```sql
-- Chủ xe
create table owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  zalo text,
  facebook text,
  photo_url text,
  address text,            -- xã/huyện
  is_primary boolean default false,  -- true = chủ chính (bạn)
  created_at timestamptz default now()
);

-- Xe
create table cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id) on delete cascade,
  name text not null,                -- vd "Toyota Vios 4 chỗ"
  type text,                         -- "4 chỗ" | "7 chỗ" | "16 chỗ"
  seats int,
  description text,
  price_self_drive numeric,          -- giá tự lái / ngày (null nếu không cho tự lái)
  price_with_driver numeric,         -- giá có tài xế / ngày
  price_note text,                   -- ghi chú: đi về trong ngày, phụ phí km...
  available boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Ảnh xe
create table car_photos (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references cars(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

-- Yêu cầu của chủ xe khác muốn tham gia
create table partner_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  zalo text,
  car_info text,           -- mô tả xe của họ
  note text,
  status text default 'new',  -- new | contacted | added
  created_at timestamptz default now()
);

-- Đánh giá / lời nhận xét
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  content text not null,
  rating int check (rating between 1 and 5),
  approved boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table owners enable row level security;
alter table cars enable row level security;
alter table car_photos enable row level security;
alter table partner_inquiries enable row level security;
alter table testimonials enable row level security;

create policy "public read owners" on owners for select using (true);
create policy "public read cars" on cars for select using (true);
create policy "public read photos" on car_photos for select using (true);
create policy "public read approved testimonials" on testimonials
  for select using (approved = true);
create policy "public insert partner" on partner_inquiries
  for insert with check (true);
create policy "public insert testimonial" on testimonials
  for insert with check (true);
```

> Lưu ý: "Loại dịch vụ" (khám bệnh, đám cưới, rước dâu, sân bay...) để **cứng trong code**
> (file config), vì chúng ít thay đổi — không cần đưa vào DB.

---

## 7. Sitemap / các trang

> Có tiền tố locale: đường dẫn thực tế là `/[locale]/...`, mặc định `vi` (vd `/vi`, `/vi/xe/[id]`). Tiếng Việt là locale gốc.

- `/` — Trang chủ (gồm tất cả các khối chính).
- `/xe/[id]` — Chi tiết xe.
- `/cho-thue-xe` — Khu vực đối tác (có thể là 1 section + 1 trang riêng).
- (tùy chọn) `/lien-he` — Thông tin liên hệ + bản đồ.

---

## 8. Yêu cầu phi chức năng

- **Mobile-first**, nút bấm to (tối thiểu 48px), chữ ≥ 16px, tương phản cao.
- Tải nhanh (ảnh tối ưu `next/image`, server render).
- **SEO địa phương:** tiêu đề kiểu "Cho thuê xe [tên xã/huyện] — đi khám bệnh, đám cưới, sân bay"; có `metadata`, Open Graph, schema.org LocalBusiness.
- Hoạt động tốt cả khi mạng yếu (3G).
- Dễ bấm gọi: nút `tel:` và `zalo.me` đặt ở nhiều nơi + sticky bar.
- Mặc định tiếng Việt, giọng văn mộc mạc, gần gũi; chuỗi giao diện qua i18n (`next-intl`) để sau thêm ngôn ngữ khác mà không sửa code.

---

## 9. Kế hoạch chia task (Writing Plans)

Thực hiện theo thứ tự. Mỗi task hoàn thành mới sang task sau.

**Giai đoạn 0 — Khởi tạo**
1. Tạo project Next.js (App Router, TS) + Tailwind.
2. Cài `@supabase/supabase-js`, tạo file `lib/supabase.ts`, cấu hình `.env.local`.
2b. Cài `next-intl`: cấu trúc `app/[locale]/...`, locale mặc định `vi`, tạo `messages/vi.json` (và `en.json` để dành). Mọi chuỗi giao diện đọc từ file ngôn ngữ, không hard-code.

**Giai đoạn 1 — Dữ liệu**
3. Tạo project Supabase, chạy SQL ở mục 6.
4. Nhập dữ liệu thật: 1 `owner` (is_primary = true) + 1 `car` + ảnh xe + vài `testimonials`.

**Giai đoạn 2 — Thiết kế giao diện (Claude Design)**
5. Từ spec này, sinh prompt thiết kế (xem mục 10) → đưa vào Claude Design → xuất giao diện.

**Giai đoạn 3 — Lập trình (Subagent Driven Development)**
6. Dựng layout chung + sticky call/Zalo bar + footer liên hệ.
7. File config danh sách "loại dịch vụ".
8. Trang chủ: hero, khối dịch vụ, khối xe (đọc Supabase), khối tự lái/có tài xế, khối đánh giá, khối đối tác.
9. Trang chi tiết xe `/xe/[id]` (đọc Supabase, carousel ảnh, bảng giá).
10. Khu vực đối tác + form ngắn ghi vào `partner_inquiries`.
11. SEO/metadata + schema.org LocalBusiness + tối ưu ảnh.

**Giai đoạn 4 — Kiểm thử (Playwright)**
12. Viết E2E test: trang chủ render danh sách xe; nút `tel:` và `zalo.me` đúng số; vào được trang chi tiết xe; gửi form đối tác thành công và hiện thông báo; truy cập `/` chuyển hướng đúng về locale `vi`.

**Giai đoạn 5 — Triển khai**
13. Deploy lên Vercel, cấu hình biến môi trường, trỏ domain.
14. Viết `HUONG-DAN-QUAN-LY.md` cho chủ chính (thêm xe/ảnh trong Supabase).

---

## 10. Prompt mẫu cho Claude Design (bước 2)

> "Thiết kế giao diện web (mobile-first, tiếng Việt) cho dịch vụ cho thuê xe ở vùng quê.
> Người dùng là nông dân, không rành công nghệ — ưu tiên đơn giản, chữ to, nút bấm lớn,
> ảnh thật, ít chữ. Hành động chính là GỌI và NHẮN ZALO (2 nút nổi bật, có thanh sticky
> dưới màn hình). Trang chủ gồm: hero với câu giới thiệu + 2 nút gọi/Zalo; khối loại dịch
> vụ (đi khám bệnh, đám cưới–rước dâu, ra sân bay, đi xa) dạng thẻ có icon; khối danh sách
> xe (ảnh, số chỗ, giá tự lái / có tài xế, nút xem chi tiết + gọi); khối giải thích tự lái
> vs có tài xế; khối đánh giá khách hàng; khối kêu gọi chủ xe khác tham gia; footer liên hệ
> + bản đồ. Phong cách: thân thiện, mộc mạc, đáng tin, tông màu ấm. Kèm trang chi tiết xe
> với carousel ảnh và bảng giá rõ ràng."

---

## 11. Lời nhắc cho người vận hành

- App này là "tờ rơi điện tử có thể bấm gọi" — đừng làm phức tạp.
- Khi có chủ xe thứ 2 muốn tham gia: chỉ cần thêm 1 `owner` + `cars` trong Supabase,
  giao diện tự hiển thị thêm lựa chọn cho khách. Không phải sửa code.
- Nên dùng ảnh xe thật, chụp rõ, có cả ảnh chủ xe để bà con thấy tin tưởng.
