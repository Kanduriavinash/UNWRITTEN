# UNWRITTEN

Your story. Still unwritten.

Phase 1 frontend preview for a college-only connection app. The current preview uses fictional sample profiles and local-only interactions. Authentication, college email verification, matching, live messaging, blocking, reporting, and moderation are not yet connected to a backend. Do not use with real student data.

## Run locally
Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Before a real pilot, implement and test Supabase Auth, college email allowlisting, server-side age eligibility, PostgreSQL row-level security, blocking/reporting, moderation, account deletion, and privacy controls. Never commit secrets or service-role keys.

## Supabase foundation

See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) before connecting a project. `src/AuthPanel.tsx` provides a sign-up/sign-in scaffold, and `supabase/schema.sql` includes a fail-closed college-domain allowlist plus RLS policies. These pieces are not a production launch: set up your verified student email domain, enable email confirmation, configure environment variables, and test policies before using real student data.
