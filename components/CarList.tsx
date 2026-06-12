import { getTranslations } from "next-intl/server";
import { getCars } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import CarCard from "@/components/CarCard";

export default async function CarList() {
  const t = await getTranslations("cars");
  const cars = await getCars();

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
        </Reveal>
        <Reveal delay={50}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <h2 className="h2">{t("title")}</h2>
            <span className="muted mono" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
              {t("count", { count: cars.length })}
            </span>
          </div>
        </Reveal>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {cars.map((car, i) => (
            <Reveal key={car.slug} delay={i * 50} variant="scale">
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
