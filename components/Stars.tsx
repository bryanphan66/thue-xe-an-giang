import { Star } from "lucide-react";

/** Stars — hàng sao Lucide tô đặc, mặc định màu accent (cobalt). */
export default function Stars({
  n = 5,
  size = 13,
  className = "text-accent",
}: {
  n?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div className={"flex gap-[3px] " + className}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} fill="currentColor" stroke="none" />
      ))}
    </div>
  );
}
