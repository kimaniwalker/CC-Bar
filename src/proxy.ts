import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/proxy";

export async function proxy(request: NextRequest) {
  console.log("Proxying request:", request.url);
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
    "/profile/:path*",
    "/orders/:path*",
    "/favorites/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
  ],
};
