import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Secret from env
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths without auth (e.g. login, api/auth)
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') || // static files
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Get JWT token from cookie
  const token = await getToken({ req, secret });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url); // redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string;

  // ADMIN: full access
  if (role === 'ADMIN') {
    return NextResponse.next();
  }

  // COMMANDER: everything except /users pages
  if (role === 'COMMANDER') {
    if (pathname.startsWith('/users')) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    return NextResponse.next();
  }

  // LOGISTICS: only allow /dashboard and root (/)
  if (role === 'LOGISTICS') {
    if (pathname === '/' || pathname.startsWith('/dashboard')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Default deny
  return NextResponse.redirect(new URL('/unauthorized', req.url));
}

// Matcher: which paths middleware applies to
export const config = {
  matcher: [
    /*
      Apply middleware to all pages except:
      - /login
      - /api/auth/**
      - static assets
    */
    '/((?!login|api/auth|_next|favicon.ico).*)',
  ],
};
