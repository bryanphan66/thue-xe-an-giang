// Tự đăng bài Facebook — nội dung do AI (Groq) tạo, biến hoá mỗi lần để tránh trùng.
// Đọc xe/giá từ Supabase → Groq soạn bài (fallback mẫu tĩnh nếu lỗi) → POST /{page}/feed.
// DRY_RUN=1 chỉ in, không đăng.
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL, SUPABASE_ANON_KEY,
  FB_PAGE_ID, FB_PAGE_TOKEN,
  GROQ_API_KEY, DRY_RUN,
} = process.env;

const PHONE = "0326 120 108";
const SITE = "https://thuexeangiang.autocontent.click";
const vnd = (n) => Number(n).toLocaleString("vi-VN");

const THEMES = [
  "đám cưới · rước dâu (xe đẹp, tài xế lịch sự)",
  "đi du lịch An Giang / Châu Đốc / miền Tây",
  "đưa đón đi khám bệnh, hợp người lớn tuổi",
  "đi xa, về quê, công chuyện gấp",
  "tự lái — chủ động giờ giấc, giao xe tận nhà",
  "gia đình đi chơi cuối tuần",
  "ra sân bay đúng giờ, không lo trễ chuyến",
  "giới thiệu chung đội xe + giá tốt",
];

async function getFleet() {
  const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { data } = await sb.from("cars").select("name,seats,price_with_driver,price_self_drive").eq("available", true);
  const bySeat = new Map();
  for (const c of data ?? []) {
    const s = c.seats || 0;
    const cur = bySeat.get(s);
    if (!cur || (c.price_with_driver ?? Infinity) < (cur.price_with_driver ?? Infinity)) bySeat.set(s, c);
  }
  return [...bySeat.entries()].sort((a, b) => a[0] - b[0]).map(([seats, c]) => ({
    seats,
    driver: c.price_with_driver ? vnd(c.price_with_driver) : null,
    self: c.price_self_drive ? vnd(c.price_self_drive) : null,
  }));
}

function priceLines(fleet) {
  return fleet.map((g) => {
    const d = g.driver ? `tài xế ${g.driver}đ` : null;
    const s = g.self ? `tự lái ${g.self}đ` : null;
    return `🚙 ${g.seats} chỗ — ${[d, s].filter(Boolean).join(" · ")}/ngày`;
  }).join("\n");
}

// Bài mẫu tĩnh (fallback khi Groq lỗi)
function staticPost(fleet) {
  return [
    "🚗 THUÊ XE AN GIANG — BẢNG GIÁ THEO SỐ CHỖ",
    "",
    priceLines(fleet),
    "",
    "✅ Có tài xế hoặc tự lái",
    "✅ Đám cưới · du lịch · khám bệnh · ra sân bay · đi xa",
    "✅ Xe đời mới, sạch sẽ, đúng giờ — giao xe tận nhà",
    "",
    `📞 Gọi / Zalo: ${PHONE}`,
    `🌐 Xem xe & đặt nhanh: ${SITE}`,
  ].join("\n");
}

async function aiPost(fleet) {
  if (!GROQ_API_KEY) return null;
  const hour = (new Date().getUTCHours() + 7) % 24; // giờ Việt Nam
  const buoi = hour < 11 ? "buổi sáng" : hour < 15 ? "buổi trưa" : "buổi chiều/tối";
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];

  const system =
    "Bạn viết nội dung Facebook cho một nhà xe cho thuê ô tô ở vùng quê An Giang. " +
    "Văn mộc mạc, thân thiện, gần gũi bà con; ngắn gọn ~6-10 dòng; emoji vừa phải. " +
    "TUYỆT ĐỐI không bịa thông tin ngoài dữ liệu được cho. Phải có giá đúng như dữ liệu, " +
    "số điện thoại và website. Tránh giật tít kiểu 'BREAKING/SỐC/HOT', không bọc bài trong dấu ngoặc kép. " +
    "Chỉ trả về nội dung bài đăng, không giải thích.";
  const user =
    `Tên nhà xe: Dịch vụ cho thuê xe Thạnh Mỹ Tây - An Giang\n` +
    `Bảng giá (đ/ngày, dùng đúng số này):\n${priceLines(fleet)}\n` +
    `Có cả tự lái và có tài xế. Phục vụ: khám bệnh, đám cưới-rước dâu, du lịch, sân bay, đi xa.\n` +
    `Điện thoại/Zalo: ${PHONE}\nWebsite: ${SITE}\n\n` +
    `Hãy viết MỘT bài Facebook ${buoi}, nhấn vào chủ đề: "${theme}". ` +
    `Mỗi lần viết phải KHÁC nhau (mở đầu, cách diễn đạt). Có giá, có lời kêu gọi gọi/Zalo, có website.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1.05,
        max_tokens: 500,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    const d = await res.json();
    const text = d?.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    return null;
  }
}

const fleet = await getFleet();
let message = (await aiPost(fleet)) || staticPost(fleet);
message = message.replace(/^["'“”‘’]+/, "").replace(/["'“”‘’]+$/, "").trim();
// đảm bảo luôn có SĐT + website (phòng AI quên)
if (!message.includes(PHONE)) message += `\n\n📞 Gọi / Zalo: ${PHONE}`;
if (!message.includes("thuexeangiang")) message += `\n🌐 ${SITE}`;

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
