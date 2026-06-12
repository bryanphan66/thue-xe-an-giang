"use client";

import { MapPin, Phone, MessageCircle, Globe, Navigation, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/config/brand";
import { useContactActions } from "@/components/ContactProvider";
import Eyebrow from "@/components/Eyebrow";

export default function Footer() {
  const t = useTranslations("footer");
  const ta = useTranslations("actions");
  const { call, zalo } = useContactActions();

  const rows: { Icon: LucideIcon; label: string; action: (() => void) | null }[] = [
    { Icon: MapPin, label: BRAND.address, action: () => window.open(BRAND.mapLink, "_blank") },
    { Icon: Phone, label: BRAND.phone, action: call },
    { Icon: MessageCircle, label: "Zalo · " + BRAND.zalo, action: zalo },
    { Icon: Globe, label: BRAND.facebook, action: null },
  ];

  return (
    <footer
      style={{
        background: "var(--stage)",
        color: "var(--stage-ink)",
        marginTop: 56,
        paddingTop: 44,
        paddingBottom: 130,
      }}
    >
      <div className="container">
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}>{BRAND.name}</div>
        <div style={{ marginTop: 4 }}>
          <Eyebrow dark>{BRAND.tagline}</Eyebrow>
        </div>

        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 2 }}>
          {rows.map((r, i) => (
            <div
              key={i}
              onClick={r.action || undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 0",
                borderTop: "1px solid var(--stage-hairline)",
                cursor: r.action ? "pointer" : "default",
                borderBottom: i === rows.length - 1 ? "1px solid var(--stage-hairline)" : "none",
              }}
            >
              <r.Icon size={20} style={{ color: "var(--stage-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: 15.5, flex: 1 }}>{r.label}</span>
              {r.action && (
                <ArrowUpRight size={17} style={{ color: "var(--stage-muted)" }} />
              )}
            </div>
          ))}
        </div>

        <a
          href={BRAND.mapLink}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost-on-dark"
          style={{ marginTop: 22 }}
        >
          <Navigation size={18} /> {ta("directions")}
        </a>

        <div
          className="muted mono"
          style={{ fontSize: 11.5, marginTop: 28, color: "var(--stage-muted)" }}
        >
          {t("rights", { name: BRAND.name })}
        </div>
      </div>
    </footer>
  );
}
