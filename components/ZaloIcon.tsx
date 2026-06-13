/** Logo Zalo (chữ "Zalo" trắng trên nền xanh bo góc) — dùng cho nút Nhắn Zalo. */
export default function ZaloIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="11" fill="#0068FF" />
      <text
        x="24"
        y="32"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="19"
        fill="#ffffff"
      >
        Zalo
      </text>
    </svg>
  );
}
