import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuid } from 'uuid';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.cookies.get('poll-token')) {
    return response;
  }

  const token = uuid();

  response.cookies.set('poll-token', token, { sameSite: 'strict' });

  return response;
}

export const config = {
  matcher: ['/:path*'],
};
