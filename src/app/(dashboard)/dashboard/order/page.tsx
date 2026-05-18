import { createClient } from "@/lib/supabase/server";
import { OrderRow } from "@/features/marketplace/components/order-row";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch contracts where user is either the client or the seller
  const { data: contracts } = await supabase
    .from("contracts")
    .select(
      `
      *,
      gig:gigs(title),
      client:profiles!contracts_client_id_fkey(username),
      seller:profiles!contracts_seller_id_fkey(username)
    `,
    )
    .or(`client_id.eq.${user?.id},seller_id.eq.${user?.id}`)
    .order("created_at", { ascending: false });

  const asClient = contracts?.filter((c) => c.client_id === user?.id) || [];
  const asSeller = contracts?.filter((c) => c.seller_id === user?.id) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Project Management
        </h1>
        <p className="text-zinc-500 font-serif italic">
          Track your collaborations and deliveries.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Simple Section Toggle */}
        <div className="border-b border-zinc-100 pb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-brand-orange mb-4">
            Active Jobs (To Write)
          </h2>
          <div className="grid gap-4">
            {asSeller.length > 0 ? (
              asSeller.map((order) => (
                <OrderRow key={order.id} order={order} role="seller" />
              ))
            ) : (
              <p className="text-sm text-zinc-400 italic">
                No one has hired you yet. Keep polishing those gigs!
              </p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">
            My Hires (To Receive)
          </h2>
          <div className="grid gap-4">
            {asClient.map((order) => (
              <OrderRow key={order.id} order={order} role="client" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
