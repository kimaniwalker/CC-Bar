"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/utils/User/signOut";

export const Logout = ({ onLogout }: { onLogout: () => void }) => {
  const supabase = createClient();
  const router = useRouter();
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      setHasSession(!!sessionData?.session?.user);
    }
    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Sign out client-side first
      await supabase.auth.signOut();

      // Update local state immediately
      setHasSession(false);

      // Call onLogout callback
      onLogout();

      // Call server action to clear server-side session
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      // Still try to clean up
      setHasSession(false);
      onLogout();
      router.push("/auth/login");
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasSession) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </>
      )}
    </button>
  );
};
