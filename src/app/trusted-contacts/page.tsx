import { Plus, PhoneCall, Trash2 } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";

const contacts = [
  { initial: "J", name: "Mama",            role: "Orang Tua · 0812-3456-7890" },
  { initial: "A", name: "Kakak Perempuan", role: "Saudara · 0813-9876-5432"   },
  { initial: "R", name: "Sahabat",         role: "Teman · 0857-1234-5678"     },
];

export function TrustedContactsPage({ onClose }: { onClose: () => void }) {
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

        <div className="mt-[32px] flex flex-col">
          {contacts.map((c) => (
            <div key={c.name} className="contact-row flex items-center justify-between py-[14px]">
              <div className="flex items-center gap-[10px]">
                <div
                  className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold text-[16px] shrink-0"
                  style={{ background: "#FA1190", color: "#FCF8FA" }}
                >
                  {c.initial}
                </div>
                <div className="flex flex-col gap-[5px]">
                  <p className="font-semibold text-[16px] leading-[19px] text-white">{c.name}</p>
                  <p className="text-[10px] leading-[12px] text-white/70">{c.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-[14px]">
                {([<PhoneCall size={16} />, <Trash2 size={16} />] as React.ReactNode[]).map((icon, i) => (
                  <button
                    key={i}
                    className="w-[35px] h-[35px] rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                    style={{ background: "#2A0017", border: "1px solid #F7DDEB", color: "#F9A8D4" }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="btn-dashed mt-[22px] w-full h-[50px] flex items-center justify-center gap-[6px]">
          <Plus size={20} />
          Tambah Kontak
        </button>
      </div>
    </ModalWrapper>
  );
}
