import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SOSButton({ onActivate }: { onActivate: () => void }) {
  const [pressing, setPressing] = useState(false);
  const [activated, setActivated] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPress = () => {
    if (activated) return;
    setPressing(true);
    setProgress(0);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      setProgress(Math.min((Date.now() - start) / 2000, 1));
    }, 16);
    timerRef.current = setTimeout(() => {
      setActivated(true);
      setPressing(false);
      onActivate();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(1);
    }, 2000);
  };

  const endPress = () => {
    if (activated) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPressing(false);
    setProgress(0);
  };

  useEffect(() => {
    if (!activated) return;
    const t = setTimeout(() => {
      setActivated(false);
      setProgress(0);
    }, 4000);
    return () => clearTimeout(t);
  }, [activated]);

  return (
    <div className="flex flex-col items-center gap-[16px]">
      {/* Radial orb */}
      <div className="sos-orb relative flex items-center justify-center w-[500px] h-[500px] overflow-visible">

        {/* Pulse rings on activation */}
        {activated &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-red-500/40"
              initial={{ width: 250, height: 250, opacity: 0.8 }}
              animate={{ width: 480, height: 480, opacity: 0 }}
              transition={{ duration: 1.6, delay: i * 0.45, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

        {/* Ripple rings while pressing */}
        {pressing &&
          [0, 1].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-red-400/30"
              initial={{ width: 250, height: 250, opacity: 0.6 }}
              animate={{ width: 360, height: 360, opacity: 0 }}
              transition={{ duration: 1, delay: i * 0.4, repeat: Infinity, ease: "easeOut" }}
            />
          ))}

        {/* Main button */}
        <motion.button
          onMouseDown={startPress}
          onMouseUp={endPress}
          onMouseLeave={endPress}
          onTouchStart={startPress}
          onTouchEnd={endPress}
          className="relative w-[250px] h-[250px] rounded-full flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          animate={activated ? { scale: [1, 1.1, 0.97, 1.04, 1] } : pressing ? { scale: 0.94 } : { scale: 1 }}
          transition={activated ? { duration: 0.5, times: [0, 0.2, 0.5, 0.8, 1] } : { duration: 0.15 }}
          whileHover={!pressing && !activated ? { scale: 1.04 } : {}}
          style={{
            background: activated ? "#cc0000" : "#FF0000",
            boxShadow: activated
              ? "0 0 60px rgba(255,0,0,0.9), 0 0 120px rgba(255,0,0,0.4)"
              : pressing
              ? "0 0 40px rgba(255,0,0,0.7)"
              : "0 0 24px rgba(255,0,0,0.45)",
          }}
        >
          {/* Hold-progress arc */}
          {pressing && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 250 250">
              <circle
                cx="125" cy="125" r="115"
                fill="none" stroke="white" strokeWidth="6" strokeOpacity="0.35"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 115}`}
                strokeDashoffset={`${2 * Math.PI * 115 * (1 - progress)}`}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />
            </svg>
          )}

          <motion.span
            className="font-black text-[75px] leading-none text-white"
            animate={activated ? { scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            SOS
          </motion.span>

          <AnimatePresence mode="wait">
            {activated ? (
              <motion.span
                key="sent"
                className="text-[16px] leading-[20px] text-white mt-[6px] font-semibold"
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                Bantuan Dikirim!
              </motion.span>
            ) : (
              <motion.span
                key="hold"
                className="text-[20px] leading-[24px] text-white mt-[4px]"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Tahan 2 Detik
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <motion.p
        className="text-[18px] leading-[22px] text-center max-w-[526px]"
        animate={activated ? { color: "#FF6B6B" } : { color: "#F9EBF3" }}
        transition={{ duration: 0.3 }}
      >
        {activated
          ? "Lokasi & pesan darurat sedang dikirim ke 3 kontak tepercayamu."
          : "Tahan tombol SOS selama 2 detik untuk mengirim lokasimu ke 3 kontak tepercaya dan memicu alarm."}
      </motion.p>
    </div>
  );
}
