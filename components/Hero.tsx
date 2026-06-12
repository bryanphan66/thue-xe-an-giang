"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/config/brand";
import { useContactActions } from "@/components/ContactProvider";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import Photo from "@/components/Photo";

export default function Hero() {
  const t = useTranslations("hero");
  const ta = useTranslations("actions");
  const { call, zalo } = useContactActions();
  const lines = [t("line1"), t("line2"), t("line3")];

  return (
    <section
      className="mv-stage"
      style={{
        background: "var(--stage)",
        color: "var(--stage-ink)",
        paddingTop: 56,
        paddingBottom: 38,
      }}
    >
      <div className="container">
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
            <span
              className="dot-pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: 99,
                background: "var(--accent)",
                display: "inline-block",
              }}
            />
            <Eyebrow dark>{BRAND.tagline}</Eyebrow>
          </div>
        </Reveal>
        <h1 className="display" style={{ color: "var(--stage-ink)" }}>
          {lines.map((ln, i) => (
            <Reveal
              key={i}
              as="span"
              variant="up-lg"
              delay={80 + i * 95}
              style={{ display: "block" }}
            >
              {ln}
            </Reveal>
          ))}
        </h1>
        <Reveal delay={130}>
          <p className="lead" style={{ color: "var(--stage-muted)", marginTop: 20, maxWidth: 320 }}>
            {t("lead")}
          </p>
        </Reveal>
      </div>

      <Reveal delay={180} variant="scale">
        <div className="container" style={{ marginTop: 30 }}>
          <div style={{ overflow: "hidden", borderRadius: 16 }}>
            <Photo className="hero-photo" label={t("photoLabel")} ratio="16 / 10" dark radius={16} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={230}>
        <div
          className="container"
          style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <button className="btn btn-on-dark" onClick={call}>
            <Phone size={19} /> {ta("callNow")} · {BRAND.phone}
          </button>
          <button className="btn btn-ghost-on-dark" onClick={zalo}>
            <MessageCircle size={19} /> {ta("messageZalo")}
          </button>
        </div>
      </Reveal>
    </section>
  );
}
