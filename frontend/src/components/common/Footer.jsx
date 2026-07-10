import React from "react";
import { useNavigate } from "react-router-dom";

const account = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Wallet",    href: "/wallet" },
  { label: "Orders",    href: "/orders" },
  { label: "Settings",  href: "/settings" },
  { label: "Support",   href: "/support" },
];

const socials = [
  { label: "Telegram",  symbol: "✈",  href: "https://t.me/" },
  { label: "WhatsApp",  symbol: "💬", href: "https://wa.me/9352397644" },
  { label: "Instagram", symbol: "📷", href: "https://instagram.com/" },
  { label: "Discord",   symbol: "🎮", href: "https://discord.gg/" },
];

const Footer = () => {
  const navigate = useNavigate();

  // ── auth check ──────────────────────────────────────────────────
  // Adjust this to match however you store auth:
  // e.g. localStorage.getItem("token"), useContext(AuthContext), etc.
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAccountLink = (e, href) => {
    e.preventDefault();
    if (isLoggedIn) {
      navigate(href);
    } else {
      navigate("/login");
    }
  };
  // ────────────────────────────────────────────────────────────────

  return (
    <footer
      className="relative overflow-hidden border-t border-white/[0.07] px-6 md:px-10 pt-10 pb-7"
      style={{ background: "linear-gradient(160deg, #0f1117 0%, #141824 60%, #0f1117 100%)" }}
    >
      {/* Purple glow top line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[320px] md:w-[480px] pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #7c3aed55, #a78bfa88, #7c3aed55, transparent)" }}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-9 items-start">

        {/* Brand column */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <div
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: "0 0 14px #7c3aed44",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 17l4-8 5 6 3-4 6 6H3z" />
              </svg>
            </div>
            <span className="text-[16px] font-semibold text-slate-100 tracking-tight">
              BOOST GURU SMM
            </span>
          </div>

          <p className="text-[13px] text-slate-500 leading-relaxed mb-4 max-w-[260px]">
            Premium social media growth services. Fast delivery, real results, and reliable support.
          </p>

          <div className="flex flex-wrap gap-2">
            {["🔒 Secure", "⚡ Instant"].map((text) => (
              <span
                key={text}
                className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  color: "#7c3aed",
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                {text}
              </span>
            ))}
            <span
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                color: "#7c3aed",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"
                style={{ boxShadow: "0 0 5px #22c55e", animation: "pulse-dot 2s infinite" }}
              />
              All systems up
            </span>
          </div>
        </div>

        {/* Account links */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-3.5">
            Account
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
            {account.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  onClick={(e) => handleAccountLink(e, href)}
                  className="text-[13px] text-slate-500 no-underline transition-colors duration-150 hover:text-violet-400 cursor-pointer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-0 border-t border-white/[0.06] mb-5" />

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Copyright */}
        <span className="text-[12px] text-slate-700">
          © 2026{" "}
          <span className="text-violet-600 font-medium">Boost Guru SMM</span>.
          {" "}All rights reserved.
        </span>

        {/* Legal links */}
        <div className="flex items-center gap-4">
          {[
            { text: "Privacy",       href: "/privacy" },
            { text: "Terms",         href: "/terms" },
            { text: "Refund policy", href: "/refund-policy" },
          ].map(({ text, href }, i) => (
            <React.Fragment key={text}>
              {i > 0 && (
                <span className="inline-block w-[3px] h-[3px] rounded-full bg-slate-700" />
              )}
              <a
                href={href}
                className="text-[11px] text-slate-700 no-underline transition-colors duration-150 hover:text-violet-600"
              >
                {text}
              </a>
            </React.Fragment>
          ))}
        </div>

        {/* Social icons */}
        <div className="flex gap-2">
          {socials.map(({ label, symbol, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 no-underline transition-all duration-150 hover:text-violet-400"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              {symbol}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;