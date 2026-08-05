import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";

// Interface disesuaikan dengan asumsi response API
interface Contact {
    id?: string | number;
    initial: string;
    name: string;
    role: string;
}

export function TrustedContactsPage({ onClose }: { onClose: () => void }) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Mengambil data dari API saat komponen di-render
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                // Sesuaikan base URL API ini dengan milik kelompokmu
                const response = await fetch("https://be-her-route.vercel.app/api/trusted-contacts");
                if (response.ok) {
                    const data = await response.json();
                    // Pastikan struktur data dari API di-map sesuai kebutuhan komponen
                    setContacts(data);
                } else {
                    console.error("Gagal mengambil data kontak");
                }
            } catch (error) {
                console.error("Terjadi kesalahan:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

    return (
        <ModalWrapper onClose={onClose}>
            <div className="w-[631px] min-h-[608px] relative px-[51px] pt-[43px] pb-[60px]">
                <CloseBtn onClose={onClose} />

                <p className="font-light text-[16px] tracking-[0.15em] mt-[10px]" style={{ color: "#FA1190" }}>
                    TRUSTED CONTACTS
                </p>
                <h2 className="font-semibold text-[24px] leading-[29px] mt-[3px]" style={{ color: "#FCF8FA" }}>
                    Kontak Tepercaya
                </h2>
                <p className="text-[12px] leading-[15px] mt-[10px]" style={{ color: "#F7DDEB" }}>
                    Kontak ini menerima lokasi &amp; pesan darurat saat kamu menekan tombol SOS.
                </p>

                <div className="mt-[32px] flex flex-col min-h-[250px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full mt-10">
                            <span className="text-[#FA1190] animate-pulse">Memuat kontak...</span>
                        </div>
                    ) : contacts.length > 0 ? (
                        contacts.map((c, index) => (
                            <div key={c.id || index} className="contact-row flex items-center justify-between py-[14px]">
                                <div className="flex items-center gap-[10px]">
                                    <div
                                        className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold text-[16px] shrink-0"
                                        style={{ background: "#FA1190", color: "#FCF8FA" }}
                                    >
                                        {c.initial || c.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col gap-[5px]">
                                        <p className="font-semibold text-[16px] leading-[19px] text-white">{c.name}</p>
                                        <p className="text-[10px] leading-[12px] text-white/70">{c.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-[14px]">
                                    {/* Tombol Call dengan material-symbols:call */}
                                    <button
                                        className="w-[35px] h-[35px] rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                                        style={{ background: "#2A0017", border: "1px solid #F7DDEB", color: "#F9A8D4" }}
                                        aria-label="Call Contact"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                    </button>

                                    {/* Tombol Delete dengan mdi:bin */}
                                    <button
                                        className="w-[35px] h-[35px] rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                                        style={{ background: "#2A0017", border: "1px solid #F7DDEB", color: "#F9A8D4" }}
                                        aria-label="Delete Contact"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9M7 6h10v13H7V6m2 2v9h2V8H9m4 0v9h2V8h-2Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full mt-10">
                            <span className="text-white/50 text-sm">Belum ada kontak tepercaya.</span>
                        </div>
                    )}
                </div>

                <button className="btn-dashed mt-[22px] w-full h-[50px] flex items-center justify-center gap-[6px]">
                    <Plus size={20} />
                    Tambah Kontak
                </button>
            </div>
        </ModalWrapper>
    );
}