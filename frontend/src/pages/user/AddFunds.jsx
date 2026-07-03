import { useNavigate } from "react-router-dom";
import { QrCode, CreditCard } from "lucide-react";

const AddFunds = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(124,58,237,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0); }
        }
        .method-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 14px;
          cursor: pointer;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
          min-width: 0;
        }
        .method-card:hover {
          border-color: rgba(124,58,237,0.6);
          background: rgba(124,58,237,0.07);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(124,58,237,0.2);
        }
        .method-card:active { transform: translateY(0); }
        .method-card-text { flex: 1; min-width: 0; overflow: hidden; }
        .method-card-title {
          color: #f1f5f9;
          font-weight: 600;
          font-size: clamp(13px, 3.5vw, 15px);
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .method-card-desc {
          color: #64748b;
          font-size: clamp(11px, 3vw, 13px);
          line-height: 1.4;
        }
        .method-card-icon {
          width: clamp(40px, 11vw, 48px);
          height: clamp(40px, 11vw, 48px);
          flex-shrink: 0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .funds-badge {
          font-size: clamp(9px, 2.5vw, 11px);
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 20px;
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>

      <div style={{
        width: "100%",
        maxWidth: 460,
        position: "relative",
        animation: "slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both"
      }}>
        <div style={{
          background: "rgba(15,13,26,0.85)",
          border: "1px solid rgba(124,58,237,0.2)",
          borderRadius: 24,
          padding: "clamp(24px, 6vw, 40px) clamp(18px, 5vw, 36px)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 24px 60px rgba(0,0,0,0.6)"
        }}>

          <div style={{
            width: "clamp(44px, 12vw, 56px)",
            height: "clamp(44px, 12vw, 56px)",
            borderRadius: 16,
            marginBottom: 20,
            background: "linear-gradient(135deg, #7c3aed, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse-ring 2.5s ease-in-out infinite",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)"
          }}>
            <CreditCard size={24} color="#fff" />
          </div>

          <h2 style={{
            color: "#fff",
            fontSize: "clamp(20px, 5.5vw, 26px)",
            fontWeight: 700,
            marginBottom: 6,
            letterSpacing: "-0.4px"
          }}>
            Add Funds
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "clamp(12px, 3.5vw, 14px)", marginBottom: 28, lineHeight: 1.6 }}>
            Choose how you want to top up your wallet.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            <div className="method-card" onClick={() => navigate("/add-funds/manual")}>
              <div className="method-card-icon" style={{
                background: "linear-gradient(135deg,#7c3aed22,#a855f722)",
                border: "1px solid rgba(124,58,237,0.3)"
              }}>
                <QrCode size={20} color="#a78bfa" />
              </div>
              <div className="method-card-text">
                <p className="method-card-title">UPI / QR Payment</p>
                <p className="method-card-desc">Scan QR & Pay Enter 12-digit UTR number.(Approved by admin).</p>
              </div>
              <div className="funds-badge" style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.2)"
              }}>
                Instant
              </div>
            </div>

            <div className="method-card" onClick={() => navigate("/add-funds/bhim-upi")}>
              <div className="method-card-icon" style={{
                background: "linear-gradient(135deg,#7c3aed22,#a855f722)",
                border: "1px solid rgba(124,58,237,0.3)"
              }}>
                <QrCode size={20} color="#a78bfa" />
              </div>
              <div className="method-card-text">
                <p className="method-card-title">BHIM UPI Payment</p>
                <p className="method-card-desc">Scan QR & Pay Enter 12-digit UTR number.(Approved by admin).</p>
              </div>
              <div className="funds-badge" style={{
                background: "rgba(34,197,94,0.12)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.2)"
              }}>
                Instant
              </div>
            </div>

            

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFunds;
