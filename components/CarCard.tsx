"use client";

import { Users, ArrowRight, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Car } from "@/types/db";
import { useContactActions } from "@/components/ContactProvider";
import Photo from "@/components/Photo";

export default function CarCard({ car }: { car: Car }) {
  const t = useTranslations("cars");
  const ta = useTranslations("actions");
  const { call } = useContactActions();

  return (
    <div className="card car-card" style={{ overflow: "hidden" }} data-testid="car-card">
      <div style={{ position: "relative" }}>
        <Photo label={t("photoLabel", { name: car.name })} ratio="16 / 10" radius={0} />
        {car.badge && (
          <span
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              fontSize: 11.5,
              fontWeight: 600,
              letterSpacing: ".02em",
              padding: "6px 11px",
              borderRadius: 99,
              background: "rgba(11,11,12,.88)",
              color: "#fff",
              backdropFilter: "blur(4px)",
            }}
          >
            {car.badge}
          </span>
        )}
      </div>
      <div style={{ padding: "18px 18px 18px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.035em" }}>{car.name}</h3>
        </div>
        <div className="muted linkrow" style={{ fontSize: 14.5, marginTop: 6 }}>
          <span className="linkrow" style={{ gap: 6 }}>
            <Users size={16} /> {ta("seats", { count: car.seats })}
          </span>
          <span style={{ color: "var(--hairline)" }}>·</span>
          <span>{car.type.split("·")[0].trim()}</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 0,
            marginTop: 16,
            borderTop: "1px solid var(--hairline)",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div style={{ flex: 1, padding: "13px 0" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>
              {t("priceDriver")}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>
              {car.priceDriver}
              <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
                {" "}
                {ta("perDay")}
              </span>
            </div>
          </div>
          <div style={{ width: 1, background: "var(--hairline)" }} />
          <div style={{ flex: 1, padding: "13px 0 13px 16px" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>
              {t("priceSelf")}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>
              {car.priceSelf ? (
                <>
                  {car.priceSelf}
                  <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
                    {" "}
                    {ta("perDay")}
                  </span>
                </>
              ) : (
                <span className="muted" style={{ fontSize: 15, fontWeight: 600 }}>
                  {ta("contact")}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <Link
            href={`/xe/${car.slug}`}
            className="btn btn-ghost btn-sm"
            style={{ flex: 1 }}
            data-testid="car-detail-link"
          >
            {ta("viewDetail")} <ArrowRight size={17} />
          </Link>
          <button
            className="btn btn-primary btn-sm"
            style={{ width: 52, padding: 0, flexShrink: 0 }}
            onClick={call}
            aria-label={ta("callNow")}
          >
            <Phone size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
