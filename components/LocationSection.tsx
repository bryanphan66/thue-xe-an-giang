import { Navigation } from "lucide-react";
import { useTranslations } from "next-intl";
import { BRAND } from "@/config/brand";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

const { lat, lng } = BRAND;
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.012},${lat - 0.008},${lng + 0.012},${lat + 0.008}&layer=mapnik&marker=${lat},${lng}`;

export default function LocationSection() {
  const t = useTranslations("location");
  const ta = useTranslations("actions");

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal delay={50}>
          <h2 className="h2" style={{ marginTop: 12 }}>
            {t("title")}
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>
            {BRAND.address}
          </p>
        </Reveal>
        <Reveal delay={120} variant="scale">
          <div
            style={{
              marginTop: 18,
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid var(--hairline)",
              position: "relative",
            }}
          >
            <div className="imgph" style={{ position: "absolute", inset: 0, borderRadius: 0 }}>
              <span className="lbl">{t("loading")}</span>
            </div>
            <iframe
              title={`${t("title")} · ${BRAND.name}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                position: "relative",
                width: "100%",
                height: 210,
                border: 0,
                display: "block",
                filter: "grayscale(.15) contrast(1.02)",
              }}
            />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <a
            href={BRAND.mapLink}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ marginTop: 14 }}
          >
            <Navigation size={18} /> {ta("directions")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
