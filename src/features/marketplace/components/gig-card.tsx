import { Briefcase, Clock, Zap } from "lucide-react";

interface GigCardProps {
  gig: {
    id: string;
    title: string;
    price: number;
    delivery_days: number;
    seller: { username: string; avatar_url: string };
  };
}

export function GigCard({ gig }: GigCardProps) {
  return (
    <div className="group rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-zinc-100" />
        <span className="text-xs font-bold text-zinc-400">
          @{gig.seller.username}
        </span>
      </div>

      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-brand-orange transition-colors">
        {gig.title}
      </h3>

      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> {gig.delivery_days} days
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-brand-orange" /> High Quality
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div>
          <p className="text-xs text-zinc-400 font-bold uppercase">Starts at</p>
          <p className="text-xl font-black text-zinc-900">
            ₦{gig.price.toLocaleString()}
          </p>
        </div>
        <button className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-bold text-white hover:bg-brand-orange transition-all">
          Hire Writer
        </button>
      </div>
    </div>
  );
}
