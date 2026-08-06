import React, { useState, useEffect, useMemo } from "react";
// IMPORT LEAFLET COMPONENTS
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


const currentPositionIcon = L.divIcon({
    className: "custom-current-position-icon",
    html: `
        <div style="position:relative; width:126px; height:150px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="126" height="150" viewBox="0 0 126 150" fill="none" style="position:absolute; top:0; left:0;">
                <g opacity="0.4" filter="url(#filter0_ddd_191_979)">
                    <ellipse cx="62.9736" cy="47.522" rx="47.9736" ry="47.522" fill="#FA1190"/>
                </g>
                <ellipse opacity="0.7" cx="63.2124" cy="47.2848" rx="38.188" ry="37.6816" fill="#FA1190"/>
                <ellipse cx="63.4515" cy="47.5236" rx="29.8343" ry="30.2413" fill="#FA1190"/>
                
                <!-- Teks dimasukkan LANGSUNG ke dalam SVG -->
                <text x="63" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="9px" text-anchor="middle">Posisi kamu</text>
                <text x="63" y="55" fill="white" font-family="sans-serif" font-weight="bold" font-size="9px" text-anchor="middle">saat ini</text>
                
                <defs>
                    <filter id="filter0_ddd_191_979" x="0" y="0" width="125.947" height="149.044" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="10"/>
                        <feGaussianBlur stdDeviation="5"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.584314 0 0 0 0 0.45098 0 0 0 0 0.886275 0 0 0 0.09 0"/>
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_191_979"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="22"/>
                        <feGaussianBlur stdDeviation="6.5"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.584314 0 0 0 0 0.45098 0 0 0 0 0.886275 0 0 0 0.05 0"/>
                        <feBlend mode="normal" in2="effect1_dropShadow_191_979" result="effect2_dropShadow_191_979"/>
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                        <feOffset dy="39"/>
                        <feGaussianBlur stdDeviation="7.5"/>
                        <feColorMatrix type="matrix" values="0 0 0 0 0.584314 0 0 0 0 0.45098 0 0 0 0 0.886275 0 0 0 0.01 0"/>
                        <feBlend mode="normal" in2="effect2_dropShadow_191_979" result="effect3_dropShadow_191_979"/>
                        <feBlend mode="normal" in="SourceGraphic" in2="effect3_dropShadow_191_979" result="shape"/>
                    </filter>
                </defs>
            </svg>
        </div>
    `,
    iconSize: [126, 150],
    iconAnchor: [63, 47],
});

const shieldStarIcon = (color: string) =>
    L.divIcon({
        className: "custom-shield-star-icon",
        html: `
            <div style="position:relative; width:56px; height:56px; display:flex; align-items:center; justify-content:center;">
                <div style="position:absolute; inset:0; border-radius:9999px; background:#FFFFFF; opacity:0.35; filter: blur(4px);"></div>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style="position:relative; z-index:2;">
                    <path d="M12 2L4 5v6c0 5.25 3.5 9.75 8 11 4.5-1.25 8-5.75 8-11V5l-8-3z" fill="#FA1190"/>
                    <path d="M12 7.5l1.1 2.25 2.48.36-1.79 1.75.42 2.47L12 13.15l-2.21 1.18.42-2.47-1.79-1.75 2.48-.36L12 7.5z" fill="#FFFFFF"/>
                </svg>
            </div>
        `,
        iconSize: [56, 56],
        iconAnchor: [28, 28],
    });

// ─── ARROW ICON UNTUK NUNJUKIN ARAH RUTE ───
// Dipakai di tiap segmen garis rute, dirotasi sesuai bearing segmen tsb.
const routeArrowIcon = (color: string, angleDeg: number) =>
    L.divIcon({
        className: "custom-route-arrow-icon",
        html: `
            <div style="width:22px; height:22px; transform: rotate(${angleDeg}deg); transform-origin: center;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#120B11" fill-opacity="0.55"/>
                    <path d="M12 5L18 15H6L12 5Z" fill="${color}" stroke="#FCF8FA" stroke-width="1"/>
                </svg>
            </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
    });

// Hitung bearing (derajat, 0 = utara) antara 2 titik lat/lon, buat rotasi arrow icon
function computeBearing(from: [number, number], to: [number, number]): number {
    const [lat1, lon1] = from.map((v) => (v * Math.PI) / 180);
    const [lat2, lon2] = to.map((v) => (v * Math.PI) / 180);
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearingRad = Math.atan2(y, x);
    return ((bearingRad * 180) / Math.PI + 360) % 360;
}

// --- DUMMY DATA RUTE ---
const DUMMY_ROUTES = [
    {
        id: "route_a",
        name: "Rute A (Paling Aman)",
        risk_level: "low",
        duration_mins: 10,
        safe_points_count: 2,
        reason: "Jalur utama, penerangan baik, melewati 2 safe place.",
        color: "#22C55E",
        // Waypoint skematik (bukan hasil real routing engine, lihat catatan di bawah).
        // Sengaja dijaga lat > -6.2451 supaya gak pernah masuk rectangle Area Rawan
        // (bounds zona rawan: lat -6.2465 s/d -6.2451).
        waypoints: [
            [-6.2444, 106.7973],
            [-6.2446, 106.7982],
            [-6.2447, 106.7990],
            [-6.2450, 106.7995],
        ] as [number, number][],
    },
    {
        id: "route_b",
        name: "Rute B (Alternatif)",
        risk_level: "medium",
        duration_mins: 14,
        safe_points_count: 1,
        reason: "Rute lebih pendek, tapi menyerempet ujung area waspada.",
        color: "#EAB308",
        // Nyerempet dikit ke tepi zona rawan (lat sempat nyentuh -6.2452)
        waypoints: [
            [-6.2444, 106.7973],
            [-6.2448, 106.7985],
            [-6.2452, 106.7993],
            [-6.2450, 106.7995],
        ] as [number, number][],
    },
    {
        id: "route_c",
        name: "Rute C (Waspada)",
        risk_level: "high",
        duration_mins: 15,
        safe_points_count: 0,
        reason: "Melewati area dengan laporan rawan tinggi, hindari di malam hari.",
        color: "#EF4444",
        // Motong lewat tengah rectangle rawan (lat -6.2460, di dalam -6.2465 s/d -6.2451)
        waypoints: [
            [-6.2444, 106.7973],
            [-6.2452, 106.7988],
            [-6.2460, 106.7998],
            [-6.2450, 106.7995],
        ] as [number, number][],
    },
];


const INITIAL_HEATMAP_ZONES = [
    {
        id: 1,
        bounds: [[-6.2451, 106.7965], [-6.2437, 106.7983]] as [[number, number], [number, number]],
        center: [-6.2444, 106.7973] as [number, number],
        badgePosition: [-6.2440, 106.7980] as [number, number] | null,
        color: "#22C55E",
        info: "Area Aman (Klik untuk cek API ML)",
    },
    {
        id: 2,
        bounds: [[-6.2451, 106.7983], [-6.2437, 106.8000]] as [[number, number], [number, number]],
        center: [-6.2444, 106.79915] as [number, number],
        badgePosition: [-6.2444, 106.79915] as [number, number] | null,
        color: "#EAB308",
        info: "Area Waspada (Klik untuk cek API ML)",
    },
    {
        id: 3,
        bounds: [[-6.2465, 106.7983], [-6.2451, 106.8005]] as [[number, number], [number, number]],
        center: [-6.2458, 106.7994] as [number, number],
        badgePosition: null as [number, number] | null,
        color: "#EF4444",
        info: "Area Rawan (Klik untuk cek API ML)",
    },
];

interface MapDashboardProps {
    onGoToHomepage?: () => void;
}

export default function MapDashboard({ onGoToHomepage }: MapDashboardProps) {
    const [startPoint, setStartPoint] = useState("Stasiun MRT Blok M Plaza");
    const [endPoint, setEndPoint] = useState("Echigoya Ramen Melawai");

    const [safePlaces, setSafePlaces] = useState<any[]>([]);
    const [routes, setRoutes] = useState(DUMMY_ROUTES);
    const [isLoading, setIsLoading] = useState(false);
    const [isRouteDrawn, setIsRouteDrawn] = useState(false);

    // Rute yang lagi ditampilin garisnya di map. Default: rute paling aman begitu hasil rute muncul.
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

    const [activeNav, setActiveNav] = useState("Map");

    // State untuk nyimpen data hasil fetch API per zona yang diklik
    const [zoneDataMap, setZoneDataMap] = useState<{ [key: number]: any }>({});
    const [loadingZoneId, setLoadingZoneId] = useState<number | null>(null);

    const BLOK_M_LAT = -6.2444;
    const BLOK_M_LON = 106.7973;

    useEffect(() => {
        const fetchSafePlaces = async () => {
            try {
                const response = await fetch(`https://be-her-route.vercel.app/api/ml/safe-places?lat=${BLOK_M_LAT}&lon=${BLOK_M_LON}&k=3`);
                if (response.ok) {
                    const data = await response.json();
                    const formattedPlaces = data.map((place: any, index: number) => ({
                        id: `sp_${index}`,
                        name: place.name,
                        lat: place.lat,
                        lon: place.lon,
                        distance_meters: Math.floor(Math.random() * 300) + 100
                    }));
                    setSafePlaces(formattedPlaces);
                }
            } catch (error) {
                console.error("Gagal mengambil Safe Places:", error);
            }
        };
        fetchSafePlaces();
    }, []);

    // FUNGSI FETCH SAAT ZONA DIKLIK (Sesuai API /api/ml/risk-indicator)[cite: 1]
    const handleZoneClick = async (zoneId: number, lat: number, lon: number) => {
        setLoadingZoneId(zoneId);
        try {
            const payload = {
                lat: lat,
                lon: lon,
                dow: 0, // Day of week (misal: 0 = Senin)
                hour: 19 // Jam 7 malam
            };

            const response = await fetch("https://be-her-route.vercel.app/api/ml/risk-indicator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                setZoneDataMap(prev => ({ ...prev, [zoneId]: result }));
            }
        } catch (error) {
            console.error("Gagal fetch risk indicator:", error);
        } finally {
            setLoadingZoneId(null);
        }
    };


    const RISK_LEVEL_MULTIPLIER: { [key: string]: number } = {
        low: 1,
        medium: 1.4,
        high: 1.9,
    };

    const handleSearchRoute = async () => {
        setIsLoading(true);
        try {
            const payload = {
                start_lat: BLOK_M_LAT,
                start_lon: BLOK_M_LON,
                end_lat: -6.2450,
                end_lon: 106.7995,
                mode: "safe"
            };

            const routeResponse = await fetch("https://be-her-route.vercel.app/api/ml/safe-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (routeResponse.ok) {
                const routeData = await routeResponse.json();
                const baseAvgRisk = routeData.avg_risk || 18.94;
                const mockNote = routeData.mock_note || '';

                // Mapping data server ke SEMUA rute (A, B, C)
                // Tiap rute dapet risk score turunan dari baseAvgRisk sesuai risk_level-nya sendiri.
                // CATATAN: API ml/safe-route cuma ngasih avg_risk (angka), BUKAN geometry rute.
                // Jadi garis di map tetap pakai waypoint skematik (routes[].waypoints) yang
                // udah didefinisiin di frontend, independen dari model risk Chicago ini.
                const updatedRoutes = DUMMY_ROUTES.map((route) => {
                    const multiplier = RISK_LEVEL_MULTIPLIER[route.risk_level] ?? 1;
                    const routeRiskScore = (baseAvgRisk * multiplier).toFixed(2);
                    return {
                        ...route,
                        reason: `Rute hasil generate AI. Avg Risk Score: ${routeRiskScore}. ${mockNote}`,
                    };
                });

                setRoutes(updatedRoutes);
                setIsRouteDrawn(true);
                // otomatis tampilin rute paling aman begitu hasil pencarian muncul
                setSelectedRouteId(updatedRoutes[0].id);
            }
        } catch (error) {
            console.error("Gagal mencari rute:", error);
            setIsRouteDrawn(true);
            setSelectedRouteId(DUMMY_ROUTES[0].id);
        } finally {
            setIsLoading(false);
        }
    };

    const activeRoute = useMemo(
        () => routes.find((r) => r.id === selectedRouteId) ?? null,
        [routes, selectedRouteId]
    );

    // Titik tengah tiap segmen + bearing-nya, buat naro arrow icon di sepanjang garis
    const arrowMarkers = useMemo(() => {
        if (!activeRoute) return [];
        const pts = activeRoute.waypoints;
        return pts.slice(0, -1).map((p, i) => {
            const next = pts[i + 1];
            const mid: [number, number] = [(p[0] + next[0]) / 2, (p[1] + next[1]) / 2];
            const angle = computeBearing(p, next);
            return { position: mid, angle, key: `${activeRoute.id}_arrow_${i}` };
        });
    }, [activeRoute]);

    return (
        <main className="min-h-screen w-full bg-[#1A0F18] text-white pb-10">

            <style>{`
                .custom-current-position-icon, .custom-shield-star-icon, .custom-route-arrow-icon { background: transparent !important; border: none !important; }
            `}</style>

            {/* ─── NAVBAR ─── */}
            <nav className="fixed top-0 z-50 flex h-[103px] w-full items-center px-[120px] bg-[#75003F]">                <div className="flex items-center gap-[17px]">
                <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#FA1190] text-[12px] font-bold text-[#FCF8FA]">HR</div>
                <div className="flex flex-col">
                    <span className="text-[16px] font-bold leading-[19px] text-[#FCF8FA]">HerRoute</span>
                    <span className="text-[12px] leading-[15px] text-[#F7DDEB]">Perlindungan & Rute Aman</span>
                </div>
            </div>
                <div className="mx-auto flex items-center gap-[56px]">
                    {["Homepage", "Map", "Report", "Contact"].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                if (item === "Homepage") {
                                    onGoToHomepage?.();
                                } else {
                                    setActiveNav(item);
                                }
                            }}
                            className="pb-[5px] text-[20px] font-bold leading-[24px] text-[#F9EBF3] transition-all hover:opacity-80"
                            style={{ borderBottom: activeNav === item ? "3px solid #FA1190" : "3px solid transparent" }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FA1190] text-[16px] font-bold text-[#FCF8FA] hover:opacity-80">JD</div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <div className="mx-auto pt-[143px] pb-[40px] flex max-w-[1300px] justify-center gap-[30px] px-[20px]">
                {/* KOLOM KIRI */}
                <section className="flex w-[472px] shrink-0 flex-col gap-[30px]">
                    <div className="rounded-[15px] bg-[#1E2024] px-[50px] py-[60px]">
                        <h2 className="mb-8 text-[20px] font-bold text-white">Masukkan Rute Anda</h2>
                        <div className="mb-[40px] flex items-center gap-4 relative">
                            <div className="relative flex-1 flex flex-col gap-5">
                                <div className="absolute left-[15px] top-[40px] z-0 h-10 w-[2px] bg-white/20"></div>

                                {/* START POINT  */}
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 18C19 19.657 15.866 21 12 21C8.134 21 5 19.657 5 18C5 16.452 7.737 15.1781 11.25 15.0181V17C11.25 17.41 11.59 17.75 12 17.75C12.41 17.75 12.75 17.41 12.75 17V15.0181C16.263 15.1781 19 16.452 19 18ZM12.75 15.0181V10.9241C14.6 10.5721 16 8.952 16 7C16 4.791 14.209 3 12 3C9.791 3 8 4.791 8 7C8 8.952 9.4 10.5731 11.25 10.9241V15.0181C11.497 15.0071 11.746 15 12 15C12.254 15 12.503 15.0071 12.75 15.0181Z" fill="#FA1190" />
                                        </svg>
                                    </span>
                                    <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]" />
                                </div>

                                {/* END POINT  */}
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA1190">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.54 22.351a.76.76 0 00.92 0c.169-.12.706-.512 1.404-1.115a19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.683 2.282c.698.603 1.235.995 1.404 1.115H11.54zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                                        </svg>
                                    </span>
                                    <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]" />
                                </div>
                            </div>
                            <button className="absolute -right-5 top-[32px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FA1190] hover:bg-[#d00e78] shadow-lg z-20">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" /></svg>
                            </button>
                        </div>

                        <button onClick={handleSearchRoute} disabled={isLoading} className={`flex w-full items-center justify-center gap-2 rounded-[10px] py-[16px] text-[16px] font-bold text-white transition ${isLoading ? "bg-[#75003F] cursor-wait" : "bg-[#FA1190] hover:bg-[#d00e78]"}`}>
                            {isLoading ? <span className="animate-pulse">Menghitung Risiko...</span> : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Cari Rute Aman</>}
                        </button>
                    </div>

                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-[20px] font-bold text-white">Safe Place Terdekat</h2>
                                <span className="text-[14px] font-normal text-white/50">(Radius 500m)</span>
                            </div>
                            <span className="cursor-pointer text-[14px] font-medium text-[#FA1190] hover:underline">Lihat Semua {">"}</span>
                        </div>

                        <div className="space-y-[20px] mt-[30px]">
                            {safePlaces.length > 0 ? safePlaces.map((place) => (
                                <div key={place.id} className="border-b border-white/10 pb-[20px] last:border-0 last:pb-0">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                            <span className="text-[16px] font-bold">{place.name}</span>
                                        </div>
                                        <span className="text-[14px] font-semibold text-white/70">{place.distance_meters} m</span>
                                    </div>
                                    <button className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#75003F] py-[12px] text-[14px] font-bold text-white transition hover:bg-[#5a0030]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" /></svg> Dapatkan Petunjuk Arah
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center text-white/50 py-4 animate-pulse">Memuat data API...</div>
                            )}
                        </div>
                    </div>

                    {/* Prediksi Risiko Waktu */}
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
                                    <div className="absolute top-[25%] left-0 h-[1px] w-full bg-white/20"></div>
                                    <div className="absolute top-[50%] left-0 h-[1px] w-full bg-white/20"></div>
                                    <div className="absolute top-[75%] left-0 h-[1px] w-full bg-white/20"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-full z-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 339 128" fill="none" preserveAspectRatio="none">
                                            <path d="M0 49.7953C0 49.7953 24.5876 0 56.3613 0C80.9489 0 91.0569 9.79539 112.723 28.4545C147.418 58.3354 139.064 97.08 169.084 97.08C195.425 97.08 189.898 43.7443 225.445 40.171C246.259 38.0788 253.61 38.8115 281.806 38.0788C309.972 37.3469 338.168 37.2419 338.168 37.2419V127.627H281.806H225.445H169.084H112.723H56.3613H0V49.7953Z" fill="url(#paint0_linear_191_1039)" fillOpacity="0.7" />
                                            <path d="M0 49.7953C0 49.7953 24.5876 0 56.3613 0C80.9489 0 91.0569 9.79539 112.723 28.4545C147.418 58.3354 139.064 97.08 169.084 97.08C195.425 97.08 189.898 43.7443 225.445 40.171C246.259 38.0788 253.61 38.8115 281.806 38.0788C309.972 37.3469 338.168 37.2419 338.168 37.2419" stroke="#FA1190" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                                            <defs>
                                                <linearGradient id="paint0_linear_191_1039" x1="0" y1="0" x2="0" y2="127.627" gradientUnits="userSpaceOnUse">
                                                    <stop offset="0.05" stopColor="#FA1190" />
                                                    <stop offset="0.95" stopColor="#8979FF" stopOpacity="0.1" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                <div className="mt-3 flex justify-between text-[11px] font-semibold text-white/50 pr-2">
                                    <span>17:00</span><span>17:30</span><span>18:00</span><span>18:30</span><span>19:00</span><span>19:30</span><span>20:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KOLOM KANAN (MAP + RUTE) */}
                <section className="flex w-[779px] flex-col gap-[30px]">
                    <div className="relative h-[480px] w-full overflow-hidden rounded-[15px] border border-white/5 bg-[#120B11] z-0">
                        <MapContainer
                            center={[BLOK_M_LAT, BLOK_M_LON]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', zIndex: 0 }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            />

                            {/* ZONA RISIKO  */}
                            {INITIAL_HEATMAP_ZONES.map((zone) => {
                                const fetchedData = zoneDataMap[zone.id];
                                const isLoadingThis = loadingZoneId === zone.id;

                                return (
                                    <React.Fragment key={zone.id}>
                                        <Rectangle
                                            bounds={zone.bounds}
                                            pathOptions={{ fillColor: zone.color, color: zone.color, weight: 1, opacity: 0.4, fillOpacity: 0.25 }}
                                            eventHandlers={{
                                                click: () => handleZoneClick(zone.id, zone.center[0], zone.center[1]),
                                            }}
                                        >
                                            <Popup>
                                                <div className="text-black font-sans p-1">
                                                    <p className="font-bold text-[14px] mb-1">Zona Deteksi Risiko</p>
                                                    {isLoadingThis ? (
                                                        <p className="text-pink-600 animate-pulse text-[12px]">Memproses data...</p>
                                                    ) : fetchedData ? (
                                                        <div className="text-[12px] space-y-1">
                                                            <p><b>Cell ID:</b> {fetchedData.cell_id}</p>
                                                            <p><b>Risk Score:</b> {fetchedData.risk_score}</p>
                                                            <p><b>Tier:</b> <span className="font-bold uppercase text-green-600">{fetchedData.tier}</span></p>
                                                            <p className="text-[10px] text-gray-500 italic mt-1">{fetchedData.mock_note}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[12px] text-gray-600">{zone.info}</p>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Rectangle>


                                        {zone.badgePosition && (
                                            <Marker
                                                position={zone.badgePosition}
                                                icon={shieldStarIcon(zone.color)}
                                                interactive={false}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {/* GARIS RUTE + ARROW (skematik, lihat catatan di handleSearchRoute) */}
                            {isRouteDrawn && activeRoute && (
                                <React.Fragment>
                                    <Polyline
                                        positions={activeRoute.waypoints}
                                        pathOptions={{
                                            color: activeRoute.color,
                                            weight: 5,
                                            opacity: 0.9,
                                            dashArray: activeRoute.risk_level === "high" ? "8 8" : undefined,
                                        }}
                                    />
                                    {arrowMarkers.map((a) => (
                                        <Marker
                                            key={a.key}
                                            position={a.position}
                                            icon={routeArrowIcon(activeRoute.color, a.angle)}
                                            interactive={false}
                                        />
                                    ))}
                                </React.Fragment>
                            )}

                            {/* Posisi saat ini */}
                            <Marker position={[BLOK_M_LAT, BLOK_M_LON]} icon={currentPositionIcon} />
                        </MapContainer>

                        <div className="absolute bottom-[20px] left-[20px] rounded-[10px] bg-[#1E2024]/95 p-4 shadow-lg backdrop-blur-sm border border-white/10 z-[1000] pointer-events-none">
                            <h3 className="mb-2 text-[12px] font-bold text-white">Legenda</h3>
                            <div className="flex flex-col gap-2 text-[11px] font-semibold text-white/80">
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"></div> Area Aman</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]"></div> Area Waspada</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"></div> Area Rawan</div>
                                <div className="flex items-center gap-2">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L4 5v6c0 5.25 3.5 9.75 8 11 4.5-1.25 8-5.75 8-11V5l-8-3z" fill="#FA1190" />
                                        <path d="M12 7.5l1.1 2.25 2.48.36-1.79 1.75.42 2.47L12 13.15l-2.21 1.18.42-2.47-1.79-1.75 2.48-.36L12 7.5z" fill="#FFFFFF" />
                                    </svg>
                                    Area Safe Place
                                </div>
                                {isRouteDrawn && activeRoute && (
                                    <div className="flex items-center gap-2 pt-1 mt-1 border-t border-white/10">
                                        <div className="h-[3px] w-4 rounded-full" style={{ background: activeRoute.color }}></div>
                                        Rute Terpilih
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DAFTAR PILIHAN RUTE */}
                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <h2 className="mb-[24px] text-[20px] font-bold text-white">Pilih Rute Aman</h2>
                        <div className="flex flex-col gap-[16px]">
                            {routes.map((route) => {
                                const isSelected = selectedRouteId === route.id;
                                return (
                                    <div
                                        key={route.id}
                                        className="grid grid-cols-1 md:grid-cols-[1fr_180px] items-center gap-4 rounded-[20px] bg-[#120B11] p-[24px] transition"
                                        style={{ border: isSelected ? `1.5px solid ${route.color}` : "1px solid rgba(255,255,255,0.05)" }}
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <div className="flex flex-wrap items-center gap-[12px]">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill={route.color} className="shrink-0"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                                <h3 className="text-[16px] font-bold whitespace-nowrap" style={{ color: route.color }}>{route.name}</h3>
                                                <span className="flex items-center gap-1 rounded-full bg-[#3A1F31] px-3 py-1 text-[12px] font-bold text-white whitespace-nowrap">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190" className="shrink-0"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> {route.safe_points_count} Safe Place
                                                </span>
                                            </div>
                                            <p className="mt-[12px] text-[14px] font-medium text-white/80">
                                                <span className="font-bold text-white">Alasan:</span> {route.reason}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-[180px] shrink-0">
                                            <span className="text-[16px] font-bold text-white whitespace-nowrap">{route.duration_mins} Menit</span>
                                            <button
                                                onClick={() => {
                                                    setIsRouteDrawn(true);
                                                    setSelectedRouteId(route.id);
                                                }}
                                                className="shrink-0 rounded-[20px] px-[20px] py-[10px] text-[14px] font-bold text-white transition whitespace-nowrap"
                                                style={{ background: isSelected ? route.color : "#FA1190" }}
                                            >
                                                {isSelected ? "Ditampilkan" : "Pilih Rute"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}