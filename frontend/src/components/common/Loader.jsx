const Loader = ({ label = "Loading" }) => (
  <div className="flex min-h-[240px] items-center justify-center">
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  </div>
);

export const SkeletonRows = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="skeleton h-12 w-full" />
    ))}
  </div>
);

export default Loader;
