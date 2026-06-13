// Sinh ảnh OG (1200×630) cho mạng xã hội: ảnh xe thật + bảng thương hiệu.
// Chạy: node scripts/make-og.mjs [ảnh nguồn] [file ra]
import { renderPoster } from "./poster.mjs";

const CAR = process.argv[2] || "public/cars/innova.jpg";
const OUT = process.argv[3] || "public/og.jpg";

await renderPoster({
  photoPath: CAR,
  template: "split",
  eyebrow: "Cho thuê xe · An Giang",
  headline: "Dịch vụ cho thuê xe",
  headline2: "Thạnh Mỹ Tây – An Giang",
  lines: [
    "Xe 5 & 8 chỗ · Tự lái hoặc có tài xế",
    "Giao xe tận nhà · Đám cưới · Du lịch · Đi xa",
  ],
  phone: "0326 120 108",
  site: "thuexeangiang.autocontent.click",
  accent: "#D9A441",
  out: OUT,
});
console.log("Đã tạo", OUT);
