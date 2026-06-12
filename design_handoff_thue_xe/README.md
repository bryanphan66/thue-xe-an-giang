# Handoff: Thuê Xe Trung Hiếu — Web cho thuê xe (mobile)

## Tổng quan
Landing page giới thiệu dịch vụ cho thuê xe (có tài xế / tự lái) phục vụ đi khám bệnh,
đám cưới – rước dâu, du lịch, đi xa. Mục tiêu: khách **xem xe → bấm GỌI hoặc NHẮN ZALO**.
Mobile-first, tiếng Việt, phong cách **quiet-luxury đơn sắc** (như trang một hãng xe điện
hiện đại), KHÔNG màu mè / emoji / cảm giác "tờ rơi".

## Về các file trong gói này
Các file trong `reference/` là **bản thiết kế tham chiếu viết bằng HTML/React (Babel inline)** —
prototype thể hiện đúng look & behavior, **KHÔNG phải code production để copy nguyên**.
Nhiệm vụ là **dựng lại các màn hình này trong codebase đích** (đề xuất **Next.js + Tailwind**,
như brief) theo pattern/thư viện của dự án. Hãy bám pixel/spacing/màu/typography trong file
tham chiếu, nhưng viết lại bằng component sạch của framework.

## Độ chính xác (Fidelity)
**Hi-fi** — màu, typography, spacing, bo góc, tương tác đã chốt. Dựng lại **pixel-perfect**.

---

## Stack đề xuất
- **Next.js (App Router) + TypeScript + Tailwind CSS**.
- Icon: **lucide-react** (đúng bộ icon đã dùng).
- Font: **Be Vietnam Pro** qua `next/font/google` (weights 400/500/600/700/800).
- 3D: **`@google/model-viewer`** (web component) — load client-side, `loading="eager"`.
- Tách component: `Hero, ServiceTypes, CarCard, CarList, DriveOptions, Testimonials,
  PartnerSection, Footer, StickyContactBar, Car3DViewer, CarGallery, PriceTable,
  OwnerCard, ContactSheet`.

## Design tokens (map vào `tailwind.config` / CSS vars)
| Token | Hex | Dùng cho |
|---|---|---|
| `ink` | `#0B0B0C` | chữ chính, nút chính |
| `surface` | `#FFFFFF` | nền thẻ |
| `bg` | `#FAFAFA` | nền sáng chính |
| `muted` | `#6B7280` | chữ phụ / chú thích |
| `hairline` | `#E7E7E9` | viền mảnh, separator |
| `stage` (dark) | `#0B0B0C` | nền hero / khu 3D / footer |
| `stage-ink` | `#FAFAFA` | chữ trên nền tối |
| `stage-muted` | `#9A9CA3` | chữ phụ trên nền tối |
| `stage-hairline` | `#1F2024` | viền trên nền tối |
| `accent` (cobalt) | `#2D5BFF` | **DÙNG RẤT ÍT**: chấm chỉ báo, sao đánh giá, badge "Uy tín", focus/link |

- **Bo góc:** thẻ `14px`, nút `13px`, sheet `22px`.
- **Bóng:** gần như không — ưu tiên viền hairline. Bóng chỉ rất nhẹ cho khung điện thoại / sheet.
- **Container mobile:** rộng tối đa ~412px, padding ngang `22px`, nhịp dọc giữa khối `~52px`.
- **Vùng chạm:** ≥ 48px; CTA chính cao `52px`.

## Typography
- Họ chữ duy nhất: **Be Vietnam Pro** (grotesk, hỗ trợ tiếng Việt đủ).
- Display (hero h1): `46px / weight 800 / line-height .98 / letter-spacing -0.045em`.
- H2 section: `27px / 800 / -0.035em`.
- Tên xe (card): `22px / 800 / -0.035em`; (detail) `30px / 800 / -0.04em`.
- Body/lead: `17px / 400 / line-height 1.5–1.6`.
- Eyebrow: `11.5px / 600 / UPPERCASE / letter-spacing .16em / màu muted / nowrap`.
- Giá tiền: nổi bật bằng **cỡ chữ** (19–24px, 800), KHÔNG bằng màu.
- Caption placeholder ảnh: monospace (JetBrains Mono) `11px`.

---

## MÀN HÌNH 1 — TRANG CHỦ
1. **Hero** (nền `stage` tối). Eyebrow chấm cobalt + "DỊCH VỤ CHO THUÊ XE" → h1 grotesk lớn
   "Đi xa thật dễ. Chỉ một cuộc gọi." → 1 câu phụ (muted) → ảnh xe full-bleed (16:10) →
   cặp CTA: **Gọi ngay** (nền `stage-ink` trắng, chữ ink, icon Phone) / **Nhắn Zalo** (ghost viền).
2. **ServiceTypes** — list 4 mục, mỗi mục: ô icon 46px viền hairline + nhãn + sub + chevron phải.
   Phân tách bằng hairline. (Đi khám bệnh · Đám cưới–Rước dâu · Đi du lịch · Đi xa/việc gấp).
3. **CarList** — header "Xe của chúng tôi" + đếm "N xe" (mono, nowrap). Mỗi **CarCard**:
   ảnh xe 16:10 (+ badge "Phổ biến nhất"/"Xe cưới" góc trên trái nếu có), tên xe (800),
   dòng `Users` + số chỗ + loại; **bảng giá 2 cột** (Có tài xế / Tự lái) phân tách hairline,
   số 19px/800; hàng nút: "Xem chi tiết" (ghost + mũi tên, flex:1) + nút gọi nhanh vuông 52px (ink).
4. **DriveOptions** — "Tự lái hay có tài xế?" 2 mục (icon steering / key) phân tách hairline.
5. **Testimonials (marquee)** — header eyebrow "Khách nói gì" + h2 "Bà con tin tưởng".
   Dải thẻ đánh giá **trôi ngang liên tục, liền mạch** (CSS marquee): mỗi thẻ `flex:0 0 300px`
   + `margin-right:14px`; track chứa **2 bản** danh sách thẻ, `animation: translateX(0) → -50%`,
   `linear infinite ~52s`. **Mờ dần 2 mép** bằng `mask-image: linear-gradient(...)`. **Chạm/hover →
   `animation-play-state: paused`**. `prefers-reduced-motion` → tắt animation, cho thẻ wrap xuống dòng.
   Mỗi thẻ: sao (icon line cobalt) + câu "…" + "— Tên, địa phương".
6. **PartnerSection** — thẻ viền: "Bạn có xe muốn cho thuê?" + nút ghost "Trở thành đối tác ↗".
7. **LocationSection** — eyebrow "Vị trí" + h2 "Ghé nhà xe" + địa chỉ + **bản đồ nhúng**.
   ⚠️ **Google `output=embed` bị chặn iframe** (`X-Frame-Options` → `ERR_BLOCKED_BY_RESPONSE`) — KHÔNG dùng.
   Đang dùng **OpenStreetMap** (keyless, không bị chặn): `https://www.openstreetmap.org/export/embed.html?bbox=<minlon,minlat,maxlon,maxlat>&layer=mapnik&marker=<lat,lng>`,
   `filter: grayscale(.15)` cho hợp tone, có placeholder "Đang tải bản đồ…".
   Toạ độ ghim: **`10.534045, 105.16464`** (`BRAND.lat/lng`). Nút "Chỉ đường" → `BRAND.mapLink` (Google Maps app, đúng ghim).
   *Nếu muốn bản đồ phong cách Google trong app thật:* dùng **Maps Embed API** (`/maps/embed/v1/place?key=...&q=lat,lng`) hoặc mã `pb` từ Share→Embed.
8. **Footer** (nền `stage` tối) — tên nhà xe, eyebrow, các dòng: địa chỉ (MapPin, **bấm → mở map**),
   SĐT (Phone, bấm gọi), Zalo (Chat), Facebook; nút "Chỉ đường tới nhà xe" (→ `mapLink`).
   Chừa `padding-bottom ~130px` cho sticky bar.

## MÀN HÌNH 2 — CHI TIẾT XE
1. **Back bar** sticky kính mờ trên nền tối (nút chevron-left + tên xe).
2. **Car3DViewer** — `<model-viewer>` trên **sân khấu tối** (`stage`), cao ~420px:
   `camera-controls auto-rotate auto-rotate-delay=3000 rotation-per-second=14deg shadow-intensity=1.1
   exposure=0.9 ar ar-modes="webxr scene-viewer quick-look" loading="eager"`.
   Overlay: nhãn "MÔ HÌNH 3D" (icon cube) góc trên trái; **gesture hint** "Vuốt để xoay · chụm để zoom"
   (pill mờ, tự fade sau ~5.5s); **nút AR** "Xem trong sân nhà bạn" góc dưới phải (gọi `mv.activateAR()`).
   **Trạng thái tải**: poster tối + spinner + "Đang tải mô hình 3D…", ẩn khi event `load`;
   **fallback** sang poster ảnh thật khi `error`/không hỗ trợ. (Hiện dùng model mẫu `ToyCar.glb` từ
   jsDelivr — **thay bằng .glb xe thật**.)
3. Tên xe (h1 30px) + số chỗ (Users) + loại.
4. **CarGallery** — dải ảnh thật vuốt ngang `scroll-snap`, mỗi ảnh 84% bề rộng, nút chevron trái/phải,
   thanh tiến trình các đoạn (đoạn active màu ink).
5. **Mô tả** ngắn (eyebrow "MÔ TẢ" + body 17px).
6. **PriceTable** — khung viền bo 16px: 2 hàng "Có tài xế / Tự lái", số 24px/800 + " đ/ngày" (muted),
   ghi chú nhỏ mỗi hàng, hairline giữa; chú thích phụ phí bên dưới.
7. **OwnerCard** — thẻ: ảnh tròn 60px + "Chủ xe / Anh Tư" + badge cobalt "Uy tín" (icon Shield).
8. Cặp CTA **Gọi ngay / Nhắn Zalo** cuối nội dung (ngoài sticky bar).

## StickyContactBar (cả 2 màn)
Cố định đáy, **kính mờ** (`backdrop-filter: blur(18px) saturate(1.4)`), nền `rgba(250,250,250,.72)`,
viền trên hairline. Chứa **Gọi ngay** (ink) + **Nhắn Zalo** (ghost). `padding-bottom` cộng safe-area.

## ContactSheet (bottom sheet)
Bấm bất kỳ nút Gọi/Zalo → overlay mờ + sheet trượt từ đáy (radius 22px trên). Hiển thị icon,
nhãn ("Gọi cho nhà xe"/"Nhắn Zalo cho nhà xe"), **số điện thoại lớn**, nút hành động
(`tel:0901234567` / `https://zalo.me/<id>`) + nút "Đóng". Animation `sheetUp` cubic-bezier(.16,1,.3,1).

---

## Tương tác & chuyển động
- **Reveal khi cuộn**: fade + dịch lên `translateY(16px)→0`, `transition .7s cubic-bezier(.16,1,.3,1)`,
  trigger bằng IntersectionObserver (threshold .12). **Bắt buộc có fallback** hiện nội dung sau
  ~1.3s nếu observer chưa kích hoạt (vd tab ẩn) — không để nội dung kẹt ở opacity 0.
  Tôn trọng `prefers-reduced-motion`.
- **Chuyển màn** Home ↔ Detail: fade + dịch nhỏ; **reset scroll về top** khi đổi màn.
- Xe 3D **tự xoay chậm khi nhàn rỗi**; hint cử chỉ fade dần.
- `:active` nút: `scale(.975)`. Focus/hover dùng cobalt rất nhẹ. Không hiệu ứng giật.

### Mỗi section một chuyển động "chữ ký" (chỉ transform/opacity — rẻ, mượt trên máy yếu)
- **Hero**: 3 dòng tiêu đề trồi lên so le (`translateY(34px)→0`, delay 80/175/270ms);
  ảnh hero "thở" zoom rất chậm (`scale(1)→1.045`, 16s ease-in-out alternate, bọc `overflow:hidden`);
  chấm cobalt có vòng nhịp khẽ (`dotPulse` 2.6s).
- **ServiceTypes**: từng hàng trượt vào từ trái (`translateX(-26px)→0`) so le 70ms.
- **CarList**: thẻ hiện kiểu phóng nhẹ (`scale(.95)→1`) so le 50ms; hover thẻ nâng `translateY(-3px)`.
- **DriveOptions**: 2 hàng trượt từ trái so le.
- **Testimonials**: marquee (ở trên).
- **StickyContactBar**: trồi lên khi tải (`translateY(120%)→0`, delay 250ms).
- **Detail**: gallery/mô tả/bảng giá/thẻ chủ xe reveal so le; xe 3D tự xoay khi nhàn rỗi.
- **Lưu ý hiệu năng**: 5G ≠ máy mạnh — chỉ animate `transform`/`opacity`, tránh `blur`/`box-shadow`
  động; mọi animation phải có nhánh `prefers-reduced-motion`.

## State
- `screen: 'home' | 'detail'`, `selectedCar`, `sheet: null | 'call' | 'zalo'`.
- Dữ liệu xe nên fetch từ CMS/JSON; hiện hardcode 4 xe trong `reference/app/data.jsx` (Vios/Innova/CX-5/Transit).

## Assets cần thay
- **Ảnh xe thật** (hero full-bleed + dải gallery mỗi xe) — hiện là ô placeholder sọc + nhãn mono.
- **File .glb** mô hình 3D từng xe (+ poster ảnh) — hiện dùng ToyCar mẫu.
- **Thông tin liên hệ** (đã điền): **Thuê Xe Trung Hiếu** · ĐT/Zalo **0326120108** ·
  **Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang** · chủ xe **Anh Hiếu** ·
  **Google Maps:** `https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7` (nút Chỉ đường) ·
  **Toạ độ:** `10.534045, 105.16464` (ô nhúng OpenStreetMap).
  Tất cả đặt trong `BRAND` (reference/app/data.jsx) — dễ đổi, nên đưa ra 1 file config.

## Files tham chiếu
- `reference/index.html` — tokens, CSS nền, khung điện thoại, thứ tự load.
- `reference/app/data.jsx` — nội dung & dữ liệu xe.
- `reference/app/icons.jsx` — bộ icon (map sang lucide-react cùng tên).
- `reference/app/ui.jsx` — Reveal (+fallback), Photo placeholder, Stars, Eyebrow.
- `reference/app/home.jsx` — toàn bộ section trang chủ.
- `reference/app/detail.jsx` — Car3DViewer, CarGallery, PriceTable, OwnerCard.
- `reference/app/app.jsx` — routing, StickyContactBar, ContactSheet.
