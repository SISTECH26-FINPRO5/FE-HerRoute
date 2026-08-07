import { useState, useRef, useEffect } from "react";
import { Map, FileWarning, Users, Phone, MapPin, AlertTriangle } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";
import { SOSButton } from "../components/SOSButton";
import { TrustedContactsPage } from "../trusted-contacts/page";
import { QuickCallPage } from "../quick-call/page";
import { AnonymousReportPage } from "../anonymous-report/page";
import SosPopup from "../pop-up-sos/page";
import { CallPopup } from "../quick-call/call";
import logo from "@/imports/logo.png";
import alarmSound from "@/imports/alarm.mp3";

type Modal = "none" | "contacts" | "quickcall" | "report" | "sos" | "calling110";

export function DashboardPage({ onLogout, onGoToMap }: { onLogout: () => void; onGoToMap: () => void }) {
  const [modal, setModal] = useState<Modal>("none");
  const [activeNav, setActiveNav] = useState("Homepage");

  // Ref buat nyimpen instance audio alarm
  const alarmAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Inisialisasi audio sekali aja saat komponen mount
    alarmAudioRef.current = new Audio(alarmSound);
    alarmAudioRef.current.loop = true; // bunyi berulang selama SOS aktif, hapus kalau nggak mau loop

    return () => {
      // Cleanup saat komponen unmount
      alarmAudioRef.current?.pause();
      alarmAudioRef.current = null;
    };
  }, []);

  const playAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.currentTime = 0;
      alarmAudioRef.current.play().catch((err) => {
        console.error("Gagal memutar alarm:", err);
      });
    }
  };

  const stopAlarm = () => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
  };

  const closeModal = () => {
    setModal("none");
    stopAlarm(); // hentikan alarm saat modal ditutup
  };

  const navItems = ["Homepage", "Map", "Report", "Contact"];

  const features = [
    {
      icon: <Map size={22} style={{ color: "#F7DDEB" }} />,
      title: "Safe Route",
      desc: "Bandingkan rute berdasarkan tingkat resiko",
      onClick: onGoToMap,
    },
    {
      icon: <AlertTriangle size={22} style={{ color: "#F7DDEB" }} />,
      title: "Risk Prediction",
      desc: "Tingkat risiko di rute pilihanmu",
      onClick: () => { },
    },
    {
      icon: <MapPin size={22} style={{ color: "#F7DDEB" }} />,
      title: "Safe Place",
      desc: "Pos polisi, Toko 24 jam, RS terdekat",
      onClick: onGoToMap,
    },
    {
      icon: <Phone size={22} style={{ color: "#F7DDEB" }} />,
      title: "Quick Call",
      desc: "Hubungi bantuan dalam satu ketukan",
      onClick: () => setModal("quickcall"),
    },
    {
      icon: <FileWarning size={22} style={{ color: "#F7DDEB" }} />,
      title: "Anonymous Report",
      desc: "Laporkan pelecehan secara anonim",
      onClick: () => setModal("report"),
    },
    {
      icon: <Users size={22} style={{ color: "#F7DDEB" }} />,
      title: "Trusted Contacts",
      desc: "Kelola kontak darurat yang diberi tahu",
      onClick: () => setModal("contacts"),
    },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: "#1A0F18" }}>

      {/* ── Navbar ── */}
      <nav className="navbar fixed top-0 z-50 w-full flex items-center px-[120px] py-4 shadow-sm bg-transparent backdrop-blur-md">        <div className="flex items-center gap-[17px]">
        <img src={logo} alt="HerRoute logo" className="w-[50px] h-[50px] rounded-full object-cover shrink-0" />
        <div className="flex flex-col">
          <span className="font-semibold text-[16px] leading-[19px]" style={{ color: "#FCF8FA" }}>HerRoute</span>
          <span className="text-[12px] leading-[15px]" style={{ color: "#F7DDEB" }}>Perlindungan &amp; Rute Aman</span>
        </div>
      </div>

        <div className="flex items-center gap-[56px] mx-auto">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                if (item === "Map") {
                  onGoToMap();
                } else if (item === "Report") {
                  setModal("report");
                  setActiveNav(item);
                } else if (item === "Contact") {
                  setModal("contacts");
                  setActiveNav(item);
                } else {
                  setActiveNav(item);
                }
              }}
              className="font-semibold text-[20px] leading-[24px] pb-[5px] transition-all hover:opacity-80"
              style={{
                color: "#F9EBF3",
                borderBottom: activeNav === item ? "3px solid #FA1190" : "3px solid transparent",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative group">
          <button
            className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold text-[16px] shrink-0 hover:opacity-80 transition-opacity"
            style={{ background: "#FA1190", color: "#FCF8FA" }}
          >
            JD
          </button>
          <div
            className="absolute right-0 top-[58px] hidden group-hover:flex flex-col rounded-[10px] overflow-hidden z-40 min-w-[140px]"
            style={{ background: "#2A0017", border: "1px solid rgba(247,221,235,0.2)" }}
          >
            <button
              onClick={onLogout}
              className="px-[16px] py-[12px] text-[14px] text-left hover:bg-[#75003F] transition-colors"
              style={{ color: "#F7DDEB" }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Welcome banner ── */}
      <div className="px-[120px] pt-[120px] flex flex-col gap-[12px]">
        <h1 className="font-semibold text-[28px] leading-[34px]" style={{ color: "#FCF8FA" }}>
          Selamat Datang, Jane Doe
        </h1>
        <div className="flex items-center gap-[10px]">
          <div className="w-[10px] h-[10px] rounded-full" style={{ background: "#4ADE80" }} />
          <span className="text-[14px] leading-[17px]" style={{ color: "#F7DDEB" }}>
            Lokasi aktif · berbagi otomatis ke kontak tepercaya saat darurat
          </span>
        </div>
      </div>

      {/* ── SOS Button ── */}
      <div className="flex flex-col items-center justify-center mt-[48px]">
        {/* Bunyikan alarm sekaligus buka modal SOS */}
        <SOSButton
          onActivate={() => {
            setModal("sos");
            playAlarm();
          }}
        />
      </div>

      {/* ── Feature Cards ── */}
      <div className="px-[80px] mt-[56px] pb-[80px]">
        <p className="font-semibold text-[20px] leading-[24px] mb-[24px]" style={{ color: "#F7DDEB" }}>
          Fitur Keamanan
        </p>
        <div className="grid grid-cols-3 gap-[20px]">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "contacts" && <TrustedContactsPage onClose={closeModal} />}
      {modal === "quickcall" && <QuickCallPage onClose={closeModal} />}
      {modal === "report" && <AnonymousReportPage onClose={closeModal} />}
      {modal === "sos" && <SosPopup onClose={closeModal} onCall={() => { stopAlarm(); setModal("calling110"); }} />}
      {modal === "calling110" && <CallPopup onClose={closeModal} />}
    </div>
  );
}