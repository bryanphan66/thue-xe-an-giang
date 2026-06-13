// Quản lý Page (best-effort): cập nhật thông tin Page qua Graph API + đăng & ghim bài giới thiệu.
// LƯU Ý: Facebook hạn chế sửa nhiều field Page qua API → script báo rõ field nào OK/lỗi.
//   Cần Page token có scope: pages_manage_metadata (+ pages_manage_posts để đăng/ghim).
// Chạy:  node scripts/fb-page.mjs            (làm thật)
//        DRY_RUN=1 node scripts/fb-page.mjs  (chỉ in, không gọi API)
import { createClient } from "@supabase/supabase-js";

const {
  SUPABASE_URL, SUPABASE_ANON_KEY,
  FB_PAGE_ID, FB_PAGE_TOKEN, DRY_RUN,
} = process.env;

const PHONE = "0326 120 108";
const SITE = "https://thuexeangiang.autocontent.click";
const EMAIL = "bryanphan66@gmail.com";
const ADDRESS = "Khu dân cư kênh 10, ấp Bờ Dâu, xã Thạnh Mỹ Tây, Tỉnh An Giang";
const vnd = (n) => Number(n).toLocaleString("vi-VN");
const G = "https://graph.facebook.com/v21.0";

if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
  console.error("Thiếu FB_PAGE_ID / FB_PAGE_TOKEN trong env (.env.local).");
  process.exit(1);
}

// --- Bảng giá theo số chỗ (để chèn vào bài giới thiệu) ---
async function getFleet() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
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
  if (!fleet.length) return "🚙 Xe 5 · 7 · 8 chỗ — gọi để báo giá tốt nhất";
  return fleet.map((g) => {
    const d = g.driver ? `tài xế ${g.driver}đ` : null;
    const s = g.self ? `tự lái ${g.self}đ` : null;
    return `🚙 ${g.seats} chỗ — ${[d, s].filter(Boolean).join(" · ")}/ngày`;
  }).join("\n");
}

// --- 1) Thông tin Page muốn cập nhật (best-effort qua API) ---
const ABOUT =
  "Cho thuê xe 5 và 8 chỗ tại Thạnh Mỹ Tây, An Giang — tự lái hoặc có tài xế, giao xe tận nhà. " +
  `Đám cưới · du lịch · đưa đón khám bệnh · ra sân bay · đi xa. ☎ ${PHONE}`;
const DESCRIPTION =
  "Dịch vụ cho thuê xe Thạnh Mỹ Tây - An Giang (chủ xe: Anh Trung).\n\n" +
  "🚗 Đội xe đời mới 5 và 8 chỗ, sạch sẽ, máy lạnh mát.\n" +
  "🧑‍✈️ Linh hoạt: tự lái (chủ động giờ giấc) hoặc có tài xế quen đường miền Tây.\n" +
  "🏠 Giao xe tận nhà trong khu vực.\n" +
  "🎯 Phục vụ: rước dâu - đám cưới, du lịch An Giang/Châu Đốc, đưa đón đi khám bệnh (hợp người lớn tuổi), ra sân bay đúng giờ, về quê - đi xa.\n" +
  "💰 Giá rõ ràng theo số chỗ; đi xa báo giá khi gọi.\n\n" +
  `📞 Gọi/Zalo: ${PHONE}\n🌐 Web: ${SITE}\n📍 ${ADDRESS}`;

const FIELDS = {
  about: ABOUT,                 // giới thiệu ngắn
  description: DESCRIPTION,     // mô tả chi tiết
  phone: PHONE,
  website: SITE,
  emails: JSON.stringify([EMAIL]),
  general_info: `Giao xe tận nhà · Tự lái hoặc có tài xế · Khu vực: An Giang, Châu Đốc, Long Xuyên và lân cận. Liên hệ ${PHONE}.`,
};

async function updateFields() {
  const results = [];
  for (const [field, value] of Object.entries(FIELDS)) {
    if (DRY_RUN) { results.push([field, "DRY_RUN (không gọi)"]); continue; }
    try {
      const body = new URLSearchParams({ [field]: value, access_token: FB_PAGE_TOKEN });
      const r = await fetch(`${G}/${FB_PAGE_ID}`, { method: "POST", body });
      const d = await r.json();
      results.push([field, d.error ? `LỖI: ${d.error.message}` : "OK"]);
    } catch (e) {
      results.push([field, `LỖI: ${e.message}`]);
    }
  }
  return results;
}

// --- 2) Đăng + ghim bài giới thiệu (cách chắc ăn để "thông tin nổi bật") ---
function introPost(fleet) {
  return [
    "📌 DỊCH VỤ CHO THUÊ XE — THẠNH MỸ TÂY, AN GIANG",
    "",
    "Xe đời mới 5 và 8 chỗ, sạch sẽ, máy lạnh mát. Tự lái hoặc có tài xế — giao xe tận nhà.",
    "",
    "BẢNG GIÁ THEO SỐ CHỖ:",
    priceLines(fleet),
    "",
    "✅ Rước dâu - đám cưới",
    "✅ Du lịch An Giang · Châu Đốc · miền Tây",
    "✅ Đưa đón đi khám bệnh (hợp người lớn tuổi)",
    "✅ Ra sân bay đúng giờ · về quê · đi xa",
    "",
    `📞 Gọi / Zalo: ${PHONE}`,
    `🌐 Xem xe & đặt nhanh: ${SITE}`,
    `📍 ${ADDRESS}`,
  ].join("\n");
}

async function postAndPin(message) {
  if (DRY_RUN) { console.log("\n----- BÀI GIỚI THIỆU (DRY RUN) -----\n" + message); return; }
  const r = await fetch(`${G}/${FB_PAGE_ID}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: FB_PAGE_TOKEN }),
  });
  const d = await r.json();
  if (d.error) { console.error("Đăng bài LỖI:", d.error.message); return; }
  console.log("Đã đăng bài giới thiệu, id:", d.id);
  // Ghim bài
  const pr = await fetch(`${G}/${d.id}`, {
    method: "POST",
    body: new URLSearchParams({ is_pinned: "true", access_token: FB_PAGE_TOKEN }),
  });
  const pd = await pr.json();
  console.log(pd.error ? `Ghim LỖI: ${pd.error.message}` : "Đã ghim bài lên đầu Page");
}

// --- Run ---
const fleet = await getFleet();
console.log("=== Cập nhật thông tin Page (best-effort) ===");
for (const [f, s] of await updateFields()) console.log(`  ${f.padEnd(13)} → ${s}`);
await postAndPin(introPost(fleet));
console.log("\nXong. Field nào báo LỖI thì sửa tay trong Meta Business Suite (xem docs).");
