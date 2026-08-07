import { useState } from "react";
import { Plus, Upload, Check } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";

const incidentTypes = ["Catcalling", "Penguntitan", "Pelecehan Fisik"];

export function AnonymousReportPage({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggle = (t: string) =>
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  // --- FUNGSI SUBMIT KE API ---
  const handleSubmit = async () => {
    if (selected.length === 0) {
      alert("Pilih minimal satu jenis kejadian!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Data disesuaikan dengan kebutuhan Body API di Swagger
      const payload = {
        lat: -6.2444, // Default sementara (bisa diubah dengan data GPS asli)
        lon: 106.7973, // Default sementara
        category: selected.join(", "),
        description: "Dilaporkan secara anonim dari aplikasi", 
      };

      const res = await fetch("https://be-her-route.vercel.app/api/ml/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim laporan");
      }

      // Jika berhasil, ubah tampilan ke halaman sukses
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengirim laporan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <div className="w-[631px] relative px-[51px] pt-[43px] pb-[60px]">
        <CloseBtn onClose={onClose} />

        <p className="font-light text-[16px] tracking-[0.15em] mt-[10px]" style={{ color: "#FA1190" }}>
          ANONYMOUS REPORT
        </p>
        <h2 className="font-semibold text-[24px] leading-[29px] mt-[3px]" style={{ color: "#FCF8FA" }}>
          Lapor Kejadian
        </h2>

        {isSuccess ? (
          /* ── Tampilan Sukses (Pop-up Laporan Terkirim) ── */
          <div className="flex flex-col items-center justify-center mt-[50px] mb-[20px]">
            <div 
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center mb-[24px]" 
              style={{ background: "#1A2E20" /* Warna hijau gelap disesuaikan dengan desain */ }}
            >
              <Check size={45} color="#4ADE80" />
            </div>
            <h3 className="font-semibold text-[24px] text-white mb-[16px]">Laporan Terkirim</h3>
            <p className="text-center text-[16px] leading-[24px] mb-[40px] px-[20px]" style={{ color: "rgba(252,248,250,0.8)" }}>
              Terima kasih. Laporanmu membantu membuat kawasan<br />ini lebih aman untuk semua orang.
            </p>
            <button
              onClick={onClose}
              className="w-[200px] h-[50px] rounded-[10px] font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: "#75003F" }}
            >
              Kembali
            </button>
          </div>
        ) : (
          /* ── Tampilan Form Asli ── */
          <>
            <button className="btn-dashed mt-[20px] w-full h-[50px] flex items-center justify-center gap-[6px]">
              <Plus size={20} />
              Tambah Bukti
            </button>

            <div className="mt-[22px] flex flex-col gap-[12px]">
              {incidentTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t)}
                  className={`incident-chip${selected.includes(t) ? " selected" : ""} w-full h-[53px] flex items-center px-[16px] transition-colors`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              className="mt-[22px] w-full h-[50px] flex items-center gap-[6px] px-[30px] rounded-[15px] font-semibold text-[14px] hover:opacity-80 transition-opacity"
              style={{ border: "1px solid #F7DDEB", background: "#2A0017", color: "#F7DDEB" }}
            >
              <Upload size={18} />
              Unggah Foto / Video Bukti
            </button>

            <div
              className="mt-[22px] w-full rounded-[15px] px-[30px] py-[16px] flex flex-col gap-[12px]"
              style={{ background: "#2A0017", border: "1px solid #F7DDEB" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14px]" style={{ color: "rgba(247,221,235,0.75)" }}>Location</span>
                <span className="font-semibold text-[16px]" style={{ color: "#FCF8FA" }}>Jl. Jakarta Selatan</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px]" style={{ color: "rgba(247,221,235,0.75)" }}>Timestamp</span>
                <span className="font-semibold text-[16px]" style={{ color: "#FCF8FA" }}>26 Jul 2026, 01:28:36</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-primary mt-[22px] h-[62px] w-full flex items-center justify-center rounded-[15px] text-[24px]"
              style={{ borderRadius: "15px", opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "wait" : "pointer" }}
            >
              {isSubmitting ? "Mengirim..." : "Submit Report"}
            </button>

            <p className="mt-[22px] text-[14px] text-center" style={{ color: "rgba(252,248,250,0.75)" }}>
              Report harassment: catcalling, following, physical contact. Location auto-filled, timestamp saved.
            </p>
          </>
        )}
      </div>
    </ModalWrapper>
  );
}