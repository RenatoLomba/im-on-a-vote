// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.get('userCookie')) {
    return response;
  }

  const random = Math.random().toString();

  response.cookies.set('userCookie', random, { sameSite: 'strict' });

  return response;
}

export const config = {
  matcher: ['/', '/question/:path*'],
};
