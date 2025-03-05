
import { supabase } from '@/lib/supabase';
import { getUserIp } from "./getIp";

export const logIpEvent = async (userId: string, event: string) => {
  const ip = await getUserIp();
  if (!ip) return;

  const { error } = await supabase.from("ip_logs").insert([
    {
      user_id: userId,
      ip_address: ip,
      event: event,
    },
  ]);

  if (error) console.error("Error logging IP event:", error);
};
