# Supabase setup (not yet connected)

This repository now includes an authentication UI scaffold and a database security schema. It is **not live** until you connect your own Supabase project and apply the schema.

## 1. Create a Supabase project

Create a project in the Supabase Dashboard. This can incur usage charges depending on your plan. No project has been created by this repository change.

## 2. Apply the schema

1. Open your project's **SQL Editor**.
2. Review `supabase/schema.sql` and run it.
3. Find the official email domain used by your college's student accounts. Do not guess or use a personal email domain.
4. Add that domain using the example INSERT at the bottom of the SQL file, replacing the example with the verified domain.
5. In **Authentication → Email**, enable **Confirm email**. Set the site URL and redirect URLs for your actual local/deployed app.

The domain allowlist is deliberately empty initially, so signups fail closed until you add the approved domain. The trigger checks the domain in PostgreSQL; client-side checks alone would not be secure.

## 3. Configure the frontend

Copy `.env.example` to `.env.local` and set:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLIC_PUBLISHABLE_KEY
```

Use the project's publishable key (or legacy anon key if needed), never a service-role/secret key. Environment values prefixed with `VITE_` are visible to browser users. Do not commit `.env.local`.

Then run:

```bash
npm install
npm run dev
npm run build
```

## Security limitations before real students use it

- The current discovery cards are still fictional local preview data; they are not loaded from Supabase.
- Profile creation, connection-request workflows, and chat UI are not wired to the database yet.
- Have a developer review the SQL and test RLS policies with separate accounts before a real pilot.
- Add abuse reporting, blocking, moderation, account deletion, rate limiting, privacy policy, and retention rules before launch.
- Restrict access to adults aged 18+ through a suitable server-side eligibility flow before allowing profiles to be created.
