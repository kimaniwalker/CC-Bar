import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
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

  return NextResponse.redirect(`${origin}/profile/overview?success=true`);
}
