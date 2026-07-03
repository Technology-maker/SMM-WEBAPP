import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Search, ChevronDown, Info, CreditCard, Send, Zap } from "lucide-react";
import { getCategories, getServices } from "../../api/serviceAPI";
import { createOrder } from "../../api/orderAPI";
import formatCurrency from "../../utils/formatCurrency";
import toast from "react-hot-toast";

/* ── Inline styles ─────────────────────────────────────────────────────── */
const css = `
  .no-card { display: contents; }

  /* Wrapper card */
  .order-wrap {
    max-width: 780px;
    margin: 0 auto;
    background: rgba(24,24,38,0.85);
    border: 1px solid #303044;
    border-radius: 16px;
    padding: 28px 28px 32px;
  }
  @media (max-width: 600px) {
    .order-wrap { padding: 18px 14px 24px; border-radius: 14px; }
  }

  /* Page heading */
  .order-page-title {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 6px;
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .order-page-sub {
    font-size: 13px;
    color: #64748b;
    margin: 0 0 26px;
  }

  /* Field label */
  .o-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  /* Field group */
  .o-group { margin-bottom: 20px; }
  .o-group:last-of-type { margin-bottom: 0; }

  /* Base input */
  .o-input {
    width: 100%;
    background: rgba(15,15,15,0.75);
    border: 1px solid #303044;
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    color: #f8fafc;
    outline: none;
    transition: border-color .18s, box-shadow .18s;
    font-family: inherit;
    box-sizing: border-box;
  }
  .o-input::placeholder { color: #475569; }
  .o-input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.18);
  }

  /* Search with icon */
  .o-search-wrap {
    position: relative;
    margin-bottom: 22px;
  }
  .o-search-wrap .o-input { padding-left: 38px; }
  .o-search-wrap .o-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #475569;
  }

  /* Charge display — special */
  .o-charge {
    background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(37,99,235,0.10));
    border: 1px solid #7c3aed44;
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    box-sizing: border-box;
  }
  .o-charge-amount {
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, #a78bfa, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .o-charge-label {
    font-size: 12px;
    color: #64748b;
  }

  /* Hint text below field */
  .o-hint {
    margin-top: 6px;
    font-size: 12px;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* Submit button */
  .o-submit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .18s, transform .12s;
    font-family: inherit;
    box-shadow: 0 8px 32px rgba(124,58,237,0.28);
    margin-top: 24px;
  }
  .o-submit:hover:not(:disabled) { opacity: 0.92; }
  .o-submit:active:not(:disabled) { transform: scale(0.99); }
  .o-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Qty min/max row */
  .qty-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 7px;
  }
  .qty-tag { font-size: 12px; color: #64748b; }
  .qty-tag span { color: #94a3b8; font-weight: 600; }

  /* Service info strip */
  .svc-strip {
    display: flex;
    align-items: center;
    background: rgba(124,58,237,0.07);
    border: 1px solid #7c3aed33;
    border-radius: 10px;
    padding: 10px 14px;
    margin-top: 10px;
    font-size: 12px;
    color: #94a3b8;
    flex-wrap: wrap;
    gap: 6px 14px;
  }
  .svc-strip-item {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #64748b;
  }
  .svc-strip-item strong { color: #a78bfa; }

  /* Skeleton */
  .o-skel {
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(90deg, #1e1e2e 25%, #252538 50%, #1e1e2e 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* Qty progress bar */
  .qty-bar-wrap {
    width: 100%;
    height: 3px;
    background: #252535;
    border-radius: 3px;
    margin-top: 8px;
    overflow: hidden;
  }
  .qty-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: linear-gradient(90deg, #7c3aed, #14b8a6);
    transition: width .2s;
  }

  /* ── Shared Custom Dropdown (used by BOTH Category & Service) ── */
  .c-dropdown {
    position: relative;
  }
  .c-trigger {
    width: 100%;
    background: rgba(15,15,15,0.75);
    border: 1px solid #303044;
    border-radius: 10px;
    padding: 11px 40px 11px 14px;
    font-size: 14px;
    color: #475569;
    outline: none;
    text-align: left;
    cursor: pointer;
    box-sizing: border-box;
    font-family: inherit;
    transition: border-color .18s, box-shadow .18s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .c-trigger.selected { color: #f1f5f9; }
  .c-trigger:focus, .c-trigger.open {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.18);
  }
  .c-trigger:disabled { opacity: 0.5; cursor: not-allowed; }
  .c-trigger-arrow {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #475569;
  }
  .c-dropdown-box {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: #181826;
    border: 1px solid #7c3aed55;
    border-radius: 10px;
    z-index: 9999;
    max-height: 240px;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }
  .c-dropdown-search {
    padding: 8px 10px;
    border-bottom: 1px solid #252535;
    position: sticky;
    top: 0;
    background: #181826;
    z-index: 1;
  }
  .c-dropdown-search input {
    width: 100%;
    background: rgba(15,15,15,0.75);
    border: 1px solid #303044;
    border-radius: 7px;
    padding: 7px 10px;
    font-size: 13px;
    color: #f8fafc;
    outline: none;
    box-sizing: border-box;
    font-family: inherit;
  }
  .c-dropdown-search input::placeholder { color: #475569; }
  .c-dropdown-search input:focus { border-color: #7c3aed; }
  .c-option {
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid #1e1e2e;
    transition: background .12s;
  }
  .c-option:last-child { border-bottom: none; }
  .c-option:hover { background: rgba(124,58,237,0.12); }
  .c-option.active { background: rgba(124,58,237,0.18); }
  .c-option-name {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
    line-height: 1.4;
  }
  .c-option.active .c-option-name { color: #a78bfa; }
  .c-option-meta {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
  }
  .c-option-empty {
    padding: 16px 14px;
    font-size: 13px;
    color: #475569;
    text-align: center;
  }
`;

/* ── Component ────────────────────────────────────────────────────────── */
const NewOrder = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [catId, setCatId] = useState("");
  const [svcId, setSvcId] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState("");

  /* dropdown open/search state */
  const [catOpen, setCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [svcOpen, setSvcOpen] = useState(false);
  const [svcSearch, setSvcSearch] = useState("");

  /* queries */
  const catsQ = useQuery("categories", getCategories);
  const svcsQ = useQuery(
    ["services", catId, search],
    () => getServices({ category: catId || undefined, search: search || undefined }),
    { keepPreviousData: true }
  );

  const cats = catsQ.data?.data?.categories || [];
  const svcs = svcsQ.data?.data?.services || [];

  /* derived */
  const selectedCat = useMemo(() => cats.find(c => c._id === catId) || null, [cats, catId]);
  const selectedSvc = useMemo(() => svcs.find(s => s._id === svcId) || null, [svcs, svcId]);

  const min = selectedSvc?.minOrder || 0;
  const max = selectedSvc?.maxOrder || 0;
  const qty = Number(quantity) || 0;
  const charge = selectedSvc ? ((Number(selectedSvc.rate) * qty) / 1000) : 0;
  const pct = min && max && qty ? Math.min(100, Math.round(((qty - min) / (max - min)) * 100)) : 0;
  const qtyValid = qty >= min && qty <= max && qty > 0;

  /* filtered lists */
  const filteredCats = cats.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase()));
  const filteredSvcs = svcs.filter(s => s.name.toLowerCase().includes(svcSearch.toLowerCase()));

  /* close both dropdowns */
  const closeAll = () => { setCatOpen(false); setSvcOpen(false); };

  /* handlers */
  const handleCatSelect = (cat) => {
    setCatId(cat ? cat._id : "");
    setSvcId("");
    setQuantity("");
    setCatOpen(false);
    setCatSearch("");
  };

  const handleSvcSelect = (svc) => {
    setSvcId(svc._id);
    setQuantity(String(svc.minOrder));
    setSvcOpen(false);
    setSvcSearch("");
  };

  /* mutation */
  const mutation = useMutation(createOrder, {
    onSuccess: (res) => {
      toast.success(res.message || "Order placed successfully!");
      setLink("");
      setQuantity(selectedSvc ? String(selectedSvc.minOrder) : "");
      queryClient.invalidateQueries("orders");
      queryClient.invalidateQueries("user:dashboard");
      queryClient.invalidateQueries("auth:me");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSvc) return toast.error("Select a service first");
    if (!link.trim()) return toast.error("Enter the target link");
    if (!qtyValid) return toast.error(`Quantity must be between ${min} and ${max}`);
    mutation.mutate({ serviceId: selectedSvc._id, link: link.trim(), quantity: qty });
  };

  return (
    <>
      <style>{css}</style>

      {/* clicking outside closes both dropdowns */}
      <div className="order-wrap" onClick={closeAll}>

        <h1 className="order-page-title">New Order</h1>
        <p className="order-page-sub">Fill in the details below to place your order.</p>

        <form onSubmit={handleSubmit} autoComplete="off">

          {/* ── Search ── */}
          <div className="o-search-wrap">
            <Search size={15} className="o-icon" />
            <input
              className="o-input"
              placeholder="Search services…"
              value={search}
              onChange={e => { setSearch(e.target.value); setSvcId(""); setQuantity(""); }}
            />
          </div>

          {/* ── Category — Custom Dropdown ── */}
          <div className="o-group">
            <div className="o-label">Category</div>
            {catsQ.isLoading ? (
              <div className="o-skel" />
            ) : (
              <div className="c-dropdown" onClick={e => e.stopPropagation()}>

                <button
                  type="button"
                  className={`c-trigger ${catId ? "selected" : ""} ${catOpen ? "open" : ""}`}
                  onClick={() => { setCatOpen(v => !v); setSvcOpen(false); }}
                >
                  {selectedCat ? selectedCat.name : "— All Categories —"}
                </button>
                <ChevronDown size={16} className="c-trigger-arrow" />

                {catOpen && (
                  <div className="c-dropdown-box">
                    <div className="c-dropdown-search">
                      <input
                        autoFocus
                        placeholder="Search category…"
                        value={catSearch}
                        onChange={e => setCatSearch(e.target.value)}
                      />
                    </div>

                    {/* "All Categories" option */}
                    <div
                      className={`c-option ${!catId ? "active" : ""}`}
                      onClick={() => handleCatSelect(null)}
                    >
                      <div className="c-option-name">— All Categories —</div>
                    </div>

                    {filteredCats.length === 0 ? (
                      <div className="c-option-empty">No categories found</div>
                    ) : (
                      filteredCats.map(c => (
                        <div
                          key={c._id}
                          className={`c-option ${c._id === catId ? "active" : ""}`}
                          onClick={() => handleCatSelect(c)}
                        >
                          <div className="c-option-name">{c.name}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Service — Custom Dropdown ── */}
          <div className="o-group">
            <div className="o-label">Service</div>
            {svcsQ.isLoading ? (
              <div className="o-skel" />
            ) : (
              <>
                <div className="c-dropdown" onClick={e => e.stopPropagation()}>

                  <button
                    type="button"
                    className={`c-trigger ${selectedSvc ? "selected" : ""} ${svcOpen ? "open" : ""}`}
                    onClick={() => { setSvcOpen(v => !v); setCatOpen(false); }}
                    disabled={svcs.length === 0}
                  >
                    {selectedSvc ? selectedSvc.name : "— Select a Service —"}
                  </button>
                  <ChevronDown size={16} className="c-trigger-arrow" />

                  {svcOpen && (
                    <div className="c-dropdown-box">
                      {filteredSvcs.length === 0 ? (
                        <div className="c-option-empty">No services found</div>
                      ) : (
                        filteredSvcs.map(s => (
                          <div
                            key={s._id}
                            className={`c-option ${s._id === svcId ? "active" : ""}`}
                            onClick={() => handleSvcSelect(s)}
                          >
                            <div className="c-option-name">{s.name}</div>
                            <div className="c-option-meta">
                              {formatCurrency(s.rate)}/1k &nbsp;·&nbsp; Min {s.minOrder?.toLocaleString()} &nbsp;·&nbsp; Max {s.maxOrder?.toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {selectedSvc && (
                  <div className="svc-strip">
                    <div className="svc-strip-item"><Zap size={11} />Rate: <strong>{formatCurrency(selectedSvc.rate)}/1k</strong></div>
                    <div className="svc-strip-item">Min: <strong>{selectedSvc.minOrder?.toLocaleString()}</strong></div>
                    <div className="svc-strip-item">Max: <strong>{selectedSvc.maxOrder?.toLocaleString()}</strong></div>
                    {selectedSvc.category?.name && <div className="svc-strip-item">{selectedSvc.category.name}</div>}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Link ── */}
          <div className="o-group">
            <div className="o-label">Link</div>
            <input
              className="o-input"
              placeholder="https://..."
              value={link}
              onChange={e => setLink(e.target.value)}
              required
            />
            <div className="o-hint">
              <Info size={11} />
              Paste the full URL of your post, profile, or video.
            </div>
          </div>

          {/* ── Quantity ── */}
          <div className="o-group">
            <div className="o-label">Quantity</div>
            <input
              className="o-input"
              type="number"
              placeholder={selectedSvc ? `Min ${min} – Max ${max}` : "Select a service first"}
              min={min || 1}
              max={max || undefined}
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              disabled={!selectedSvc}
              required
            />
            {selectedSvc ? (
              <>
                <div className="qty-bar-wrap">
                  <div className="qty-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="qty-meta">
                  <span className="qty-tag">Min: <span>{min.toLocaleString()}</span></span>
                  {qty > 0 && qtyValid && <span className="qty-tag" style={{ color: "#14b8a6" }}>✓ Valid</span>}
                  {qty > 0 && !qtyValid && <span className="qty-tag" style={{ color: "#f97316" }}>Out of range</span>}
                  <span className="qty-tag">Max: <span>{max.toLocaleString()}</span></span>
                </div>
              </>
            ) : (
              <div className="o-hint"><Info size={11} />Choose a service to see limits.</div>
            )}
          </div>

          {/* ── Charge ── */}
          <div className="o-group">
            <div className="o-label"><CreditCard size={13} />Charge</div>
            <div className="o-charge">
              <div>
                <div className="o-charge-label">Total cost</div>
                <div className="o-charge-amount">{charge > 0 ? formatCurrency(charge) : "—"}</div>
              </div>
              {selectedSvc && qty > 0 && (
                <div style={{ textAlign: "right" }}>
                  <div className="o-charge-label">Rate used</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                    {formatCurrency(selectedSvc.rate)}/1k × {qty.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            className="o-submit"
            disabled={mutation.isLoading || !selectedSvc || !qtyValid || !link.trim()}
          >
            <Send size={16} />
            {mutation.isLoading ? "Placing Order…" : "Submit"}
          </button>

        </form>
      </div>
    </>
  );
};

export default NewOrder;