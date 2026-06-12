// ===== APP: routing, sticky bar, contact sheet =====

function StickyBar({ onCall, onZalo }) {
  return (
    <div className="stickybar">
      <button className="btn btn-primary" onClick={onCall}>
        <Icon name="phone" size={18} /> Gọi ngay
      </button>
      <button className="btn btn-ghost" onClick={onZalo} style={{ background: "rgba(255,255,255,.55)" }}>
        <Icon name="chat" size={18} /> Nhắn Zalo
      </button>
    </div>
  );
}

function ContactSheet({ sheet, onClose }) {
  if (!sheet) return null;
  const isCall = sheet === "call";
  return (
    <div onClick={onClose} style={{
      position: "absolute", inset: 0, zIndex: 80, background: "rgba(11,11,12,.4)",
      backdropFilter: "blur(2px)", display: "flex", alignItems: "flex-end",
      animation: "screenIn .25s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface)", width: "100%", borderRadius: "22px 22px 0 0",
        padding: "10px 22px calc(28px + env(safe-area-inset-bottom,0))",
        animation: "sheetUp .32s cubic-bezier(.16,1,.3,1)",
      }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: "var(--hairline)", margin: "0 auto 22px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, background: "var(--ink)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name={isCall ? "phone" : "chat"} size={24} />
          </div>
          <div>
            <div className="muted" style={{ fontSize: 13.5, fontWeight: 500 }}>
              {isCall ? "Gọi cho nhà xe" : "Nhắn Zalo cho nhà xe"}
            </div>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 2 }}>
              {BRAND.phone}
            </div>
          </div>
        </div>
        <a href={isCall ? `tel:${BRAND.phoneRaw}` : `https://zalo.me/${BRAND.zalo}`}
          target="_blank" rel="noreferrer"
          className="btn btn-primary" style={{ marginTop: 22, textDecoration: "none" }}>
          <Icon name={isCall ? "phone" : "chat"} size={19} />
          {isCall ? "Gọi ngay" : "Mở Zalo"}
        </a>
        <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={onClose}>Đóng</button>
      </div>
      <style>{`@keyframes sheetUp{from{transform:translateY(100%);}to{transform:none;}}`}</style>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState("home");      // 'home' | 'detail'
  const [car, setCar] = useState(null);
  const [sheet, setSheet] = useState(null);          // null | 'call' | 'zalo'
  const scrollRef = useRef(null);
  const [scrollEl, setScrollEl] = useState(null);

  useEffect(() => { setScrollEl(scrollRef.current); }, []);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
  }, [screen, car]);

  const openCar = (c) => { setCar(c); setScreen("detail"); };
  const onCall = () => setSheet("call");
  const onZalo = () => setSheet("zalo");

  return (
    <div className="phone">
      <ScrollContext.Provider value={scrollEl}>
        <div className="scroll" ref={scrollRef}>
          {screen === "home"
            ? <HomeScreen onOpen={openCar} onCall={onCall} onZalo={onZalo} />
            : <DetailScreen car={car} onBack={() => setScreen("home")} onCall={onCall} onZalo={onZalo} />}
        </div>
      </ScrollContext.Provider>
      <StickyBar onCall={onCall} onZalo={onZalo} />
      <ContactSheet sheet={sheet} onClose={() => setSheet(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
