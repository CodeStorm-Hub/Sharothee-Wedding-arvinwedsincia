import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Add security headers
    const response = NextResponse.next();
    
    // Performance: Add cache headers for static routes
    const pathname = req.nextUrl.pathname;
    
    if (pathname.startsWith('/images/') || pathname.startsWith('/_next/static/')) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=31536000, immutable'
      );
    }
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/(dashboard|guests|events|media|hotels|streams|contacts|settings)(.*)?",
  ],
};
