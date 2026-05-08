const variantMap = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
  scheduled: "bg-indigo-100 text-indigo-700",
  active: "bg-sky-100 text-sky-700",
  expired: "bg-slate-200 text-slate-700",
  invalid: "bg-slate-200 text-slate-700",
};

export default function StatusBadge({ label, variant }) {
  const className = variantMap[variant] || "bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
