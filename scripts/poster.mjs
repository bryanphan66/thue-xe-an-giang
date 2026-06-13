// Render ảnh poster (1200×630) = ẢNH XE THẬT + chữ thương hiệu, KHÔNG dùng AI vẽ ảnh.
// Dùng chung cho OG image và ảnh đính kèm bài Facebook. Render HTML bằng Playwright (chuẩn
// tiếng Việt) → sharp tối ưu. Trả về Buffer jpeg, hoặc ghi ra file nếu có `out`.
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import sharp from "sharp";

export const ACCENTS = ["#D9A441", "#3B5BDB", "#2F9E44", "#E8590C", "#C2255C"];

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const br = (s = "") => esc(s).replace(/\n/g, "<br>");

const FONT = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">`;

const BASE = `*{margin:0;padding:0;box-sizing:border-box}html,body{width:1200px;height:630px}
body{font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#0B0B0C;color:#fff;overflow:hidden}`;

// Layout 1: ảnh trái + bảng phải
function splitHtml({ imgUri, eyebrow, headline, headline2, lines, phone, site, accent }) {
  const linesHtml = lines.map((l) => `<div class="line">${esc(l)}</div>`).join("");
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">${FONT}<style>${BASE}
  body{display:flex}
  .photo{width:648px;height:630px;position:relative}
  .photo img{width:100%;height:100%;object-fit:cover}
  .photo::after{content:"";position:absolute;inset:0;box-shadow:inset -60px 0 60px -20px #0B0B0C}
  .panel{flex:1;padding:56px 52px;display:flex;flex-direction:column;justify-content:center;gap:16px}
  .eyebrow{font-size:17px;font-weight:700;letter-spacing:.2em;color:${accent};text-transform:uppercase}
  .title{font-size:46px;font-weight:800;line-height:1.05;letter-spacing:-.01em}
  .title .g{color:${accent}}
  .rule{width:60px;height:4px;background:${accent};border-radius:3px;margin:4px 0}
  .line{font-size:21px;font-weight:500;color:#dcdcde;line-height:1.4}
  .phone{font-size:40px;font-weight:800;margin-top:6px}
  .site{font-size:20px;font-weight:600;color:#9aa0a6}
  </style></head><body>
  <div class="photo"><img src="${imgUri}" alt=""></div>
  <div class="panel">
    <div class="eyebrow">${esc(eyebrow)}</div>
    <div class="title">${br(headline)}${headline2 ? `<br><span class="g">${esc(headline2)}</span>` : ""}</div>
    <div class="rule"></div>
    ${linesHtml}
    <div class="phone">📞 ${esc(phone)}</div>
    <div class="site">🌐 ${esc(site)}</div>
  </div></body></html>`;
}

// Layout 2: ảnh tràn viền + dải tối dưới
function bannerHtml({ imgUri, eyebrow, headline, lines, phone, site, accent }) {
  const linesHtml = lines.map((l) => `<span class="line">${esc(l)}</span>`).join('<span class="dot">·</span>');
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8">${FONT}<style>${BASE}
  .wrap{position:relative;width:1200px;height:630px}
  .wrap img{width:100%;height:100%;object-fit:cover}
  .scrim{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,12,.15) 0%,rgba(11,11,12,.2) 42%,rgba(11,11,12,.92) 100%)}
  .content{position:absolute;left:0;right:0;bottom:0;padding:44px 56px;display:flex;flex-direction:column;gap:12px}
  .eyebrow{font-size:17px;font-weight:700;letter-spacing:.2em;color:${accent};text-transform:uppercase}
  .title{font-size:50px;font-weight:800;line-height:1.05;letter-spacing:-.01em;text-shadow:0 2px 12px rgba(0,0,0,.5)}
  .lines{font-size:21px;font-weight:600;color:#eaeaec;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .dot{color:${accent}}
  .bottom{display:flex;align-items:center;gap:24px;margin-top:6px}
  .phone{font-size:36px;font-weight:800}
  .site{font-size:19px;font-weight:600;color:#c8ccd1}
  </style></head><body>
  <div class="wrap"><img src="${imgUri}" alt=""><div class="scrim"></div>
    <div class="content">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <div class="title">${br(headline)}</div>
      <div class="lines">${linesHtml}</div>
      <div class="bottom"><div class="phone">📞 ${esc(phone)}</div><div class="site">🌐 ${esc(site)}</div></div>
    </div></div></body></html>`;
}

export async function renderPoster(opts) {
  const {
    photoPath, template = "split", eyebrow = "", headline = "", headline2 = "",
    lines = [], phone = "", site = "", accent = ACCENTS[0], out,
  } = opts;
  const imgUri = "data:image/jpeg;base64," + readFileSync(photoPath).toString("base64");
  const params = { imgUri, eyebrow, headline, headline2, lines, phone, site, accent };
  const html = template === "banner" ? bannerHtml(params) : splitHtml(params);

  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: "png" });
    const img = sharp(png).resize(1200, 630).jpeg({ quality: 86, mozjpeg: true });
    if (out) { await img.toFile(out); return out; }
    return await img.toBuffer();
  } finally {
    await browser.close();
  }
}
