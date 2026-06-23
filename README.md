# Kaptein E2E tests

Playwright E2E tests for [Kaptein](https://kaptein.intern.nav.no) — Nav Klageinstansen's statistics dashboard.

## Running locally

Create an `.env` file

```
SAKSBEHANDLER_USERNAME=<email>
SAKSBEHANDLER_PASSWORD=<password>
```

### Against `dev`

```
bun dev
bun dev --headed
```

Runs tests against [kaptein.intern.dev.nav.no](https://kaptein.intern.dev.nav.no) with local reporter config.

### Against `localhost:3000`

```
bun local
bun local --headed
```

Runs tests against [localhost:3000](http://localhost:3000). Requires Kaptein running locally.

### Same config as NAIS

```
bun test
```

Runs against [kaptein.intern.dev.nav.no](https://kaptein.intern.dev.nav.no) with Slack and status reporters.

## GCP setup (one-time)

Apply the network policy once before the first run:

```
kubectl apply -f nais/e2e-network-policy.yaml -n klage
```
