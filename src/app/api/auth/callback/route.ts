import { createClient } from "@/utils/supabase/server";
import { syncUserAccount } from "@/utils/User/syncUserAccount";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          await syncUserAccount(user); // Sync only on login
        }
      } else {
        const msg = encodeURIComponent(error.message ?? "Unknown error");
        return NextResponse.redirect(
          `${origin}/auth/login?success=false&errorMessage=${msg}`,
        );
      }
    } catch (err: unknown) {
      const msg = encodeURIComponent(
        err instanceof Error ? err.message : "Unknown error",
      );

      return NextResponse.redirect(
        `${origin}/auth/login?success=false&errorMessage=${msg}`,
      );
    }
  }

  console.log("✅ Auth callback successful");
  console.log({ origin });
  return NextResponse.redirect(`${origin}/profile/overview?success=true`);
}
