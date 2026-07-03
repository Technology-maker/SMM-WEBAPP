import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../../api/authAPI";
import toast from "react-hot-toast";
import { LockKeyhole, ArrowRight, Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
    const location = useLocation();
    const email = location.state?.email || sessionStorage.getItem("resetEmail");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await changePassword(email, { newPassword, confirmPassword });
            toast.success(data.message);
            sessionStorage.removeItem("resetEmail");
            setTimeout(() => navigate("/login"), 1000);
        } finally {
            setLoading(false);
        }
    };

    const match = confirmPassword.length > 0 && newPassword === confirmPassword;
    const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const inputWrapper = (isFocused, isMatch, isMismatch) => ({
        position: "relative",
        borderRadius: 14,
        border: `1.5px solid ${isMismatch ? "rgba(239,68,68,0.6)" : isMatch ? "rgba(34,197,94,0.6)" : isFocused ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.08)"}`,
        background: "rgba(255,255,255,0.04)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: isMismatch ? "0 0 0 3px rgba(239,68,68,0.1)" : isMatch ? "0 0 0 3px rgba(34,197,94,0.1)" : isFocused ? "0 0 0 3px rgba(124,58,237,0.15)" : "none"
    });

    const iconColor = (isFocused) => isFocused ? "#a78bfa" : "#475569";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#050508] px-4 relative overflow-hidden">

            {/* Background blobs */}
            <div style={{
                position: "absolute", width: 520, height: 520, borderRadius: "50%",
                top: "-120px", left: "-120px",
                background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", width: 400, height: 400, borderRadius: "50%",
                bottom: "-100px", right: "-80px",
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
                    .cp-input:focus { outline: none; }
                    .cp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(124,58,237,0.45); }
                    .cp-btn:active:not(:disabled) { transform: translateY(0px); }
                    .cp-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                    .toggle-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; align-items: center; }
                `}</style>

                {/* Card */}
                <div style={{
                    background: "rgba(15,13,26,0.85)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 24, padding: "40px 36px",
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
                        <LockKeyhole size={26} color="#fff" />
                    </div>

                    {/* Heading */}
                    <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.4px" }}>
                        Set new password
                    </h2>
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                        Choose something strong. You won't need to remember the old one.
                    </p>

                    <form onSubmit={submit}>

                        {/* New Password */}
                        <div style={{ ...inputWrapper(focusedField === "new", false, false), marginBottom: 12 }}>
                            <LockKeyhole size={17} style={{
                                position: "absolute", left: 16, top: "50%",
                                transform: "translateY(-50%)",
                                color: iconColor(focusedField === "new"),
                                transition: "color 0.2s ease"
                            }} />
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onFocus={() => setFocusedField("new")}
                                onBlur={() => setFocusedField(null)}
                                required
                                className="cp-input"
                                style={{
                                    width: "100%", background: "transparent", border: "none",
                                    paddingLeft: 46, paddingRight: 46,
                                    paddingTop: 14, paddingBottom: 14,
                                    color: "#f1f5f9", fontSize: 15, boxSizing: "border-box"
                                }}
                            />
                            <button type="button" className="toggle-btn" onClick={() => setShowNew(v => !v)}
                                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                                {showNew ? <EyeOff size={17} color="#475569" /> : <Eye size={17} color="#475569" />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ ...inputWrapper(focusedField === "confirm", match, mismatch), marginBottom: 6 }}>
                            <LockKeyhole size={17} style={{
                                position: "absolute", left: 16, top: "50%",
                                transform: "translateY(-50%)",
                                color: mismatch ? "#ef4444" : match ? "#22c55e" : iconColor(focusedField === "confirm"),
                                transition: "color 0.2s ease"
                            }} />
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setFocusedField("confirm")}
                                onBlur={() => setFocusedField(null)}
                                required
                                className="cp-input"
                                style={{
                                    width: "100%", background: "transparent", border: "none",
                                    paddingLeft: 46, paddingRight: 46,
                                    paddingTop: 14, paddingBottom: 14,
                                    color: "#f1f5f9", fontSize: 15, boxSizing: "border-box"
                                }}
                            />
                            <button type="button" className="toggle-btn" onClick={() => setShowConfirm(v => !v)}
                                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}>
                                {showConfirm ? <EyeOff size={17} color="#475569" /> : <Eye size={17} color="#475569" />}
                            </button>
                        </div>

                        {/* Match hint */}
                        <p style={{
                            fontSize: 12, marginBottom: 20, marginLeft: 4,
                            color: mismatch ? "#ef4444" : match ? "#22c55e" : "transparent",
                            transition: "color 0.2s ease"
                        }}>
                            {mismatch ? "Passwords don't match" : match ? "Passwords match ✓" : "placeholder"}
                        </p>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="cp-btn"
                            style={{
                                width: "100%", borderRadius: 14, padding: "14px 0",
                                color: "#fff", fontWeight: 600, fontSize: 15,
                                border: "none", cursor: loading ? "not-allowed" : "pointer",
                                background: loading
                                    ? "rgba(124,58,237,0.4)"
                                    : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
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
                                    Updating Password...
                                </>
                            ) : (
                                <>
                                    Change Password
                                    <ArrowRight size={17} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#475569" }}>
                        Remembered it?{" "}
                        <a href="/login" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 500 }}>
                            Back to login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;