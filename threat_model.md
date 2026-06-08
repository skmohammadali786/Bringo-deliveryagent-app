# Threat Model

## Project Overview

This repository is a pnpm monorepo with two production-facing artifacts on a public Replit deployment: a mobile Expo artifact served at `/` and a minimal Express API served at `/api`. The mobile artifact is a courier-facing “Bringo Agent” app that exposes login, onboarding, KYC, order, earnings, support, and profile flows. The API currently exposes only a health check. The mockup sandbox artifact is development-only and should be ignored unless production reachability is demonstrated.

Production assumptions for future scans:
- `NODE_ENV` is `production` in deployed services.
- The deployment is public, so internet users can reach the mobile artifact and `/api/*` routes.
- Replit-managed TLS is present; transport encryption is not a primary differentiator here.

## Assets

- **Courier identity and session state** — whether a user is treated as an authenticated, onboarded, or KYC-approved courier. Compromise lets an attacker access courier-only app surfaces.
- **Operational order data** — order identifiers, shop details, customer details, addresses, phone numbers, payment mode, and workflow state shown in the mobile app.
- **Courier profile and payout-related data** — name, phone, email, bank and UPI-related UI state, KYC progress, and earnings views.
- **API availability and integrity** — the `/api` service is currently small, but it is still a public trust boundary and future expansion would make it high-value quickly.
- **Secrets and database access** — `DATABASE_URL` is required for the DB package and any future server-side data flows must preserve that trust boundary.

## Trust Boundaries

- **Public internet → mobile artifact (`/`)** — any user can load the landing page and Expo manifests/bundles for the public mobile artifact. The client is fully untrusted.
- **Public internet → API artifact (`/api`)** — browser and app requests cross into the Express server. All future API routes must authenticate, authorize, and validate inputs server-side.
- **Client state → privileged app views** — the mobile app distinguishes unauthenticated, onboarding, KYC-review, and approved states, but those transitions currently happen entirely inside client-controlled state.
- **API → database** — the DB package creates a direct PostgreSQL connection from server-side code. Any future API route using it must prevent injection and unauthorized data access.
- **Production → dev-only artifacts** — `artifacts/mockup-sandbox` is assumed development-only and should stay out of production-focused findings unless routing changes make it reachable.

## Scan Anchors

- **Production entry points:** `artifacts/mobile/server/serve.js` for `/`, `artifacts/api-server/src/index.ts` and `artifacts/api-server/src/app.ts` for `/api`.
- **Highest-risk code areas:** `artifacts/mobile/app/(auth)/**`, `artifacts/mobile/app/(onboarding)/**`, `artifacts/mobile/store/authStore.ts`, and any future non-health API routes under `artifacts/api-server/src/routes/**`.
- **Public surfaces:** mobile landing page and Expo bundles at `/`; API routes under `/api`.
- **Authenticated/admin surfaces:** currently client-defined only inside the mobile app; there is no server-enforced authenticated or admin API surface yet.
- **Dev-only areas:** `artifacts/mockup-sandbox/**`, build scripts, and local preview helpers unless they become reachable from public routes.

## Threat Categories

### Spoofing

The mobile app presents an OTP login and KYC approval flow, so the system must ensure those states are backed by a server-verified identity rather than mutable client state. A public user must not be able to become an authenticated or approved courier merely by entering arbitrary values or toggling local state.

### Tampering

The client is untrusted and can freely modify persisted state, routes, and JavaScript execution. Any workflow milestone that matters — login success, onboarding completion, KYC approval, order acceptance, payout eligibility, or similar partner state — must be derived from server-side checks or signed/verifiable tokens, not from local storage alone.

### Information Disclosure

Courier-only screens can expose order, customer, shop, payout, and profile data. Those views must only be reachable after real authentication and authorization, and future API responses must be scoped to the authenticated courier. Sensitive data should not be embedded in publicly downloadable client bundles unless it is intentionally public test content.

### Elevation of Privilege

The primary privilege boundary in this project is the distinction between unauthenticated public users and approved couriers. The application must enforce that boundary server-side. Client-only redirects or persisted booleans are not a security control and do not prevent unauthorized users from reaching privileged screens or actions.
