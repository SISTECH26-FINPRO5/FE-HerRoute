import { useState } from "react";
import { Shield, FileWarning, Users, Eye, EyeOff, Route } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const loginFeatures = [
  {
    icon: <Shield size={20} style={{ color: "#F7DDEB" }} />,
    title: "Tombol SOS Darurat",
    desc: "Kirim lokasimu ke 3 kontak tepercaya secara instan",
  },
  {
    icon: <Route size={20} style={{ color: "#F7DDEB" }} />,
    title: "Rute Aman",
    desc: "Bandingkan rute berdasarkan tingkat risiko kejahatan",
  },
  {
    icon: <FileWarning size={20} style={{ color: "#F7DDEB" }} />,
    title: "Laporan Anonim",
    desc: "Laporkan pelecehan secara anonim dan aman",
  },
  {
    icon: <Users size={20} style={{ color: "#F7DDEB" }} />,
    title: "Kontak Tepercaya",
    desc: "Kelola kontak darurat yang selalu siap membantumu",
  },
];

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [tab, setTab]                   = useState<"login" | "register">("login");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [name, setName]                 = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#1A0F18" }}>

      {/* ── Left Panel ── */}
      <div className="login-panel-gradient hidden lg:flex flex-col justify-between px-[90px] py-[60px] w-[40%] min-h-screen shrink-0">

        {/* Logo + name */}
        <div className="flex items-center gap-[17px]">
          <div
            className="w-[80px] h-[80px] rounded-full flex items-center justify-center font-semibold text-[20px] shrink-0"
            style={{ background: "#FA1190", color: "#FCF8FA" }}
          >
            HR
          </div>
          <span className="font-semibold text-[28px] leading-[34px]" style={{ color: "#FCF8FA" }}>
            HerRoute
          </span>
        </div>

        {/* Tagline + features */}
        <div className="flex flex-col gap-[24px]">
          <h2 className="font-semibold text-[36px] leading-[44px]" style={{ color: "#FCF8FA" }}>
            Rute aman, panggilan darurat &amp; pelaporan anonim dalam satu genggaman.
          </h2>
          <p className="text-[20px] leading-[24px] font-normal" style={{ color: "#F7DDEB" }}>
            Dirancang agar kamu merasa aman dan tenang saat berjalan di malam hari.
          </p>

          <div className="flex flex-col gap-[28px] mt-[12px]">
            {loginFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-[24px]">
                <div
                  className="w-[60px] h-[60px] rounded-[25px] flex items-center justify-center shrink-0"
                  style={{ background: "rgba(250,17,144,0.5)" }}
                >
                  {f.icon}
                </div>
                <div className="flex flex-col gap-[4px] pt-[2px]">
                  <p className="font-semibold text-[18px] leading-[22px]" style={{ color: "#FCF8FA" }}>{f.title}</p>
                  <p className="text-[14px] leading-[17px]" style={{ color: "#F9EBF3" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div />
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="login-form-card w-full max-w-[788px] px-[70px] py-[70px] flex flex-col gap-[36px]">

          {/* Heading */}
          <h1 className="text-[36px] leading-[44px] font-normal text-center" style={{ color: "#FCF8FA" }}>
            Welcome to <span className="font-semibold" style={{ color: "#FA1190" }}>HerRoute</span>
          </h1>

          {/* Google login */}
          <button
            className="w-full h-[77px] rounded-[8px] flex items-center justify-center gap-[16px] font-normal text-[24px] hover:bg-gray-50 transition-colors"
            style={{ background: "#FFFFFF", color: "#2F2F2F", boxShadow: "0px 4px 15px rgba(0,0,0,0.11)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path fill="#FBBB00" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
              <path fill="#518EF8" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
              <path fill="#28B446" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/>
              <path fill="#F14336" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
            </svg>
            Login with Google
          </button>

          {/* OR divider */}
          <div className="flex items-center gap-[35px]">
            <div className="flex-1 h-px" style={{ background: "#BFBFBF" }} />
            <span className="text-[16px] leading-[19px]" style={{ color: "#FCF8FA" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "#BFBFBF" }} />
          </div>

          {/* Login / Register tab */}
          <div className="tab-pill flex w-full h-[50px] p-[6px] gap-[4px]">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 rounded-full text-[14px] font-semibold text-white transition-all capitalize"
                style={{ background: tab === t ? "#FA1190" : "transparent" }}
              >
                {t === "login" ? "Login" : "Register"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">

            {/* Name — register only */}
            <AnimatePresence>
              {tab === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-[20px] px-[15px] h-[77px] rounded-[8px]" style={{ background: "#1A0F18" }}>
                    <Users size={24} style={{ color: "#FCF8FA", flexShrink: 0 }} />
                    <div className="flex flex-col gap-[3px] flex-1">
                      <label className="text-[16px]" style={{ color: "#FCF8FA" }}>Nama Lengkap</label>
                      <input
                        type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Doe"
                        className="input-field bg-transparent border-0 text-[18px] font-semibold"
                        style={{ background: "transparent", border: "none" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="flex items-center gap-[20px] px-[15px] h-[77px] rounded-[8px]" style={{ background: "#1A0F18" }}>
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none">
                <rect width="30" height="24" rx="4" fill="#FCF8FA" fillOpacity="0.15"/>
                <path d="M2 4h26v16H2V4zm0 0l13 9 13-9" stroke="#FCF8FA" strokeWidth="1.5" fill="none"/>
              </svg>
              <div className="flex flex-col gap-[3px] flex-1">
                <label className="text-[16px]" style={{ color: "#FCF8FA" }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com" required
                  className="bg-transparent outline-none w-full text-[18px] font-semibold placeholder:opacity-40"
                  style={{ color: "#FCF8FA" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center gap-[20px] px-[15px] h-[77px] rounded-[8px]" style={{ background: "#1A0F18" }}>
              <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
                <circle cx="13.5" cy="10" r="6" stroke="#FCF8FA" strokeWidth="1.5" fill="none"/>
                <rect x="9" y="14" width="9" height="10" rx="2" fill="#FCF8FA" fillOpacity="0.15" stroke="#FCF8FA" strokeWidth="1.5"/>
                <circle cx="13.5" cy="19" r="1.5" fill="#FCF8FA"/>
              </svg>
              <div className="flex flex-col gap-[3px] flex-1">
                <label className="text-[16px]" style={{ color: "#FCF8FA" }}>Password</label>
                <input
                  type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" required
                  className="bg-transparent outline-none w-full text-[18px] font-semibold placeholder:opacity-40"
                  style={{ color: "#FCF8FA" }}
                />
              </div>
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="hover:opacity-70 transition-opacity shrink-0" style={{ color: "#FCF8FA" }}>
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-[10px] cursor-pointer select-none">
                <div
                  onClick={() => setRemember((r) => !r)}
                  className="w-[18px] h-[18px] rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  style={{ background: remember ? "#FA1190" : "#ECECEC", border: "1px solid #D9D9D9" }}
                >
                  {remember && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-[16px]" style={{ color: "#FCF8FA" }}>Remember me</span>
              </label>
              <button type="button" className="text-[16px] font-semibold hover:opacity-75 transition-opacity" style={{ color: "#FA1190" }}>
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary h-[77px] mt-[4px]">
              {tab === "login" ? "Login" : "Register"}
            </button>

            {/* Switch tab */}
            <p className="text-[16px] text-center" style={{ color: "#FCF8FA" }}>
              {tab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setTab(tab === "login" ? "register" : "login")}
                className="font-semibold hover:opacity-75 transition-opacity"
                style={{ color: "#FA1190" }}
              >
                {tab === "login" ? "Register" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
