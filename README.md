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
