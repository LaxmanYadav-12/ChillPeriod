import { NextResponse } from 'next/server';
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

// Simple in-memory rate limiting map for Edge (LRU cache is Node-only usually, simpler map for edge middleware)
const rateLimitMap = new Map();

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    // 1. Rate Limiting (Simple Window)
    const LIMIT = 100; // requests per minute
    const WINDOW = 60 * 1000;
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, lastReset: Date.now() });
    } else {
        const data = rateLimitMap.get(ip);
        if (Date.now() - data.lastReset > WINDOW) {
             data.count = 1;
             data.lastReset = Date.now();
        } else {
             data.count++;
        }
        
        if (data.count > LIMIT) {
             return new NextResponse('Too Many Requests', { status: 429 });
        }
    }

    // 2. Security Headers
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

    // 3. Auth Logic (from processed auth response or custom logic)
    // Note: 'auth' wrapper handles the session check internal logic, we just modify the response here if needed,
    // but we need to respect the redirects from the auth logic.
    // However, the auth wrapper doesn't expose the response object easily to modify headers AFTER auth check logic
    // unless we duplicate the logic.
    // Simpler approach: We use the auth middleware functionality mainly for the redirects.
    
    // Re-implementing the specific redirect logic here to allow header injection on the returned response
    const isOnboarding = nextUrl.pathname.startsWith('/onboarding');
    const isApi = nextUrl.pathname.startsWith('/api');
    const isAuth = nextUrl.pathname.startsWith('/auth') || nextUrl.pathname.startsWith('/login');
    const isPublic = nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/static');

    if (isApi || isAuth || isPublic) {
        return response;
    }

    if (isLoggedIn) {
        const hasCompletedOnboarding = req.auth.user.hasCompletedOnboarding;

        if (!hasCompletedOnboarding && !isOnboarding) {
            return NextResponse.redirect(new URL('/onboarding', nextUrl));
        }

        if (hasCompletedOnboarding && isOnboarding) {
            return NextResponse.redirect(new URL('/attendance', nextUrl));
        }
    } else {
        if (!isPublic && !isOnboarding) {
            return NextResponse.redirect(new URL('/login', nextUrl)); // Redirect to login
        }
    }

    return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
