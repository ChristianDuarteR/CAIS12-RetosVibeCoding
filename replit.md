# Clínica Veterinaria

Sistema web en español para gestionar pacientes de una clínica veterinaria, registrar visitas médicas y consultar historiales persistidos en SQLite.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/veterinary-clinic run dev` — run the web app
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `SQLITE_DB_PATH` — optional SQLite database path; defaults to `artifacts/api-server/data/veterinary-clinic.sqlite`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: SQLite (`node:sqlite`, Node.js 24)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/veterinary-clinic/` — React web app for the clinic
- `artifacts/api-server/src/routes/` — REST endpoints for patients, visits, and dashboard
- `artifacts/api-server/src/lib/sqlite.ts` — SQLite schema, database initialization, and query helpers
- `lib/api-spec/openapi.yaml` — API contract and source for generated request/response validation and frontend hooks
- `README.md` — setup, run instructions, database location, and API examples

## Architecture decisions

- Patient deletion cascades to its medical visits to prevent orphaned records.
- The clinic's dashboard counts visits for the America/Bogota calendar day.

## Product

- Dashboard with patient and visit totals, today's visits, and recent appointments
- Searchable patient records with create, edit, detail, and confirmed delete
- Visit create, edit, delete, and per-patient medical history

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- OpenAPI changes require code generation before using the updated generated types and hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
