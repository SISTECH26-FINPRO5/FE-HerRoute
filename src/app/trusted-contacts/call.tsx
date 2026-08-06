import { useState, useEffect } from "react";
import { Mic, Phone, Volume2, X } from "lucide-react";

interface CallScreenProps {
    name: string;
    phone: string;
    onClose: () => void;
}

export default function CallScreen({ name, phone, onClose }: CallScreenProps) {
    const initial = name.charAt(0).toUpperCase();
    const [seconds, setSeconds] = useState(1);

    // Timer logic: mulai dari 1, berhenti saat mencapai 5
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => {
                if (prev >= 5) {
                    clearInterval(interval);
                    return 5;
                }
                return prev + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (sec: number) => `00:0${sec}`;

    return (
        // PERUBAHAN DI SINI: Menggunakan 'fixed inset-0 z-50' agar menjadi pop-up melayang di atas segalanya
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

            <div className="w-[631px] min-h-[608px] relative px-[51px] pt-[43px] pb-[60px] bg-[#1a000e] rounded-3xl border border-[#FA1190]/20 shadow-2xl">

                <button onClick={onClose} className="absolute top-[43px] right-[51px] text-[#FA1190] hover:opacity-75 transition-opacity">
                    <X size={24} />
                </button>

                <p className="font-light text-[16px] tracking-[0.15em] mt-[10px]" style={{ color: "#FA1190" }}>
                    TRUSTED CONTACTS
                </p>
                <h2 className="font-semibold text-[24px] leading-[29px] mt-[3px]" style={{ color: "#FCF8FA" }}>
                    Kontak Tepercaya
                </h2>
                <p className="text-[12px] leading-[15px] mt-[10px]" style={{ color: "#F7DDEB" }}>
                    Kontak ini menerima lokasi & pesan darurat saat kamu menekan tombol SOS.
                </p>

                <div className="flex flex-col items-center justify-center mt-[80px]">
                    <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center text-[48px] font-semibold mb-[20px]" style={{ background: "#FA1190", color: "#FCF8FA" }}>
                        {initial}
                    </div>

                    <h3 className="text-[24px] font-semibold text-white mb-[8px]">{name}</h3>

                    <p className="text-[#F7DDEB] text-[16px] mb-[4px] font-light">Tersambung</p>
                    <p className="text-white text-[16px] tracking-widest">{formatTime(seconds)}</p>

                    <div className="flex items-center gap-[30px] mt-[60px]">
                        <button className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: "#4a0029", color: "white" }}>
                            <Mic size={24} />
                        </button>

                        <button onClick={onClose} className="w-[80px] h-[80px] rounded-full flex items-center justify-center bg-[#FF0000] transition-transform hover:scale-105" style={{ color: "white", boxShadow: "0 4px 14px 0 rgba(255, 0, 0, 0.39)" }}>
                            <Phone size={32} fill="currentColor" />
                        </button>

                        <button className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-opacity hover:opacity-80" style={{ background: "#4a0029", color: "white" }}>
                            <Volume2 size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}