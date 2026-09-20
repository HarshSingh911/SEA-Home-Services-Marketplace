# SEA Home Services Marketplace

SEA connects customers in India with verified home-service professionals for trusted, on-demand and scheduled help.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/sea-marketplace` — React + Vite customer, professional, and admin experiences.
- `artifacts/api-server` — Express API routes for marketplace, bookings, and dashboards.
- `lib/api-spec/openapi.yaml` — source of truth for typed API contracts and generated hooks.
- `lib/db/src/schema` — Drizzle schema for SEA users, categories, services, professionals, bookings, reviews, and addresses.
- `artifacts/sea-marketplace/src/index.css` — SEA visual tokens and shared theme.

## Architecture decisions

- OpenAPI is the contract boundary; React Query hooks and Zod response schemas are generated from `lib/api-spec/openapi.yaml`.
- The first customer experience is backed by PostgreSQL seed data so marketplace, booking, and role dashboards remain real after reload.
- Service and booking responses are assembled from normalized marketplace tables into the nested shapes the UI needs.
- A shared Express API serves `/api` while the web artifact stays responsible for presentation and client state.

## Product

- Customer home feed with service discovery, search, categories, offers, verified professionals, and recent bookings.
- Service details with included work, exclusions, add-ons, warranty, FAQs, reviews, and booking creation.
- Booking list and tracking views, plus professional and admin dashboard surfaces.

## User preferences

The SEA brief calls for a premium, clean, trustworthy, mobile-first experience with royal blue and purple accents, rounded surfaces, and simple booking flows.

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing the OpenAPI contract.
- Rebuild shared declarations with `pnpm run typecheck:libs` before typechecking API routes after DB schema changes.
- Vite builds require `PORT` and `BASE_PATH`; managed workflows provide them automatically.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
