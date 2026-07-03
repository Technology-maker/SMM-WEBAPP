import { NavLink } from "react-router-dom";
import { useQuery } from "react-query";
import { getNotices } from "../../api/noticeAPI";
import {
  LayoutDashboard,
  PlusCircle,
  ReceiptText,
  Receipt,
  WalletCards,
  User,
  X,
  Contact2,
  Bell,
  Layers,
  Zap,
  LogOut,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-order", label: "New Order", icon: PlusCircle },
  { to: "/orders", label: "My Orders", icon: ReceiptText },
  { to: "/services", label: "Services", icon: Layers },
  { to: "/add-funds", label: "Add Funds", icon: WalletCards },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/contact", label: "Contact us", icon: Contact2 },
  { to: "/notices", label: "Notices", icon: Bell },
  { to: "/logout", label: "LogOut", icon: LogOut },
];

const Sidebar = ({ open, onClose }) => {
  const { data } = useQuery("notices", getNotices, {
    staleTime: 1000 * 60 * 5,
  });
  const noticeCount = data?.data?.notices?.length || 0;

  return (
    <>
      {/* ── Keyframes (same set as Login / Register) ── */}
      <style>{`
      @keyframes sb-spin-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes sb-spin-reverse {
        from { transform: rotate(0deg); }
        to   { transform: rotate(-360deg); }
      }
      @keyframes sb-zap-pulse {
        0%, 100% {
          filter: drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 8px #7c3aed);
          opacity: 1;
        }
        50% {
          filter: drop-shadow(0 0 10px #c4b5fd) drop-shadow(0 0 20px #7c3aed);
          opacity: 0.85;
        }
      }
      @keyframes sb-gradient-rotate {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes sb-orbit-dot {
        from { transform: rotate(0deg)   translateX(16px) rotate(0deg); }
        to   { transform: rotate(360deg) translateX(16px) rotate(-360deg); }
      }
      @keyframes sb-orbit-dot-2 {
        from { transform: rotate(180deg) translateX(16px) rotate(-180deg); }
        to   { transform: rotate(540deg) translateX(16px) rotate(-540deg); }
      }
      @keyframes sb-halo-ping {
        0%   { transform: scale(1);   opacity: 0.55; }
        100% { transform: scale(1.85); opacity: 0; }
      }
      @keyframes sb-word-shimmer {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes sb-link-in {
        from { opacity: 0; transform: translateX(-12px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes sb-glow-line {
        0%, 100% { opacity: 0.5; }
        50%       { opacity: 1; }
      }
      @keyframes sb-blob-drift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33%       { transform: translate(6px, -8px) scale(1.04); }
        66%       { transform: translate(-4px, 5px) scale(0.97); }
      }

      .sb-logo-bg {
        background: linear-gradient(135deg, #7c3aed, #4f46e5, #a78bfa, #7c3aed);
        background-size: 300% 300%;
        animation: sb-gradient-rotate 3s ease infinite;
        box-shadow: 0 0 14px #7c3aed66, 0 0 28px #4f46e540;
      }
      .sb-zap       { animation: sb-zap-pulse 2s ease-in-out infinite; }
      .sb-ring-out  { animation: sb-spin-slow 6s linear infinite; }
      .sb-ring-in   { animation: sb-spin-reverse 4s linear infinite; }
      .sb-dot-1     { animation: sb-orbit-dot   2.8s linear infinite; }
      .sb-dot-2     { animation: sb-orbit-dot-2 2.8s linear infinite; }
      .sb-halo      { animation: sb-halo-ping 2s ease-out infinite; }
      .sb-word {
        background: linear-gradient(90deg, #ffffff, #c4b5fd, #ffffff);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: sb-word-shimmer 4s linear infinite;
      }
      .sb-glow-line { animation: sb-glow-line 3s ease-in-out infinite; }
      .sb-blob      { animation: sb-blob-drift 12s ease-in-out infinite; }
      .sb-blob-2    { animation: sb-blob-drift 16s ease-in-out infinite reverse; }

      .sb-link {
        animation: sb-link-in 0.3s ease both;
      }

      .sb-nav-item {
        position: relative;
        overflow: hidden;
      }
      .sb-nav-item::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(124,58,237,0.08), transparent);
        opacity: 0;
        transition: opacity 0.2s ease;
        border-radius: 8px;
      }
      .sb-nav-item:hover::before { opacity: 1; }

      .sb-active-indicator {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 60%;
        border-radius: 0 3px 3px 0;
        background: linear-gradient(180deg, #a78bfa, #7c3aed);
        box-shadow: 0 0 8px #7c3aed99;
      }
    `}</style>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{
          background: "linear-gradient(160deg, #0d0f1e 0%, #0b0e18 60%, #0f1120 100%)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* Ambient blobs */}
        <div
          className="sb-blob pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-20 blur-[70px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
        />
        <div
          className="sb-blob-2 pointer-events-none absolute -bottom-16 -left-8 w-40 h-40 rounded-full opacity-15 blur-[60px]"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent 70%)" }}
        />

        {/* Vertical glow line on the right edge */}
        <div
          className="sb-glow-line pointer-events-none absolute top-1/4 right-0 w-px h-1/2 rounded-full"
          style={{ background: "linear-gradient(180deg, transparent, #a78bfa, transparent)" }}
        />

        {/* ── Header ── */}
        <div className="relative mb-8 flex items-center justify-between">

          {/* Animated Logo */}
          <NavLink to="/" className="flex items-center gap-3 w-fit group">
            {/* Icon cluster */}
            <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">

              {/* Halo ping */}
              <div
                className="sb-halo absolute inset-0 rounded-xl"
                style={{ background: "rgba(124,58,237,0.22)" }}
              />

              {/* Outer orbit ring */}
              <svg
                className="sb-ring-out absolute"
                width="46" height="46"
                viewBox="0 0 46 46"
                style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
              >
                <circle
                  cx="23" cy="23" r="21"
                  fill="none"
                  stroke="rgba(167,139,250,0.28)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              </svg>

              {/* Inner orbit ring */}
              <svg
                className="sb-ring-in absolute"
                width="34" height="34"
                viewBox="0 0 34 34"
                style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
              >
                <circle
                  cx="17" cy="17" r="15"
                  fill="none"
                  stroke="rgba(124,58,237,0.18)"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              </svg>

              {/* Orbiting dots */}
              <div
                className="sb-dot-1 absolute"
                style={{ top: "50%", left: "50%", marginTop: "-2px", marginLeft: "-2px" }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-violet-400"
                  style={{ boxShadow: "0 0 4px #a78bfa" }}
                />
              </div>
              <div
                className="sb-dot-2 absolute"
                style={{ top: "50%", left: "50%", marginTop: "-1.5px", marginLeft: "-1.5px" }}
              >
                <div
                  className="w-1 h-1 rounded-full bg-indigo-400"
                  style={{ boxShadow: "0 0 4px #818cf8" }}
                />
              </div>

              {/* Icon box */}
              <div className="sb-logo-bg relative w-8 h-8 rounded-xl flex items-center justify-center z-10">
                <Zap size={13} fill="white" color="white" className="sb-zap" />
              </div>
            </div>

            {/* Wordmark */}
            <span className="text-lg font-bold tracking-tight">
              <span className="sb-word">SMM</span>
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pulse
              </span>
            </span>
          </NavLink>

          {/* Close button (mobile) */}
          <button
            className="rounded-lg p-2 text-slate-400 transition-all duration-150 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Nav links ── */}
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }, i) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className="sb-link block"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {({ isActive }) => (
                <span
                  className={`sb-nav-item relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-white"
                    }`}
                  style={
                    isActive
                      ? {
                        background:
                          "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(79,70,229,0.12))",
                        border: "1px solid rgba(124,58,237,0.2)",
                        boxShadow: "0 0 12px rgba(124,58,237,0.12) inset",
                      }
                      : {
                        border: "1px solid transparent",
                      }
                  }
                >
                  {/* Active left indicator bar */}
                  {isActive && <span className="sb-active-indicator" />}

                  {/* Icon */}
                  <span
                    className="relative z-10 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={
                      isActive
                        ? {
                          filter: "drop-shadow(0 0 6px #a78bfa)",
                          color: "#a78bfa",
                        }
                        : {}
                    }
                  >
                    <Icon size={17} />
                  </span>

                  {/* Label */}
                  <span className="relative z-10">{label}</span>

                  {to === "/notices" && !isActive && noticeCount > 0 && (
                    <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-2 text-xs font-semibold text-white">
                      {noticeCount}
                    </span>
                  )}

                  {/* Active shimmer sweep */}
                  {isActive && (
                    <span
                      className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden"
                      aria-hidden="true"
                    >
                      <span
                        className="absolute inset-y-0 -left-full w-1/2 skew-x-12"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                          animation: "sb-word-shimmer 3s linear infinite",
                        }}
                      />
                    </span>
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom decoration ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(124,58,237,0.3), transparent)",
          }}
        />
      </aside>
    </>
  );
};

export default Sidebar;