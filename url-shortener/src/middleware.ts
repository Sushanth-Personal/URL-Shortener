// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function middleware(request: NextRequest) {
  const cookieStore = await cookies(); // Await cookies()
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    console.warn('No access token, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

}

export const config = {
  matcher: ['/dashboard/:path*'],
};