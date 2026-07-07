import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock, Zap, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../api/authAPI";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation(loginUser, {
    onSuccess: (response) => {
      setUser(response.data.user);
      toast.success("Welcome back");
      navigate(response.data.user.role === "admin" ? "/admin" : "/dashboard");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    },
  });



  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
  };
  const inputFocus = (e) => (e.target.style.border = "1px solid rgba(124,58,237,0.5)");
  const inputBlur = (e) => (e.target.style.border = "1px solid rgba(255,255,255,0.08)");

  return (
    <>
      {/* ── Keyframe definitions ── */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes zap-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px #a78bfa) drop-shadow(0 0 8px #7c3aed); opacity: 1; }
          50%       { filter: drop-shadow(0 0 10px #c4b5fd) drop-shadow(0 0 20px #7c3aed); opacity: 0.85; }
        }
        @keyframes gradient-rotate {
          0%   { background-position: 0% 50%;   }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%;   }
        }
        @keyframes orbit-dot {
          from { transform: rotate(0deg) translateX(18px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
        }
        @keyframes orbit-dot-2 {
          from { transform: rotate(180deg) translateX(18px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(18px) rotate(-540deg); }
        }
        @keyframes halo-ping {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }

        .logo-icon-bg {
          background: linear-gradient(135deg, #7c3aed, #4f46e5, #a78bfa, #7c3aed);
          background-size: 300% 300%;
          animation: gradient-rotate 3s ease infinite;
          box-shadow: 0 0 16px #7c3aed66, 0 0 32px #4f46e544;
        }
        .logo-zap {
          animation: zap-pulse 2s ease-in-out infinite;
        }
        .logo-ring-outer {
          animation: spin-slow 6s linear infinite;
        }
        .logo-ring-inner {
          animation: spin-reverse 4s linear infinite;
        }
        .orbit-dot-1 {
          animation: orbit-dot 2.8s linear infinite;
        }
        .orbit-dot-2 {
          animation: orbit-dot-2 2.8s linear infinite;
        }
        .halo {
          animation: halo-ping 2s ease-out infinite;
        }
        .logo-word {
          background: linear-gradient(90deg, #ffffff, #c4b5fd, #ffffff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-rotate 4s linear infinite;
        }
      `}</style>

      <div
        className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0b0e18 0%, #0f1320 50%, #0b0e18 100%)" }}
      >
        {/* Ambient blobs */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-20 w-[360px] h-[360px] rounded-full opacity-15 blur-[100px]"
          style={{ background: "radial-gradient(circle, #4f46e5, transparent 70%)" }}
        />

        {/* Card */}
        <div
          className="relative w-full max-w-md rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(124,58,237,0.08), 0 32px 64px rgba(0,0,0,0.5)",
          }}
        >
          {/* Top glow line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 rounded-full"
            style={{ background: "linear-gradient(90deg, transparent, #a78bfa, transparent)" }}
          />

          {/* Go Back button */}
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-1.5 text-sm text-slate-500 transition-all duration-150 group w-fit"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "")}
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-150 group-hover:-translate-x-0.5"
            />
            Go Home
          </button>

          {/* ── Animated Logo ── */}
          <Link to="/" className="mb-8 flex items-center gap-3 w-fit group">
            {/* Icon container */}
            <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">

              {/* Ping halo */}
              <div
                className="halo absolute inset-0 rounded-xl"
                style={{ background: "rgba(124,58,237,0.25)" }}
              />

              {/* Outer dashed orbit ring */}
              <svg
                className="logo-ring-outer absolute"
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
                className="logo-ring-inner absolute"
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
                className="orbit-dot-1 absolute"
                style={{ top: "50%", left: "50%", marginTop: "-2px", marginLeft: "-2px" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 4px #a78bfa" }} />
              </div>
              <div
                className="orbit-dot-2 absolute"
                style={{ top: "50%", left: "50%", marginTop: "-1.5px", marginLeft: "-1.5px" }}
              >
                <div className="w-1 h-1 rounded-full bg-indigo-400" style={{ boxShadow: "0 0 4px #818cf8" }} />
              </div>

              {/* Main icon box */}
              <div className="logo-icon-bg relative w-9 h-9 rounded-xl flex items-center justify-center z-10">
                <Zap
                  size={15}
                  fill="white"
                  color="white"
                  className="logo-zap"
                />
              </div>
            </div>

            {/* Wordmark */}
            <span className="text-lg font-bold tracking-tight">
              <span className="logo-word">BOOST GURU </span>
              <span
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #c4b5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SMM
              </span>
            </span>
          </Link>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue</p>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {/* Email field */}
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#475569" }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all duration-150"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
                autoComplete="username"
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#475569" }}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
                className="w-full rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-600 outline-none transition-all duration-150"
                style={inputStyle}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Forget pass */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm transition-colors duration-150"
                style={{ color: "#a78bfa" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: mutation.isLoading
                  ? "rgba(124,58,237,0.5)"
                  : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                boxShadow: mutation.isLoading ? "none" : "0 0 24px rgba(124,58,237,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!mutation.isLoading)
                  e.currentTarget.style.boxShadow = "0 0 32px rgba(124,58,237,0.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = mutation.isLoading
                  ? "none"
                  : "0 0 24px rgba(124,58,237,0.35)";
              }}
            >
              <LogIn size={16} />
              {mutation.isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/register"
              className="font-medium transition-colors duration-150"
              style={{ color: "#a78bfa" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#a78bfa")}
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;