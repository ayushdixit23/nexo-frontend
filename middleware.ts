import { NextResponse } from "next/server";
import { NextRequest } from "next/server"; // Import the appropriate type for the request

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("token")?.value;
  const isUser = !!authToken;

  // Define restricted routes for logged-in users
  const restrictedRoutes = ["/signup", "/login", "/"];

  const url = request.nextUrl.clone();

  // If the user is authenticated and trying to access restricted routes, redirect them
  if (isUser && restrictedRoutes.includes(url.pathname)) {
    const dashboardUrl = new URL("/tasks/mytasks", request.url); // or any other protected page
    return NextResponse.redirect(dashboardUrl);
  }

  // If the user is not authenticated and trying to access protected routes, redirect to login
  if (!isUser && !restrictedRoutes.includes(url.pathname)) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/",
    "/settings",
    "/tasks/:path*",
    "/storage",
    "/chats/:path*",
    "/members",
  ],
};
