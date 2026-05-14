# FastLend Merchant Onboarding

Enterprise-grade foundation for an internal merchant onboarding workflow platform.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-compatible primitives
- Prisma
- PostgreSQL
- TanStack Query
- RBAC-ready auth boundaries

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to a PostgreSQL database.
3. Install dependencies.
4. Run database setup:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

## Architecture

- `app/` contains route groups, layouts, and API routes.
- `components/layout/` contains the reusable application shell.
- `components/ui/` contains base UI primitives following shadcn conventions.
- `config/` contains app and navigation configuration.
- `lib/auth/` contains session and RBAC foundations.
- `modules/` defines business module ownership boundaries.
- `services/` contains orchestration-ready service interfaces.
- `workflows/` contains state transition policy.
- `prisma/` contains the PostgreSQL schema and dummy seed data.
