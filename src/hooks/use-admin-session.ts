import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminSession = {
  loading: boolean;
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
};

export function useAdminSession(): AdminSession {
  const [state, setState] = useState<AdminSession>({
    loading: true,
    userId: null,
    email: null,
    isAdmin: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        if (!cancelled) setState({ loading: false, userId: null, email: null, isAdmin: false });
        return;
      }
      // is_admin() RLS function — runs as definer, returns true if user's email is in admin_emails
      const { data: isAdminData } = await supabase.rpc("is_admin", { _user_id: user.id });
      if (!cancelled) {
        setState({
          loading: false,
          userId: user.id,
          email: user.email ?? null,
          isAdmin: Boolean(isAdminData),
        });
      }
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        check();
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}