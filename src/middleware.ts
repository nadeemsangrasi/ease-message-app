import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Export default middleware from next-auth
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect authenticated users from public routes to the dashboard
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users from private routes to the sign-in page
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access to the root route for unauthenticated users
  if (url.pathname === "/" && !token) {
    return NextResponse.next(); // Allow unauthenticated users to access the home page
  }

  // Allow access to other paths
  return NextResponse.next();
}

// Middleware configuration for matching paths
export const config = {
  matcher: [
    "/", // Root route
    "/sign-in", // Sign-in page
    "/sign-up", // Sign-up page
    "/dashboard/:path*", // Dashboard and its sub-routes
    "/verify/:path*", // Verification routes
    "/u/:path*", // User-specific routes
  ],
};
