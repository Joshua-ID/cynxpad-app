/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";

export function OrderRow({
  order,
  role,
}: {
  order: any;
  role: "client" | "seller";
}) {
  const isCompleted = order.status === "completed";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-zinc-100 bg-white p-5 transition-all hover:border-zinc-200">
      <div className="flex items-center gap-4">
        <div
          className={`rounded-full p-2 ${isCompleted ? "bg-brand-green/10 text-brand-green" : "bg-brand-orange/10 text-brand-orange"}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
        </div>
        <div>
          <h4 className="font-bold text-zinc-900">{order.gig.title}</h4>
          <p className="text-xs text-zinc-400">
            {role === "seller"
              ? `Client: @${order.client.username}`
              : `Writer: @${order.seller.username}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs font-bold text-zinc-400 uppercase">Budget</p>
          <p className="font-bold text-zinc-900">
            ₦{order.amount.toLocaleString()}
          </p>
        </div>

        {role === "seller" && !isCompleted && (
          <button className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-orange transition-all">
            Submit Work
          </button>
        )}

        {isCompleted && (
          <button className="flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-50">
            Download <ExternalLink className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
