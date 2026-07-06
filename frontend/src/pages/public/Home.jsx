import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, WalletCards, Zap } from "lucide-react";
import Footer from "../../components/common/Footer";

const categories = ["Instagram", "YouTube", "TikTok", "Facebook", "Telegram", "X"];

const Home = () => (
  <div className="app-bg min-h-screen">
    {/* ── Keyframes (identical to Login / Register / Sidebar) ── */}
    <style>{`
      @keyframes home-spin-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes home-spin-reverse {
        from { transform: rotate(0deg); }
        to   { transform: rotate(-360deg); }
      }
      @keyframes home-zap-pulse {
        0%, 100% {
          filter: drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 8px #7c3aed);
          opacity: 1;
        }
        50% {
          filter: drop-shadow(0 0 10px #c4b5fd) drop-shadow(0 0 20px #7c3aed);
          opacity: 0.85;
        }
      }
      @keyframes home-gradient-rotate {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes home-orbit-dot {
        from { transform: rotate(0deg)   translateX(18px) rotate(0deg); }
        to   { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
      }
      @keyframes home-orbit-dot-2 {
        from { transform: rotate(180deg) translateX(18px) rotate(-180deg); }
        to   { transform: rotate(540deg) translateX(18px) rotate(-540deg); }
      }
      @keyframes home-halo-ping {
        0%   { transform: scale(1);    opacity: 0.6; }
        100% { transform: scale(1.9);  opacity: 0; }
      }
      @keyframes home-word-shimmer {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .home-logo-bg {
        background: linear-gradient(135deg, #7c3aed, #4f46e5, #a78bfa, #7c3aed);
        background-size: 300% 300%;
        animation: home-gradient-rotate 3s ease infinite;
        box-shadow: 0 0 16px #7c3aed66, 0 0 32px #4f46e544;
      }
      .home-zap      { animation: home-zap-pulse 2s ease-in-out infinite; }
      .home-ring-out { animation: home-spin-slow 6s linear infinite; }
      .home-ring-in  { animation: home-spin-reverse 4s linear infinite; }
      .home-dot-1    { animation: home-orbit-dot   2.8s linear infinite; }
      .home-dot-2    { animation: home-orbit-dot-2 2.8s linear infinite; }
      .home-halo     { animation: home-halo-ping 2s ease-out infinite; }
      .home-word {
        background: linear-gradient(90deg, #ffffff, #c4b5fd, #ffffff);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: home-word-shimmer 4s linear infinite;
      }
    `}</style>

    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">

      {/* ── Animated Logo ── */}
      <Link to="/" className="flex items-center gap-3 w-fit group">
        {/* Icon cluster */}
        <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">

          {/* Halo ping */}
          <div
            className="home-halo absolute inset-0 rounded-xl"
            style={{ background: "rgba(124,58,237,0.25)" }}
          />

          {/* Outer dashed orbit ring */}
          <svg
            className="home-ring-out absolute"
            width="52" height="52"
            viewBox="0 0 52 52"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
          >
            <circle
              cx="26" cy="26" r="24"
              fill="none"
              stroke="rgba(167,139,250,0.3)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </svg>

          {/* Inner orbit ring */}
          <svg
            className="home-ring-in absolute"
            width="40" height="40"
            viewBox="0 0 40 40"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
          >
            <circle
              cx="20" cy="20" r="18"
              fill="none"
              stroke="rgba(124,58,237,0.2)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
          </svg>

          {/* Orbiting dots */}
          <div
            className="home-dot-1 absolute"
            style={{ top: "50%", left: "50%", marginTop: "-2px", marginLeft: "-2px" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 4px #a78bfa" }} />
          </div>
          <div
            className="home-dot-2 absolute"
            style={{ top: "50%", left: "50%", marginTop: "-1.5px", marginLeft: "-1.5px" }}
          >
            <div className="w-1 h-1 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 4px #818cf8" }} />
          </div>

          {/* Main icon box */}
          <div className="home-logo-bg relative w-9 h-9 rounded-xl flex items-center justify-center z-10">
            <Zap size={15} fill="white" color="white" className="home-zap" />
          </div>
        </div>

        {/* Wordmark */}
        <span className="text-xl font-black tracking-tight">
          <span className="home-word">BOOST </span>
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            GURU
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link className="btn-secondary" to="/login">Login</Link>
        <Link className="btn-primary" to="/register">Start</Link>
      </div>
    </header>

    <main>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-sm text-mint">
            Social growth operations in one secure panel
          </p>
          <div className="sparkle-wrap">
            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl text-shine">
              Boost Guru SMM
            </h1>
            <span className="spark spark-1">✦</span>
            <span className="spark spark-2">✦</span>
            <span className="spark spark-3">✦</span>
            <span className="spark spark-4">✦</span>
            <span className="spark spark-5">✦</span>
          </div>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            📸 Instagram • 🎬 YouTube • 📘 Facebook • ✈️ Telegram • 🎧 Spotify growth, all in one panel. 🚀
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">
              Create account <ArrowRight size={17} />
            </Link>
            <Link className="btn-secondary" to="/login">Admin login</Link>
          </div>
        </div>
        <div className="glass rounded-lg p-5 shadow-glow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live overview</p>
              <p className="text-2xl font-bold">₹42,850</p>
            </div>
            <BarChart3 className="text-mint" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Orders", "Revenue", "Users"].map((item, index) => (
              <div key={item} className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-500">{item}</p>
                <p className="mt-2 text-lg font-bold">{[1240, "₹89k", 312][index]}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            {["Instagram Indian Followers", "YouTube Views", "Instagram Indian Comments"].map((name, index) => (
              <div key={name} className="flex items-center justify-between rounded-lg border border-white/10 bg-ink/50 p-3">
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-slate-500">Processing speed: {["Fast", "Stable", "Instant"][index]}</p>
                </div>
                <p className="text-sm font-bold text-mint">₹{[40, 50, 30][index]}/1k</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Wallet first", icon: WalletCards, text: "Deposit funds, verify payments, and keep every order debit visible." },
            { title: "Provider ready", icon: Sparkles, text: "Peakerr API integration queues safely when provider keys are absent." },
            { title: "Admin secure", icon: ShieldCheck, text: "JWT httpOnly cookie auth, admin guards, Helmet headers, and rate limits." }
          ].map(({ title, icon: Icon, text }) => (
            <div key={title} className="glass rounded-lg p-5">
              <Icon className="text-mint" />
              <h2 className="mt-4 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {category}
            </span>
          ))}
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Home;