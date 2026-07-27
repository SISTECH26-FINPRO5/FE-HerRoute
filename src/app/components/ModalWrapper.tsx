import { X } from "lucide-react";

export function ModalWrapper({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="modal-card relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function CloseBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      className="absolute top-[43px] right-[43px] w-[35px] h-[35px] flex items-center justify-center hover:opacity-75 transition-opacity"
      style={{ color: "#FA1190" }}
    >
      <X size={20} strokeWidth={2.5} />
    </button>
  );
}
