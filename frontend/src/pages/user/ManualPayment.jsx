import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import toast from "react-hot-toast";
import { QrCode, ArrowRight, Hash, IndianRupee, ArrowLeft } from "lucide-react";
import { submitManualPayment, getDepositSettings } from "../../api/paymentAPI";

const ManualPayment = ({ title = "UPI / QR Payment", method = "upi", qrImage = "/qr-code.png" }) => {
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [utr, setUtr] = useState("");
    const [focusedField, setFocusedField] = useState(null);

    const mutation = useMutation((payload) => submitManualPayment({ ...payload, method }), {
        onSuccess: (data) => {
            toast.success(data.message || "Payment submitted! Awaiting admin approval.");
            navigate("/add-funds");
        }
    });

    const { data: settingsData } = useQuery("payment:deposit-settings", getDepositSettings);
    const minDeposit = settingsData?.data?.minDeposit ?? 100;

    const submit = (e) => {
        e.preventDefault();
        if (!amount || Number(amount) < minDeposit) return toast.error(`Minimum deposit is ₹${minDeposit}`);
        if (!utr.trim()) return toast.error("Enter your UTR / Transaction ID");
        mutation.mutate({ amount: Number(amount), utr: utr.trim() });
    };

    const inputWrapper = (field) => ({
        position: "relative", borderRadius: 14, marginBottom: 12,
        border: `1.5px solid ${focusedField === field ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.08)"}`,
        background: "rgba(255,255,255,0.04)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: focusedField === field ? "0 0 0 3px rgba(124,58,237,0.15)" : "none"
    });

    const iconColor = (field) => focusedField === field ? "#a78bfa" : "#475569";

    return (
        <div className="min-h-screen flex items-center justify-center  px-4 relative overflow-hidden">


            <div style={{ width: "100%", maxWidth: 440, position: "relative", animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
                <style>{`
                    @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
                    @keyframes pulse-ring { 0%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(124,58,237,0.5);}70%{transform:scale(1);box-shadow:0 0 0 10px rgba(124,58,237,0);}100%{transform:scale(0.95);box-shadow:0 0 0 0 rgba(124,58,237,0);} }
                    @keyframes spin { to { transform:rotate(360deg); } }
                    .mp-input:focus { outline:none; }
                    .mp-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 30px rgba(124,58,237,0.45); }
                    .mp-btn { transition:transform 0.2s ease,box-shadow 0.2s ease; }
                    .back-btn:hover { color:#a78bfa; }
                    .back-btn { transition:color 0.2s ease; }
                `}</style>

                <div style={{ background: "rgba(15,13,26,0.85)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(20px)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04),0 24px 60px rgba(0,0,0,0.6)" }}>

                    {/* Back */}
                    <button className="back-btn" onClick={() => navigate("/add-funds")} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 13, fontWeight: 500, marginBottom: 24, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                        <ArrowLeft size={15} /> Back
                    </button>

                    {/* Icon */}
                    <div style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 24, background: "linear-gradient(135deg, #7c3aed, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse-ring 2.5s ease-in-out infinite", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
                        <QrCode size={26} color="#fff" />
                    </div>

                    <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.4px" }}>{title}</h2>
                    <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                        Scan the QR below, pay, then enter your UTR number. Admin will approve and credit your wallet.
                    </p>

                    {/* QR Placeholder — replace src with your real QR image */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                        <div style={{ padding: 12, background: "#fff", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                            <img
                                src={qrImage}
                                alt={`${title} QR Code`}
                                width={160}
                                height={160}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                }}
                            />
                            {/* Fallback if image missing */}
                            <div style={{ width: 160, height: 160, display: "none", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, color: "#94a3b8", fontSize: 12, textAlign: "center" }}>
                                <QrCode size={48} color="#c4b5fd" />
                                <span>QR not set.<br />Ask admin to upload.</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} >
                        {/* Amount */}
                        <div style={inputWrapper("amount")}>
                            <IndianRupee size={17} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: iconColor("amount"), transition: "color 0.2s ease" }} />
                            <input type="number" placeholder="Amount you paid" value={amount} onChange={(e) => setAmount(e.target.value)} onFocus={() => setFocusedField("amount")} onBlur={() => setFocusedField(null)} required className="mp-input" style={{ width: "100%", background: "transparent", border: "none", paddingLeft: 46, paddingRight: 16, paddingTop: 14, paddingBottom: 14, color: "#f1f5f9", fontSize: 15, boxSizing: "border-box" }} />
                        </div>

                        {/* UTR */}
                        <div style={inputWrapper("utr")}>
                            <Hash size={17} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: iconColor("utr"), transition: "color 0.2s ease" }} />
                            <input type="text" placeholder="UTR / Transaction ID" value={utr} onChange={(e) => setUtr(e.target.value)} onFocus={() => setFocusedField("utr")} onBlur={() => setFocusedField(null)} required className="mp-input" style={{ width: "100%", background: "transparent", border: "none", paddingLeft: 46, paddingRight: 16, paddingTop: 14, paddingBottom: 14, color: "#f1f5f9", fontSize: 15, letterSpacing: "0.05em", boxSizing: "border-box" }} />
                        </div>

                        <p style={{ fontSize: 12, color: "#475569", marginBottom: 20, marginLeft: 4 }}>
                            Note - Minimum Deposit  ₹{minDeposit}  (Enter your 12-digit UTR number and Submit Payment.)
                        </p>

                        <button type="submit" disabled={mutation.isLoading} className="mp-btn" style={{ width: "100%", borderRadius: 14, padding: "14px 0", color: "#fff", fontWeight: 600, fontSize: 15, border: "none", cursor: mutation.isLoading ? "not-allowed" : "pointer", background: mutation.isLoading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            {mutation.isLoading ? (
                                <><div style={{ width: 17, height: 17, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} /> Submitting...</>
                            ) : (<>Submit Payment <ArrowRight size={17} /></>)}
                        </button>
                    </form>

                    <p style={{ textAlign: "center", marginTop: 22, fontSize: 13, color: "#475569" }}>
                        Wallet is credited after admin approval · Usually within 30 mins
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ManualPayment;
