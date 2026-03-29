import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

type ResultType = "BIG" | "SMALL";

interface PeriodEntry {
  result: ResultType;
  numbers: [number, number, number];
}

function pickThree(pool: number[]): [number, number, number] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1], shuffled[2]];
}

function generateResult(): PeriodEntry {
  const result: ResultType = Math.random() < 0.5 ? "BIG" : "SMALL";
  const pool = result === "BIG" ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  return { result, numbers: pickThree(pool) };
}

const VALID_KEYS = new Set(
  Array.from({ length: 200 }, (_, i) => `PRIVATEHACK${i + 1}`),
);

function PrivateKeyScreen({ onUnlock }: { onUnlock: () => void }) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (VALID_KEYS.has(key.trim().toUpperCase())) {
      onUnlock();
    } else {
      setError("Invalid private key. Access denied.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #070A12 0%, #0B1020 50%, #0D0818 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center gap-1 select-none">
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "0.15em",
              color: "#49E6FF",
              textShadow: "0 0 24px #49E6FF",
            }}
          >
            QUANTA
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.12em",
              background: "linear-gradient(90deg, #9D4EDD, #49E6FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PREDICT
          </span>
        </div>

        <motion.form
          animate={shaking ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4"
        >
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid #2A3146",
              backdropFilter: "blur(16px)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#6E7891",
                fontWeight: 600,
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              Enter Private Key
            </div>
            <input
              type="password"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              placeholder="PRIVATEHACK..."
              autoComplete="off"
              style={{
                background: "rgba(73,230,255,0.05)",
                border: "1px solid #2A3146",
                borderRadius: 10,
                padding: "12px 16px",
                color: "#E9EEF8",
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "0.1em",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <span
                style={{
                  fontSize: 11,
                  color: "#FF4B4B",
                  textAlign: "center",
                  letterSpacing: "0.05em",
                }}
              >
                {error}
              </span>
            )}
            <button
              type="submit"
              style={{
                background: "linear-gradient(90deg, #49E6FF, #9D4EDD)",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                color: "#070A12",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.15em",
                cursor: "pointer",
                textTransform: "uppercase",
              }}
            >
              Unlock
            </button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [countdown, setCountdown] = useState(
    () => 59 - new Date().getSeconds(),
  );
  const [current, setCurrent] = useState<PeriodEntry>(() => generateResult());
  const [justResolved, setJustResolved] = useState(false);

  const _getCountdown = useCallback(() => 59 - new Date().getSeconds(), []);

  useEffect(() => {
    if (!unlocked) return;
    let lastMinute = new Date().getMinutes();
    const timer = setInterval(() => {
      const now = new Date();
      setCountdown(59 - now.getSeconds());
      const currentMinute = now.getMinutes();
      if (lastMinute !== currentMinute) {
        lastMinute = currentMinute;
        setCurrent(generateResult());
        setJustResolved(true);
        setTimeout(() => setJustResolved(false), 1500);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [unlocked]);

  if (!unlocked) {
    return <PrivateKeyScreen onUnlock={() => setUnlocked(true)} />;
  }

  const mins = String(Math.floor(countdown / 60)).padStart(2, "0");
  const secs = String(countdown % 60).padStart(2, "0");
  const isBig = current.result === "BIG";
  const resultColor = isBig ? "#39FF8A" : "#FF4B4B";
  const resultGlow = isBig ? "#39FF8A" : "#FF4B4B";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #070A12 0%, #0B1020 50%, #0D0818 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${isBig ? "rgba(57,255,138,0.06)" : "rgba(255,75,75,0.06)"} 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 1s ease",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: "0.15em",
              color: "#49E6FF",
              textShadow: "0 0 20px #49E6FF",
            }}
          >
            QUANTA PREDICT
          </span>
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center gap-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdown}
              initial={{ opacity: 0.6, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15 }}
              style={{
                fontSize: 72,
                fontWeight: 900,
                fontVariantNumeric: "tabular-nums",
                color: countdown <= 5 ? "#FF4B4B" : "#E9EEF8",
                textShadow:
                  countdown <= 5
                    ? "0 0 20px #FF4B4B"
                    : "0 0 12px rgba(233,238,248,0.3)",
                letterSpacing: "0.05em",
                lineHeight: 1,
                transition: "color 0.3s, text-shadow 0.3s",
              }}
            >
              {mins}:{secs}
            </motion.div>
          </AnimatePresence>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "#6E7891",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Next Round
          </span>
        </div>

        {/* Result Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.result}-${current.numbers.join("-")}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 280 }}
            className="w-full rounded-2xl flex flex-col items-center gap-6 py-10 px-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${resultColor}40`,
              boxShadow: `0 0 40px ${resultColor}18`,
              backdropFilter: "blur(16px)",
            }}
          >
            {/* BIG / SMALL label */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: "0.1em",
                color: resultColor,
                textShadow: `0 0 32px ${resultGlow}`,
                lineHeight: 1,
              }}
            >
              {current.result}
            </div>

            {/* 3 numbers */}
            <div className="flex items-center gap-4">
              {current.numbers.map((n, i) => (
                <motion.div
                  key={["first", "second", "third"][i]}
                  initial={
                    justResolved
                      ? { scale: 0.5, opacity: 0 }
                      : { scale: 1, opacity: 1 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    fontWeight: 900,
                    color: resultColor,
                    background: `${resultColor}12`,
                    border: `2px solid ${resultColor}50`,
                    boxShadow: `0 0 16px ${resultColor}20`,
                    letterSpacing: 0,
                  }}
                >
                  {n}
                </motion.div>
              ))}
            </div>

            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: "#6E7891",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              {isBig ? "Numbers 5 – 9" : "Numbers 0 – 4"}
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            fontSize: 11,
            color: "#3A4460",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} ·{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "#49E6FF", textDecoration: "none" }}
          >
            Built with caffeine.ai
          </a>
        </div>
      </div>
    </div>
  );
}
