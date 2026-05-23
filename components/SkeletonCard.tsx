export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
      <div className="bg-slate-200 h-20 w-full" />
      <div className="px-5 py-4 space-y-3">
        <div className="flex gap-2.5">
          <div className="bg-slate-200 rounded w-4 h-4 shrink-0 mt-0.5" />
          <div className="bg-slate-200 rounded h-4 w-3/4" />
        </div>
        <div className="flex gap-2.5">
          <div className="bg-slate-200 rounded w-4 h-4 shrink-0 mt-0.5" />
          <div className="bg-slate-200 rounded h-4 w-1/2" />
        </div>
        <div className="flex gap-2.5">
          <div className="bg-slate-200 rounded w-4 h-4 shrink-0 mt-0.5" />
          <div className="bg-slate-200 rounded h-4 w-2/3" />
        </div>
        <div className="flex gap-2.5">
          <div className="bg-slate-200 rounded w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="bg-slate-200 rounded h-4 w-full" />
            <div className="bg-slate-200 rounded h-4 w-4/5" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-1">
        <div className="bg-slate-200 rounded-xl h-10 w-full" />
      </div>
    </div>
  );
}
