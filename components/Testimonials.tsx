import { getTranslations } from "next-intl/server";
import { getTestimonials } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import Stars from "@/components/Stars";

export default async function Testimonials() {
  const t = await getTranslations("testimonials");
  const testimonials = await getTestimonials();
  const items = [...testimonials, ...testimonials];

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
      <Reveal delay={90} variant="scale">
        <div className="marquee" style={{ marginTop: 24 }}>
          <div className="marquee-track">
            {items.map((item, i) => (
              <div
                key={i}
                className="card tcard"
                style={{ padding: "20px 18px" }}
                aria-hidden={i >= testimonials.length}
              >
                <Stars n={item.stars} />
                <p
                  className="body"
                  style={{
                    marginTop: 12,
                    fontSize: 16,
                    lineHeight: 1.5,
                    letterSpacing: "-0.015em",
                  }}
                >
                  “{item.quote}”
                </p>
                <div className="muted" style={{ fontSize: 14, marginTop: 14, fontWeight: 500 }}>
                  — {item.name}, {item.place}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
