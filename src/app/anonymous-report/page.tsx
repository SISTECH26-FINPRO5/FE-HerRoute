import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";

const incidentTypes = ["Catcalling", "Penguntitan", "Pelecehan Fisik"];

export function AnonymousReportPage({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (t: string) =>
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

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

        {/* Add evidence */}
        <button className="btn-dashed mt-[20px] w-full h-[50px] flex items-center justify-center gap-[6px]">
          <Plus size={20} />
          Tambah Bukti
        </button>

        {/* Incident type chips */}
        <div className="mt-[22px] flex flex-col gap-[12px]">
          {incidentTypes.map((t) => (
            <button
              key={t}
              onClick={() => toggle(t)}
              className={`incident-chip${selected.includes(t) ? " selected" : ""} w-full h-[53px] flex items-center px-[16px]`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Upload evidence file */}
        <button
          className="mt-[22px] w-full h-[50px] flex items-center gap-[6px] px-[30px] rounded-[15px] font-semibold text-[14px] hover:opacity-80 transition-opacity"
          style={{ border: "1px solid #F7DDEB", background: "#2A0017", color: "#F7DDEB" }}
        >
          <Upload size={18} />
          Unggah Foto / Video Bukti
        </button>

        {/* Auto-filled metadata */}
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

        {/* Submit */}
        <button
          className="btn-primary mt-[22px] h-[62px] rounded-[15px] text-[24px]"
          style={{ borderRadius: "15px" }}
        >
          Submit Report
        </button>

        <p className="mt-[22px] text-[14px] text-center" style={{ color: "rgba(252,248,250,0.75)" }}>
          Report harassment: catcalling, following, physical contact. Location auto-filled, timestamp saved.
        </p>
      </div>
    </ModalWrapper>
  );
}
