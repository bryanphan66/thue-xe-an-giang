import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";

export default function PartnerSection() {
  const t = useTranslations("partner");

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div
            style={{
              border: "1px solid var(--hairline)",
              borderRadius: 16,
              padding: "26px 22px",
              background: "var(--surface)",
            }}
          >
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12, fontSize: 24 }}>
              {t("title")}
            </h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>
              {t("body")}
            </p>
            <Link href="/cho-thue-xe" className="btn btn-ghost" style={{ marginTop: 18 }}>
              {t("cta")} <ArrowUpRight size={18} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
