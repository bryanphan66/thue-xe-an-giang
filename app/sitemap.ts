import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { routing } from "@/i18n/routing";
import { getCars } from "@/lib/data";

// Đọc Supabase lúc chạy (không phải lúc build) — nếu không sitemap rơi về
// fixtures cũ (vios/cx5/transit) vì build không có env Supabase. Xem BẪY #1.
export const dynamic = "force-dynamic";

/** Sitemap đa ngôn ngữ: trang chủ, đối tác và mọi xe — cho mỗi locale. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.siteUrl.replace(/\/$/, "");
  const cars = await getCars();

  const paths = [
    "",
    "/cho-thue-xe",
    ...cars.map((c) => `/xe/${c.slug}`),
  ];

  const lastModified = new Date();
  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
