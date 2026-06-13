"use client";

import { Phone, Headset } from "lucide-react";

/**
 * StickyContactBar — thanh liên hệ kính mờ cố định đáy, căn giữa cột .page.
 * 2 lối: "Để nhà xe gọi lại" (mở form đặt nhanh) + "Liên hệ tư vấn ngay" (Gọi/Zalo).
 */
export function StickyContactBar({
  onBook,
  onContact,
}: {
  onBook: () => void;
  onContact: () => void;
}) {
  return (
    <div className="stickybar">
      <button
        type="button"
        className="btn btn-primary"
        style={{ fontSize: 13.5, gap: 6, padding: "0 8px", whiteSpace: "nowrap" }}
        onClick={onBook}
      >
        <Phone size={16} /> Để nhà xe gọi lại
      </button>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ fontSize: 13.5, gap: 6, padding: "0 8px", whiteSpace: "nowrap", background: "rgba(255,255,255,.55)" }}
        onClick={onContact}
      >
        <Headset size={16} /> Liên hệ tư vấn ngay
      </button>
    </div>
  );
}
