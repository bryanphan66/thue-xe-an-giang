import type { CSSProperties } from "react";

/**
 * Photo — placeholder kẻ sọc nơi sẽ thả ảnh thật vào sau.
 * Server-safe (không state/effect). Dùng class `.imgph` (+ `.dark`).
 */
type PhotoProps = {
  label: string;
  ratio?: string;
  dark?: boolean;
  radius?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Photo({
  label,
  ratio = "4 / 3",
  dark = false,
  radius = 14,
  className = "",
  style,
}: PhotoProps) {
  return (
    <div
      className={"imgph " + (dark ? "dark " : "") + className}
      style={{ aspectRatio: ratio, borderRadius: radius, ...style }}
    >
      <span className="lbl">{label}</span>
    </div>
  );
}
