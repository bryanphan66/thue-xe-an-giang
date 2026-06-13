import type { Car, Testimonial } from "@/types/db";

/** Dữ liệu mẫu (lấy từ design handoff). Dùng khi chưa cấu hình Supabase. */

export const fixtureCars: Car[] = [
  {
    slug: "vios",
    name: "Toyota Vios",
    type: "Sedan · 4 chỗ",
    seats: 4,
    priceDriver: "1.200.000",
    priceSelf: "700.000",
    description:
      "Xe gầm thấp êm ái, tiết kiệm — phù hợp đi khám bệnh, đưa đón trong thành phố và đường gần.",
    badge: "Phổ biến nhất",
    photoCount: 5,
  },
  {
    slug: "innova",
    name: "Toyota Innova",
    type: "MPV · 7 chỗ",
    seats: 7,
    priceDriver: "1.500.000",
    priceSelf: "900.000",
    description:
      "Rộng rãi cho gia đình, khoang hành lý lớn — lựa chọn tốt cho đi du lịch và về quê.",
    badge: null,
    photoCount: 6,
  },
  {
    slug: "cx5",
    name: "Mazda CX-5",
    type: "SUV · 5 chỗ",
    seats: 5,
    priceDriver: "1.600.000",
    priceSelf: "1.000.000",
    description:
      "Gầm cao, ngoại hình sang — hay được chọn làm xe hoa, rước dâu và đi sự kiện.",
    badge: "Xe cưới",
    photoCount: 5,
  },
  {
    slug: "transit",
    name: "Ford Transit",
    type: "Van · 16 chỗ",
    seats: 16,
    priceDriver: "2.200.000",
    priceSelf: null,
    description:
      "Sức chứa lớn cho đoàn đông người — du lịch tập thể, đưa đón sự kiện, đi xa cả nhóm.",
    badge: null,
    photoCount: 4,
  },
];

// KHÔNG dùng review giả. Để trống — chỉ hiện ĐÁNH GIÁ THẬT (Google/khách) sau khi thu thập được.
export const fixtureTestimonials: Testimonial[] = [];
