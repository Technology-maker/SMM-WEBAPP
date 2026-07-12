import { useState, useMemo } from "react";
import { useQuery } from "react-query";
import { Search, X, TrendingDown, Package, Filter, ChevronRight, Info } from "lucide-react";
import { getCategories, getServices } from "../../api/serviceAPI";
import formatCurrency from "../../utils/formatCurrency";

const Services = () => {
  const [categoryId, setCategoryId]       = useState("");
  const [search, setSearch]               = useState("");
  const [detailSvc, setDetailSvc]         = useState(null);
  const [showMobileCat, setShowMobileCat] = useState(false);

  const { data: catData, isLoading: catLoading } = useQuery("categories", getCategories);
  const { data: svcData, isLoading: svcLoading } = useQuery(
    ["services", categoryId, search],
    () => getServices({ category: categoryId || undefined, search: search || undefined }),
    { keepPreviousData: true }
  );

  const categories  = catData?.data?.categories || [];
  const allServices = svcData?.data?.services   || [];

  const grouped = useMemo(() => {
    const map = {};
    allServices.forEach((svc) => {
      const key = svc.category?.name || "Uncategorized";
      if (!map[key]) map[key] = [];
      map[key].push(svc);
    });
    return map;
  }, [allServices]);


  const fmtNum = (n) => Number(n || 0).toLocaleString("en-IN");
  const svcId  = (svc) => svc.providerServiceId ?? svc.serviceId ?? "—";

  const activeCatName = categories.find((c) => c._id === categoryId)?.name || "All Services";

  return (
    <>
      <style>{`
        /* ─── Root ─────────────────────────────── */
        .sv-root { display:flex; gap:0; min-height:calc(100vh - 80px); margin:-1.5rem -1rem; }

        /* ─── Left category sidebar (desktop) ─── */
        .sv-cats {
          width:230px; flex-shrink:0;
          border-right:1px solid rgba(255,255,255,0.07);
          padding:0.75rem 0;
          overflow-y:auto; max-height:calc(100vh - 80px);
          position:sticky; top:0;
        }
        .sv-cats::-webkit-scrollbar { width:3px; }
        .sv-cats::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
        .sv-cat-head {
          padding:0.25rem 1rem 0.5rem;
          font-size:0.68rem; font-weight:700;
          text-transform:uppercase; letter-spacing:0.08em; color:#475569;
        }
        .sv-cat-item {
          display:flex; align-items:center; justify-content:space-between;
          padding:0.46rem 1rem; font-size:0.8125rem; cursor:pointer;
          border-left:2.5px solid transparent;
          transition:all 0.14s; color:#94a3b8; gap:0.5rem; user-select:none;
        }
        .sv-cat-item:hover  { color:#e2e8f0; background:rgba(255,255,255,0.03); }
        .sv-cat-item.active { color:#a78bfa; border-left-color:#7c3aed; background:rgba(124,58,237,0.09); }
        .sv-cat-name  { flex:1; line-height:1.35; }
        .sv-cat-count {
          font-size:0.68rem; background:rgba(255,255,255,0.08);
          padding:0.05rem 0.4rem; border-radius:9999px; color:#64748b; flex-shrink:0;
        }
        .sv-cat-item.active .sv-cat-count { background:rgba(124,58,237,0.2); color:#a78bfa; }

        /* ─── Right panel ──────────────────────── */
        .sv-main { flex:1; min-width:0; display:flex; flex-direction:column; }

        /* ─── Toolbar ──────────────────────────── */
        .sv-toolbar {
          display:flex; align-items:center; gap:0.625rem;
          padding:0.7rem 1rem;
          border-bottom:1px solid rgba(255,255,255,0.07);
          background:rgba(15,15,30,0.65);
          position:sticky; top:0; z-index:10;
          backdrop-filter:blur(8px); flex-wrap:wrap;
        }
        .sv-search-wrap { position:relative; flex:1; min-width:140px; }
        .sv-search-wrap svg { position:absolute; left:0.65rem; top:50%; transform:translateY(-50%); color:#64748b; pointer-events:none; }
        .sv-search-input {
          width:100%; box-sizing:border-box;
          padding:0.44rem 0.75rem 0.44rem 2.1rem;
          border-radius:0.375rem;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.04);
          color:#e2e8f0; font-size:0.875rem; outline:none;
          transition:border-color 0.15s;
        }
        .sv-search-input::placeholder { color:#64748b; }
        .sv-search-input:focus { border-color:#7c3aed; }
        .sv-mob-filter-btn {
          display:none; align-items:center; gap:0.35rem;
          padding:0.44rem 0.75rem;
          border-radius:0.375rem;
          border:1px solid rgba(255,255,255,0.1);
          background:rgba(255,255,255,0.04);
          color:#94a3b8; font-size:0.8rem; cursor:pointer;
          transition:all 0.15s; white-space:nowrap; flex-shrink:0;
        }
        .sv-mob-filter-btn.on { border-color:#7c3aed; color:#a78bfa; background:rgba(124,58,237,0.09); }
        .sv-count { font-size:0.73rem; color:#64748b; white-space:nowrap; flex-shrink:0; }

        /* ─── Desktop table ────────────────────── */
        .sv-table-wrap { overflow-x:auto; flex:1; }
        .sv-table { width:100%; min-width:680px; border-collapse:collapse; font-size:0.8125rem; }
        .sv-thead th {
          padding:0.5rem 1rem; text-align:left;
          font-size:0.68rem; text-transform:uppercase; letter-spacing:0.06em; color:#64748b;
          border-bottom:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.02); white-space:nowrap;
        }
        .sv-group-row td {
          padding:0.38rem 1rem; font-size:0.71rem; font-weight:700;
          letter-spacing:0.04em; text-transform:uppercase; color:#7c3aed;
          background:rgba(124,58,237,0.07);
          border-top:1px solid rgba(124,58,237,0.14);
          border-bottom:1px solid rgba(124,58,237,0.1);
        }
        .sv-new-badge {
          margin-left:0.4rem; font-size:0.6rem;
          background:#2563eb; color:#fff;
          padding:0.05rem 0.32rem; border-radius:0.2rem; font-weight:700; vertical-align:middle;
        }
        .sv-row { border-bottom:1px solid rgba(255,255,255,0.045); cursor:pointer; transition:background 0.1s; }
        .sv-row:hover { background:rgba(255,255,255,0.03); }
        .sv-row td { padding:0.58rem 1rem; color:#cbd5e1; vertical-align:middle; }
        .sv-id {
          font-family:ui-monospace,monospace; font-size:0.7rem;
          background:rgba(255,255,255,0.07); padding:0.1rem 0.4rem;
          border-radius:0.25rem; color:#94a3b8; white-space:nowrap;
        }
        .sv-rate { color:#14b8a6; font-weight:600; white-space:nowrap; }
        .sv-num  { white-space:nowrap; }
        .sv-details-btn {
          display:inline-flex; align-items:center; gap:0.28rem;
          padding:0.22rem 0.55rem; border-radius:0.32rem;
          background:#2563eb; color:#fff;
          font-size:0.72rem; font-weight:600;
          border:none; cursor:pointer; white-space:nowrap; transition:opacity 0.15s;
        }
        .sv-details-btn:hover { opacity:0.82; }

        /* ─── Mobile card list ─────────────────── */
        .sv-cards { display:none; flex-direction:column; flex:1; overflow-y:auto; }

        /* group label inside card list */
        .sv-card-group {
          padding:0.5rem 1rem 0.3rem;
          font-size:0.68rem; font-weight:700; letter-spacing:0.05em;
          text-transform:uppercase; color:#7c3aed;
          background:rgba(124,58,237,0.07);
          border-top:1px solid rgba(124,58,237,0.14);
          border-bottom:1px solid rgba(124,58,237,0.1);
          display:flex; align-items:center; gap:0.4rem;
        }

        /* individual service card */
        .sv-card {
          display:flex; flex-direction:column; gap:0.5rem;
          padding:0.875rem 1rem;
          border-bottom:1px solid rgba(255,255,255,0.05);
          cursor:pointer; transition:background 0.12s; active:background:rgba(255,255,255,0.04);
        }
        .sv-card:active { background:rgba(255,255,255,0.04); }

        .sv-card-top {
          display:flex; align-items:flex-start; justify-content:space-between; gap:0.75rem;
        }
        .sv-card-left  { flex:1; min-width:0; }
        .sv-card-right { flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:0.35rem; }

        .sv-card-id {
          font-family:ui-monospace,monospace; font-size:0.68rem;
          background:rgba(255,255,255,0.07); padding:0.08rem 0.38rem;
          border-radius:0.22rem; color:#94a3b8; display:inline-block; margin-bottom:0.3rem;
        }
        .sv-card-name {
          font-size:0.8375rem; font-weight:600; color:#e2e8f0; line-height:1.42;
          /* clamp to 2 lines on very long names */
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
        }
        .sv-card-rate { font-size:0.875rem; font-weight:700; color:#14b8a6; white-space:nowrap; }

        .sv-card-meta {
          display:flex; flex-wrap:wrap; gap:0.5rem 1rem;
          font-size:0.73rem; color:#64748b;
        }
        .sv-card-meta-item { display:flex; align-items:center; gap:0.28rem; }
        .sv-card-meta-item svg { color:#475569; flex-shrink:0; }

        .sv-card-detail-btn {
          align-self:flex-end;
          display:inline-flex; align-items:center; gap:0.3rem;
          padding:0.3rem 0.7rem; border-radius:0.375rem;
          background:#2563eb; color:#fff;
          font-size:0.75rem; font-weight:600;
          border:none; cursor:pointer; transition:opacity 0.15s;
          margin-top:0.1rem;
        }
        .sv-card-detail-btn:active { opacity:0.75; }

        /* ─── Skeleton ─────────────────────────── */
        .sv-skel {
          background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
          background-size:200% 100%; animation:svSk 1.4s infinite;
          border-radius:0.25rem; height:0.8rem;
        }
        @keyframes svSk { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* mobile skeleton cards */
        .sv-card-skel {
          padding:0.875rem 1rem;
          border-bottom:1px solid rgba(255,255,255,0.05);
          display:flex; flex-direction:column; gap:0.5rem;
        }

        .sv-empty { padding:4rem 1rem; text-align:center; color:#64748b; font-size:0.875rem; }

        /* ─── Details modal ────────────────────── */
        .sv-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.72);
          z-index:50; display:flex; align-items:center; justify-content:center; padding:1rem;
        }
        .sv-modal {
          background:#12121f;
          border:1px solid rgba(255,255,255,0.1);
          border-radius:0.875rem; width:100%; max-width:500px;
          box-shadow:0 20px 60px rgba(0,0,0,0.55);
          overflow:hidden;
          animation:svMdIn 0.17s cubic-bezier(.4,0,.2,1);
        }
        @keyframes svMdIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .sv-modal-head {
          padding:1rem 1.25rem 0.875rem;
          border-bottom:1px solid rgba(255,255,255,0.07);
          display:flex; align-items:flex-start; gap:0.75rem;
        }
        .sv-modal-title { font-size:0.9375rem; font-weight:700; line-height:1.4; color:#e2e8f0; flex:1; }
        .sv-modal-cat   { font-size:0.72rem; color:#7c3aed; margin-top:0.2rem; }
        .sv-modal-id    { font-size:0.68rem; color:#64748b; margin-bottom:0.2rem; font-family:ui-monospace,monospace; }
        .sv-close-btn   { flex-shrink:0; background:none; border:none; color:#64748b; cursor:pointer; padding:0.25rem; border-radius:0.375rem; transition:all 0.15s; }
        .sv-close-btn:hover { color:#e2e8f0; background:rgba(255,255,255,0.08); }
        .sv-modal-body  { padding:1rem 1.25rem; display:flex; flex-direction:column; gap:0.45rem; }
        .sv-modal-row   { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:0.48rem 0.75rem; border-radius:0.45rem; background:rgba(255,255,255,0.03); }
        .sv-modal-label { font-size:0.78rem; color:#94a3b8; display:flex; align-items:center; gap:0.35rem; }
        .sv-modal-val   { font-size:0.78rem; font-weight:600; color:#e2e8f0; text-align:right; }
        .sv-modal-desc  { font-size:0.78rem; color:#94a3b8; line-height:1.6; padding:0.65rem 0.75rem; background:rgba(255,255,255,0.03); border-radius:0.45rem; }
        .sv-modal-foot  { padding:0.875rem 1.25rem; border-top:1px solid rgba(255,255,255,0.07); display:flex; gap:0.625rem; justify-content:flex-end; }
        .sv-order-btn {
          display:inline-flex; align-items:center; gap:0.35rem;
          padding:0.5rem 1.1rem; border-radius:0.5rem;
          background:linear-gradient(135deg,#7c3aed,#2563eb);
          color:#fff; font-size:0.875rem; font-weight:600;
          border:none; cursor:pointer; transition:opacity 0.15s;
        }
        .sv-order-btn:hover { opacity:0.87; }
        .sv-cancel-btn {
          background:none; border:1px solid rgba(255,255,255,0.1); color:#94a3b8;
          border-radius:0.5rem; padding:0.5rem 1rem; font-size:0.875rem;
          cursor:pointer; transition:all 0.15s;
        }
        .sv-cancel-btn:hover { border-color:rgba(255,255,255,0.2); color:#e2e8f0; }

        /* ─── Mobile: modal slides up from bottom ─ */
        @media (max-width:767px) {
          .sv-backdrop { align-items:flex-end; padding:0; }
          .sv-modal {
            border-radius:1rem 1rem 0 0; max-width:100%;
            animation:svMdUp 0.22s cubic-bezier(.4,0,.2,1);
          }
          @keyframes svMdUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
          /* add a drag handle */
          .sv-modal-handle {
            width:2.5rem; height:0.25rem; border-radius:9999px;
            background:rgba(255,255,255,0.15); margin:0.75rem auto 0;
          }
        }
        @media (min-width:768px) { .sv-modal-handle { display:none; } }

        /* ─── Mobile category bottom-sheet ─────── */
        .sv-mob-sheet-wrap { position:fixed; inset:0; z-index:40; display:none; }
        .sv-mob-sheet-wrap.open { display:block; }
        .sv-mob-sheet-bg { position:absolute; inset:0; background:rgba(0,0,0,0.55); }
        .sv-mob-sheet {
          position:absolute; bottom:0; left:0; right:0;
          background:#0f0f1e;
          border-top:1px solid rgba(255,255,255,0.08);
          border-radius:1rem 1rem 0 0;
          padding:1rem 0 2.5rem; max-height:72dvh; overflow-y:auto;
          animation:svSheet 0.2s ease;
        }
        @keyframes svSheet { from{transform:translateY(100%)} to{transform:translateY(0)} }
        .sv-mob-handle { width:2.5rem; height:0.25rem; background:rgba(255,255,255,0.15); border-radius:9999px; margin:0 auto 0.875rem; }

        /* ─── Responsive switches ───────────────── */
        @media (max-width:767px) {
          .sv-cats        { display:none !important; }
          .sv-mob-filter-btn { display:flex !important; }
          .sv-table-wrap  { display:none !important; }
          .sv-cards       { display:flex !important; }
        }
        @media (min-width:768px) {
          .sv-mob-sheet-wrap { display:none !important; }
          .sv-mob-filter-btn { display:none !important; }
          .sv-cards          { display:none !important; }
          .sv-table-wrap     { display:block !important; }
        }
      `}</style>

      <div className="sv-root">

        {/* ══ LEFT sidebar (desktop) ══ */}
        <div className="sv-cats">
          <div className="sv-cat-head">Categories</div>
          <div
            className={`sv-cat-item${!categoryId ? " active" : ""}`}
            onClick={() => setCategoryId("")}
          >
            <span className="sv-cat-name">All Services</span>
            <span className="sv-cat-count">{allServices.length}</span>
          </div>
          {catLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ padding: "0.55rem 1rem" }}>
                  <div className="sv-skel" style={{ width: `${58 + i * 8}%` }} />
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id}
                  className={`sv-cat-item${categoryId === cat._id ? " active" : ""}`}
                  onClick={() => setCategoryId(cat._id)}
                >
                  <span className="sv-cat-name">{cat.name}</span>
                </div>
              ))
          }
        </div>

        {/* ══ RIGHT panel ══ */}
        <div className="sv-main">

          {/* Toolbar */}
          <div className="sv-toolbar">
            <button
              className={`sv-mob-filter-btn${categoryId ? " on" : ""}`}
              onClick={() => setShowMobileCat(true)}
            >
              <Filter size={13} />
              {activeCatName}
            </button>

            <div className="sv-search-wrap">
              <Search size={13} />
              <input
                className="sv-search-input"
                placeholder="Search services…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <span className="sv-count">{allServices.length} services</span>
          </div>

          {/* ══ DESKTOP: table ══ */}
          <div className="sv-table-wrap">
            {svcLoading ? (
              <table className="sv-table">
                <thead className="sv-thead">
                  <tr>
                    <th>ID</th><th>Service</th><th>Rate per 1000</th>
                    <th>Min order</th><th>Max order</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {[44, 240, 90, 60, 70, 90, 70].map((w, j) => (
                        <td key={j} style={{ padding: "0.65rem 1rem" }}>
                          <div className="sv-skel" style={{ width: `${w}px`, maxWidth: "100%" }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : allServices.length === 0 ? (
              <div className="sv-empty">No services found.</div>
            ) : (
              <table className="sv-table">
                <thead className="sv-thead">
                  <tr>
                    <th>ID</th>
                    <th>Service</th>
                    <th>Rate per 1000</th>
                    <th>Min order</th>
                    <th>Max order</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(grouped).map(([groupName, svcs]) => (
                    <>
                      <tr key={`g-${groupName}`} className="sv-group-row">
                        <td colSpan={7}>
                          {groupName}
                          {svcs[0]?.isNew && <span className="sv-new-badge">NEW</span>}
                        </td>
                      </tr>
                      {svcs.map((svc) => (
                        <tr key={svc._id} className="sv-row" onClick={() => setDetailSvc(svc)}>
                          <td><span className="sv-id">{svcId(svc)}</span></td>
                          <td style={{ maxWidth: 280, minWidth: 160 }}>
                            <span style={{ display:"block", lineHeight:1.45, color:"#e2e8f0" }}>{svc.name}</span>
                          </td>
                          <td><span className="sv-rate">≈ {formatCurrency(svc.rate)}</span></td>
                          <td className="sv-num">{fmtNum(svc.minOrder)}</td>
                          <td className="sv-num">{fmtNum(svc.maxOrder)}</td>
                          
                          <td onClick={(e) => e.stopPropagation()}>
                            <button className="sv-details-btn" onClick={() => setDetailSvc(svc)}>
                              <Info size={11} /> Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ══ MOBILE: card list ══ */}
          <div className="sv-cards">
            {svcLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="sv-card-skel">
                  <div className="sv-skel" style={{ width: "40px" }} />
                  <div className="sv-skel" style={{ width: "85%" }} />
                  <div className="sv-skel" style={{ width: "60%" }} />
                  <div className="sv-skel" style={{ width: "50%", height:"0.65rem" }} />
                </div>
              ))
            ) : allServices.length === 0 ? (
              <div className="sv-empty">No services found.</div>
            ) : (
              Object.entries(grouped).map(([groupName, svcs]) => (
                <>
                  {/* group label */}
                  <div key={`mg-${groupName}`} className="sv-card-group">
                    {groupName}
                    {svcs[0]?.isNew && <span className="sv-new-badge">NEW</span>}
                  </div>

                  {/* cards */}
                  {svcs.map((svc) => (
                    <div key={svc._id} className="sv-card" onClick={() => setDetailSvc(svc)}>
                      <div className="sv-card-top">
                        <div className="sv-card-left">
                          <span className="sv-card-id">{svcId(svc)}</span>
                          <div className="sv-card-name">{svc.name}</div>
                        </div>
                        <div className="sv-card-right">
                          <span className="sv-card-rate">≈ {formatCurrency(svc.rate)}</span>
                        </div>
                      </div>

                      <div className="sv-card-meta">
                        <span className="sv-card-meta-item">
                          <Package size={11} /> {fmtNum(svc.minOrder)} – {fmtNum(svc.maxOrder)}
                        </span>
                      </div>

                      <button
                        className="sv-card-detail-btn"
                        onClick={(e) => { e.stopPropagation(); setDetailSvc(svc); }}
                      >
                        <Info size={11} /> Details
                      </button>
                    </div>
                  ))}
                </>
              ))
            )}
          </div>

        </div>{/* sv-main */}
      </div>{/* sv-root */}

      {/* ══ Mobile category bottom-sheet ══ */}
      <div className={`sv-mob-sheet-wrap${showMobileCat ? " open" : ""}`}>
        <div className="sv-mob-sheet-bg" onClick={() => setShowMobileCat(false)} />
        <div className="sv-mob-sheet">
          <div className="sv-mob-handle" />
          <div className="sv-cat-head" style={{ paddingLeft:"1.25rem" }}>Categories</div>
          <div
            className={`sv-cat-item${!categoryId ? " active" : ""}`}
            onClick={() => { setCategoryId(""); setShowMobileCat(false); }}
          >
            <span className="sv-cat-name">All Services</span>
            <span className="sv-cat-count">{allServices.length}</span>
          </div>
          {categories.map((cat) => (
            <div
              key={cat._id}
              className={`sv-cat-item${categoryId === cat._id ? " active" : ""}`}
              onClick={() => { setCategoryId(cat._id); setShowMobileCat(false); }}
            >
              <span className="sv-cat-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ Details modal ══ */}
      {detailSvc && (
        <div className="sv-backdrop" onClick={() => setDetailSvc(null)}>
          <div className="sv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sv-modal-handle" />

            <div className="sv-modal-head">
              <div style={{ flex:1 }}>
                <div className="sv-modal-id">Service #{svcId(detailSvc)}</div>
                <div className="sv-modal-title">{detailSvc.name}</div>
                {detailSvc.category?.name && (
                  <div className="sv-modal-cat">{detailSvc.category.name}</div>
                )}
              </div>
              <button className="sv-close-btn" onClick={() => setDetailSvc(null)}>
                <X size={17} />
              </button>
            </div>

            <div className="sv-modal-body">
              <div className="sv-modal-row">
                <span className="sv-modal-label"><TrendingDown size={13} /> Rate per 1000</span>
                <span className="sv-modal-val" style={{ color:"#14b8a6" }}>{formatCurrency(detailSvc.rate)}</span>
              </div>
              <div className="sv-modal-row">
                <span className="sv-modal-label"><Package size={13} /> Min / Max</span>
                <span className="sv-modal-val">{fmtNum(detailSvc.minOrder)} – {fmtNum(detailSvc.maxOrder)}</span>
              </div>
              
              {detailSvc.description && (
                <div className="sv-modal-desc">{detailSvc.description}</div>
              )}
            </div>

            <div className="sv-modal-foot">
              <button className="sv-cancel-btn" onClick={() => setDetailSvc(null)}>Close</button>
              <button
                className="sv-order-btn"
                onClick={() => { setDetailSvc(null); window.location.href = `/new-order?service=${detailSvc._id}`; }}
              >
                Order Now <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Services;