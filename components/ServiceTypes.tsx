import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { SERVICE_TYPES } from "@/lib/services";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

export default function ServiceTypes() {
  const t = useTranslations("services");

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
      </div>
      <div className="container" style={{ marginTop: 22, borderTop: "1px solid var(--hairline)" }}>
        {SERVICE_TYPES.map(({ key, Icon }, i) => (
          <Reveal
            as="div"
            key={key}
            variant="left"
            delay={i * 70}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "18px 0",
              borderBottom: "1px solid var(--hairline)",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                flexShrink: 0,
                borderRadius: 12,
                border: "1px solid var(--hairline)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink)",
              }}
            >
              <Icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17.5, fontWeight: 700, letterSpacing: "-0.02em" }}>
                {t(`${key}.label`)}
              </div>
              <div className="muted" style={{ fontSize: 14.5, marginTop: 2 }}>
                {t(`${key}.sub`)}
              </div>
            </div>
            <ArrowRight size={19} className="muted" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
