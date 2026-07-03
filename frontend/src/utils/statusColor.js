const statusColor = (status) => {
  const map = {
    pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    processing: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    cancelled: "bg-red-500/15 text-red-300 border-red-400/30",
    partial: "bg-orange-500/15 text-orange-300 border-orange-400/30",
    success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    failed: "bg-red-500/15 text-red-300 border-red-400/30"
  };
  return map[status] || "bg-slate-500/15 text-slate-300 border-slate-400/30";
};

export default statusColor;
