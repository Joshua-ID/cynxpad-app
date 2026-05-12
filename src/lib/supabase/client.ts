import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase"; // We will generate this later

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
