import React, { useState, useEffect, useMemo } from "react";
// IMPORT LEAFLET COMPONENTS
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import logo from "@/imports/logo.png";
// IMPORT RECHARTS
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
                
                <text x="63" y="44" fill="white" font-family="sans-serif" font-weight="bold" font-size="9px" text-anchor="middle">Posisi kamu</text>
                <text x="63" y="55" fill="white" font-family="sans-serif" font-weight="bold" font-size="9px" text-anchor="middle">saat ini</text>
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

function computeBearing(from: [number, number], to: [number, number]): number {
    const [lat1, lon1] = from.map((v) => (v * Math.PI) / 180);
    const [lat2, lon2] = to.map((v) => (v * Math.PI) / 180);
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearingRad = Math.atan2(y, x);
    return ((bearingRad * 180) / Math.PI + 360) % 360;
}


// 1. MOCK GEOCODER (PENERJEMAH TEKS KE KOORDINAT)
// Menerjemahkan input teks (misal "blok m") menjadi titik koordinat Latitude/Longitude asli.
// Karena API ML hanya menerima angka koordinat, kita butuh kamus ini sebelum memanggil API.
const MOCK_GEOCODER: Record<string, { lat: number, lon: number }> = {
    "blok m": { lat: -6.2444, lon: 106.7973 },
    "echigoya": { lat: -6.2450, lon: 106.7995 },
    "dukuh atas": { lat: -6.2023, lon: 106.8222 },
    "lebak bulus": { lat: -6.2893, lon: 106.7744 },
};

const getCoordinates = (placeName: string, fallbackLat: number, fallbackLon: number) => {
    const query = placeName.toLowerCase();
    for (const key in MOCK_GEOCODER) {
        if (query.includes(key)) return MOCK_GEOCODER[key];
    }
    return { lat: fallbackLat, lon: fallbackLon };
};

const DUMMY_ROUTES = [
    {
        id: "route_a",
        name: "Rute A (Paling Aman)",
        risk_level: "low",
        duration_mins: 10,
        safe_points_count: 2,
        reason: "Jalur utama, penerangan baik, melewati 2 safe place.",
        color: "#22C55E",
        waypoints: [[-6.2444, 106.7973], [-6.2446, 106.7982], [-6.2447, 106.7990], [-6.2450, 106.7995]] as [number, number][],
    },
    {
        id: "route_b",
        name: "Rute B (Alternatif)",
        risk_level: "medium",
        duration_mins: 14,
        safe_points_count: 1,
        reason: "Rute lebih pendek, tapi menyerempet ujung area waspada.",
        color: "#EAB308",
        waypoints: [[-6.2444, 106.7973], [-6.2448, 106.7985], [-6.2452, 106.7993], [-6.2450, 106.7995]] as [number, number][],
    },
    {
        id: "route_c",
        name: "Rute C (Waspada)",
        risk_level: "high",
        duration_mins: 15,
        safe_points_count: 0,
        reason: "Melewati area dengan laporan rawan tinggi, hindari di malam hari.",
        color: "#EF4444",
        waypoints: [[-6.2444, 106.7973], [-6.2452, 106.7988], [-6.2460, 106.7998], [-6.2450, 106.7995]] as [number, number][],
    },
];

// ─── DATA GRAFIK PREDIKSI RISIKO WAKTU ───
const riskChartData = [
    { time: '17:00', risk: 40 },
    { time: '17:30', risk: 85 },
    { time: '18:00', risk: 50 },
    { time: '18:30', risk: 10 },
    { time: '19:00', risk: 45 },
    { time: '19:30', risk: 48 },
    { time: '20:00', risk: 50 },
];

const CustomYAxisTick = ({ x, y, payload }: any) => {
    let text = "Rendah";
    let color = "#22C55E";

    if (payload.value === 50) {
        text = "Sedang";
        color = "#EAB308";
    } else if (payload.value === 90) {
        text = "Tinggi";
        color = "#EF4444";
    }

    return (
        <text x={x} y={y} dy={4} textAnchor="end" fill={color} fontSize={12} fontWeight={500}>
            {text}
        </text>
    );
};

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
    const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
    const [activeNav, setActiveNav] = useState("Map");
    const [zoneDataMap, setZoneDataMap] = useState<{ [key: number]: any }>({});
    const [loadingZoneId, setLoadingZoneId] = useState<number | null>(null);

    // Default Pusat Peta
    const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2444, 106.7973]);

    useEffect(() => {
        const fetchSafePlaces = async () => {
            try {
                const response = await fetch(`https://be-her-route.vercel.app/api/ml/safe-places?lat=-6.2444&lon=106.7973&k=3`);
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

    const handleZoneClick = async (zoneId: number, lat: number, lon: number) => {
        setLoadingZoneId(zoneId);
        try {
            const payload = { lat: lat, lon: lon, dow: 0, hour: 19 };
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

    const RISK_LEVEL_MULTIPLIER: { [key: string]: number } = { low: 1, medium: 1.4, high: 1.9 };

    const handleSearchRoute = async () => {
        setIsLoading(true);
        try {
            // 2. PROSES PENGIRIMAN DATA KOORDINAT KE API ML
            // A. Gunakan Mock Geocoder untuk menerjemahkan teks di inputan menjadi angka koordinat.
            const startCoords = getCoordinates(startPoint, -6.2444, 106.7973);
            const endCoords = getCoordinates(endPoint, -6.2450, 106.7995);

            // B. Geser titik pusat peta (Leaflet Map Center) sesuai koordinat awal rute.
            setMapCenter([startCoords.lat, startCoords.lon]);

            // C. Siapkan format data (JSON Payload) yang diminta oleh API ML.
            const payload = {
                start_lat: startCoords.lat,
                start_lon: startCoords.lon,
                end_lat: endCoords.lat,
                end_lon: endCoords.lon,
                mode: "safe"
            };

            // D. Tembak endpoint API ML dengan metode POST dan kirim koordinatnya.
            const routeResponse = await fetch("https://be-her-route.vercel.app/api/ml/safe-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (routeResponse.ok) {
                // E. Tangkap balasan hasil perhitungan risiko dari API ML.
                const routeData = await routeResponse.json();
                const baseAvgRisk = routeData.avg_risk || 18.94;
                const mockNote = routeData.mock_note || '';

                // Regenerate dummy waypoints berdasarkan koordinat baru agar rutenya pindah
                const updatedRoutes = DUMMY_ROUTES.map((route, i) => {
                    const multiplier = RISK_LEVEL_MULTIPLIER[route.risk_level] ?? 1;
                    const routeRiskScore = (baseAvgRisk * multiplier).toFixed(2);

                    const offset = i * 0.0005; // Sedikit pergeseran koordinat agar rute beda-beda
                    const newWaypoints = [
                        [startCoords.lat, startCoords.lon],
                        [startCoords.lat - offset, startCoords.lon + 0.001],
                        [endCoords.lat + offset, endCoords.lon - 0.001],
                        [endCoords.lat, endCoords.lon]
                    ] as [number, number][];

                    return {
                        ...route,
                        waypoints: newWaypoints,
                        reason: `Rute hasil generate AI. Avg Risk Score: ${routeRiskScore}. ${mockNote}`
                    };
                });

                // 3. MENGGABUNGKAN HASIL API KE UI
                // Setelah data rute di-update, simpan ke State `routes`. 
                setRoutes(updatedRoutes);
                setIsRouteDrawn(true);
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
            <nav className="fixed top-0 z-50 flex h-[80px] lg:h-[103px] w-full items-center justify-between px-5 lg:px-[120px] bg-[#75003F]">
                <div className="flex items-center gap-2 lg:gap-[17px]">
                    <img src={logo} alt="HerRoute logo" className="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] rounded-full object-cover" />
                    <div className="flex flex-col">
                        <span className="text-[14px] lg:text-[16px] font-bold leading-[19px] text-[#FCF8FA]">HerRoute</span>
                        <span className="hidden lg:block text-[12px] leading-[15px] text-[#F7DDEB]">Perlindungan & Rute Aman</span>
                    </div>
                </div>

                <div className="hidden lg:flex mx-auto items-center gap-[56px]">
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
                <div className="flex h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#FA1190] text-[14px] lg:text-[16px] font-bold text-[#FCF8FA] hover:opacity-80">JD</div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <div className="mx-auto pt-[100px] lg:pt-[143px] pb-[40px] flex flex-col lg:flex-row max-w-[1300px] justify-center gap-[30px] px-[20px]">

                {/* KOLOM KIRI */}
                <section className="flex w-full lg:w-[472px] shrink-0 flex-col gap-[30px]">

                    {/* FORM RUTE */}
                    <div className="rounded-[15px] bg-[#1E2024] px-5 py-8 lg:px-[50px] lg:py-[60px]">
                        <h2 className="mb-6 lg:mb-8 text-[18px] lg:text-[20px] font-bold text-white">Masukkan Rute Anda</h2>
                        <div className="mb-8 lg:mb-[40px] flex items-center gap-4 relative">
                            <div className="relative flex-1 flex flex-col gap-5">
                                <div className="absolute left-[15px] top-[40px] z-0 h-10 w-[2px] bg-white/20"></div>

                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 18C19 19.657 15.866 21 12 21C8.134 21 5 19.657 5 18C5 16.452 7.737 15.1781 11.25 15.0181V17C11.25 17.41 11.59 17.75 12 17.75C12.41 17.75 12.75 17.41 12.75 17V15.0181C16.263 15.1781 19 16.452 19 18ZM12.75 15.0181V10.9241C14.6 10.5721 16 8.952 16 7C16 4.791 14.209 3 12 3C9.791 3 8 4.791 8 7C8 8.952 9.4 10.5731 11.25 10.9241V15.0181C11.497 15.0071 11.746 15 12 15C12.254 15 12.503 15.0071 12.75 15.0181Z" fill="#FA1190" />
                                        </svg>
                                    </span>
                                    <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]" />
                                </div>

                                <div className="relative z-10 flex items-center gap-4 pr-[20px]">
                                    <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA1190">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M11.54 22.351a.76.76 0 00.92 0c.169-.12.706-.512 1.404-1.115a19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.683 2.282c.698.603 1.235.995 1.404 1.115H11.54zM12 13.5a3 3 0 100-6 3 3 0 000 6z" />
                                        </svg>
                                    </span>
                                    <input type="text" value={endPoint} onChange={(e) => setEndPoint(e.target.value)} className="w-full rounded-[10px] border border-white/10 bg-[#120B11] px-4 py-[14px] text-[14px] font-semibold text-white outline-none focus:border-[#FA1190]" />
                                </div>
                            </div>
                            <button className="absolute -right-2 lg:-right-5 top-[32px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FA1190] hover:bg-[#d00e78] shadow-lg z-20">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" /></svg>
                            </button>
                        </div>

                        <button onClick={handleSearchRoute} disabled={isLoading} className={`flex w-full items-center justify-center gap-2 rounded-[10px] py-[16px] text-[16px] font-bold text-white transition ${isLoading ? "bg-[#75003F] cursor-wait" : "bg-[#FA1190] hover:bg-[#d00e78]"}`}>
                            {isLoading ? <span className="animate-pulse">Menghitung Risiko...</span> : <><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Cari Rute Aman</>}
                        </button>
                    </div>

                    {/* GRAFIK PREDIKSI RISIKO WAKTU */}
                    <div className="rounded-[15px] bg-[#1E2024] p-5 lg:p-[40px]">
                        <h2 className="mb-[24px] text-[18px] lg:text-[20px] font-bold text-white">Prediksi Risiko Waktu</h2>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={riskChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FA1190" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#FA1190" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
                                    <XAxis
                                        dataKey="time"
                                        stroke="rgba(255,255,255,0.6)"
                                        fontSize={12}
                                        tickLine={true}
                                        axisLine={true}
                                    />
                                    <YAxis
                                        ticks={[10, 50, 90]}
                                        tick={<CustomYAxisTick />}
                                        axisLine={true}
                                        tickLine={false}
                                        domain={[0, 100]}
                                        stroke="rgba(255,255,255,0.6)"
                                        width={60}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1A0F18', border: '1px solid #FA1190', borderRadius: '8px' }}
                                        labelStyle={{ color: '#FCF8FA' }}
                                        itemStyle={{ color: '#FA1190' }}
                                    />
                                    <Area type="monotone" dataKey="risk" stroke="#FA1190" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* SAFE PLACE LIST */}
                    <div className="rounded-[15px] bg-[#1E2024] p-5 lg:p-[40px]">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[18px] lg:text-[20px] font-bold text-white">Safe Place Terdekat</h2>
                                <span className="text-[14px] font-normal text-white/50">(Radius 500m)</span>
                            </div>
                            <span className="cursor-pointer text-[14px] font-medium text-[#FA1190] hover:underline">Lihat Semua {">"}</span>
                        </div>

                        <div className="space-y-[20px] mt-[20px] lg:mt-[30px]">
                            {safePlaces.length > 0 ? safePlaces.map((place) => (
                                <div key={place.id} className="border-b border-white/10 pb-[20px] last:border-0 last:pb-0">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FA1190"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                            <span className="text-[14px] lg:text-[16px] font-bold">{place.name}</span>
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
                </section>

                {/* KOLOM KANAN (MAP + RUTE) */}
                <section className="flex w-full lg:w-auto lg:flex-1 flex-col gap-[30px]">

                    <div className="relative h-[350px] lg:h-[480px] w-full overflow-hidden rounded-[15px] border border-white/5 bg-[#120B11] z-0">
                        <MapContainer
                            center={mapCenter}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: '100%', width: '100%', zIndex: 0 }}
                            key={mapCenter.join(',')} // Trick untuk merefresh center peta
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
                                                        </div>
                                                    ) : (
                                                        <p className="text-[12px] text-gray-600">{zone.info}</p>
                                                    )}
                                                </div>
                                            </Popup>
                                        </Rectangle>

                                        {zone.badgePosition && (
                                            <Marker position={zone.badgePosition} icon={shieldStarIcon(zone.color)} interactive={false} />
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {/* ============================================================================
                                BAGIAN INI MENGGAMBAR HASIL DARI API KE PETA (LEAFLET)
                                ============================================================================ */}
                            {isRouteDrawn && activeRoute && (
                                <React.Fragment>
                                    {/* Komponen Polyline ini akan menggambar garis jalan raya mengikuti titik-titik (waypoints) yang ada di activeRoute */}
                                    <Polyline
                                        positions={activeRoute.waypoints}
                                        pathOptions={{
                                            color: activeRoute.color,
                                            weight: 5,
                                            opacity: 0.9,
                                            dashArray: activeRoute.risk_level === "high" ? "8 8" : undefined,
                                        }}
                                    />
                                    {/* Menggambar ikon panah kecil di sepanjang garis rute */}
                                    {arrowMarkers.map((a) => (
                                        <Marker key={a.key} position={a.position} icon={routeArrowIcon(activeRoute.color, a.angle)} interactive={false} />
                                    ))}
                                </React.Fragment>
                            )}

                            {/* Posisi Awal Berdasarkan Input */}
                            <Marker position={mapCenter} icon={currentPositionIcon} />
                        </MapContainer>

                        <div className="hidden sm:block absolute bottom-[20px] left-[20px] rounded-[10px] bg-[#1E2024]/95 p-4 shadow-lg backdrop-blur-sm border border-white/10 z-[1000] pointer-events-none">
                            <h3 className="mb-2 text-[12px] font-bold text-white">Legenda</h3>
                            <div className="flex flex-col gap-2 text-[11px] font-semibold text-white/80">
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"></div> Area Aman</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EAB308]"></div> Area Waspada</div>
                                <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-[#EF4444]"></div> Area Rawan</div>
                                {isRouteDrawn && activeRoute && (
                                    <div className="flex items-center gap-2 pt-1 mt-1 border-t border-white/10">
                                        <div className="h-[3px] w-4 rounded-full" style={{ background: activeRoute.color }}></div> Rute Terpilih
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* DAFTAR PILIHAN RUTE */}
                    <div className="rounded-[15px] bg-[#1E2024] p-5 lg:p-[40px]">
                        <h2 className="mb-[24px] text-[18px] lg:text-[20px] font-bold text-white">Pilih Rute Aman</h2>
                        <div className="flex flex-col gap-[16px]">
                            {routes.map((route) => {
                                const isSelected = selectedRouteId === route.id;
                                return (
                                    <div
                                        key={route.id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-[20px] bg-[#120B11] p-[20px] lg:p-[24px] transition"
                                        style={{ border: isSelected ? `1.5px solid ${route.color}` : "1px solid rgba(255,255,255,0.05)" }}
                                    >
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 lg:gap-[12px]">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill={route.color} className="shrink-0"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                                <h3 className="text-[14px] lg:text-[16px] font-bold" style={{ color: route.color }}>{route.name}</h3>
                                                <span className="flex items-center gap-1 rounded-full bg-[#3A1F31] px-3 py-1 text-[10px] lg:text-[12px] font-bold text-white whitespace-nowrap">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#FA1190" className="shrink-0"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg> {route.safe_points_count} Safe Place
                                                </span>
                                            </div>
                                            <p className="mt-[12px] text-[12px] lg:text-[14px] font-medium text-white/80">
                                                <span className="font-bold text-white">Alasan:</span> {route.reason}
                                            </p>
                                        </div>

                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 lg:gap-4 shrink-0 mt-3 sm:mt-0">
                                            <span className="text-[14px] lg:text-[16px] font-bold text-white whitespace-nowrap">{route.duration_mins} Menit</span>
                                            <button
                                                onClick={() => {
                                                    setIsRouteDrawn(true);
                                                    setSelectedRouteId(route.id);
                                                }}
                                                className="shrink-0 rounded-[20px] px-[16px] py-[8px] lg:px-[20px] lg:py-[10px] text-[12px] lg:text-[14px] font-bold text-white transition whitespace-nowrap"
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