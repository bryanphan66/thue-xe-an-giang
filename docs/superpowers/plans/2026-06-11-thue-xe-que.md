# Thuê Xe Quê — Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Web app "tờ rơi điện tử có thể bấm gọi" giới thiệu dịch vụ cho thuê xe vùng quê — bà con xem xe/giá rồi bấm GỌI hoặc NHẮN ZALO; nền tảng multi-vendor đọc dữ liệu từ Supabase.

**Architecture:** Next.js App Router (TS) + Tailwind, mobile-first. Chuỗi giao diện qua `next-intl` (`app/[locale]/...`, mặc định `vi`). Dữ liệu xe/owner/testimonials đọc phía server qua một lớp `lib/data.ts` có **fixture fallback**: khi chưa cấu hình env Supabase thì trả dữ liệu mẫu (dev & E2E chạy được ngay); khi điền env thật thì tự chuyển sang Supabase, không sửa code. Form đối tác ghi vào `partner_inquiries` qua Server Action (fixture mode trả success). Đặt xe chỉ qua `tel:` / `zalo.me`.

**Tech Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · `@supabase/supabase-js` · `next-intl` v4 · Playwright (E2E).

**Quy ước review:** Mỗi **Giai đoạn (Phase)** xong thì DỪNG cho người dùng review trước khi sang phase sau.

**Quyết định đã chốt với người dùng:**
- Data: **fixture fallback** (không bắt buộc Supabase thật để dev/test).
- Supabase: **chưa có project** — chỉ tạo file SQL + hướng dẫn, người dùng tự tạo sau.
- Có **một bước design riêng** (Claude Design) là một checkpoint trước khi code UI; phần logic (data, i18n, contact, form action) không phụ thuộc design nên làm trước.
- i18n: locale mặc định `vi`, `messages/vi.json` + `messages/en.json`, **không hard-code chuỗi UI**, chưa cần bộ chọn ngôn ngữ. Dữ liệu Supabase giữ nguyên tiếng Việt.

---

## Design System (đã chốt — Warm Editorial 2026)

> Nguồn chuẩn: `docs/design-prompt.md`. **Bỏ sạch emoji; không màu sặc sỡ; icon dùng Lucide (line, đơn sắc).** Mọi component bám token dưới. Khi có output Claude Design, tinh chỉnh spacing/ảnh theo đó nhưng GIỮ token này.

**Màu (đưa vào `@theme` của Tailwind v4 trong `globals.css`):**
- `--color-ivory: #F7F4EF` (nền chính) · `--color-cream: #FCFAF6` (thẻ)
- `--color-charcoal: #1C1B19` (chữ chính) · `--color-stonegray: #6B655C` (chữ phụ)
- `--color-olive: #404A2C` (màu nhấn/CTA chính) · `--color-clay: #B45A3C` (nhấn phụ, sao)
- `--color-hairline: #E5DFD5` (viền)

**Font (next/font, subset `vietnamese`):** tiêu đề serif **Fraunces** → biến `--font-display`; thân/UI sans **Be Vietnam Pro** → biến `--font-sans`. Body ≥17px.

**Icon:** `lucide-react`. Map: Gọi=`Phone`, Zalo=`MessageCircle`, địa chỉ/chỉ đường=`MapPin`, số chỗ=`Users`, sao=`Star`, điều hướng carousel=`ChevronLeft/ChevronRight`, dịch vụ=`Stethoscope`(khám bệnh)/`HeartHandshake`(cưới)/`Palmtree`(du lịch)/`Route`(đi xa). Nét mảnh (`strokeWidth={1.5}`), kế thừa màu chữ.

**Nút:** cao ≥48px (CTA chính ~52–56px), bo góc `rounded-xl` (~12px), KHÔNG gradient/bóng đậm. CTA chính = nền `olive`/`charcoal` đặc, chữ `ivory`. CTA phụ (Zalo) = outline: viền `charcoal`, chữ `charcoal`, nền trong suốt.

**Bố cục:** container `max-w-xl` căn giữa, padding hai bên `px-5`/`px-6`; nhịp dọc giữa khối `py-16`–`py-20`; thẻ nền `cream` + `border border-hairline` + bóng rất nhẹ; mỗi khối có eyebrow nhỏ in HOA (`text-xs tracking-widest text-stonegray`) trên tiêu đề serif.

---

## File Structure

```
thue-xe-que/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # html/body, NextIntlClientProvider, sticky bar, footer
│   │   ├── page.tsx                # Trang chủ (ghép các section)
│   │   ├── xe/[id]/page.tsx        # Chi tiết xe
│   │   └── cho-thue-xe/page.tsx    # Khu vực đối tác
│   └── globals.css                 # Tailwind import + base styles
├── components/
│   ├── StickyContactBar.tsx        # thanh gọi/Zalo sticky dưới (mobile)
│   ├── Footer.tsx
│   ├── ContactButtons.tsx          # nút GỌI + ZALO (tái dùng)
│   ├── Hero.tsx
│   ├── ServiceTypes.tsx
│   ├── CarCard.tsx
│   ├── CarList.tsx                 # server, đọc getCars()
│   ├── DriveOptions.tsx
│   ├── Testimonials.tsx            # server, đọc getTestimonials()
│   ├── PartnerSection.tsx          # CTA đối tác trên trang chủ
│   ├── PartnerForm.tsx             # client, gọi Server Action
│   ├── CarCarousel.tsx             # client, carousel ảnh đơn giản
│   └── PriceTable.tsx
├── lib/
│   ├── supabase.ts                 # client + cờ supabaseConfigured
│   ├── data.ts                     # getCars/getCar/getTestimonials/getPrimaryOwner (+fallback)
│   ├── fixtures.ts                 # dữ liệu mẫu
│   ├── contact.ts                  # telHref/zaloHref/contact() từ env
│   ├── services.ts                 # config "loại dịch vụ" (cứng trong code)
│   └── actions.ts                  # Server Action submitPartnerInquiry
├── i18n/
│   ├── routing.ts
│   ├── navigation.ts
│   └── request.ts
├── messages/
│   ├── vi.json
│   └── en.json
├── types/
│   └── db.ts                       # Owner, Car, CarPhoto, Testimonial, PartnerInquiry
├── tests/e2e/
│   ├── home.spec.ts
│   ├── contact-links.spec.ts
│   ├── car-detail.spec.ts
│   ├── partner-form.spec.ts
│   └── locale-redirect.spec.ts
├── tests/unit/
│   ├── contact.test.ts
│   └── services.test.ts
├── supabase/schema.sql             # SQL mục 6 của spec
├── middleware.ts
├── next.config.ts
├── playwright.config.ts
├── .env.local.example
├── HUONG-DAN-QUAN-LY.md
└── SPEC.md
```

---

# GIAI ĐOẠN 0 — Khởi tạo

### Task 0.1: Scaffold Next.js + Tailwind

**Files:**
- Create: toàn bộ scaffold (`app/`, `package.json`, `tsconfig.json`, `app/globals.css`, ...)

- [ ] **Step 1: Tạo project bằng create-next-app**

Run (trong thư mục cha, vì thư mục hiện tại đã có SPEC.md/docs):
```bash
cd /Users/bryan/Desktop/Workspace/thue-xe-que
npx create-next-app@latest . --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
Khi hỏi đè file (SPEC.md/docs đã tồn tại), chọn giữ — `create-next-app` không xóa file lạ. Nếu báo thư mục không rỗng và từ chối, chạy trong thư mục tạm rồi copy, hoặc dùng cờ `--yes` và xác nhận. Mục tiêu: có `package.json`, `app/`, `tailwind` đã cấu hình.

- [ ] **Step 2: Chạy dev server kiểm tra scaffold**

Run: `npm run dev` (rồi tắt) — Expected: server lên ở `http://localhost:3000`, trang mặc định render.

- [ ] **Step 3: Dọn trang mặc định**

Xóa nội dung mẫu trong `app/page.tsx` (sẽ thay bằng `app/[locale]/...` ở Task 0.3). Giữ `app/globals.css` (Tailwind import).

- [ ] **Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js App Router + Tailwind"
```

---

### Task 0.2: Supabase client + types + env

**Files:**
- Create: `lib/supabase.ts`, `types/db.ts`, `.env.local.example`, `.env.local`

- [ ] **Step 1: Cài @supabase/supabase-js**

Run: `npm install @supabase/supabase-js`

- [ ] **Step 2: Tạo types**

Create `types/db.ts`:
```ts
export type Owner = {
  id: string;
  name: string;
  phone: string;
  zalo: string | null;
  facebook: string | null;
  photo_url: string | null;
  address: string | null;
  is_primary: boolean;
};

export type CarPhoto = {
  id: string;
  car_id: string;
  url: string;
  sort_order: number;
};

export type Car = {
  id: string;
  owner_id: string;
  name: string;
  type: string | null;
  seats: number | null;
  description: string | null;
  price_self_drive: number | null;
  price_with_driver: number | null;
  price_note: string | null;
  available: boolean;
  featured: boolean;
  owner?: Owner;
  photos?: CarPhoto[];
};

export type Testimonial = {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  approved: boolean;
};

export type PartnerInquiryInput = {
  name: string;
  phone: string;
  zalo?: string;
  car_info?: string;
  note?: string;
};
```

- [ ] **Step 3: Tạo Supabase client với cờ cấu hình**

Create `lib/supabase.ts`:
```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = supabaseConfigured
  ? createClient(url!, anonKey!)
  : null;
```

- [ ] **Step 4: Tạo file env mẫu + env local (fixtures rỗng)**

Create `.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PHONE=84901234567
NEXT_PUBLIC_ZALO=84901234567
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/
NEXT_PUBLIC_MAP_URL=https://maps.google.com/
```

Create `.env.local` (để trống Supabase → kích hoạt fixture fallback; điền số liên hệ demo):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_PHONE=84901234567
NEXT_PUBLIC_ZALO=84901234567
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/thuexeque
NEXT_PUBLIC_MAP_URL=https://maps.google.com/?q=10.762622,106.660172
```
Đảm bảo `.env.local` đã nằm trong `.gitignore` (create-next-app thêm sẵn).

- [ ] **Step 5: Commit**

```bash
git add lib/supabase.ts types/db.ts .env.local.example
git commit -m "feat: supabase client with configured flag + db types"
```

---

### Task 0.3: next-intl (app/[locale], mặc định vi, redirect /)

**Files:**
- Create: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `middleware.ts`, `messages/vi.json`, `messages/en.json`, `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`
- Modify: `next.config.ts`
- Delete: `app/layout.tsx`, `app/page.tsx` (cũ, thay bằng bản trong `[locale]`)

- [ ] **Step 1: Cài next-intl**

Run: `npm install next-intl`

- [ ] **Step 2: Routing config**

Create `i18n/routing.ts`:
```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
});
```

Create `i18n/navigation.ts`:
```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 3: Request config (chọn messages theo locale)**

Create `i18n/request.ts`:
```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Middleware (redirect `/` → `/vi`)**

Create `middleware.ts`:
```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(vi|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
```
> `localePrefix` mặc định là `'always'` → truy cập `/` sẽ chuyển hướng về `/vi`.

- [ ] **Step 5: Bật plugin next-intl trong next.config**

Replace `next.config.ts`:
```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Messages vi + en (khởi tạo khóa nền tảng)**

Create `messages/vi.json`:
```json
{
  "site": {
    "name": "Thuê Xe Quê",
    "eyebrow": "DỊCH VỤ CHO THUÊ XE",
    "headline": "Đưa bà con đi xa, về gần.",
    "tagline": "Thuê xe có tài xế hoặc tự lái — đi khám bệnh, đám cưới, rước dâu, đi du lịch."
  },
  "actions": {
    "callNow": "Gọi ngay",
    "messageZalo": "Nhắn Zalo",
    "viewDetail": "Xem chi tiết",
    "directions": "Chỉ đường"
  },
  "home": {
    "servicesEyebrow": "CHÚNG TÔI PHỤC VỤ",
    "servicesTitle": "Loại dịch vụ",
    "carsTitle": "Xe của chúng tôi",
    "driveTitle": "Tự lái hay có tài xế?",
    "testimonialsTitle": "Khách nói gì",
    "partnerTitle": "Bạn có xe muốn cho thuê?"
  },
  "services": {
    "hospital": "Đi khám bệnh",
    "wedding": "Đám cưới – Rước dâu",
    "travel": "Đi du lịch",
    "longTrip": "Đi xa / việc gấp"
  },
  "drive": {
    "selfTitle": "Tự lái",
    "selfNote": "Cần bằng lái phù hợp và đặt cọc.",
    "driverTitle": "Có tài xế",
    "driverNote": "Chủ xe lái, bà con chỉ việc lên xe."
  },
  "car": {
    "seats": "{count} chỗ",
    "priceSelfDrive": "Giá tự lái",
    "priceWithDriver": "Giá có tài xế",
    "perDay": "/ ngày",
    "note": "Ghi chú",
    "ownerLabel": "Chủ xe",
    "photosAlt": "Ảnh xe {name}"
  },
  "partner": {
    "intro": "Nhà bạn có xe rảnh? Liên hệ để được giới thiệu cùng chúng tôi, có thêm khách.",
    "cta": "Đăng ký cho thuê xe",
    "formName": "Tên của bạn",
    "formPhone": "Số điện thoại",
    "formCarInfo": "Loại xe của bạn",
    "formNote": "Ghi chú",
    "submit": "Gửi thông tin",
    "submitting": "Đang gửi...",
    "success": "Đã nhận, chúng tôi sẽ gọi lại cho bạn.",
    "error": "Có lỗi, bà con thử gọi trực tiếp giúp nhé."
  },
  "footer": {
    "owner": "Chủ xe",
    "address": "Địa chỉ",
    "phone": "Điện thoại",
    "rights": "Cho thuê xe vùng quê"
  }
}
```

Create `messages/en.json` (đối chiếu, để dành — dịch tạm hoặc giữ tiếng Việt; cấu trúc khóa GIỐNG hệt vi.json):
```json
{
  "site": {
    "name": "Thuê Xe Quê",
    "eyebrow": "CAR RENTAL SERVICE",
    "headline": "Take your family far, bring them home close.",
    "tagline": "Car rental with driver or self-drive — hospital trips, weddings, travel trips."
  },
  "actions": {
    "callNow": "Call now",
    "messageZalo": "Zalo",
    "viewDetail": "View details",
    "directions": "Directions"
  },
  "home": {
    "servicesEyebrow": "WHAT WE OFFER",
    "servicesTitle": "Services",
    "carsTitle": "Our cars",
    "driveTitle": "Self-drive or with driver?",
    "testimonialsTitle": "What customers say",
    "partnerTitle": "Have a car to rent out?"
  },
  "services": {
    "hospital": "Hospital trips",
    "wedding": "Weddings",
    "travel": "Travel trips",
    "longTrip": "Long / urgent trips"
  },
  "drive": {
    "selfTitle": "Self-drive",
    "selfNote": "Valid license and deposit required.",
    "driverTitle": "With driver",
    "driverNote": "The owner drives; just hop in."
  },
  "car": {
    "seats": "{count} seats",
    "priceSelfDrive": "Self-drive price",
    "priceWithDriver": "With-driver price",
    "perDay": "/ day",
    "note": "Note",
    "ownerLabel": "Owner",
    "photosAlt": "Photo of {name}"
  },
  "partner": {
    "intro": "Have an idle car? Contact us to get more customers together.",
    "cta": "Register your car",
    "formName": "Your name",
    "formPhone": "Phone number",
    "formCarInfo": "Your car type",
    "formNote": "Note",
    "submit": "Send",
    "submitting": "Sending...",
    "success": "Received, we will call you back.",
    "error": "Something went wrong, please call us directly."
  },
  "footer": {
    "owner": "Owner",
    "address": "Address",
    "phone": "Phone",
    "rights": "Countryside car rental"
  }
}
```

- [ ] **Step 7: Locale layout tạm (chỉ html/body + provider; sticky bar/footer thêm ở Phase 3)**

Delete `app/layout.tsx` và `app/page.tsx` cũ. Create `app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="bg-[#F7F4EF] text-[#1C1B19] antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Trang chủ tạm để kiểm tra i18n hoạt động**

Create `app/[locale]/page.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Placeholder />;
}

function Placeholder() {
  const t = useTranslations('site');
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">{t('name')}</h1>
      <p>{t('tagline')}</p>
    </main>
  );
}
```

- [ ] **Step 9: Verify redirect + i18n**

Run: `npm run dev`. Mở `http://localhost:3000/` → Expected: chuyển hướng tới `/vi`, hiển thị "Thuê Xe Quê" + tagline tiếng Việt. Mở `/en` → hiển thị bản tiếng Anh.

- [ ] **Step 10: Commit**

```bash
git add i18n messages middleware.ts next.config.ts "app/[locale]"
git commit -m "feat: next-intl app/[locale] with vi default and / redirect"
```

---

### Task 0.4: Data layer + fixtures + SQL schema (TDD cho fallback)

**Files:**
- Create: `lib/fixtures.ts`, `lib/data.ts`, `supabase/schema.sql`, `tests/unit/data.test.ts`
- Test: `tests/unit/data.test.ts`

- [ ] **Step 1: SQL schema (copy nguyên mục 6 spec)**

Create `supabase/schema.sql` với toàn bộ SQL ở SPEC.md mục 6 (các bảng `owners`, `cars`, `car_photos`, `partner_inquiries`, `testimonials` + RLS + policies). Copy chính xác từ spec.

- [ ] **Step 2: Fixtures (1 owner is_primary + 1 car + ảnh + testimonials)**

Create `lib/fixtures.ts`:
```ts
import type { Owner, Car, Testimonial } from '@/types/db';

export const fixtureOwner: Owner = {
  id: 'owner-1',
  name: 'Anh Tư',
  phone: '84901234567',
  zalo: '84901234567',
  facebook: 'https://facebook.com/thuexeque',
  photo_url: 'https://placehold.co/200x200?text=Chu+xe',
  address: 'Xã Mỹ Hòa, Huyện Bình Minh',
  is_primary: true,
};

export const fixtureCars: Car[] = [
  {
    id: 'car-1',
    owner_id: 'owner-1',
    name: 'Toyota Vios 4 chỗ',
    type: '4 chỗ',
    seats: 4,
    description: 'Xe đời mới, máy lạnh mát, sạch sẽ, chạy êm. Phù hợp đi khám bệnh, đám cưới, đi du lịch.',
    price_self_drive: 700000,
    price_with_driver: 1200000,
    price_note: 'Giá đi về trong ngày. Đi xa tính thêm phí cầu đường và xăng.',
    available: true,
    featured: true,
    owner: fixtureOwner,
    photos: [
      { id: 'p1', car_id: 'car-1', url: 'https://placehold.co/800x600?text=Xe+1', sort_order: 0 },
      { id: 'p2', car_id: 'car-1', url: 'https://placehold.co/800x600?text=Xe+2', sort_order: 1 },
      { id: 'p3', car_id: 'car-1', url: 'https://placehold.co/800x600?text=Xe+3', sort_order: 2 },
    ],
  },
];

export const fixtureTestimonials: Testimonial[] = [
  { id: 't1', author_name: 'Cô Bảy', content: 'Xe sạch, tài xế vui vẻ, chở tôi đi bệnh viện tỉnh an toàn.', rating: 5, approved: true },
  { id: 't2', author_name: 'Chú Ba', content: 'Đám cưới con tôi thuê xe rước dâu, đúng giờ, giá phải chăng.', rating: 5, approved: true },
];
```

- [ ] **Step 3: Viết test fallback TRƯỚC (đỏ)**

Create `tests/unit/data.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getCars, getCar, getTestimonials, getPrimaryOwner } from '@/lib/data';
import { fixtureCars, fixtureTestimonials, fixtureOwner } from '@/lib/fixtures';

// Khi không cấu hình Supabase (env trống trong test), data layer trả fixtures.
describe('data layer fixture fallback', () => {
  it('getCars trả về fixtures', async () => {
    expect(await getCars()).toEqual(fixtureCars);
  });
  it('getCar trả đúng xe theo id', async () => {
    expect((await getCar('car-1'))?.id).toBe('car-1');
    expect(await getCar('khong-co')).toBeNull();
  });
  it('getTestimonials trả approved fixtures', async () => {
    expect(await getTestimonials()).toEqual(fixtureTestimonials);
  });
  it('getPrimaryOwner trả owner chính', async () => {
    expect((await getPrimaryOwner())?.is_primary).toBe(true);
  });
});
```

- [ ] **Step 4: Cài vitest + chạy test để thấy ĐỎ**

Run: `npm install -D vitest`. Thêm vào `package.json` scripts: `"test:unit": "vitest run"`. Tạo `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  test: { environment: 'node' },
});
```
Run: `npm run test:unit` — Expected: FAIL (chưa có `lib/data.ts`).

- [ ] **Step 5: Implement data layer (xanh)**

Create `lib/data.ts`:
```ts
import { supabase } from './supabase';
import { fixtureCars, fixtureTestimonials, fixtureOwner } from './fixtures';
import type { Car, Testimonial, Owner } from '@/types/db';

const CAR_SELECT = '*, owner:owners(*), photos:car_photos(*)';

export async function getCars(): Promise<Car[]> {
  if (!supabase) return fixtureCars;
  const { data } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .eq('available', true)
    .order('featured', { ascending: false });
  return (data as Car[] | null) ?? fixtureCars;
}

export async function getCar(id: string): Promise<Car | null> {
  if (!supabase) return fixtureCars.find((c) => c.id === id) ?? null;
  const { data } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .eq('id', id)
    .maybeSingle();
  return (data as Car | null) ?? null;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!supabase) return fixtureTestimonials;
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });
  return (data as Testimonial[] | null) ?? fixtureTestimonials;
}

export async function getPrimaryOwner(): Promise<Owner | null> {
  if (!supabase) return fixtureOwner;
  const { data } = await supabase
    .from('owners')
    .select('*')
    .eq('is_primary', true)
    .maybeSingle();
  return (data as Owner | null) ?? fixtureOwner;
}
```

- [ ] **Step 6: Chạy test để thấy XANH**

Run: `npm run test:unit` — Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add lib/data.ts lib/fixtures.ts supabase/schema.sql tests/unit/data.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat: data layer with supabase + fixture fallback (TDD)"
```

> **DỪNG REVIEW — Giai đoạn 0.** Báo người dùng: scaffold + i18n redirect + data layer + SQL đã xong.

---

# GIAI ĐOẠN 1 — Thiết kế (Claude Design)  ⛔ checkpoint người dùng

### Task 1.1: Chuẩn bị prompt design + nhận output

**Files:** (không code) — Create: `docs/design-prompt.md`

- [ ] **Step 1: Soạn prompt design**

Create `docs/design-prompt.md` dựa trên SPEC.md mục 10, bổ sung: mobile-first, sticky bottom bar GỌI/ZALO, tông màu ấm (amber/stone), chữ ≥16px, nút ≥48px, ảnh thật. Liệt kê các section trang chủ + trang chi tiết xe.

- [ ] **Step 2: DỪNG — người dùng chạy Claude Design**

Báo người dùng: dùng `docs/design-prompt.md` đưa vào Claude Design, xuất giao diện (HTML/React/screenshot) rồi gửi lại. Các task UI phía sau sẽ **bám màu sắc/spacing/bố cục từ output design**; cấu trúc component + wiring dữ liệu giữ như plan. Nếu người dùng bỏ qua bước này, fallback: dựng UI Tailwind mộc mạc theo mô tả spec.

> **DỪNG REVIEW — Giai đoạn 1.** Chờ output design trước khi sang Giai đoạn 2.

---

# GIAI ĐOẠN 2 — Nền tảng UI (layout, contact, services)

### Task 2.0: Design tokens — Tailwind theme, fonts, Lucide

**Files:**
- Modify: `app/globals.css`, `app/[locale]/layout.tsx`
- Install: `lucide-react`

- [ ] **Step 1: Cài icon library**

Run: `npm install lucide-react`

- [ ] **Step 2: Token màu + font vào Tailwind v4 theme**

Replace nội dung `app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-ivory: #F7F4EF;
  --color-cream: #FCFAF6;
  --color-charcoal: #1C1B19;
  --color-stonegray: #6B655C;
  --color-olive: #404A2C;
  --color-clay: #B45A3C;
  --color-hairline: #E5DFD5;

  --font-sans: var(--font-be-vietnam), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-fraunces), ui-serif, Georgia, serif;
}

body {
  background-color: var(--color-ivory);
  color: var(--color-charcoal);
  font-size: 17px;
}
```

- [ ] **Step 3: Nạp font qua next/font (subset vietnamese) trong root locale layout**

Modify `app/[locale]/layout.tsx` — thêm import font và gắn biến vào `<html>`:
```tsx
import { Fraunces, Be_Vietnam_Pro } from 'next/font/google';

const fraunces = Fraunces({
  subsets: ['vietnamese'],
  variable: '--font-fraunces',
  display: 'swap',
});
const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

// trong JSX, thay <html lang={locale}> bằng:
<html lang={locale} className={`${fraunces.variable} ${beVietnam.variable}`}>
  <body className="font-sans antialiased">
```
> Bỏ class cũ `bg-amber-50 text-stone-900` ở body (màu nay lấy từ `globals.css`). Tiêu đề serif dùng class `font-display`.

- [ ] **Step 4: Verify**

Run: `npm run dev`, mở `/vi` → nền ngà, chữ Be Vietnam Pro, không lỗi font.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/"[locale]"/layout.tsx package.json package-lock.json
git commit -m "feat: design tokens (warm editorial palette, fonts, lucide)"
```

---

### Task 2.1: Contact helpers (TDD)

**Files:**
- Create: `lib/contact.ts`, `tests/unit/contact.test.ts`

- [ ] **Step 1: Viết test trước (đỏ)**

Create `tests/unit/contact.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { telHref, zaloHref } from '@/lib/contact';

describe('contact helpers', () => {
  it('telHref tạo tel: đúng số', () => {
    expect(telHref('84901234567')).toBe('tel:+84901234567');
  });
  it('telHref bỏ ký tự thừa', () => {
    expect(telHref('0901 234 567')).toBe('tel:0901234567');
  });
  it('zaloHref tạo link zalo.me', () => {
    expect(zaloHref('84901234567')).toBe('https://zalo.me/84901234567');
  });
});
```

- [ ] **Step 2: Chạy test → ĐỎ**

Run: `npm run test:unit` — Expected: FAIL (chưa có `lib/contact.ts`).

- [ ] **Step 3: Implement (xanh)**

Create `lib/contact.ts`:
```ts
function digits(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

export function telHref(phone: string): string {
  const d = digits(phone);
  // số bắt đầu bằng 84 → thêm dấu + cho định dạng quốc tế
  return d.startsWith('84') ? `tel:+${d}` : `tel:${d}`;
}

export function zaloHref(zalo: string): string {
  return `https://zalo.me/${digits(zalo)}`;
}

export function siteContact() {
  return {
    phone: process.env.NEXT_PUBLIC_PHONE ?? '',
    zalo: process.env.NEXT_PUBLIC_ZALO ?? '',
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '',
    mapUrl: process.env.NEXT_PUBLIC_MAP_URL ?? '',
  };
}
```

- [ ] **Step 4: Chạy test → XANH**

Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts tests/unit/contact.test.ts
git commit -m "feat: contact tel/zalo helpers (TDD)"
```

---

### Task 2.2: Services config (TDD)

**Files:**
- Create: `lib/services.ts`, `tests/unit/services.test.ts`

- [ ] **Step 1: Test trước (đỏ)**

Create `tests/unit/services.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { SERVICE_TYPES } from '@/lib/services';

describe('service types config', () => {
  it('có đủ 4 loại dịch vụ với key i18n + icon component', () => {
    expect(SERVICE_TYPES.map((s) => s.key)).toEqual([
      'hospital', 'wedding', 'travel', 'longTrip',
    ]);
    SERVICE_TYPES.forEach((s) => expect(s.Icon).toBeTruthy());
  });
});
```

- [ ] **Step 2: Chạy → ĐỎ**

Run: `npm run test:unit` — Expected: FAIL.

- [ ] **Step 3: Implement**

Create `lib/services.ts`:
```ts
import { Stethoscope, HeartHandshake, Palmtree, Route, type LucideIcon } from 'lucide-react';

// "Loại dịch vụ" để cứng trong code (spec mục 6) — ít thay đổi.
// `key` map tới messages.services.<key>; `Icon` là component Lucide (line, đơn sắc).
export type ServiceType = { key: string; Icon: LucideIcon };

export const SERVICE_TYPES: ServiceType[] = [
  { key: 'hospital', Icon: Stethoscope },
  { key: 'wedding', Icon: HeartHandshake },
  { key: 'travel', Icon: Palmtree },
  { key: 'longTrip', Icon: Route },
];
```

- [ ] **Step 4: Chạy → XANH**

Run: `npm run test:unit` — Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/services.ts tests/unit/services.test.ts
git commit -m "feat: hard-coded service types config (TDD)"
```

---

### Task 2.3: ContactButtons + StickyContactBar + Footer

**Files:**
- Create: `components/ContactButtons.tsx`, `components/StickyContactBar.tsx`, `components/Footer.tsx`
- Modify: `app/[locale]/layout.tsx`

> Styling bám theo output Claude Design (Giai đoạn 1). Dưới đây là bản fallback chuẩn (tông amber/stone, nút ≥48px).

- [ ] **Step 1: ContactButtons (tái dùng nút GỌI + ZALO)**

Create `components/ContactButtons.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle } from 'lucide-react';
import { telHref, zaloHref } from '@/lib/contact';

export default function ContactButtons({
  phone,
  zalo,
  className = '',
}: {
  phone: string;
  zalo: string;
  className?: string;
}) {
  const t = useTranslations('actions');
  return (
    <div className={`flex gap-3 ${className}`}>
      <a
        href={telHref(phone)}
        data-testid="call-button"
        className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-xl bg-olive px-4 text-base font-semibold text-ivory"
      >
        <Phone size={20} strokeWidth={1.5} /> {t('callNow')}
      </a>
      <a
        href={zaloHref(zalo)}
        data-testid="zalo-button"
        className="flex-1 min-h-13 flex items-center justify-center gap-2 rounded-xl border border-charcoal px-4 text-base font-semibold text-charcoal"
      >
        <MessageCircle size={20} strokeWidth={1.5} /> {t('messageZalo')}
      </a>
    </div>
  );
}
```

- [ ] **Step 2: StickyContactBar (sticky bottom, mobile)**

Create `components/StickyContactBar.tsx`:
```tsx
import { siteContact } from '@/lib/contact';
import ContactButtons from './ContactButtons';

export default function StickyContactBar() {
  const { phone, zalo } = siteContact();
  return (
    <div
      data-testid="sticky-bar"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-ivory/95 p-3 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] backdrop-blur"
    >
      <ContactButtons phone={phone} zalo={zalo} className="mx-auto max-w-md" />
    </div>
  );
}
```

- [ ] **Step 3: Footer**

Create `components/Footer.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { MapPin } from 'lucide-react';
import { getPrimaryOwner } from '@/lib/data';
import { siteContact, telHref, zaloHref } from '@/lib/contact';

export default async function Footer() {
  const owner = await getPrimaryOwner();
  const { facebook, mapUrl } = siteContact();
  return <FooterView owner={owner} facebook={facebook} mapUrl={mapUrl} />;
}

function FooterView({ owner, facebook, mapUrl }: any) {
  const t = useTranslations('footer');
  const tA = useTranslations('actions');
  return (
    <footer className="mt-10 bg-charcoal px-6 py-12 pb-28 text-ivory">
      <p className="font-display text-xl">{owner?.name}</p>
      <p className="mt-2 text-stonegray">{t('address')}: {owner?.address}</p>
      <p className="text-stonegray">{t('phone')}: <a className="underline" href={telHref(owner?.phone ?? '')}>{owner?.phone}</a></p>
      {owner?.zalo && <p className="text-stonegray">Zalo: <a className="underline" href={zaloHref(owner.zalo)}>{owner.zalo}</a></p>}
      <div className="mt-4 flex gap-5">
        {facebook && <a className="underline" href={facebook}>Facebook</a>}
        {mapUrl && <a className="inline-flex items-center gap-1 underline" href={mapUrl}><MapPin size={16} strokeWidth={1.5} />{tA('directions')}</a>}
      </div>
      <p className="mt-6 text-sm text-stonegray">© {t('rights')}</p>
    </footer>
  );
}
```
> Lưu ý `useTranslations` không gọi được trực tiếp trong async server component cùng chỗ await; tách `FooterView` (sync) như trên.

- [ ] **Step 4: Gắn sticky bar + footer vào layout**

Modify `app/[locale]/layout.tsx` — bọc children:
```tsx
import StickyContactBar from '@/components/StickyContactBar';
import Footer from '@/components/Footer';
// ... trong <body>:
<NextIntlClientProvider>
  <div className="pb-24">{children}</div>
  <Footer />
  <StickyContactBar />
</NextIntlClientProvider>
```

- [ ] **Step 5: Verify**

Run: `npm run dev`. Mở `/vi` → Expected: thanh sticky dưới có 2 nút GỌI/ZALO, footer hiện tên chủ + địa chỉ.

- [ ] **Step 6: Commit**

```bash
git add components app/"[locale]"/layout.tsx
git commit -m "feat: contact buttons, sticky bar, footer in layout"
```

> **DỪNG REVIEW — Giai đoạn 2.**

---

# GIAI ĐOẠN 3 — Trang chủ

### Task 3.1: Hero + ServiceTypes

**Files:**
- Create: `components/Hero.tsx`, `components/ServiceTypes.tsx`

- [ ] **Step 1: Hero**

Create `components/Hero.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { siteContact } from '@/lib/contact';
import ContactButtons from './ContactButtons';

export default function Hero() {
  const t = useTranslations('site');
  const { phone, zalo } = siteContact();
  return (
    <section className="mx-auto max-w-xl px-6 pb-12 pt-14">
      <p className="text-xs font-medium uppercase tracking-widest text-stonegray">
        {t('eyebrow')}
      </p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-charcoal">
        {t('headline')}
      </h1>
      <p className="mt-4 text-lg text-stonegray">{t('tagline')}</p>
      <ContactButtons phone={phone} zalo={zalo} className="mt-8" />
    </section>
  );
}
```
> Thêm khóa i18n `site.eyebrow` ("DỊCH VỤ CHO THUÊ XE") và `site.headline` ("Đưa bà con đi xa, về gần.") vào `messages/vi.json` + `en.json` (giữ cùng cấu trúc khóa).

- [ ] **Step 2: ServiceTypes**

Create `components/ServiceTypes.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { SERVICE_TYPES } from '@/lib/services';

export default function ServiceTypes() {
  const t = useTranslations('home');
  const tS = useTranslations('services');
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-stonegray">
        {t('servicesEyebrow')}
      </p>
      <h2 className="mt-2 font-display text-3xl text-charcoal">{t('servicesTitle')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
        {SERVICE_TYPES.map(({ key, Icon }) => (
          <div key={key} className="flex flex-col gap-3 bg-cream p-6">
            <Icon size={28} strokeWidth={1.5} className="text-olive" />
            <span className="text-lg font-medium text-charcoal">{tS(key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
```
> Thêm khóa `home.servicesEyebrow` ("CHÚNG TÔI PHỤC VỤ") vào vi/en.json.

- [ ] **Step 3: Verify + Commit**

Run: `npm run dev`, kiểm tra `/vi`. Then:
```bash
git add components/Hero.tsx components/ServiceTypes.tsx
git commit -m "feat: hero + service types sections"
```

---

### Task 3.2: CarCard + CarList

**Files:**
- Create: `components/CarCard.tsx`, `components/CarList.tsx`

- [ ] **Step 1: CarCard**

Create `components/CarCard.tsx`:
```tsx
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Users, Phone, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { telHref, siteContact } from '@/lib/contact';
import type { Car } from '@/types/db';

export default function CarCard({ car }: { car: Car }) {
  const t = useTranslations('car');
  const tA = useTranslations('actions');
  const { phone } = siteContact();
  const cover = car.photos?.[0]?.url;
  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-cream" data-testid="car-card">
      {cover && (
        <Image src={cover} alt={t('photosAlt', { name: car.name })} width={800} height={600} className="h-52 w-full object-cover" />
      )}
      <div className="p-5">
        <h3 className="font-display text-2xl text-charcoal">{car.name}</h3>
        {car.seats != null && (
          <p className="mt-1 flex items-center gap-1.5 text-stonegray">
            <Users size={16} strokeWidth={1.5} /> {t('seats', { count: car.seats })}
          </p>
        )}
        <div className="mt-4 space-y-1 border-t border-hairline pt-4">
          {car.price_with_driver != null && (
            <p className="text-stonegray">{t('priceWithDriver')}: <b className="text-lg text-charcoal">{car.price_with_driver.toLocaleString('vi-VN')}đ</b> {t('perDay')}</p>
          )}
          {car.price_self_drive != null && (
            <p className="text-stonegray">{t('priceSelfDrive')}: <b className="text-lg text-charcoal">{car.price_self_drive.toLocaleString('vi-VN')}đ</b> {t('perDay')}</p>
          )}
        </div>
        <div className="mt-5 flex gap-3">
          <Link href={`/xe/${car.id}`} className="flex-1 min-h-12 flex items-center justify-center gap-1.5 rounded-xl border border-charcoal font-semibold text-charcoal" data-testid="car-detail-link">
            {tA('viewDetail')} <ArrowRight size={18} strokeWidth={1.5} />
          </Link>
          <a href={telHref(phone)} aria-label={tA('callNow')} className="min-h-12 flex items-center justify-center rounded-xl bg-olive px-4 text-ivory">
            <Phone size={20} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: CarList (server, đọc data)**

Create `components/CarList.tsx`:
```tsx
import { getCars } from '@/lib/data';
import CarCard from './CarCard';
import { getTranslations } from 'next-intl/server';

export default async function CarList() {
  const cars = await getCars();
  const t = await getTranslations('home');
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h2 className="font-display text-3xl text-charcoal">{t('carsTitle')}</h2>
      <div className="mt-6 grid gap-6">
        {cars.map((car) => <CarCard key={car.id} car={car} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify + Commit**

```bash
git add components/CarCard.tsx components/CarList.tsx
git commit -m "feat: car card + car list reading data layer"
```

---

### Task 3.3: DriveOptions + Testimonials + PartnerSection + ghép trang chủ

**Files:**
- Create: `components/DriveOptions.tsx`, `components/Testimonials.tsx`, `components/PartnerSection.tsx`
- Modify: `app/[locale]/page.tsx`

- [ ] **Step 1: DriveOptions**

Create `components/DriveOptions.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { KeyRound, UserRound } from 'lucide-react';

export default function DriveOptions() {
  const t = useTranslations('home');
  const tD = useTranslations('drive');
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h2 className="font-display text-3xl text-charcoal">{t('driveTitle')}</h2>
      <div className="mt-6 divide-y divide-hairline border-y border-hairline">
        <div className="flex gap-4 py-6">
          <KeyRound size={24} strokeWidth={1.5} className="mt-1 shrink-0 text-olive" />
          <div>
            <h3 className="text-lg font-semibold text-charcoal">{tD('selfTitle')}</h3>
            <p className="mt-1 text-stonegray">{tD('selfNote')}</p>
          </div>
        </div>
        <div className="flex gap-4 py-6">
          <UserRound size={24} strokeWidth={1.5} className="mt-1 shrink-0 text-olive" />
          <div>
            <h3 className="text-lg font-semibold text-charcoal">{tD('driverTitle')}</h3>
            <p className="mt-1 text-stonegray">{tD('driverNote')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Testimonials (server)**

Create `components/Testimonials.tsx`:
```tsx
import { getTestimonials } from '@/lib/data';
import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';

export default async function Testimonials() {
  const items = await getTestimonials();
  const t = await getTranslations('home');
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h2 className="font-display text-3xl text-charcoal">{t('testimonialsTitle')}</h2>
      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline">
        {items.map((x) => (
          <blockquote key={x.id} className="bg-cream p-6">
            <div className="flex gap-0.5 text-clay">
              {Array.from({ length: x.rating }).map((_, i) => (
                <Star key={i} size={16} strokeWidth={1.5} fill="currentColor" />
              ))}
            </div>
            <p className="mt-3 font-display text-lg italic text-charcoal">“{x.content}”</p>
            <footer className="mt-3 text-sm text-stonegray">— {x.author_name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: PartnerSection (CTA + link sang /cho-thue-xe)**

Create `components/PartnerSection.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export default function PartnerSection() {
  const t = useTranslations('home');
  const tP = useTranslations('partner');
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-hairline bg-cream p-8 text-center">
        <h2 className="font-display text-3xl text-charcoal">{t('partnerTitle')}</h2>
        <p className="mt-3 text-stonegray">{tP('intro')}</p>
        <Link href="/cho-thue-xe" className="mt-6 inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-olive px-7 font-semibold text-ivory">
          {tP('cta')} <ArrowRight size={18} strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
}
```
> Thêm khóa `partner.cta` ("Đăng ký cho thuê xe" / "Register your car") vào vi/en.json — tách khỏi nút submit của form.

- [ ] **Step 4: Ghép trang chủ**

Replace `app/[locale]/page.tsx`:
```tsx
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/Hero';
import ServiceTypes from '@/components/ServiceTypes';
import CarList from '@/components/CarList';
import DriveOptions from '@/components/DriveOptions';
import Testimonials from '@/components/Testimonials';
import PartnerSection from '@/components/PartnerSection';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      <ServiceTypes />
      <CarList />
      <DriveOptions />
      <Testimonials />
      <PartnerSection />
    </main>
  );
}
```

- [ ] **Step 5: Verify + Commit**

Run: `npm run dev`, mở `/vi` → tất cả section hiển thị, danh sách xe có 1 xe.
```bash
git add components app/"[locale]"/page.tsx
git commit -m "feat: assemble home page sections"
```

> **DỪNG REVIEW — Giai đoạn 3.**

---

# GIAI ĐOẠN 4 — Chi tiết xe

> **Quyết định (đã chốt với người dùng):** v1 dùng **carousel ảnh thật nhiều góc** (trước/chéo 45°/hông/sau/nội thất/taplo/cốp) — nhanh trên 3G, đúng "ảnh thật". KHÔNG làm mô hình 3D generic (không phải xe thật, nặng). **Chừa sẵn cho 360° ảnh thật sau**: `car_photos` đã có `sort_order`; khi cần xoay 360° chỉ thêm cột `kind text default 'photo'` (giá trị `'spin_frame'` cho các khung xoay) và một component `Car360` đọc các frame — không phải sửa schema lớn. `HUONG-DAN-QUAN-LY.md` sẽ hướng dẫn chủ xe chụp đủ các góc.

### Task 4.1: CarCarousel + PriceTable

**Files:**
- Create: `components/CarCarousel.tsx`, `components/PriceTable.tsx`

- [ ] **Step 1: CarCarousel (client, carousel đơn giản)**

Create `components/CarCarousel.tsx`:
```tsx
'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { CarPhoto } from '@/types/db';

export default function CarCarousel({ photos, alt }: { photos: CarPhoto[]; alt: string }) {
  const [i, setI] = useState(0);
  if (photos.length === 0) return null;
  const sorted = [...photos].sort((a, b) => a.sort_order - b.sort_order);
  return (
    <div data-testid="car-carousel">
      <Image src={sorted[i].url} alt={alt} width={800} height={600} className="h-64 w-full rounded-2xl object-cover" />
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {sorted.map((p, idx) => (
            <button key={p.id} onClick={() => setI(idx)} aria-label={`${alt} ${idx + 1}`}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${idx === i ? 'border-olive' : 'border-hairline'}`}>
              <Image src={p.url} alt={alt} width={64} height={64} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: PriceTable**

Create `components/PriceTable.tsx`:
```tsx
import { useTranslations } from 'next-intl';
import type { Car } from '@/types/db';

export default function PriceTable({ car }: { car: Car }) {
  const t = useTranslations('car');
  return (
    <div className="rounded-2xl border border-hairline bg-cream p-6">
      <table className="w-full text-left">
        <tbody>
          {car.price_with_driver != null && (
            <tr className="border-b border-hairline">
              <th className="py-3 font-medium text-stonegray">{t('priceWithDriver')}</th>
              <td className="py-3 text-right"><b className="text-lg text-charcoal">{car.price_with_driver.toLocaleString('vi-VN')}đ</b> <span className="text-stonegray">{t('perDay')}</span></td>
            </tr>
          )}
          {car.price_self_drive != null && (
            <tr className="border-b border-hairline">
              <th className="py-3 font-medium text-stonegray">{t('priceSelfDrive')}</th>
              <td className="py-3 text-right"><b className="text-lg text-charcoal">{car.price_self_drive.toLocaleString('vi-VN')}đ</b> <span className="text-stonegray">{t('perDay')}</span></td>
            </tr>
          )}
        </tbody>
      </table>
      {car.price_note && <p className="mt-4 text-sm text-stonegray">{t('note')}: {car.price_note}</p>}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/CarCarousel.tsx components/PriceTable.tsx
git commit -m "feat: car carousel + price table"
```

---

### Task 4.2: Trang /xe/[id]

**Files:**
- Create: `app/[locale]/xe/[id]/page.tsx`

- [ ] **Step 1: Trang chi tiết xe**

Create `app/[locale]/xe/[id]/page.tsx`:
```tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getCar } from '@/lib/data';
import { siteContact } from '@/lib/contact';
import CarCarousel from '@/components/CarCarousel';
import PriceTable from '@/components/PriceTable';
import ContactButtons from '@/components/ContactButtons';

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const car = await getCar(id);
  if (!car) notFound();
  const t = await getTranslations('car');
  const { phone, zalo } = siteContact();

  return (
    <main className="mx-auto max-w-xl px-6 py-8">
      <h1 className="font-display text-3xl text-charcoal">{car.name}</h1>
      <p className="mt-1 text-stonegray">{car.type} · {car.seats != null ? t('seats', { count: car.seats }) : ''}</p>
      <div className="mt-5">
        <CarCarousel photos={car.photos ?? []} alt={t('photosAlt', { name: car.name })} />
      </div>
      {car.description && <p className="mt-5 text-stonegray">{car.description}</p>}
      <div className="mt-6"><PriceTable car={car} /></div>
      {car.owner && (
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-hairline bg-cream p-5">
          {car.owner.photo_url && (
            <Image src={car.owner.photo_url} alt={car.owner.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
          )}
          <div>
            <p className="text-sm text-stonegray">{t('ownerLabel')}</p>
            <p className="font-display text-lg text-charcoal">{car.owner.name}</p>
          </div>
        </div>
      )}
      <ContactButtons phone={phone} zalo={zalo} className="mt-8" />
    </main>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, mở `/vi/xe/car-1` → carousel, bảng giá, chủ xe, nút gọi. Mở `/vi/xe/khong-co` → 404.

- [ ] **Step 3: Commit**

```bash
git add app/"[locale]"/xe
git commit -m "feat: car detail page /xe/[id]"
```

> **DỪNG REVIEW — Giai đoạn 4.**

---

# GIAI ĐOẠN 5 — Khu vực đối tác + form

### Task 5.1: Server Action submitPartnerInquiry

**Files:**
- Create: `lib/actions.ts`

- [ ] **Step 1: Server Action (fixture mode → success; có Supabase → insert)**

Create `lib/actions.ts`:
```ts
'use server';
import { supabase } from './supabase';
import type { PartnerInquiryInput } from '@/types/db';

export type SubmitResult = { ok: boolean };

export async function submitPartnerInquiry(
  input: PartnerInquiryInput
): Promise<SubmitResult> {
  if (!input.name?.trim() || !input.phone?.trim()) {
    return { ok: false };
  }
  if (!supabase) {
    // Fixture/demo mode: coi như nhận thành công (chưa cấu hình Supabase).
    return { ok: true };
  }
  const { error } = await supabase.from('partner_inquiries').insert({
    name: input.name,
    phone: input.phone,
    zalo: input.zalo || null,
    car_info: input.car_info || null,
    note: input.note || null,
  });
  return { ok: !error };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/actions.ts
git commit -m "feat: partner inquiry server action with fixture fallback"
```

---

### Task 5.2: PartnerForm + trang /cho-thue-xe

**Files:**
- Create: `components/PartnerForm.tsx`, `app/[locale]/cho-thue-xe/page.tsx`

- [ ] **Step 1: PartnerForm (client)**

Create `components/PartnerForm.tsx`:
```tsx
'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { submitPartnerInquiry } from '@/lib/actions';

export default function PartnerForm() {
  const t = useTranslations('partner');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const fd = new FormData(e.currentTarget);
    const res = await submitPartnerInquiry({
      name: String(fd.get('name') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      car_info: String(fd.get('car_info') ?? ''),
      note: String(fd.get('note') ?? ''),
    });
    setStatus(res.ok ? 'ok' : 'error');
  }

  if (status === 'ok') {
    return (
      <div data-testid="partner-success" className="flex items-start gap-3 rounded-2xl border border-olive/30 bg-cream p-6">
        <Check size={22} strokeWidth={1.5} className="mt-0.5 shrink-0 text-olive" />
        <p className="text-lg text-charcoal">{t('success')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} data-testid="partner-form" className="grid gap-3">
      <input name="name" required placeholder={t('formName')} className="min-h-12 rounded-xl border border-hairline bg-cream px-4 text-charcoal placeholder:text-stonegray" />
      <input name="phone" required inputMode="tel" placeholder={t('formPhone')} className="min-h-12 rounded-xl border border-hairline bg-cream px-4 text-charcoal placeholder:text-stonegray" />
      <input name="car_info" placeholder={t('formCarInfo')} className="min-h-12 rounded-xl border border-hairline bg-cream px-4 text-charcoal placeholder:text-stonegray" />
      <textarea name="note" placeholder={t('formNote')} className="min-h-24 rounded-xl border border-hairline bg-cream px-4 py-3 text-charcoal placeholder:text-stonegray" />
      <button type="submit" disabled={status === 'sending'} className="min-h-13 rounded-xl bg-olive font-semibold text-ivory disabled:opacity-60">
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
      {status === 'error' && <p className="text-clay">{t('error')}</p>}
    </form>
  );
}
```

- [ ] **Step 2: Trang đối tác**

Create `app/[locale]/cho-thue-xe/page.tsx`:
```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { siteContact } from '@/lib/contact';
import ContactButtons from '@/components/ContactButtons';
import PartnerForm from '@/components/PartnerForm';

export default async function PartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('partner');
  const tH = await getTranslations('home');
  const { phone, zalo } = siteContact();
  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="font-display text-3xl text-charcoal">{tH('partnerTitle')}</h1>
      <p className="mt-3 text-stonegray">{t('intro')}</p>
      <ContactButtons phone={phone} zalo={zalo} className="my-6" />
      <PartnerForm />
    </main>
  );
}
```

- [ ] **Step 3: Verify + Commit**

Run: `npm run dev`, mở `/vi/cho-thue-xe`, điền form, gửi → hiện thông báo "Đã nhận...".
```bash
git add components/PartnerForm.tsx app/"[locale]"/cho-thue-xe
git commit -m "feat: partner page + form writing to partner_inquiries"
```

> **DỪNG REVIEW — Giai đoạn 5.**

---

# GIAI ĐOẠN 6 — SEO & metadata

### Task 6.1: Metadata + Open Graph + schema.org LocalBusiness

**Files:**
- Modify: `app/[locale]/layout.tsx` (generateMetadata), `app/[locale]/page.tsx` (JSON-LD), `app/[locale]/xe/[id]/page.tsx` (generateMetadata)

- [ ] **Step 1: Metadata cho layout**

Thêm vào `app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    title: `${t('name')} — ${t('tagline')}`,
    description: t('tagline'),
    openGraph: {
      title: t('name'),
      description: t('tagline'),
      type: 'website',
    },
  };
}
```

- [ ] **Step 2: JSON-LD LocalBusiness trên trang chủ**

Thêm vào `app/[locale]/page.tsx` (đọc owner để lấy địa chỉ/điện thoại):
```tsx
import { getPrimaryOwner } from '@/lib/data';
// trong component, sau khi await:
const owner = await getPrimaryOwner();
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Thuê Xe Quê',
  telephone: owner?.phone,
  address: owner?.address,
};
// render trong <main>:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

- [ ] **Step 3: generateMetadata cho trang xe**

Thêm vào `app/[locale]/xe/[id]/page.tsx`:
```tsx
import type { Metadata } from 'next';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);
  if (!car) return {};
  return {
    title: `${car.name} — Thuê Xe Quê`,
    description: car.description ?? car.name,
    openGraph: {
      title: car.name,
      images: car.photos?.[0]?.url ? [car.photos[0].url] : [],
    },
  };
}
```

- [ ] **Step 4: Verify + Commit**

Run: `npm run build` → Expected: build thành công, không lỗi metadata. Xem `view-source` `/vi` có `<title>` + JSON-LD.
```bash
git add app/"[locale]"
git commit -m "feat: SEO metadata, Open Graph, LocalBusiness JSON-LD"
```

> **DỪNG REVIEW — Giai đoạn 6.**

---

# GIAI ĐOẠN 7 — E2E Playwright

### Task 7.1: Cài + cấu hình Playwright

**Files:**
- Create: `playwright.config.ts`
- Modify: `package.json` (scripts)

- [ ] **Step 1: Cài Playwright**

Run: `npm init playwright@latest -- --quiet` hoặc `npm install -D @playwright/test && npx playwright install --with-deps chromium`.

- [ ] **Step 2: Config (tự khởi động dev server, base URL)**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Pixel 5'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000/vi',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
```

- [ ] **Step 3: Thêm script**

Modify `package.json` scripts: thêm `"test:e2e": "playwright test"`.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts package.json package-lock.json
git commit -m "chore: configure playwright e2e"
```

---

### Task 7.2: Test redirect locale + trang chủ render xe

**Files:**
- Create: `tests/e2e/locale-redirect.spec.ts`, `tests/e2e/home.spec.ts`

- [ ] **Step 1: Test redirect `/` → `/vi`**

Create `tests/e2e/locale-redirect.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('/ chuyển hướng về locale vi', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/vi$/);
  await expect(page.getByRole('heading', { name: 'Thuê Xe Quê' })).toBeVisible();
});
```

- [ ] **Step 2: Test trang chủ render danh sách xe**

Create `tests/e2e/home.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('trang chủ render danh sách xe', async ({ page }) => {
  await page.goto('/vi');
  const cards = page.getByTestId('car-card');
  await expect(cards.first()).toBeVisible();
  await expect(cards).toHaveCount(1); // fixture: 1 xe
  await expect(page.getByText('Toyota Vios 4 chỗ')).toBeVisible();
});
```

- [ ] **Step 3: Chạy 2 test này**

Run: `npm run test:e2e -- locale-redirect home` — Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/locale-redirect.spec.ts tests/e2e/home.spec.ts
git commit -m "test(e2e): locale redirect + home car list"
```

---

### Task 7.3: Test nút tel:/zalo.me đúng số + vào trang chi tiết

**Files:**
- Create: `tests/e2e/contact-links.spec.ts`, `tests/e2e/car-detail.spec.ts`

- [ ] **Step 1: Test tel/zalo đúng số (theo env demo: 84901234567)**

Create `tests/e2e/contact-links.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('nút gọi và zalo trong sticky bar đúng số', async ({ page }) => {
  await page.goto('/vi');
  const bar = page.getByTestId('sticky-bar');
  await expect(bar.getByTestId('call-button')).toHaveAttribute('href', 'tel:+84901234567');
  await expect(bar.getByTestId('zalo-button')).toHaveAttribute('href', 'https://zalo.me/84901234567');
});
```

- [ ] **Step 2: Test vào trang chi tiết xe**

Create `tests/e2e/car-detail.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('vào được trang chi tiết xe từ trang chủ', async ({ page }) => {
  await page.goto('/vi');
  await page.getByTestId('car-detail-link').first().click();
  await expect(page).toHaveURL(/\/vi\/xe\/car-1$/);
  await expect(page.getByRole('heading', { name: 'Toyota Vios 4 chỗ' })).toBeVisible();
  await expect(page.getByTestId('car-carousel')).toBeVisible();
});
```

- [ ] **Step 3: Chạy**

Run: `npm run test:e2e -- contact-links car-detail` — Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/contact-links.spec.ts tests/e2e/car-detail.spec.ts
git commit -m "test(e2e): contact links + car detail navigation"
```

---

### Task 7.4: Test gửi form đối tác thành công

**Files:**
- Create: `tests/e2e/partner-form.spec.ts`

- [ ] **Step 1: Test form**

Create `tests/e2e/partner-form.spec.ts`:
```ts
import { test, expect } from '@playwright/test';

test('gửi form đối tác thành công và hiện thông báo', async ({ page }) => {
  await page.goto('/vi/cho-thue-xe');
  await page.getByTestId('partner-form').getByPlaceholder('Tên của bạn').fill('Anh Năm');
  await page.getByTestId('partner-form').getByPlaceholder('Số điện thoại').fill('0907654321');
  await page.getByRole('button', { name: 'Gửi thông tin' }).click();
  await expect(page.getByTestId('partner-success')).toBeVisible();
  await expect(page.getByTestId('partner-success')).toContainText('Đã nhận');
});
```

- [ ] **Step 2: Chạy**

Run: `npm run test:e2e -- partner-form` — Expected: PASS (fixture mode: action trả ok).

- [ ] **Step 3: Chạy TOÀN BỘ suite (yêu cầu của người dùng: tự kiểm thử trước khi báo xong)**

Run: `npm run test:e2e` — Expected: tất cả 5 file PASS. Dán kết quả thật vào báo cáo.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/partner-form.spec.ts
git commit -m "test(e2e): partner form submit success"
```

> **DỪNG REVIEW — Giai đoạn 7.** Báo người dùng kèm output Playwright thật.

---

# GIAI ĐOẠN 8 — Tài liệu vận hành (deploy do người dùng)

### Task 8.1: HUONG-DAN-QUAN-LY.md

**Files:**
- Create: `HUONG-DAN-QUAN-LY.md`

- [ ] **Step 1: Viết hướng dẫn (tiếng Việt, mộc mạc)**

Create `HUONG-DAN-QUAN-LY.md` gồm: (1) tạo project Supabase + chạy `supabase/schema.sql`; (2) lấy URL + anon key, điền `.env.local` / biến môi trường Vercel; (3) thêm `owner` (is_primary = true), thêm `cars`, upload ảnh vào Storage rồi dán URL vào `car_photos`; (4) bật/tắt `available`; (5) xem `partner_inquiries`; (6) duyệt `testimonials.approved = true`; (7) khi điền env Supabase, app tự dùng dữ liệu thật thay fixtures. Chừa chỗ chèn ảnh chụp màn hình.

- [ ] **Step 2: Checklist deploy Vercel (mô tả, người dùng tự bấm)**

Trong cùng file hoặc `docs/deploy.md`: push GitHub → import vào Vercel → khai báo env (`NEXT_PUBLIC_*`) → deploy → trỏ domain.

- [ ] **Step 3: Commit**

```bash
git add HUONG-DAN-QUAN-LY.md
git commit -m "docs: huong dan quan ly supabase + deploy"
```

> **DỪNG REVIEW — Giai đoạn 8 (kết thúc).**

---

## Self-Review (đối chiếu spec)

**Spec coverage:**
- §4.1 Trang chủ (hero, dịch vụ, xe, tự lái/tài xế, đánh giá, đối tác, footer) → Phase 2–3 ✅
- §4.2 Chi tiết xe (carousel, bảng giá, chủ xe, sticky) → Phase 4 ✅
- §4.3 Đối tác + form ghi `partner_inquiries` → Phase 5 ✅
- §4.4 Quản trị qua Supabase + `HUONG-DAN-QUAN-LY.md` → Phase 8 ✅
- §5 Next.js/Tailwind/Supabase/next-intl/Server Components/RLS SQL → Phase 0 ✅
- §6 SQL data model → `supabase/schema.sql` (Task 0.4) ✅
- §7 Sitemap (`/`, `/xe/[id]`, `/cho-thue-xe`) + prefix locale → Phase 0,3,4,5 ✅
- §8 Mobile-first, nút ≥48px (`min-h-12`), chữ to, `tel:`/`zalo.me`, sticky, SEO → Phase 2,6 ✅
- §9 i18n khung + vi/en, không hard-code → Phase 0 ✅
- E2E (5 luồng người dùng yêu cầu) → Phase 7 ✅

**Placeholder scan:** Không có "TODO/TBD"; mọi step code có code thật. (Phần styling UI sẽ tinh chỉnh theo output Claude Design ở Phase 1 — đây là điều chỉnh thẩm mỹ, không phải placeholder logic.)

**Type consistency:** `Car/Owner/CarPhoto/Testimonial/PartnerInquiryInput` định nghĩa ở `types/db.ts` (Task 0.2), dùng nhất quán trong `lib/data.ts`, components, `lib/actions.ts`. Tên hàm `getCars/getCar/getTestimonials/getPrimaryOwner`, `telHref/zaloHref/siteContact`, `submitPartnerInquiry`, `SERVICE_TYPES` đồng nhất xuyên suốt.

---

## Execution Handoff

Sau khi người dùng duyệt plan: thực thi bằng **superpowers:subagent-driven-development** — mỗi task một subagent mới, review hai tầng giữa các task, và DỪNG review ở cuối mỗi Giai đoạn như đánh dấu ở trên.
