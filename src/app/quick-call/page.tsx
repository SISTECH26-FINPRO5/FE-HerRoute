import { Shield, Ambulance, Flame, HardHat } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";

const emergencyServices = [
  { icon: <Shield size={28} style={{ color: "#F7DDEB" }} />,   name: "Police",      number: "110" },
  { icon: <Ambulance size={28} style={{ color: "#F7DDEB" }} />, name: "Ambulance",  number: "119" },
  { icon: <Flame size={28} style={{ color: "#F7DDEB" }} />,    name: "Firefighter", number: "113" },
  { icon: <HardHat size={28} style={{ color: "#F7DDEB" }} />,  name: "Basarnas",    number: "115" },
];

export function QuickCallPage({ onClose }: { onClose: () => void }) {
  return (
    <ModalWrapper onClose={onClose}>
      <div className="w-[631px] min-h-[553px] relative px-[53px] pt-[43px] pb-[60px]">
        <CloseBtn onClose={onClose} />

        <p className="font-light text-[16px] tracking-[0.15em] mt-[10px]" style={{ color: "#FA1190" }}>
          EMERGENCY
        </p>
        <h2 className="font-semibold text-[24px] leading-[29px] mt-[3px]" style={{ color: "#FCF8FA" }}>
          Panggilan Cepat
        </h2>

        <div className="mt-[30px] grid grid-cols-2 gap-[16px]">
          {emergencyServices.map((s) => (
            <button key={s.name} className="emergency-card flex flex-col items-center justify-center gap-[8px] py-[13px] min-h-[146px]">
              <div className="emergency-icon">{s.icon}</div>
              <div className="flex flex-col items-center gap-[2px]">
                <p className="font-semibold text-[16px] leading-[19px]" style={{ color: "#FCF8FA" }}>{s.name}</p>
                <p className="text-[14px] leading-[17px]" style={{ color: "#F7DDEB" }}>{s.number}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
}
