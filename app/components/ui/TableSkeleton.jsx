export default function TableSkeleton({ rows = 4 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-4 border-b border-slate-100 p-4 last:border-b-0"
          >
            <div className="h-3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-200" />
            <div className="h-3 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
