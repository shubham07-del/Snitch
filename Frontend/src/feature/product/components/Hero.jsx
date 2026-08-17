import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Marquee ticker ─── */
const MARQUEE_ITEMS = [
  "NEW ARRIVALS",
  "LIMITED DROPS",
  "PREMIUM QUALITY",
  "FREE RETURNS",
  "EXCLUSIVE PIECES",
  "HANDCRAFTED",
];

const Hero = () => {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const pillsRef = useRef(null);

  /* Simple entrance animation on mount */
  useEffect(() => {
    const els = [headingRef, subRef, ctaRef, pillsRef];
    els.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.style.opacity = "0";
      ref.current.style.transform = "translateY(24px)";
      setTimeout(() => {
        if (!ref.current) return;
        ref.current.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        ref.current.style.opacity = "1";
        ref.current.style.transform = "translateY(0)";
      }, 120 + i * 130);
    });
  }, []);

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "var(--color-surface)" }}>

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Background glow accents */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #000 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full opacity-[0.05] blur-2xl"
        style={{ background: "radial-gradient(circle, #000 0%, transparent 70%)" }}
      />

      {/* Main hero content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 pt-12 pb-0 sm:pt-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:gap-16">

          {/* Left column — text */}
          <div className="flex-1 min-w-0 pb-10 lg:pb-16">

            {/* Eyebrow label */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "var(--color-text-primary)" }}
              />
              <p
                className="text-[10px] font-semibold uppercase tracking-[5px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                SS 2026 Collection
              </p>
            </div>

            {/* Main heading */}
            <div ref={headingRef}>
              <h1
                className="font-black leading-[0.92] tracking-[-0.04em] text-[clamp(3.5rem,10vw,7.5rem)]"
                style={{ color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif" }}
              >
                AFTER
              </h1>
              <h2
                className="font-black leading-[0.92] tracking-[-0.04em] text-[clamp(3.5rem,10vw,7.5rem)]"
                style={{
                  WebkitTextStroke: "1.5px var(--color-text-primary)",
                  color: "transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                HOURS
              </h2>
            </div>

            {/* Sub-copy */}
            <p
              ref={subRef}
              className="mt-7 text-sm sm:text-base leading-relaxed max-w-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Pieces built for the time between midnight and morning. Premium
              fabrics, minimal silhouettes, zero compromise.
            </p>

            {/* CTA row */}
            <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[13px] font-bold uppercase tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-100"
                style={{
                  background: "var(--color-btn-primary-bg)",
                  color: "var(--color-btn-primary-text)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                }}
              >
                Shop Now
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>

              <button
                onClick={() => document.getElementById("products-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[13px] font-semibold uppercase tracking-widest transition-all duration-200 hover:scale-[1.03] active:scale-100"
                style={{
                  borderColor: "var(--color-border-input)",
                  color: "var(--color-text-primary)",
                  background: "transparent",
                }}
              >
                View All
              </button>
            </div>

            {/* Pill tags */}
            <div ref={pillsRef} className="mt-7 flex flex-wrap gap-2">
              {["Minimal", "Premium", "Unisex", "Drop #12"].map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest"
                  style={{
                    borderColor: "var(--color-border-input)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — editorial cards (desktop only) */}
          <div className="hidden lg:flex items-end gap-3 pb-0 flex-shrink-0 w-[340px] xl:w-[400px]">

            {/* Tall dark card */}
            <div
              className="relative flex-1 rounded-2xl overflow-hidden"
              style={{
                height: "420px",
                background: "linear-gradient(160deg, #1a1a1a 0%, #0a0a0a 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(255,255,255,0.08) 28px, rgba(255,255,255,0.08) 29px)",
                }}
              />
              <div className="absolute bottom-6 left-5 right-5">
                <p className="text-[9px] font-semibold uppercase tracking-[4px] text-white/40 mb-2">New In</p>
                <p className="text-white text-xl font-black tracking-tight leading-snug">
                  The Void<br />Collection
                </p>
                <p className="text-white/50 text-[11px] mt-2">From ₹2,499</p>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              </div>
            </div>

            {/* Two shorter cards stacked */}
            <div className="flex flex-col gap-3 flex-1">
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  height: "196px",
                  background: "linear-gradient(145deg, #2e2e2e, #111)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.2) 6px, rgba(255,255,255,0.2) 7px)",
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[8px] uppercase tracking-[3px] text-white/40 mb-1">Drop</p>
                  <p className="text-white text-sm font-black tracking-tight">Limited Ed.</p>
                </div>
              </div>
              <div
                className="rounded-2xl relative overflow-hidden"
                style={{
                  height: "196px",
                  background: "linear-gradient(145deg, #c8c6c2, #b0aea9)",
                }}
              >
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[8px] uppercase tracking-[3px] text-black/40 mb-1">Unisex</p>
                  <p className="text-black text-sm font-black tracking-tight">Free Fit</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling marquee strip */}
      <div
        className="relative z-10 mt-6 border-y overflow-hidden py-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{
            animation: "hero-marquee 22s linear infinite",
            width: "max-content",
          }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-6 text-[10px] font-semibold uppercase tracking-[4px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item}
              <span
                className="w-1 h-1 rounded-full flex-shrink-0"
                style={{ background: "var(--color-text-primary)" }}
              />
            </span>
          ))}
        </div>

        <style>{`
          @keyframes hero-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>
    </section>
  );
};

export default Hero;
