// Tự đăng bài "bảng giá theo số chỗ" lên Facebook Page.
// Đọc xe từ Supabase → soạn bài → POST /{page}/feed. DRY_RUN=1 chỉ in, không đăng.
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  FB_PAGE_ID,
  FB_PAGE_TOKEN,
  DRY_RUN,
} = process.env;

const PHONE = "0326 120 108";
const SITE = "https://thuexeangiang.autocontent.click";
const vnd = (n) => Number(n).toLocaleString("vi-VN");

async function buildMessage() {
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { data: cars } = await sb
    .from("cars")
    .select("name,seats,price_with_driver,price_self_drive,badge")
    .eq("available", true);
  const list = cars ?? [];

  // gom theo số chỗ, lấy giá thấp nhất mỗi loại
  const bySeat = new Map();
  for (const c of list) {
    const s = c.seats || 0;
    const cur = bySeat.get(s);
    const d = c.price_with_driver ?? Infinity;
    if (!cur || d < (cur.price_with_driver ?? Infinity)) bySeat.set(s, c);
  }
  const groups = [...bySeat.entries()].sort((a, b) => a[0] - b[0]);

  const lines = ["🚗 THUÊ XE AN GIANG — BẢNG GIÁ THEO SỐ CHỖ", ""];
  for (const [seats, c] of groups) {
    const driver = c.price_with_driver ? `tài xế ${vnd(c.price_with_driver)}đ` : null;
    const self = c.price_self_drive ? `tự lái ${vnd(c.price_self_drive)}đ` : null;
    const price = [driver, self].filter(Boolean).join(" · ") || "liên hệ";
    lines.push(`🚙 ${seats} chỗ — ${price}/ngày`);
  }
  lines.push(
    "",
    "✅ Có tài xế hoặc tự lái",
    "✅ Đám cưới · du lịch · khám bệnh · ra sân bay · đi xa",
    "✅ Xe đời mới, sạch sẽ, đúng giờ — giao xe tận nhà",
    "",
    `📞 Gọi / Zalo: ${PHONE}`,
    `🌐 Xem xe & đặt nhanh: ${SITE}`,
  );
  return lines.join("\n");
}

const message = await buildMessage();

if (DRY_RUN) {
  console.log("----- DRY RUN (không đăng) -----\n" + message);
  process.exit(0);
}

const res = await fetch(`https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, access_token: FB_PAGE_TOKEN }),
});
const out = await res.json();
if (out.error) {
  console.error("FB error:", out.error.message);
  process.exit(1);
}
console.log("Đã đăng FB, post id:", out.id);
