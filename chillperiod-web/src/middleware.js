import { NextResponse } from 'next/server';
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

/**
 * Middleware rate limiting with automatic cleanup.
 * 
 * OWASP: Prevents brute-force attacks and resource exhaustion.
 * Uses tiered limits: stricter for /api/auth paths.
 */
const rateLimitMap = new Map();

// SECURITY: Periodic cleanup to prevent unbounded memory growth
const CLEANUP_INTERVAL = 60_000; // 60 seconds
let lastCleanup = Date.now();

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  
  for (const [key, data] of rateLimitMap) {
    if (now - data.lastReset > 120_000) { // 2 minutes stale
      rateLimitMap.delete(key);
    }
  }
}

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
    
    // 1. Rate Limiting (Tiered)
    const isAuthPath = nextUrl.pathname.startsWith('/api/auth');
    const LIMIT = isAuthPath ? 100 : 500; // Increased limit for dev/testing
    const WINDOW = 60 * 1000;
    
    // Run cleanup periodically
    cleanupStaleEntries();
    
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
            const retryAfter = Math.ceil((data.lastReset + WINDOW - Date.now()) / 1000);
            // OWASP: Return JSON 429 with Retry-After header  
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.', retryAfter },
                { 
                    status: 429,
                    headers: { 'Retry-After': String(retryAfter) }
                }
            );
        }
    }

    // 2. Security Headers (OWASP recommended)
    const response = NextResponse.next();
    response.headers.set('X-Frame-Options', 'DENY');                              // Clickjacking protection
    response.headers.set('X-Content-Type-Options', 'nosniff');                    // MIME-sniffing protection
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');   // Referrer leakage protection
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload'); // HTTPS enforcement
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)'); // Feature restrictions
    response.headers.set('X-DNS-Prefetch-Control', 'off');                        // DNS prefetch control

    // 3. Auth & Routing Logic
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
            return NextResponse.redirect(new URL('/login', nextUrl));
        }
    }

    return response;
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
