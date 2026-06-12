// ===== HOME SCREEN =====

function Hero({ onCall, onZalo }) {
  return (
    <section className="mv-stage" style={{ background: "var(--stage)", color: "var(--stage-ink)", paddingTop: 56, paddingBottom: 38 }}>
      <div className="container">
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
            <span className="dot-pulse" style={{ width: 7, height: 7, borderRadius: 99, background: "var(--accent)", display: "inline-block" }} />
            <Eyebrow dark>{BRAND.tagline}</Eyebrow>
          </div>
        </Reveal>
        <h1 className="display" style={{ color: "var(--stage-ink)" }}>
          {["Đi xa thật dễ.", "Chỉ một", "cuộc gọi."].map((ln, i) => (
            <Reveal key={i} as="span" variant="up-lg" delay={80 + i * 95} style={{ display: "block" }}>{ln}</Reveal>
          ))}
        </h1>
        <Reveal delay={130}>
          <p className="lead" style={{ color: "var(--stage-muted)", marginTop: 20, maxWidth: 320 }}>
            Cho thuê xe có tài xế hoặc tự lái — đi khám bệnh, đám cưới, du lịch hay việc gấp. Sạch sẽ, đúng giờ, đáng tin.
          </p>
        </Reveal>
      </div>

      <Reveal delay={180} variant="scale">
        <div className="container" style={{ marginTop: 30 }}>
          <div style={{ overflow: "hidden", borderRadius: 16 }}>
            <Photo className="hero-photo" label="Ảnh xe full-bleed · 16:10" ratio="16 / 10" dark radius={16} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={230}>
        <div className="container" style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <button className="btn btn-on-dark" onClick={onCall}>
            <Icon name="phone" size={19} /> Gọi ngay · {BRAND.phone}
          </button>
          <button className="btn btn-ghost-on-dark" onClick={onZalo}>
            <Icon name="chat" size={19} /> Nhắn Zalo
          </button>
        </div>
      </Reveal>
    </section>
  );
}

function ServiceTypes() {
  return (
    <section className="section">
      <div className="container">
        <Reveal><Eyebrow>Dịch vụ</Eyebrow></Reveal>
        <Reveal delay={50}><h2 className="h2" style={{ marginTop: 12 }}>Bạn cần đi đâu?</h2></Reveal>
      </div>
      <div className="container" style={{ marginTop: 22, borderTop: "1px solid var(--hairline)" }}>
        {SERVICES.map((s, i) => (
          <Reveal as="div" key={i} variant="left" delay={i * 70} style={{
            display: "flex", alignItems: "center", gap: 16, padding: "18px 0",
            borderBottom: "1px solid var(--hairline)",
          }}>
            <div style={{
              width: 46, height: 46, flexShrink: 0, borderRadius: 12, border: "1px solid var(--hairline)",
              display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
            }}>
              <Icon name={s.icon} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17.5, fontWeight: 700, letterSpacing: "-0.02em" }}>{s.label}</div>
              <div className="muted" style={{ fontSize: 14.5, marginTop: 2 }}>{s.sub}</div>
            </div>
            <Icon name="arrowRight" size={19} className="muted" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CarCard({ car, onOpen, onCall }) {
  return (
    <div className="card car-card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative" }}>
        <Photo label={`Ảnh xe · ${car.name}`} ratio="16 / 10" radius={0} />
        {car.accent && (
          <span style={{
            position: "absolute", top: 12, left: 12, fontSize: 11.5, fontWeight: 600,
            letterSpacing: ".02em", padding: "6px 11px", borderRadius: 99,
            background: "rgba(11,11,12,.88)", color: "#fff", backdropFilter: "blur(4px)",
          }}>{car.accent}</span>
        )}
      </div>
      <div style={{ padding: "18px 18px 18px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.035em" }}>{car.name}</h3>
        </div>
        <div className="muted linkrow" style={{ fontSize: 14.5, marginTop: 6 }}>
          <span className="linkrow" style={{ gap: 6 }}><Icon name="users" size={16} /> {car.seats} chỗ</span>
          <span style={{ color: "var(--hairline)" }}>·</span>
          <span>{car.type.split("·")[0].trim()}</span>
        </div>

        <div style={{ display: "flex", gap: 0, marginTop: 16, borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ flex: 1, padding: "13px 0" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>Có tài xế</div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>
              {car.driver}<span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> đ/ngày</span>
            </div>
          </div>
          <div style={{ width: 1, background: "var(--hairline)" }} />
          <div style={{ flex: 1, padding: "13px 0 13px 16px" }}>
            <div className="muted" style={{ fontSize: 12.5, fontWeight: 500 }}>Tự lái</div>
            <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 3 }}>
              {car.self ? <>{car.self}<span className="muted" style={{ fontSize: 13, fontWeight: 500 }}> đ/ngày</span></>
                : <span className="muted" style={{ fontSize: 15, fontWeight: 600 }}>Liên hệ</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onOpen(car)}>
            Xem chi tiết <Icon name="arrowRight" size={17} />
          </button>
          <button className="btn btn-primary btn-sm" style={{ width: 52, padding: 0, flexShrink: 0 }} onClick={onCall} aria-label="Gọi ngay">
            <Icon name="phone" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CarList({ onOpen, onCall }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal><Eyebrow>Đội xe</Eyebrow></Reveal>
        <Reveal delay={50}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 12 }}>
            <h2 className="h2">Xe của chúng tôi</h2>
            <span className="muted mono" style={{ fontSize: 13, whiteSpace: "nowrap" }}>{CARS.length} xe</span>
          </div>
        </Reveal>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {CARS.map((car, i) => (
            <Reveal key={car.id} delay={i * 50} variant="scale">
              <CarCard car={car} onOpen={onOpen} onCall={onCall} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DriveOptions() {
  const opts = [
    { icon: "steering", title: "Có tài xế", body: "Bác tài quen đường, đón tận nơi. Bạn chỉ việc lên xe — phù hợp người lớn tuổi, đi khám bệnh, sự kiện." },
    { icon: "keyRound", title: "Tự lái", body: "Tự cầm lái, chủ động giờ giấc. Thủ tục gọn nhẹ, xe giao tận nhà — phù hợp đi gần và du lịch ngắn ngày." },
  ];
  return (
    <section className="section">
      <div className="container">
        <Reveal><Eyebrow>Lựa chọn</Eyebrow></Reveal>
        <Reveal delay={50}><h2 className="h2" style={{ marginTop: 12 }}>Tự lái hay có tài xế?</h2></Reveal>
        <div style={{ marginTop: 22 }}>
          {opts.map((o, i) => (
            <Reveal key={i} delay={i * 60} variant="left">
              <div style={{
                display: "flex", gap: 16, padding: "20px 0",
                borderTop: "1px solid var(--hairline)",
                borderBottom: i === opts.length - 1 ? "1px solid var(--hairline)" : "none",
              }}>
                <Icon name={o.icon} size={26} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.025em" }}>{o.title}</div>
                  <p className="muted" style={{ fontSize: 15.5, lineHeight: 1.55, marginTop: 6 }}>{o.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [...TESTIMONIALS, ...TESTIMONIALS];
  return (
    <section className="section">
      <div className="container">
        <Reveal><Eyebrow>Khách nói gì</Eyebrow></Reveal>
        <Reveal delay={50}><h2 className="h2" style={{ marginTop: 12 }}>Bà con tin tưởng</h2></Reveal>
      </div>
      <Reveal delay={90} variant="scale">
        <div className="marquee" style={{ marginTop: 24 }}>
          <div className="marquee-track">
            {items.map((t, i) => (
              <div key={i} className="card tcard" style={{ padding: "20px 18px" }} aria-hidden={i >= TESTIMONIALS.length}>
                <Stars n={t.stars} color="var(--accent)" />
                <p className="body" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.5, letterSpacing: "-0.015em" }}>
                  “{t.quote}”
                </p>
                <div className="muted" style={{ fontSize: 14, marginTop: 14, fontWeight: 500 }}>
                  — {t.name}, {t.place}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div style={{
            border: "1px solid var(--hairline)", borderRadius: 16, padding: "26px 22px",
            background: "var(--surface)",
          }}>
            <Eyebrow>Đối tác</Eyebrow>
            <h2 className="h2" style={{ marginTop: 12, fontSize: 24 }}>Bạn có xe muốn cho thuê?</h2>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>
              Để xe nhàn rỗi sinh lời. Chúng tôi lo khách, lịch và hợp đồng — bạn nhận thu nhập hàng tháng.
            </p>
            <button className="btn btn-ghost" style={{ marginTop: 18 }}>
              Trở thành đối tác <Icon name="arrowUpRight" size={18} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="section">
      <div className="container">
        <Reveal><Eyebrow>Vị trí</Eyebrow></Reveal>
        <Reveal delay={50}><h2 className="h2" style={{ marginTop: 12 }}>Ghé nhà xe</h2></Reveal>
        <Reveal delay={90}>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, marginTop: 10 }}>{BRAND.address}</p>
        </Reveal>
        <Reveal delay={120} variant="scale">
          <div style={{ marginTop: 18, borderRadius: 16, overflow: "hidden", border: "1px solid var(--hairline)", position: "relative" }}>
            <div className="imgph" style={{ position: "absolute", inset: 0, borderRadius: 0 }}>
              <span className="lbl">Đang tải bản đồ…</span>
            </div>
            <iframe
              title="Bản đồ nhà xe Trung Hiếu"
              src={BRAND.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ position: "relative", width: "100%", height: 210, border: 0, display: "block", filter: "grayscale(.15) contrast(1.02)" }}
            ></iframe>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <a href={BRAND.mapLink} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ marginTop: 14 }}>
            <Icon name="navigation" size={18} /> Chỉ đường tới nhà xe
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer({ onCall, onZalo }) {
  return (
    <footer style={{ background: "var(--stage)", color: "var(--stage-ink)", marginTop: 56, paddingTop: 44, paddingBottom: 130 }}>
      <div className="container">
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}>{BRAND.name}</div>
        <div style={{ marginTop: 4 }}><Eyebrow dark>{BRAND.tagline}</Eyebrow></div>

        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { icon: "mapPin", label: BRAND.address, action: () => window.open(BRAND.mapLink, "_blank") },
            { icon: "phone", label: BRAND.phone, action: onCall },
            { icon: "chat", label: "Zalo · " + BRAND.zalo, action: onZalo },
            { icon: "facebook", label: BRAND.facebook, action: null },
          ].map((r, i) => (
            <div key={i} onClick={r.action || undefined}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "15px 0",
                borderTop: "1px solid var(--stage-hairline)", cursor: r.action ? "pointer" : "default",
                borderBottom: i === 3 ? "1px solid var(--stage-hairline)" : "none",
              }}>
              <Icon name={r.icon} size={20} style={{ color: "var(--stage-muted)", flexShrink: 0 }} />
              <span style={{ fontSize: 15.5, flex: 1 }}>{r.label}</span>
              {r.action && <Icon name="arrowUpRight" size={17} style={{ color: "var(--stage-muted)" }} />}
            </div>
          ))}
        </div>

        <a href={BRAND.mapLink} target="_blank" rel="noreferrer" className="btn btn-ghost-on-dark" style={{ marginTop: 22 }}>
          <Icon name="navigation" size={18} /> Chỉ đường tới nhà xe
        </a>

        <div className="muted mono" style={{ fontSize: 11.5, marginTop: 28, color: "var(--stage-muted)" }}>
          © 2026 {BRAND.name}
        </div>
      </div>
    </footer>
  );
}

function HomeScreen({ onOpen, onCall, onZalo }) {
  return (
    <div className="screen">
      <Hero onCall={onCall} onZalo={onZalo} />
      <ServiceTypes />
      <CarList onOpen={onOpen} onCall={onCall} />
      <DriveOptions />
      <Testimonials />
      <PartnerSection />
      <LocationSection />
      <Footer onCall={onCall} onZalo={onZalo} />
    </div>
  );
}

Object.assign(window, { HomeScreen });
