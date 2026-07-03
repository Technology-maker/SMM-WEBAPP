const StatCard = ({ title, value, icon: Icon, accent = "from-brand to-ocean" }) => (
  <div className="glass rounded-lg p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </div>
      {Icon && (
        <div className={`rounded-lg bg-gradient-to-br ${accent} p-3 text-white`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
