// Tự đăng bài Facebook dạng ẢNH: ảnh xe thật + tiêu đề do AI (Groq) biến hoá mỗi lần → đa dạng,
// không trùng. Giá/SĐT/tên xe lấy từ dữ liệu (KHÔNG để AI bịa). Đăng /photos; lỗi thì fallback /feed.
// DRY_RUN=1 chỉ render ảnh + in caption, KHÔNG đăng.
import { readdirSync, writeFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { renderPoster, ACCENTS } from "./poster.mjs";

const {
  SUPABASE_URL, SUPABASE_ANON_KEY,
  FB_PAGE_ID, FB_PAGE_TOKEN,
  GROQ_API_KEY, DRY_RUN,
} = process.env;

const PHONE = "0326 120 108";
const SITE = "https://thuexeangiang.autocontent.click";
const SITE_HOST = "thuexeangiang.autocontent.click";
const G = "https://graph.facebook.com/v21.0";
const vnd = (n) => Number(n).toLocaleString("vi-VN");
const pick = (a) => a[Math.floor(Math.random() * a.length)];

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

const STATIC_HEADLINES = [
  "Xe đẹp, tài xế vui — đi là mê",
  "Giao xe tận nhà, gọi là có",
  "Rước dâu xe sang, trọn ngày vui",
  "Về quê đón Tết, đặt xe sớm nha",
  "Đi xa yên tâm, giá quê dễ chịu",
  "Cả nhà đi chơi, xe rộng mát lạnh",
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

// Cho caption (text bài)
function priceLines(fleet) {
  return fleet.map((g) => {
    const d = g.driver ? `tài xế ${g.driver}đ` : null;
    const s = g.self ? `tự lái ${g.self}đ` : null;
    return `🚙 ${g.seats} chỗ — ${[d, s].filter(Boolean).join(" · ")}/ngày`;
  }).join("\n");
}
// Cho ẢNH (ngắn gọn, không emoji)
function priceLinesShort(fleet) {
  return fleet.map((g) => {
    const d = g.driver ? `tài xế ${g.driver}` : null;
    const s = g.self ? `tự lái ${g.self}` : null;
    return `${g.seats} chỗ · ${[d, s].filter(Boolean).join(" · ")}`;
  });
}

function staticPost(fleet) {
  return [
    "🚗 THUÊ XE AN GIANG — BẢNG GIÁ THEO SỐ CHỖ", "",
    priceLines(fleet), "",
    "✅ Có tài xế hoặc tự lái",
    "✅ Đám cưới · du lịch · khám bệnh · ra sân bay · đi xa",
    "✅ Xe đời mới, sạch sẽ, đúng giờ — giao xe tận nhà", "",
    `📞 Gọi / Zalo: ${PHONE}`,
    `🌐 Xem xe & đặt nhanh: ${SITE}`,
  ].join("\n");
}

// Groq trả JSON {caption, headline}. headline ngắn để ghép lên ảnh.
async function aiContent(fleet) {
  const fallback = { caption: staticPost(fleet), headline: pick(STATIC_HEADLINES) };
  if (!GROQ_API_KEY) return fallback;
  const hour = (new Date().getUTCHours() + 7) % 24;
  const buoi = hour < 11 ? "buổi sáng" : hour < 15 ? "buổi trưa" : "buổi chiều/tối";
  const theme = pick(THEMES);

  const system =
    "Bạn viết nội dung Facebook cho nhà xe cho thuê ô tô ở vùng quê An Giang. Văn mộc mạc, thân thiện. " +
    "TUYỆT ĐỐI không bịa thông tin/giá ngoài dữ liệu. Tránh giật tít 'SỐC/HOT'. " +
    'Chỉ trả về JSON đúng dạng: {"caption": string, "headline": string}. ' +
    "caption: bài đăng ~6-10 dòng, có giá đúng, số điện thoại và website, emoji vừa phải. " +
    "headline: MỘT câu tiêu đề thật NGẮN (tối đa 8 chữ) để in lên ảnh, KHÔNG chứa số/giá, không dấu ngoặc kép.";
  const user =
    `Tên nhà xe: Dịch vụ cho thuê xe Thạnh Mỹ Tây - An Giang\n` +
    `Bảng giá (đ/ngày, dùng đúng số này):\n${priceLines(fleet)}\n` +
    `Có cả tự lái và có tài xế. Phục vụ: khám bệnh, đám cưới-rước dâu, du lịch, sân bay, đi xa.\n` +
    `Điện thoại/Zalo: ${PHONE}\nWebsite: ${SITE}\n\n` +
    `Viết bài ${buoi}, nhấn chủ đề: "${theme}". Mỗi lần phải KHÁC nhau.`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 1.05, max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
    });
    const d = await res.json();
    const obj = JSON.parse(d?.choices?.[0]?.message?.content ?? "{}");
    let caption = (obj.caption || "").trim();
    let headline = (obj.headline || "").trim().replace(/^["'“”]+|["'“”]+$/g, "");
    if (!caption) return fallback;
    if (!headline || headline.length > 42) headline = pick(STATIC_HEADLINES); // giữ ảnh gọn
    return { caption, headline };
  } catch {
    return fallback;
  }
}

function pickPhoto() {
  let files = [];
  try {
    files = readdirSync("public/cars").filter((f) => /\.(jpe?g|png)$/i.test(f) && f !== "storefront.jpg");
  } catch { /* ignore */ }
  if (!files.length) files = ["innova.jpg"];
  return "public/cars/" + pick(files);
}

async function postPhoto(caption, buffer) {
  const fd = new FormData();
  fd.append("caption", caption);
  fd.append("access_token", FB_PAGE_TOKEN);
  fd.append("source", new Blob([buffer], { type: "image/jpeg" }), "poster.jpg");
  const r = await fetch(`${G}/${FB_PAGE_ID}/photos`, { method: "POST", body: fd });
  return r.json();
}
async function postText(message) {
  const r = await fetch(`${G}/${FB_PAGE_ID}/feed`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: FB_PAGE_TOKEN }),
  });
  return r.json();
}

// ---- Run ----
const fleet = await getFleet();
const { caption, headline } = await aiContent(fleet);

let message = caption.replace(/^["'“”‘’]+/, "").replace(/["'“”‘’]+$/, "").trim();
if (!message.includes(PHONE)) message += `\n\n📞 Gọi / Zalo: ${PHONE}`;
if (!message.includes("thuexeangiang")) message += `\n🌐 ${SITE}`;

// Render ảnh (best-effort)
let buffer = null;
try {
  buffer = await renderPoster({
    photoPath: pickPhoto(),
    template: Math.random() < 0.5 ? "split" : "banner",
    eyebrow: "Thuê xe · An Giang",
    headline,
    lines: priceLinesShort(fleet),
    phone: PHONE, site: SITE_HOST,
    accent: pick(ACCENTS),
  });
} catch (e) {
  console.error("Render ảnh lỗi (sẽ đăng bài chữ):", e.message);
}

if (DRY_RUN) {
  console.log("----- DRY RUN -----\nHEADLINE:", headline, "\n\nCAPTION:\n" + message);
  if (buffer) { writeFileSync("fb-post-preview.jpg", buffer); console.log("\nĐã lưu ảnh xem trước: fb-post-preview.jpg"); }
  else console.log("\n(Không render được ảnh)");
  process.exit(0);
}

let out;
if (buffer) {
  out = await postPhoto(message, buffer);
  if (out.error) { console.error("Đăng ảnh lỗi, fallback bài chữ:", out.error.message); out = await postText(message); }
} else {
  out = await postText(message);
}
if (out.error) { console.error("FB error:", out.error.message); process.exit(1); }
console.log("Đã đăng FB:", out.post_id || out.id);
