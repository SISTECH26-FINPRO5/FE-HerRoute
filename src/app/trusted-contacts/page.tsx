import { useState, useEffect } from "react";
import { Plus, PhoneCall, Trash2 } from "lucide-react";
import { ModalWrapper, CloseBtn } from "../components/ModalWrapper";
import CallScreen from "./call"; // Jembatan penghubung CallScreen

const API_BASE = "https://be-her-route.vercel.app";

interface Contact {
  id: number;
  name: string;
  phone: string;
}

type ViewState = "list" | "add-form" | "confirm-add" | "confirm-delete";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token") || "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function TrustedContactsPage({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<ViewState>("list");
  const [contacts, setContacts] = useState<Contact[]>([]);

  // State untuk menampung data kontak saat layar telepon dimunculkan
  const [callingContact, setCallingContact] = useState<Contact | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trusted-contacts`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`GET gagal: ${res.status}`);
      const responseJson = await res.json();
      const contactsArray = responseJson.data || [];
      setContacts(
        contactsArray.map((item: { id: number; name: string; phone_number: string }) => ({
          id: item.id,
          name: item.name,
          phone: item.phone_number,
        }))
      );
    } catch (err) {
      console.error("Gagal memuat kontak:", err);
      alert("Gagal memuat kontak. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchContacts(); }, []);

  const handleAddContact = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/trusted-contacts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          phone_number: formData.phone,
        }),
      });
      if (!res.ok) throw new Error(`POST gagal: ${res.status}`);

      setFormData({ name: "", phone: "" });
      setView("list");
      await fetchContacts();
    } catch (err) {
      console.error("Gagal menambah kontak:", err);
      alert("Gagal menambah kontak. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${API_BASE}/trusted-contacts/${contactToDelete.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`DELETE gagal: ${res.status}`);

      setContactToDelete(null);
      setView("list");
      await fetchContacts();
    } catch (err) {
      console.error("Gagal menghapus kontak:", err);
      alert("Gagal menghapus kontak. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getInitial = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // ─── RENDER: CALL SCREEN ───
  if (callingContact) {
    return (
      <CallScreen
        name={callingContact.name}
        phone={callingContact.phone}
        onClose={() => {
          // menutup total modal Trusted Contacts, dan balik ke dashboard
          onClose();
        }}
      />
    );
  }

  // ─── RENDER: CONFIRM DELETE ───
  if (view === "confirm-delete") {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="w-[631px] px-[60px] py-[80px] flex flex-col items-center justify-center text-center">
          <h2 className="font-semibold text-[22px] text-white mb-4">Apakah Kamu Yakin Ingin Menghapus Kontak Ini?</h2>
          <p className="text-[14px] text-white/80 mb-[40px]">
            Kontak ini tidak akan lagi menerima informasi darurat dari kamu.
          </p>
          <div className="flex gap-[20px] w-full">
            <button
              onClick={() => {
                setContactToDelete(null);
                setView("list");
              }}
              disabled={isProcessing}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#5a0030" }}
            >
              No
            </button>
            <button
              onClick={handleDeleteContact}
              disabled={isProcessing}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#FA1190" }}
            >
              {isProcessing ? "Memproses..." : "Yes"}
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  // ─── RENDER: CONFIRM ADD ───
  if (view === "confirm-add") {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="w-[631px] px-[60px] py-[80px] flex flex-col items-center justify-center text-center">
          <h2 className="font-semibold text-[22px] text-white mb-4">Apakah Kamu Yakin Ingin Menambah Kontak Ini?</h2>
          <p className="text-[14px] text-white/80 mb-[40px]">
            Kontak ini akan mendapat notifikasi darurat saat tombol SOS ditekan.
          </p>
          <div className="flex gap-[20px] w-full">
            <button
              onClick={() => setView("add-form")}
              disabled={isProcessing}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#5a0030" }}
            >
              No
            </button>
            <button
              onClick={handleAddContact}
              disabled={isProcessing}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#FA1190" }}
            >
              {isProcessing ? "Menyimpan..." : "Yes"}
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  // ─── RENDER: FORM ADD ───
  if (view === "add-form") {
    return (
      <ModalWrapper onClose={onClose}>
        <div className="w-[631px] min-h-[608px] relative px-[51px] pt-[43px] pb-[60px]">
          <CloseBtn onClose={() => setView("list")} />
          <p className="font-light text-[16px] tracking-[0.15em] mt-[10px]" style={{ color: "#FA1190" }}>TRUSTED CONTACTS</p>
          <h2 className="font-semibold text-[24px] mt-[3px]" style={{ color: "#FCF8FA" }}>Kontak Tepercaya</h2>
          <p className="text-[12px] mt-[10px]" style={{ color: "#F7DDEB" }}>
            Kontak ini menerima lokasi & pesan darurat saat kamu menekan tombol SOS.
          </p>

          <div className="mt-[32px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-white">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nama kontak"
                className="w-full rounded-[10px] px-4 py-[14px] text-[14px] text-white outline-none"
                style={{ background: "#1A0F18", border: "1px solid rgba(255,255,255,0.05)" }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] text-white">Nomor Telepon</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="08xx-xxxx-xxxx"
                className="w-full rounded-[10px] px-4 py-[14px] text-[14px] text-white outline-none"
                style={{ background: "#1A0F18", border: "1px solid rgba(255,255,255,0.05)" }}
              />
            </div>
          </div>

          <div className="flex gap-[16px] mt-[40px]">
            <button
              onClick={() => setView("list")}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#5a0030" }}
            >
              Batal
            </button>
            <button
              onClick={() => {
                if (formData.name && formData.phone) setView("confirm-add");
              }}
              className="flex-1 rounded-[10px] py-[14px] text-[16px] font-bold text-white transition hover:opacity-80"
              style={{ background: "#FA1190" }}
            >
              Save
            </button>
          </div>
        </div>
      </ModalWrapper>
    );
  }

  // ─── RENDER: DEFAULT LIST ───
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
            contacts.map((c) => (
              <div key={c.id} className="contact-row flex items-center justify-between py-[14px] border-b border-white/5 last:border-0">
                <div className="flex items-center gap-[10px]">
                  <div
                    className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold text-[16px] shrink-0"
                    style={{ background: "#FA1190", color: "#FCF8FA" }}
                  >
                    {getInitial(c.name)}
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <p className="font-semibold text-[16px] leading-[19px] text-white">{c.name}</p>
                    <p className="text-[10px] leading-[12px] text-white/70">{c.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[14px]">
                  {/* Tombol Call yang sekarang memiliki onClick */}
                  <button
                    onClick={() => setCallingContact(c)}
                    className="w-[35px] h-[35px] rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                    style={{ background: "#2A0017", border: "1px solid #F7DDEB", color: "#F9A8D4" }}
                    aria-label="Call"
                  >
                    <PhoneCall size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setContactToDelete(c);
                      setView("confirm-delete");
                    }}
                    className="w-[35px] h-[35px] rounded-full flex items-center justify-center hover:opacity-75 transition-opacity"
                    style={{ background: "#2A0017", border: "1px solid #F7DDEB", color: "#F9A8D4" }}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
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

        <button
          onClick={() => setView("add-form")}
          className="btn-dashed mt-[22px] w-full h-[50px] flex items-center justify-center gap-[6px] transition hover:bg-white/5"
        >
          <Plus size={20} />
          Tambah Kontak
        </button>
      </div>
    </ModalWrapper>
  );
}