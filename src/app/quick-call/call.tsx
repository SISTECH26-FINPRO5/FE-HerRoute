import React, { useState, useEffect } from 'react';
import { Mic, Volume2, X } from 'lucide-react';

interface CallPopupProps {
    onClose: () => void;
}

// Icon polisi custom (map_police.svg)
function PoliceIcon({ size = 75 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.8712 30.816C42.8712 35.8695 38.6877 35.8695 36.4332 35.8695H33.6222V26.316H37.1547C39.1302 26.316 42.8712 26.316 42.8712 30.816ZM64.4652 25.7715C64.8822 20.6295 66.3717 15.9105 68.9997 11.5845L58.9212 1.5C55.7367 4.242 52.1127 5.76 48.0027 6.0285C44.3049 6.38373 40.5848 5.63522 37.3122 3.8775C33.8607 5.5965 30.3057 6.315 26.5992 6.0285C22.7652 5.685 19.3062 4.326 16.2072 1.917L6.10016 11.997C8.58716 16.385 9.96816 20.9765 10.2432 25.7715C10.3722 27.9795 9.74216 31.0185 8.32916 34.947C7.58966 37.125 7.03016 39.015 6.64916 40.593C6.29666 42.1605 6.07616 43.4355 6.00266 44.3895C5.95016 48.576 7.12466 52.356 9.53216 55.7145C11.4132 58.167 14.5152 60.8745 18.8232 63.837C23.5362 66.237 27.1842 67.7955 29.7387 68.4585L31.8567 69.4425C32.5227 69.7635 33.2367 70.074 33.9822 70.413C35.5887 71.376 36.7182 72.4215 37.3122 73.4985C38.0412 72.333 39.1947 71.3145 40.7277 70.413C41.6481 70.0189 42.5598 69.6048 43.4622 69.171C44.1972 68.8485 44.7447 68.6055 45.0627 68.457C45.7584 68.1208 46.4674 67.8131 47.1882 67.5345C48.0627 67.191 49.1412 66.7695 50.4297 66.3045C52.9197 65.421 54.7317 64.5885 55.8837 63.8355C60.0612 60.873 63.1152 58.2105 65.0592 55.827C67.5522 52.4535 68.7627 48.657 68.7072 44.388C68.5602 42.477 67.7517 39.4185 66.2832 35.2515C64.8822 31.1955 64.2612 28.0455 64.4652 25.7715ZM45.9402 39.5865C43.5477 41.1525 40.2582 41.1525 38.5407 41.1525H33.8232V54.0615H26.7297V20.9475H36.7992C41.4792 20.9475 45.3927 21.249 48.1107 24.5625C49.8072 26.6715 50.0937 29.067 50.0937 30.7695C50.0907 34.626 48.5022 37.881 45.9402 39.5865Z" fill="#FCF8FA" />
        </svg>
    );
}

// Icon telepon custom (material-symbols_call-sharp.svg), diputar utk kesan "end call"
function EndCallIcon({ size = 35 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(135deg)' }}>
            <path d="M29.0938 30.625C26.0556 30.625 23.048 29.9688 20.071 28.6562C17.0941 27.3438 14.3899 25.4722 11.9583 23.0417C9.52681 20.6111 7.65528 17.9132 6.34375 14.9479C5.03222 11.9826 4.37597 8.96875 4.375 5.90625V4.375H12.9792L14.3281 11.7031L10.1719 15.8958C10.7066 16.8438 11.3021 17.7431 11.9583 18.5938C12.6146 19.4444 13.3194 20.2344 14.0729 20.9635C14.7778 21.6684 15.5497 22.3431 16.3888 22.9877C17.2278 23.6323 18.1329 24.2336 19.1042 24.7917L23.3333 20.5625L30.625 22.0573V30.625H29.0938Z" fill="#FCF8FA" />
        </svg>
    );
}

export function CallPopup({ onClose }: CallPopupProps) {
    const [seconds, setSeconds] = useState(1);

    // Timer naik dari 00:01 sampai 00:05, lalu berhenti (popup tetap tampil)
    useEffect(() => {
        if (seconds >= 5) return;

        const interval = setInterval(() => {
            setSeconds((prev) => Math.min(prev + 1, 5));
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    // Format seconds to mm:ss
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

            {/* Container Utama (631x553) */}
            <div className="relative flex flex-col w-full max-w-[631px] h-[553px] rounded-[20px] bg-[#2A0017] p-[40px] shadow-2xl">

                {/* Tombol Close (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-[40px] right-[40px] text-[#FA1190] hover:opacity-80 transition-opacity"
                >
                    <X size={35} />
                </button>

                {/* Header Teks */}
                <div className="flex flex-col gap-2 mt-[10px]">
                    <span className="text-[12px] font-bold tracking-widest text-[#FA1190] uppercase">
                        EMERGENCY
                    </span>
                    <h2 className="text-[28px] font-bold text-white">
                        Panggilan Cepat
                    </h2>
                </div>

                {/* Bagian Tengah (Avatar & Status) */}
                <div className="flex flex-col items-center justify-center flex-1 mt-[20px]">

                    {/* Lingkaran Avatar Polisi */}
                    <div className="flex items-center justify-center w-[125px] h-[125px] rounded-full bg-[#FA1190] mb-[24px]">
                        <PoliceIcon size={75} />
                    </div>

                    {/* Teks Status */}
                    <h3 className="text-[24px] font-bold text-white mb-[8px]">Police</h3>
                    <p className="text-[16px] text-[#F7DDEB] mb-[8px]">Memanggil...</p>
                    <p className="text-[16px] font-medium text-white">{formatTime(seconds)}</p>
                </div>

                {/* Action Buttons Bawah */}
                <div className="flex items-center justify-center gap-[30px] mt-auto mb-[20px]">

                    {/* Mute Button */}
                    <button className="flex items-center justify-center w-[65px] h-[65px] rounded-full bg-[#75003F] opacity-70 hover:opacity-100 transition-opacity">
                        <Mic size={30} color="white" />
                    </button>

                    {/* End Call Button */}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-[75px] h-[75px] rounded-full bg-red-600 hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                    >
                        <EndCallIcon size={35} />
                    </button>

                    {/* Speaker Button */}
                    <button className="flex items-center justify-center w-[65px] h-[65px] rounded-full bg-[#75003F] opacity-70 hover:opacity-100 transition-opacity">
                        <Volume2 size={30} color="white" />
                    </button>

                </div>

            </div>
        </div>
    );
}