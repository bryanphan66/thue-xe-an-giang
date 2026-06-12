# Prompt dán cho Claude Code

> Kéo cả thư mục `design_handoff_thue_xe/` vào Claude Code, rồi dán nguyên đoạn dưới.

---

```
Dựng lại bộ giao diện trong design_handoff_thue_xe/ thành một web app thật.

NGUỒN CHÂN LÝ
- Đọc design_handoff_thue_xe/README.md để nắm tokens, layout, 8 section, tương tác, animation.
- Các file trong reference/ là prototype HTML/React-Babel — bám SÁT pixel, spacing, màu, typography,
  bo góc, animation trong đó; nhưng VIẾT LẠI bằng component sạch, KHÔNG copy nguyên.
- Dùng các file trong snippets/ làm điểm khởi đầu: chép tailwind.config.ts, config/brand.ts,
  components/{Reveal,MapEmbed,Car3DViewer,StickyContactBar,ContactSheet}.tsx,
  hooks/{useReveal,useContact}.ts, types/model-viewer.d.ts; nối app/globals.snippet.css vào globals.css.

STACK
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Font Be Vietnam Pro qua next/font/google (400/500/600/700/800).
- Icon: lucide-react (đúng tên trong reference/app/icons.jsx).
- 3D: @google/model-viewer, client-only ('use client'/dynamic), loading="eager".

THƯƠNG HIỆU (để trong config/brand.ts, đừng hardcode rải rác)
- Tên: Thuê Xe Trung Hiếu · chủ xe Anh Hiếu.
- ĐT & Zalo: 0326120108 (tel:0326120108 / https://zalo.me/0326120108).
- Địa chỉ: Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang.
- Google Maps (nút Chỉ đường): https://maps.app.goo.gl/ptcb9NfjbUnhGPRb7
- Toạ độ ghim: 10.534045, 105.16464

YÊU CẦU
1. Map design tokens trong README vào tailwind.config (ink #0B0B0C, surface #FFF, bg #FAFAFA,
   muted #6B7280, hairline #E7E7E9, stage #0B0B0C, stage-ink #FAFAFA, stage-muted #9A9CA3,
   stage-hairline #1F2024, accent #2D5BFF) + bo góc 14/13/22. Cobalt DÙNG RẤT ÍT (chấm, sao,
   badge Uy tín, focus) — không làm nền mảng lớn. Không emoji, không gradient loè loẹt.
2. Mobile-first, container ~412px, padding ngang 22px, nhịp dọc ~52px. Vùng chạm ≥48px,
   CTA chính cao 52px. Giá tiền nổi bật bằng CỠ CHỮ, không bằng màu.
3. Tách component: Hero, ServiceTypes, CarCard/CarList, DriveOptions, Testimonials,
   PartnerSection, LocationSection, Footer, StickyContactBar, Car3DViewer, CarGallery,
   PriceTable, OwnerCard, ContactSheet.
4. Hai route: trang chủ và chi tiết xe (/xe/[slug]). Dữ liệu xe tách data/cars.ts
   (lấy từ reference/app/data.jsx: Vios/Innova/CX-5/Transit), dễ thay bằng CMS sau.
5. Car3DViewer: sân khấu tối, auto-rotate khi nhàn rỗi, gesture hint tự fade, nút AR
   (activateAR), trạng thái tải (poster+spinner), fallback ảnh thật khi lỗi. Để TODO thay .glb thật.
6. LocationSection: nhúng bản đồ bằng OpenStreetMap (KEYLESS, không bị chặn iframe — TUYỆT ĐỐI
   KHÔNG dùng maps.google.com/...output=embed vì trả ERR_BLOCKED_BY_RESPONSE):
   https://www.openstreetmap.org/export/embed.html?bbox=<minlon,minlat,maxlon,maxlat>&layer=mapnik&marker=10.534045,105.16464
   filter grayscale nhẹ + placeholder "Đang tải bản đồ…". Nút "Chỉ đường" và dòng địa chỉ ở footer
   mở BRAND.mapLink (Google Maps app). Có sẵn nhánh Maps Embed API (provider="google") nếu sau có key.
7. StickyContactBar kính mờ (backdrop-blur) ở cả 2 màn; ContactSheet trượt từ đáy hiện số ĐT với
   tel: và zalo.me. Cộng safe-area-inset-bottom. Ráp bằng useContact().
8. ANIMATION — mỗi section một chuyển động "chữ ký", CHỈ transform/opacity (mượt trên máy yếu),
   MỌI animation có nhánh prefers-reduced-motion:
   - Reveal-on-scroll: fade + dịch (up/left/scale), IntersectionObserver + BẮT BUỘC fallback hiện
     nội dung sau ~1.3s (không để kẹt opacity 0). Reset scroll khi đổi route.
   - Hero: 3 dòng tiêu đề trồi lên so le; ảnh hero "thở" zoom rất chậm (scale 1→1.045, 16s alternate,
     bọc overflow:hidden); chấm cobalt nhịp khẽ.
   - ServiceTypes: hàng trượt vào từ trái so le. CarList: thẻ phóng nhẹ + hover nâng 3px.
   - Testimonials: MARQUEE trôi ngang liền mạch (mỗi card flex:0 0 300px + margin-right 14px,
     track 2 bản, translateX 0→-50% linear infinite ~52s), mask mờ 2 mép, hover/chạm thì dừng.
   - StickyBar trồi lên khi load. Detail: gallery/mô tả/giá/chủ xe reveal so le; 3D tự xoay khi nhàn rỗi.

A11y cơ bản (alt, aria-label nút icon, focus-visible), build sạch.
```

---

## Còn thiếu (chỉ chủ xe cung cấp được)
- **Ảnh xe thật** sắc nét (hero full-bleed + dải gallery mỗi xe).
- **File `.glb`** mô hình 3D từng xe (+ poster ảnh). Chưa có thì cứ để placeholder/model mẫu.
- Toạ độ đã chính xác; nếu muốn ô nhúng kiểu Google → tạo `NEXT_PUBLIC_GOOGLE_MAPS_KEY`.
