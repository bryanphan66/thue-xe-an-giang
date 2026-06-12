import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  // Ưu tiên tiếng Việt: KHÔNG dò Accept-Language của trình duyệt.
  // Truy cập "/" luôn chuyển về "/vi" (khách là bà con vùng quê).
  localeDetection: false,
});
