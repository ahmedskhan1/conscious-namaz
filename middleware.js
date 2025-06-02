import { NextResponse } from 'next/server';

export function middleware(request) {
  // Log the request URL for debugging
  // console.log(`Middleware processing request for: ${request.url}`);
  
  // Continue with the request
  return NextResponse.next();
}

// Only run the middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 