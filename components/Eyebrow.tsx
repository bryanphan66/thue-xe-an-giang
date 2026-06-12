import type { CSSProperties, ReactNode } from "react";

/** Eyebrow — nhãn nhỏ in hoa phía trên tiêu đề. */
export default function Eyebrow({
  children,
  dark = false,
  style,
}: {
  children: ReactNode;
  dark?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={"eyebrow" + (dark ? " on-dark" : "")} style={style}>
      {children}
    </div>
  );
}
