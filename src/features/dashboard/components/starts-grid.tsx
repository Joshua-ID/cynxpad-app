export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase">Followers</p>
        <h4 className="text-3xl font-bold mt-1">1,284</h4>
      </div>
      <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase">Total Reads</p>
        <h4 className="text-3xl font-bold mt-1">42.5k</h4>
      </div>
      <div className="p-6 rounded-2xl bg-white border border-zinc-100 shadow-sm">
        <p className="text-xs font-bold text-zinc-400 uppercase">
          Revenue (NGN)
        </p>
        <h4 className="text-3xl font-bold mt-1 text-brand-green">₦145,000</h4>
      </div>
    </div>
  );
}
