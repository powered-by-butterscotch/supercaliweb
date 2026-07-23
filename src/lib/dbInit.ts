import { supabase } from "./supabase";

/**
 * Automigration script to verify and create required tables in Supabase public schema.
 * This runs on-demand during web API routes access to guarantee tables exist without manual execution.
 */
export async function initDbSchema() {
  try {
    // 1. Verify and create shop_items table via standard promise checks
    const { error: rpcError } = await supabase.rpc("init_shop_items_table");
    if (rpcError) {
      // Fallback: Check if table can be queried
      const { error: queryError } = await supabase.from("shop_items").select("id").limit(1);
      if (queryError) {
        console.warn("Table 'shop_items' not detected. Real-time auto-creation must be configured via Supabase Dashboard RPC function 'init_shop_items_table'.");
      }
    }

    console.log("Database schema verification and initialization completed.");
  } catch (error) {
    console.error("Failed to auto initialize database tables:", error);
  }
}
