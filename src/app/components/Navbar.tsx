import { useState } from "react";

export interface NavbarProps {
  activePage?: "Homepage" | "Map" | "Report" | "Contact";
  onNavigate?: (page: "Homepage" | "Map" | "Report" | "Contact") => void;
  onLogout?: () => void;
  showProfileMenu?: boolean;
}

export function Navbar({ activePage = "Homepage", onNavigate, onLogout, showProfileMenu = true }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navItems: Array<"Homepage" | "Map" | "Report" | "Contact"> = ["Homepage", "Map", "Report", "Contact"];

  return (
    <nav className="fixed top-0 z-50 w-full flex items-center justify-between px-5 lg:px-[120px] py-4 bg-[#75003F] shadow-sm backdrop-blur-md">
      <div className="flex items-center gap-3 lg:gap-[17px]">
        <div className="flex h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] items-center justify-center rounded-full border border-white/20 bg-[#FA1190] text-[14px] lg:text-[16px] font-bold text-[#FCF8FA]">
          HR
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] lg:text-[18px] font-semibold text-[#FCF8FA]">HerRoute</span>
          <span className="text-[12px] lg:text-[13px] text-[#F7DDEB]">Perlindungan &amp; Rute Aman</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-[56px]">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => onNavigate?.(item)}
            className="pb-[5px] text-[18px] lg:text-[20px] font-semibold leading-[24px] text-[#F9EBF3] transition-all hover:opacity-80"
            style={{ borderBottom: activePage === item ? "3px solid #FA1190" : "3px solid transparent" }}
          >
            {item}
          </button>
        ))}
      </div>

      {showProfileMenu ? (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((open) => !open)}
            className="flex h-[40px] w-[40px] lg:h-[50px] lg:w-[50px] items-center justify-center rounded-full bg-[#FA1190] text-[16px] lg:text-[18px] font-semibold text-[#FCF8FA] hover:opacity-90 transition-opacity"
          >
            JD
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 top-[58px] z-40 min-w-[140px] overflow-hidden rounded-[10px] bg-[#2A0017] border border-[#F7DDEB33] shadow-lg">
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout?.();
                }}
                className="w-full px-[16px] py-[12px] text-left text-[14px] text-[#F7DDEB] hover:bg-[#75003F] transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[40px] w-[40px] lg:h-[50px] lg:w-[50px]" />
      )}
    </nav>
  );
}
