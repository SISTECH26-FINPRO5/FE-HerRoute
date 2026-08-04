import React from 'react';

// 1. Tambahin prop onCall ke interface
interface SosPopupProps {
    onClose: () => void;
    onCall: () => void; // Prop baru untuk pindah ke halaman call
}

// 2. Jangan lupa masukin onCall di parameter fungsi
export default function SosPopup({ onClose, onCall }: SosPopupProps) {
    const contacts = [
        { name: "Mama · Orang Tua" },
        { name: "John Doe · Pacar" },
        { name: "Karina · Sahabat" }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative flex flex-col items-center w-full max-w-[450px] rounded-[20px] bg-[#1A0F18] p-8 pb-6 border border-white/10 shadow-[0_0_40px_rgba(250,17,144,0.15)]">

                {/* Icon Bel / Alarm */}
                <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#75003F] mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                        <path d="M20.8333 43.75H29.1667C29.1667 46.0417 27.2917 47.9167 25 47.9167C22.7083 47.9167 20.8333 46.0417 20.8333 43.75ZM43.75 39.5834V41.6667H6.25V39.5834L10.4167 35.4167V22.9167C10.4167 16.4584 14.5833 10.8334 20.8333 8.95835V8.33335C20.8333 6.04169 22.7083 4.16669 25 4.16669C27.2917 4.16669 29.1667 6.04169 29.1667 8.33335V8.95835C35.4167 10.8334 39.5833 16.4584 39.5833 22.9167V35.4167L43.75 39.5834ZM35.4167 22.9167C35.4167 17.0834 30.8333 12.5 25 12.5C19.1667 12.5 14.5833 17.0834 14.5833 22.9167V37.5H35.4167V22.9167Z" fill="#F9A8D4" />
                    </svg>
                </div>

                {/* Text Area */}
                <h2 className="text-[28px] font-bold text-white mb-3 tracking-wide">
                    SOS Terkirim
                </h2>
                <p className="text-center text-[14px] text-gray-300 mb-8 max-w-[300px] leading-relaxed">
                    Lokasi & pesan daruratmu telah dibagikan ke kontak tepercaya. Alarm suara diaktifkan.
                </p>

                {/* List Kontak Tercall */}
                <div className="flex w-full flex-col gap-[10px] mb-8">
                    {contacts.map((contact, index) => (
                        <div
                            key={index}
                            className="flex h-[52px] w-full items-center justify-between rounded-[10px] border border-[#F7DDEB] bg-[#1A0F18] px-[25px]"
                        >
                            <span className="text-[15px] font-medium text-white">{contact.name}</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 13L9 17L19 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* Tombol Action */}
                <div className="flex w-full flex-col gap-4">
                    {/* 3. Pasang onClick={onCall} di tombol ini */}
                    <button
                        onClick={onCall}
                        className="flex h-[62px] w-full items-center justify-center rounded-[15px] bg-[#FA1190] text-[18px] font-bold text-white hover:bg-[#d40c79] transition-colors"
                    >
                        Hubungi 110 Sekarang
                    </button>

                    <button
                        onClick={onClose}
                        className="flex h-[62px] w-full items-center justify-center rounded-[15px] border border-black bg-[#75003F] text-[18px] font-bold text-white hover:bg-[#5c0032] transition-colors"
                    >
                        Tutup
                    </button>
                </div>

                <p className="mt-6 text-[12px] text-gray-500">
                    Alarm aktif — tim tepercaya sudah diberi tahu
                </p>
            </div>
        </div>
    );
}