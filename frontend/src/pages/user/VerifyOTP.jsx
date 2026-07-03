import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../api/authAPI";
import toast from "react-hot-toast";
import { KeyRound, ArrowRight, ShieldCheck } from "lucide-react";

const VerifyOTP = () => {
    const location = useLocation();
    const email = location.state?.email || sessionStorage.getItem("resetEmail");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await verifyOTP(email, otp);
            toast.success(data.message);
            navigate("/change-password", { state: { email } });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050508] px-4 relative overflow-hidden">

            {/* Background blobs */}
            <div style={{
                position: "absolute", width: 520, height: 520,
                borderRadius: "50%", top: "-120px", left: "-120px",
                background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", width: 400, height: 400,
                borderRadius: "50%", bottom: "-100px", right: "-80px",
                background: "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none"
            }} />

            {/* Subtle grid */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
                backgroundSize: "40px 40px"
            }} />

            <div style={{
                width: "100%", maxWidth: 420, position: "relative",
                animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both"
            }}>
                <style>{`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(28px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulse-ring {
                        0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
                        70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(124,58,237,0); }
                        100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0); }
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50%      { transform: translateY(-4px); }
                    }
                    .vf-input:focus { outline: none; }
                    .vf-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(124,58,237,0.45); }
                    .vf-btn:active:not(:disabled) { transform: translateY(0px); }
                    .vf-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                `}</style>

                {/* Card */}
                <div style={{
                    background: "rgba(15,13,26,0.85)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 24,
                    padding: "40px 36px",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.6)"
                }}>

                    {/* Icon */}
                    <div style={{
                        width: 56, height: 56, borderRadius: 16, marginBottom: 24,
                        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        animation: "pulse-ring 2.5s ease-in-out infinite",
                        boxShadow: "0 4px 20px rgba(124,58,237,0.4)"
                    }}>
                        <KeyRound size={26} color="#fff" />
                    </div>

                    {/* Heading */}
                    <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.4px" }}>
                        Check your inbox or (SPAM)
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 6, lineHeight: 1.6 }}>
                        We sent a one-time code to
                    </p>
                    <p style={{
                        color: "#a78bfa", fontSize: 14, fontWeight: 600,
                        marginBottom: 28, letterSpacing: "0.1px",
                        display: "flex", alignItems: "center", gap: 6
                    }}>
                        <ShieldCheck size={15} />
                        {email}
                    </p>

                    <form onSubmit={submit}>

                        {/* OTP field */}
                        <div style={{
                            position: "relative", marginBottom: 16,
                            borderRadius: 14,
                            border: `1.5px solid ${focused ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.08)"}`,
                            background: "rgba(255,255,255,0.04)",
                            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                            boxShadow: focused ? "0 0 0 3px rgba(124,58,237,0.15)" : "none"
                        }}>
                            <KeyRound size={17} style={{
                                position: "absolute", left: 16, top: "50%",
                                transform: "translateY(-50%)",
                                color: focused ? "#a78bfa" : "#475569",
                                transition: "color 0.2s ease"
                            }} />
                            <input
                                type="text"
                                placeholder="Enter OTP code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                required
                                className="vf-input"
                                style={{
                                    width: "100%", background: "transparent",
                                    border: "none", paddingLeft: 46, paddingRight: 16,
                                    paddingTop: 14, paddingBottom: 14,
                                    color: "#f1f5f9", fontSize: 15,
                                    letterSpacing: "0.2em",
                                    boxSizing: "border-box"
                                }}
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="vf-btn"
                            style={{
                                width: "100%", borderRadius: 14, padding: "14px 0",
                                color: "#fff", fontWeight: 600, fontSize: 15,
                                border: "none", cursor: loading ? "not-allowed" : "pointer",
                                background: loading
                                    ? "rgba(124,58,237,0.4)"
                                    : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 8,
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 17, height: 17, borderRadius: "50%",
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTopColor: "#fff",
                                        animation: "spin 0.7s linear infinite"
                                    }} />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify OTP
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer note */}
                    <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#475569" }}>
                        Didn't get a code?{" "}
                        <a href="/forgot-password" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 500 }}>
                            Resend OTP
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOTP;