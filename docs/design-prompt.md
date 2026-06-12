# Prompt thiết kế UI — Thuê Xe Quê (Modern Mobility, 2026)

Copy toàn bộ khối dưới đây dán vào Claude Design.

---

Thiết kế giao diện web **mobile-first, tiếng Việt, phong cách hiện đại 2026** cho một dịch vụ **cho thuê xe (có tài xế hoặc tự lái)** phục vụ đi khám bệnh, đám cưới – rước dâu, đi du lịch, đi xa/việc gấp. Đây là trang giới thiệu để khách **xem xe rồi bấm GỌI hoặc NHẮN ZALO**.

## Đối tượng & triết lý (RẤT QUAN TRỌNG)
- Người dùng **không rành công nghệ, có người lớn tuổi** — NHƯNG họ **không quê mùa**. Thiết kế phải **hiện đại, tinh tế, đáng tin như một thương hiệu mobility/ô tô cao cấp**, KHÔNG "tờ rơi", KHÔNG dân dã.
- "Dễ dùng" đến từ **bố cục rõ ràng, chữ lớn, tương phản tốt, ít lựa chọn, vùng chạm to** — KHÔNG từ màu sắc.
- **Tránh:** màu sặc sỡ/nhiều màu, emoji làm icon, gradient lòe loẹt, bo góc bong bóng, hoạ tiết rườm rà, cảm giác "miền quê".
- **Hướng tới:** tối giản cao cấp (quiet luxury), trung tính, nhiều khoảng trắng, ảnh/3D xe làm nhân vật chính, typography grotesk mạnh, **gần như đơn sắc + một màu nhấn rất tiết chế**, chuyển động vi tế. Tinh thần như trang của một hãng xe điện / dịch vụ di chuyển hiện đại.

## Bảng màu (đơn sắc hiện đại — dùng đúng tone)
- Nền sáng chính: `#FAFAFA` · bề mặt thẻ: `#FFFFFF`.
- Mực (chữ chính & nút chính): gần đen `#0B0B0C`.
- Chữ phụ / chú thích: xám trung tính `#6B7280`.
- Viền mảnh: `#E7E7E9`.
- **"Sân khấu" tối** (dùng cho hero / khu 3D / footer để tạo chiều sâu, sang): nền `#0B0B0C`, chữ `#FAFAFA`, viền `#1F2024`.
- **Màu nhấn duy nhất, dùng rất ít** (chỉ cho trạng thái active, link, chấm chỉ báo, focus): xanh cobalt `#2D5BFF`. KHÔNG dùng làm nền mảng lớn.
- Bóng: rất nhẹ, mềm, khuếch tán; ưu tiên dùng viền hairline thay bóng.

## Typography
- **Một họ chữ grotesk hiện đại, có hỗ trợ tiếng Việt đầy đủ** (vd **Be Vietnam Pro**), khai thác **độ tương phản weight**: tiêu đề rất đậm (700–800), thân chữ 400–500.
- Tiêu đề lớn, **letter-spacing hơi âm (tight)**, sắc nét, hiện đại. KHÔNG dùng serif (tránh cảm giác cổ điển/editorial).
- Body ≥17px, dòng thoáng, dễ đọc cho người lớn tuổi.

## Iconography
- **Không emoji.** Dùng **icon line mảnh đơn sắc** (vd Lucide), nét đồng nhất, kế thừa màu mực. Dùng tiết chế.

## Nút & tương tác
- Vùng chạm cao **≥ 48px** (CTA chính ~52–56px), bo góc **12–14px** (hiện đại, không bong bóng), padding rộng.
- **CTA chính "Gọi ngay":** nền **mực đen đặc**, chữ trắng, icon Phone line. Sạch, mạnh, tương phản cao.
- **CTA phụ "Nhắn Zalo":** kiểu **outline/ghost** — viền mảnh mực, chữ mực, nền trong suốt.
- **Thanh liên hệ sticky đáy màn hình:** **kính mờ (frosted glass / backdrop blur)** trên nền sáng, viền trên hairline, chứa cặp nút Gọi/Zalo. Thanh lịch, hiện đại.
- Trạng thái focus/hover dùng màu nhấn cobalt rất nhẹ.

## Chuyển động (motion) — tinh tế
- Reveal nhẹ khi cuộn (fade + dịch nhỏ). Xe 3D **tự xoay chậm khi nhàn rỗi**. Chuyển trang/ảnh mượt. Không hiệu ứng giật, không loè loẹt.

## ⭐ Trình xem xe 3D (điểm nhấn hiện đại)
- Trên **trang chi tiết xe**, phần hero là **trình xem mô hình 3D của chiếc xe trên một "sân khấu" nền tối**, người dùng **vuốt để xoay 360°, chụm để zoom**, có nút **"Xem trong sân nhà bạn" (AR)** trên điện thoại hỗ trợ.
- Xe tự xoay chậm khi chưa chạm; có gợi ý cử chỉ ("Vuốt để xoay") mờ dần.
- Phía dưới 3D vẫn có **dải ảnh thật của xe** (để khách thấy đúng xe thực tế) — 3D để xem tổng thể, ảnh thật để tạo niềm tin.
- Thiết kế cả **trạng thái đang tải** (poster ảnh + skeleton) cho mạng yếu.
- Trên **trang chủ**, ở khối hero có thể đặt một preview 3D nhỏ hoặc ảnh xe full-bleed chất lượng cao (chọn phương án nào đẹp & nhẹ hơn).

## MÀN HÌNH 1 — TRANG CHỦ (mobile)
1. **Hero (nền tối sân khấu hoặc sáng tối giản)**: eyebrow nhỏ in HOA giãn chữ ("DỊCH VỤ CHO THUÊ XE"), **tiêu đề grotesk rất lớn, đậm** (vd "Đi xa thật dễ. Chỉ một cuộc gọi."), 1 câu phụ ngắn. Cặp **CTA Gọi ngay (đặc) / Nhắn Zalo (ghost)**. Ảnh xe full-bleed hoặc preview 3D ấn tượng.
2. **Loại dịch vụ**: lưới mục **icon line** + nhãn: Đi khám bệnh · Đám cưới – Rước dâu · Đi du lịch · Đi xa / việc gấp. Tối giản, viền hairline, không thẻ màu.
3. **Xe của chúng tôi**: thẻ xe hiện đại — **ảnh xe lớn sắc nét**, tên xe (grotesk đậm), số chỗ (icon Users), giá có tài xế/ngày & giá tự lái/ngày (số nổi bật bằng cỡ chữ, không bằng màu), nút "Xem chi tiết" (ghost + mũi tên) và nút gọi nhanh. Thiết kế cho được nhiều xe.
4. **Tự lái hay có tài xế?**: hai mục giải thích ngắn, bố cục sạch, phân tách bằng hairline.
5. **Khách nói gì**: trích dẫn đánh giá tối giản, sao dạng icon line nhỏ (màu mực hoặc cobalt rất nhẹ), tên người ("— Cô Bảy, xã Mỹ Hoà").
6. **Bạn có xe muốn cho thuê?**: dải kêu gọi đối tác tinh tế + 1 nút dẫn sang trang đối tác.
7. **Footer (nền tối)**: tên chủ xe, địa chỉ, SĐT (bấm gọi), Zalo, Facebook, link Chỉ đường. Tối giản, hàng lối rõ. Chừa khoảng trống đáy cho thanh sticky.

## MÀN HÌNH 2 — CHI TIẾT XE (mobile)
1. **Trình xem 3D xe trên sân khấu tối** (xoay 360°, zoom, nút AR "Xem trong sân nhà bạn"), có trạng thái tải.
2. Tên xe (grotesk lớn) + loại xe & số chỗ.
3. **Dải ảnh thật của xe** (vuốt ngang, có thumbnail), điều hướng bằng icon Chevron line.
4. Mô tả ngắn.
5. **Bảng giá rõ ràng, hiện đại**: "Giá có tài xế — … đ / ngày" và "Giá tự lái — … đ / ngày", phân tách hairline, số tiền nổi bật; ghi chú nhỏ màu phụ (đi về trong ngày, phụ phí đi xa…).
6. **Thẻ chủ xe**: ảnh tròn + tên + 1 dòng tin cậy ("Chủ xe — anh Tư").
7. Cặp **CTA Gọi ngay / Nhắn Zalo** cuối nội dung (ngoài thanh sticky).

## Yêu cầu kỹ thuật giao diện (để dễ chuyển sang code Tailwind + Next.js)
- Mobile-first; container giới hạn bề ngang, padding hai bên thoáng; nhịp dọc giữa khối rộng.
- Dùng đúng token màu ở trên; đặt tên nhất quán (ink / surface / muted / hairline / stage-dark / accent).
- Vùng chạm ≥ 48px; tương phản đạt chuẩn dễ đọc.
- Trình xem 3D: thiết kế để nhúng bằng `<model-viewer>` (.glb) — có poster ảnh, lazy-load, fallback sang ảnh thật khi mạng yếu/không hỗ trợ.
- Tách component rõ: Hero, ServiceTypes, CarCard/CarList, DriveOptions, Testimonials, PartnerSection, Footer, StickyContactBar, Car3DViewer, CarGallery, PriceTable.

Xuất giao diện cho **cả 2 màn hình (Trang chủ + Chi tiết xe)** ở khổ mobile, kèm **bảng màu (hex), ghi chú typography/spacing, và bố cục trình xem 3D**. Tinh thần: **hiện đại, tối giản, cao cấp, đáng tin — không màu mè, không emoji, không quê mùa.**
