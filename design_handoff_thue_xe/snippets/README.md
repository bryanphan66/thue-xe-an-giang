# snippets/ — file dán thẳng vào dự án Next.js

Các file production-ready để Claude Code khởi động nhanh. Bám đúng tokens/spec trong `../README.md`.

| File | Đặt vào | Việc |
|---|---|---|
| `tailwind.config.ts` | gốc dự án | Tokens màu, bo góc, font, keyframes/animation (marquee, heroZoom, dotPulse, barUp, sheetUp). |
| `config/brand.ts` | `config/brand.ts` | Mọi thông tin thương hiệu/liên hệ + toạ độ bản đồ ở MỘT chỗ. |
| `components/MapEmbed.tsx` | `components/` | Bản đồ nhúng: OSM (keyless, mặc định) hoặc Google Embed API (cần key). Nút Chỉ đường → Google Maps app. |
| `hooks/useReveal.ts` | `hooks/` | IntersectionObserver + fallback 1.3s. Trả `{ ref, shown }`. |
| `components/Reveal.tsx` | `components/` | Wrapper dùng useReveal; biến thể up/up-lg/left/right/scale/mask. |
| `components/Car3DViewer.tsx` | `components/` | model-viewer (sân khấu tối, auto-rotate, AR, loading, fallback). Cần `npm i @google/model-viewer`. |
| `components/StickyContactBar.tsx` | `components/` | Thanh liên hệ kính mờ cố định đáy (Gọi/Zalo). |
| `components/ContactSheet.tsx` | `components/` | Bottom sheet hiện số ĐT + link `tel:`/`zalo.me`. |
| `hooks/useContact.ts` | `hooks/` | Trạng thái mở sheet: `{ open, call, zalo, close }`. |
| `types/model-viewer.d.ts` | `types/` | Khai báo JSX cho `<model-viewer>`. Thêm `types/` vào `include` của tsconfig. |
| `app/globals.snippet.css` | nối vào `app/globals.css` | `.reveal` + biến thể, `.marquee`, mask mờ mép, ambient, `prefers-reduced-motion`. |
| `.env.local.example` | copy thành `.env.local` | Chỉ cần khi dùng bản đồ kiểu Google. |

## Thứ tự dựng gợi ý
1. `npx create-next-app@latest --ts --tailwind --app`
2. Chép `tailwind.config.ts`, `config/brand.ts`, `components/MapEmbed.tsx`; nối `globals.snippet.css`.
3. Cài: `npm i lucide-react @google/model-viewer`. Đảm bảo `tsconfig.json` có `"include": [..., "types/**/*.ts"]`.
4. Khai báo font Be Vietnam Pro + JetBrains Mono bằng `next/font/google` trong `app/layout.tsx`
   (xem comment đầu `tailwind.config.ts`), gán `--font-sans` / `--font-mono`.
5. Class `.reveal` → `.reveal.in` đã có hook sẵn (`hooks/useReveal.ts` + `components/Reveal.tsx`).
6. Dựng từng section theo `../README.md` và đối chiếu `../reference/`.

## Ráp thanh liên hệ (ví dụ)
```tsx
const c = useContact();
// ...trong layout của cả 2 trang:
<StickyContactBar onCall={c.call} onZalo={c.zalo} />
<ContactSheet open={c.open} onClose={c.close} />
```

## Lưu ý bản đồ (quan trọng)
- **KHÔNG** nhúng `maps.google.com/...&output=embed` → bị chặn iframe (`ERR_BLOCKED_BY_RESPONSE`).
- Mặc định dùng **OpenStreetMap** (đã ghim đúng `10.534045, 105.16464`). Muốn kiểu Google → set
  `<MapEmbed provider="google" />` + `NEXT_PUBLIC_GOOGLE_MAPS_KEY` trong `.env.local`.
