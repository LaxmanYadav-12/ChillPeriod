/**
 * Shared API route handler wrapper.
 * 
 * Provides a consistent security layer for all API routes:
 *  - Authentication check (via NextAuth session)
 *  - Role-based access control (RBAC)
 *  - Zod schema validation (body or query)
 *  - Per-route rate limiting
 *  - Safe error handling (no internal details leaked)
 * 
 * Usage:
 *   export const POST = withApi(handler, { auth: true, schema: mySchema, rateLimit: 'write' });
 *   export const GET  = withApi(handler, { auth: false, rateLimit: 'read' });
 */

import { NextResponse } from 'next/server';
import { auth as getSession } from '@/auth';
import { checkRateLimit, getRateLimitKey } from './rateLimit';

/**
 * @param {Function} handler — async (req, { session, params, validatedData }) => NextResponse
 * @param {Object}   opts
 * @param {boolean}  [opts.auth=false]      — require authenticated session
 * @param {string}   [opts.role]            — require specific role ('admin')
 * @param {import('zod').ZodSchema} [opts.schema] — Zod schema to validate request body
 * @param {string}   [opts.rateLimit='read'] — rate limit tier: 'read' | 'write' | 'auth'
 */
export function withApi(handler, opts = {}) {
  const {
    auth: requireAuth = false,
    role: requiredRole,
    schema,
    rateLimit: rateLimitTier = 'read',
  } = opts;

  return async (req, context) => {
    try {
      // 1. Rate Limiting
      // We need session for user-based keys, but don't want to call auth() twice.
      // So we get session first (it's lightweight if cached), then rate limit.
      const session = await getSession();

      const rlKey = getRateLimitKey(req, session);
      const rl = checkRateLimit(rlKey, rateLimitTier);

      if (!rl.allowed) {
        // OWASP: Return 429 with Retry-After header
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.', retryAfter: rl.retryAfter },
          {
            status: 429,
            headers: { 'Retry-After': String(rl.retryAfter) },
          }
        );
      }

      // 2. Authentication
      if (requireAuth && !session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      // 3. Role-Based Access Control
      if (requiredRole && session?.user?.role !== requiredRole) {
        return NextResponse.json({ error: 'Forbidden: insufficient permissions' }, { status: 403 });
      }

      // 4. Input Validation (Zod)
      let validatedData = null;
      if (schema) {
        let body;
        try {
          body = await req.json();
        } catch {
          return NextResponse.json({ error: 'Invalid or missing JSON body' }, { status: 400 });
        }

        const result = schema.safeParse(body);
        if (!result.success) {
          // Return structured validation errors (field-level)
          const fieldErrors = result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          }));
          return NextResponse.json({ error: 'Validation failed', details: fieldErrors }, { status: 400 });
        }
        validatedData = result.data;
      }

      // 5. Call the actual handler
      const params = context?.params ? await context.params : undefined;
      return await handler(req, { session, params, validatedData });

    } catch (error) {
      // OWASP: Never expose internal error details to clients
      console.error(`[API Error] ${req.method} ${req.nextUrl?.pathname}:`, error);
      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}
