import React, { useState, useEffect } from "react";
// IMPORT LEAFLET COMPONENTS
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

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

// --- MOCK DATA HEATMAP ZONES ---
const INITIAL_HEATMAP_ZONES = [
    { id: 1, center: [-6.2444, 106.7973] as [number, number], radius: 150, color: "#22C55E", info: "Area Aman (Klik untuk cek API ML)" },
    { id: 2, center: [-6.2455, 106.7985] as [number, number], radius: 120, color: "#EAB308", info: "Area Waspada (Klik untuk cek API ML)" },
    { id: 3, center: [-6.2465, 106.8000] as [number, number], radius: 180, color: "#EF4444", info: "Area Rawan (Klik untuk cek API ML)" },
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

    // State untuk nyimpen data hasil fetch API per zona yang diklik
    const [zoneDataMap, setZoneDataMap] = useState<{ [key: number]: any }>({});
    const [loadingZoneId, setLoadingZoneId] = useState<number | null>(null);

    const BLOK_M_LAT = -6.2444;
    const BLOK_M_LON = 106.7973;

    const routeCoordinates: [number, number][] = [
        [-6.2444, 106.7973],
        [-6.2450, 106.7980],
        [-6.2458, 106.7990],
        [-6.2460, 106.8000],
    ];

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

    const handleSearchRoute = async () => {
        setIsLoading(true);
        try {
            const payload = {
                start_lat: BLOK_M_LAT,
                start_lon: BLOK_M_LON,
                end_lat: -6.2460,
                end_lon: 106.8000,
                mode: "safe"
            };

            const routeResponse = await fetch("https://be-her-route.vercel.app/api/ml/safe-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (routeResponse.ok) {
                const routeData = await routeResponse.json();
                const updatedRoutes = [...DUMMY_ROUTES];
                updatedRoutes[0] = {
                    ...updatedRoutes[0],
                    reason: `Rute hasil generate AI. Avg Risk Score: ${routeData.avg_risk || 18.94}. ${routeData.mock_note || ''}`
                };
                setRoutes(updatedRoutes);
                setIsRouteDrawn(true);
            }
        } catch (error) {
            console.error("Gagal mencari rute:", error);
            setIsRouteDrawn(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-[#1A0F18] font-sans text-white pb-10">
            {/* ─── NAVBAR ─── */}
            <nav className="flex h-[103px] w-full items-center px-[120px] bg-[#75003F]">
                <div className="flex items-center gap-[17px]">
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
                            onClick={item === "Homepage" ? onGoToHomepage : undefined}
                            className="pb-[5px] text-[20px] font-bold leading-[24px] text-[#F9EBF3] transition-all hover:opacity-80"
                            style={{ borderBottom: item === "Map" ? "3px solid #FA1190" : "3px solid transparent" }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
                <div className="flex h-[50px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FA1190] text-[16px] font-bold text-[#FCF8FA] hover:opacity-80">JD</div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <div className="mx-auto mt-[40px] flex max-w-[1300px] justify-center gap-[30px] px-[20px]">

                {/* KOLOM KIRI */}
                <section className="flex w-[472px] shrink-0 flex-col gap-[30px]">
                    <div className="rounded-[15px] bg-[#1E2024] px-[50px] py-[60px]">
                        <h2 className="mb-8 text-[20px] font-bold text-white">Masukkan Rute Anda</h2>
                        <div className="mb-[40px] flex items-center gap-4 relative">
                            <div className="relative flex-1 flex flex-col gap-5">
                                <div className="absolute left-[15px] top-[40px] z-0 h-10 w-[2px] bg-white/20"></div>
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FA1190" /><circle cx="12" cy="9" r="3" fill="#1E2024" /></svg>
                                    </span>
                                    <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]" />
                                </div>
                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="5" fill="#FA1190" /><path d="M12 15v6" stroke="#FA1190" strokeWidth="2.5" strokeLinecap="round" /><path d="M7 21h10" stroke="#FA1190" strokeWidth="2.5" strokeLinecap="round" /></svg>
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

                            {/* ZONA HEATMAP INTERAKTIF (Terhubung ke API /api/ml/risk-indicator) */}
                            {INITIAL_HEATMAP_ZONES.map((zone) => {
                                const fetchedData = zoneDataMap[zone.id];
                                const isLoadingThis = loadingZoneId === zone.id;

                                return (
                                    <Circle
                                        key={zone.id}
                                        center={zone.center}
                                        radius={zone.radius}
                                        pathOptions={{ fillColor: zone.color, color: 'transparent', fillOpacity: 0.25 }}
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
                                    </Circle>
                                );
                            })}

                            {isRouteDrawn && (
                                <Polyline
                                    positions={routeCoordinates}
                                    pathOptions={{ color: '#FA1190', weight: 5, opacity: 0.8 }}
                                />
                            )}

                            <Marker position={[BLOK_M_LAT, BLOK_M_LON]}>
                                <Popup>Posisi kamu saat ini</Popup>
                            </Marker>
                        </MapContainer>

                        <div className="absolute bottom-[20px] left-[20px] rounded-[10px] bg-[#1E2024]/95 p-4 shadow-lg backdrop-blur-sm border border-white/10 z-[1000] pointer-events-none">
                            <h3 className="mb-2 text-[12px] font-bold text-white">Legenda</h3>
                            <div className="flex flex-col gap-2 text-[11px] font-semibold text-white/80">
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"></div> Area Aman</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]"></div> Area Waspada</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"></div> Area Rawan</div>
                                <div className="flex items-center gap-2"><svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> Area Safe Place</div>
                            </div>
                        </div>
                    </div>

                    {/* DAFTAR PILIHAN RUTE */}
                    <div className="rounded-[15px] bg-[#1E2024] p-[40px]">
                        <h2 className="mb-[24px] text-[20px] font-bold text-white">Pilih Rute Aman</h2>
                        <div className="flex flex-col gap-[16px]">
                            {routes.map((route) => (
                                <div key={route.id} className="flex flex-col justify-between rounded-[12px] bg-[#120B11] p-[24px] border border-white/5 md:flex-row md:items-center">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-[12px]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill={route.color}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                            <h3 className="text-[16px] font-bold" style={{ color: route.color }}>{route.name}</h3>
                                            <span className="flex items-center gap-1 rounded-full bg-[#3A1F31] px-3 py-1 text-[12px] font-bold text-white">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> {route.safe_points_count} Safe Place
                                            </span>
                                        </div>
                                        <p className="mt-[12px] text-[14px] font-medium text-white/80"><span className="font-bold text-white">Alasan:</span> {route.reason}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between md:mt-0 md:ml-6 md:w-[180px]">
                                        <span className="text-[16px] font-bold text-white">{route.duration_mins} Menit</span>
                                        <button className="rounded-[20px] bg-[#FA1190] px-[20px] py-[10px] text-[14px] font-bold text-white hover:bg-[#d00e78] transition">Pilih Rute</button>
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