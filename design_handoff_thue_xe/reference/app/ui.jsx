// ===== Shared UI primitives =====
const { useState, useEffect, useRef, useContext, createContext } = React;

const ScrollContext = createContext(null);

function Reveal({ children, className = "", delay = 0, variant = "up", style = {}, as: Tag = "div" }) {
  const root = useContext(ScrollContext);
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setShown(true); io.unobserve(el); }
      }),
      { root: root || null, threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    const fallback = setTimeout(() => setShown(true), 1300);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [root]);
  const HIDDEN = {
    up: "translateY(16px)",
    "up-lg": "translateY(34px)",
    mask: "translateY(110%)",
    left: "translateX(-26px)",
    right: "translateX(26px)",
    scale: "translateY(14px) scale(.95)",
  };
  return (
    <Tag ref={ref} className={"reveal " + (shown ? "in " : "") + className}
      style={{ transitionDelay: delay + "ms", "--rv-hidden": HIDDEN[variant] || HIDDEN.up, ...style }}>
      {children}
    </Tag>
  );
}

// Striped placeholder where a real photo should be dropped in
function Photo({ label, ratio = "4 / 3", dark = false, radius = 14, className = "", style = {} }) {
  return (
    <div className={"imgph " + (dark ? "dark " : "") + className}
      style={{ aspectRatio: ratio, borderRadius: radius, ...style }}>
      <span className="lbl">{label}</span>
    </div>
  );
}

// Small stars row (line icon, ink colored)
function Stars({ n = 5, size = 13, color = "var(--ink)" }) {
  return (
    <div style={{ display: "flex", gap: 3, color }}>
      {Array.from({ length: n }).map((_, i) => (
        <Icon key={i} name="star" size={size} stroke={0} style={{ fill: color }} />
      ))}
    </div>
  );
}

function Eyebrow({ children, dark = false, style = {} }) {
  return <div className={"eyebrow" + (dark ? " on-dark" : "")} style={style}>{children}</div>;
}

Object.assign(window, { ScrollContext, Reveal, Photo, Stars, Eyebrow });
