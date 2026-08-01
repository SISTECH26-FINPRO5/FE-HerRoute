import React, { useState } from "react";

// --- MOCK DATA ---
const DUMMY_SAFE_PLACES = [
    { id: "sp_1", name: "FamilyMart Blok M", distance_meters: 150 },
    { id: "sp_2", name: "Blok M Plaza", distance_meters: 300 },
    { id: "sp_3", name: "Pos Polisi Blok M", distance_meters: 480 },
];

const DUMMY_ROUTES = [
    {
        id: "route_a",
        name: "Rute A (Paling Aman)",
        risk_level: "low",
        duration_mins: 10,
        safe_points_count: 2,
        reason: "Jalur utama, penerangan baik, melewati 2 safe place.",
        color: "#22C55E",
    },
    {
        id: "route_b",
        name: "Rute B (Alternatif)",
        risk_level: "medium",
        duration_mins: 14,
        safe_points_count: 1,
        reason: "Rute lebih pendek, tapi melewati 1 area waspada.",
        color: "#EAB308",
    },
    {
        id: "route_c",
        name: "Rute C (Waspada)",
        risk_level: "high",
        duration_mins: 15,
        safe_points_count: 0,
        reason: "Melewati area dengan laporan rawan tinggi, hindari di malam hari.",
        color: "#EF4444",
    },
];

interface MapDashboardProps {
    onGoToHomepage?: () => void;
}

export default function MapDashboard({ onGoToHomepage }: MapDashboardProps) {
    const [startPoint, setStartPoint] = useState("Stasiun MRT Blok M Plaza");
    const [endPoint, setEndPoint] = useState("Echigoya Ramen Melawai");

    return (
        <main className="min-h-screen w-full bg-[#1A0F18] font-sans text-white pb-10">

            {/* ─── NAVBAR ─── */}
            <nav className="flex h-[103px] w-full items-center px-[120px] bg-[#75003F]">
                <div className="flex items-center gap-[17px]">
                    <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#FA1190] text-[12px] font-bold text-[#FCF8FA]">
                        HR
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[16px] font-bold leading-[19px] text-[#FCF8FA]">HerRoute</span>
                        <span className="text-[12px] leading-[15px] text-[#F7DDEB]">Perlindungan & Rute Aman</span>
                    </div>
                </div>

                {/* Homepage Menu Kembali */}
                <div className="mx-auto flex items-center gap-[56px]">
                    {["Homepage", "Map", "Report", "Contact"].map((item) => (
                        <button
                            key={item}
                            onClick={item === "Homepage" ? onGoToHomepage : undefined}
                            className="pb-[5px] text-[20px] font-bold leading-[24px] text-[#F9EBF3] transition-all hover:opacity-80"
                            style={{
                                borderBottom: item === "Map" ? "3px solid #FA1190" : "3px solid transparent",
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                <div className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FA1190] text-[16px] font-bold text-[#FCF8FA] transition-opacity hover:opacity-80">
                    JD
                </div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <div className="mx-auto mt-[40px] flex max-w-[1300px] justify-center gap-[30px] px-[20px]">

                {/* ─── KOLOM KIRI ─── */}
                <section className="flex w-[472px] shrink-0 flex-col gap-[30px]">

                    {/* 1. Form Cari Rute */}
                    <div className="rounded-[15px] bg-[#1E2024] px-[50px] py-[60px]">
                        <h2 className="mb-8 text-[20px] font-bold text-white">Masukkan Rute Anda</h2>

                        <div className="mb-[40px] flex items-center gap-4 relative">
                            <div className="relative flex-1 flex flex-col gap-5">
                                <div className="absolute left-[15px] top-[40px] z-0 h-10 w-[2px] bg-white/20"></div>

                                {/* Input 1 (Titik Awal) */}
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FA1190" />
                                            <circle cx="12" cy="9" r="3" fill="#1E2024" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={startPoint}
                                        onChange={(e) => setStartPoint(e.target.value)}
                                        className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]"
                                    />
                                </div>

                                {/* Input 2 (Tujuan) */}
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="10" r="5" fill="#FA1190" />
                                            <path d="M12 15v6" stroke="#FA1190" strokeWidth="2.5" strokeLinecap="round" />
                                            <path d="M7 21h10" stroke="#FA1190" strokeWidth="2.5" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={endPoint}
                                        onChange={(e) => setEndPoint(e.target.value)}
                                        className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]"
                                    />
                                </div>
                            </div>

                            {/* Tombol Swap */}
                            <button className="absolute -right-5 top-[32px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FA1190] hover:bg-[#d00e78] shadow-lg z-20">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" /></svg>
                            </button>
                        </div>

                        <button className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#FA1190] py-[16px] text-[16px] font-bold text-white transition hover:bg-[#d00e78]">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Cari Rute Aman
                        </button>
                    </div>

                    {/* 2. Safe Place Terdekat */}
                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-[20px] font-bold text-white">Safe Place Terdekat</h2>
                                <span className="text-[14px] font-normal text-white/50">(Radius 500m)</span>
                            </div>
                            <span className="cursor-pointer text-[14px] font-medium text-[#FA1190] hover:underline">Lihat Semua {">"}</span>
                        </div>

                        <div className="space-y-[20px] mt-[30px]">
                            {DUMMY_SAFE_PLACES.map((place) => (
                                <div key={place.id} className="border-b border-white/10 pb-[20px] last:border-0 last:pb-0">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                            <span className="text-[16px] font-bold">{place.name}</span>
                                        </div>
                                        <span className="text-[14px] font-semibold text-white/70">{place.distance_meters} m</span>
                                    </div>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#75003F] py-[12px] text-[14px] font-bold text-white transition hover:bg-[#5a0030]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" /></svg>
                                        Dapatkan Petunjuk Arah
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Prediksi Risiko Waktu (Grid Lines) */}
                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <h2 className="mb-8 text-[20px] font-bold text-white">Prediksi Risiko Waktu</h2>

                        <div className="flex gap-4">
                            <div className="flex flex-col justify-between text-right text-[12px] pb-[25px] font-semibold">
                                <span className="text-[#EF4444]">Tinggi</span>
                                <span className="text-[#EAB308]">Sedang</span>
                                <span className="text-[#22C55E]">Rendah</span>
                            </div>

                            <div className="flex-1">
                                <div className="relative h-[128px] w-full border-b border-l border-white/20 overflow-hidden">

                                    {/* Grid Lines Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#grid)" />
                                        </svg>
                                    </div>

                                    <div className="absolute bottom-0 left-0 w-full h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 339 128" fill="none" preserveAspectRatio="none">
                                            <path d="M0 49.7953C0 49.7953 24.5876 0 56.3613 0C80.9489 0 91.0569 9.79539 112.723 28.4545C147.418 58.3354 139.064 97.08 169.084 97.08C195.425 97.08 189.898 43.7443 225.445 40.171C246.259 38.0788 253.61 38.8115 281.806 38.0788C309.972 37.3469 338.168 37.2419 338.168 37.2419V127.627H281.806H225.445H169.084H112.723H56.3613H0V49.7953Z" fill="url(#paint0_linear_191_1039)" fillOpacity="0.7" />
                                            <defs>
                                                <linearGradient id="paint0_linear_191_1039" x1="0" y1="0" x2="0" y2="127.627" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0.05" stopColor="#FA1190" />
                                                    <stop offset="0.95" stopColor="#8979FF" stopOpacity="0.1" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="absolute bottom-[20%] left-0 h-[2px] w-full bg-[#FA1190] opacity-50"></div>
                                </div>

                                <div className="mt-3 flex justify-between text-[11px] font-semibold text-white/50 pr-2">
                                    <span>17:00</span>
                                    <span>17:30</span>
                                    <span>18:00</span>
                                    <span>18:30</span>
                                    <span>19:00</span>
                                    <span>19:30</span>
                                    <span>20:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── KOLOM KANAN ─── */}
                <section className="flex w-[779px] flex-col gap-[30px]">

                    {/* AREA MAP (Google Maps API Blok M + Filter Hitam) */}
                    <div className="relative h-[480px] w-full overflow-hidden rounded-[15px] border border-white/5 bg-[#120B11]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.267201829007!2d106.7973!3d-6.2444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMzkuOCJTIDEwNsKwNDcnNTAuMyJF!5e0!3m2!1sen!2sid!4v1690000000000!5m2!1sen!2sid"
                            className="w-full h-full grayscale invert opacity-70"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>

                        <div className="absolute left-[30%] top-[40%] flex items-center justify-center pointer-events-none">
                            <div className="h-[60px] w-[60px] animate-ping rounded-full bg-[#FA1190] opacity-40"></div>
                            <div className="absolute flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FA1190] shadow-[0_0_15px_rgba(250,17,144,0.6)]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                            </div>
                            <div className="absolute -top-8 w-[110px] text-center text-[10px] font-bold text-white bg-black/70 px-2 py-1 rounded-full">Posisi kamu saat ini</div>
                        </div>

                        <div className="absolute bottom-[20px] left-[20px] rounded-[10px] bg-[#1E2024]/95 p-4 shadow-lg backdrop-blur-sm border border-white/10 pointer-events-none">
                            <h3 className="mb-2 text-[12px] font-bold text-white">Legenda</h3>
                            <div className="flex flex-col gap-2 text-[11px] font-semibold text-white/80">
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"></div> Area Aman</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]"></div> Area Waspada</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"></div> Area Rawan</div>
                                <div className="flex items-center gap-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> Area Safe Place</div>
                            </div>
                        </div>
                    </div>

                    {/* PILIHAN RUTE AMAN (Border Radius 20px) */}
                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <h2 className="mb-[24px] text-[20px] font-bold text-white">Pilih Rute Aman</h2>
                        <div className="flex flex-col gap-[16px]">
                            {DUMMY_ROUTES.map((route) => (
                                <div key={route.id} className="flex flex-col justify-between rounded-[12px] bg-[#120B11] p-[24px] border border-white/5 md:flex-row md:items-center">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-[12px]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill={route.color}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                            <h3 className="text-[16px] font-bold" style={{ color: route.color }}>{route.name}</h3>
                                            <span className="flex items-center gap-1 rounded-full bg-[#3A1F31] px-3 py-1 text-[12px] font-bold text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                                {route.safe_points_count} Safe Place
                                            </span>
                                        </div>
                                        <p className="mt-[12px] text-[14px] font-medium text-white/80"><span className="font-bold text-white">Alasan:</span> {route.reason}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between md:mt-0 md:ml-6 md:w-[180px]">
                                        <span className="text-[16px] font-bold text-white">{route.duration_mins} Menit</span>
                                        {/* BUTTON RUTE DENGAN RADIUS 20px */}
                                        <button className="rounded-[20px] bg-[#FA1190] px-[20px] py-[10px] text-[14px] font-bold text-white hover:bg-[#d00e78] transition">
                                            Pilih Rute
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}