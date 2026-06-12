import { UserRound, KeyRound, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

export default function DriveOptions() {
  const t = useTranslations("drive");
  const opts: { Icon: LucideIcon; title: string; body: string }[] = [
    { Icon: UserRound, title: t("driverTitle"), body: t("driverBody") },
    { Icon: KeyRound, title: t("selfTitle"), body: t("selfBody") },
  ];

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
        <div style={{ marginTop: 22 }}>
          {opts.map((o, i) => (
            <Reveal key={i} delay={i * 60} variant="left">
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "20px 0",
                  borderTop: "1px solid var(--hairline)",
                  borderBottom: i === opts.length - 1 ? "1px solid var(--hairline)" : "none",
                }}
              >
                <o.Icon size={26} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.025em" }}>
                    {o.title}
                  </div>
                  <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.55, marginTop: 6 }}>
                    {o.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
