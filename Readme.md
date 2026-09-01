# TravelLTK

TravelLTK is a marketplace where travel creators publish their exact trip itineraries as a single bookable product. Shoppers browse creator trips and book the whole itinerary or individual legs (flights, hotels, cruises, activities, restaurants). Creators earn a payout on every booking made through their trip.

This repository contains two deployable pieces:

| Piece | Stack | Where it runs |
| --- | --- | --- |
| Web app | Next.js (App Router) + TypeScript + Tailwind + shadcn/ui | Vercel |
| Backend | AWS CDK (Cognito, DynamoDB, API Gateway HTTP API, Lambda, S3 + CloudFront) | AWS (`/infra`) |

The Next.js app is the shopper, creator, and admin UI. It talks to the AWS HTTP API via a typed client in `lib/api-client.ts`. Until that API is deployed, the UI is backed by mock data with `TODO` markers at each swap-out point.

## Architecture

```
Browser
  └── Vercel (Next.js)
        ├── Auth.js  ──OAuth──► Cognito Hosted UI ──federates──► Google
        ├── Stripe.js ────────► Stripe (PaymentIntents + Connect)
        └── lib/api-client.ts ─► API Gateway HTTP API
                                      └── Lambda (Node.js/TypeScript)
                                            └── DynamoDB (single-table)
                                      └── S3 + CloudFront (creator media)
```

Route groups in `app/`:

- `(marketing)` — public / SEO pages (explore, destinations, legal, apply)
- `(app)` — authenticated shopper pages (account, checkout, bookings)
- `(creator)` — creator studio (trip builder, payouts)
- `(admin)` — internal tooling

## Local development

### Next.js app

```bash
npm install
cp .env.example .env.local
# fill in AUTH_SECRET at minimum: openssl rand -base64 32
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables are validated by `lib/config.ts` (Zod). Missing or malformed values fail fast in development.

Useful scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

### AWS backend (`/infra`)

The CDK app is a separate npm package. It is not required to run the UI against mock data.

```bash
cd infra
npm install
npx cdk synth    # requires AWS credentials for deploy
npx cdk deploy
```

After deploy, copy stack outputs (`ApiUrl`, `UserPoolId`, `UserPoolClientId`, `CognitoDomain`, `MediaBaseUrl`) into the Next.js `.env.local` / Vercel project settings. Full steps: [`infra/README.md`](./infra/README.md) and [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## Design system

Tokens live in `tailwind.config.ts` (type scale, 8px spacing scale, semantic color roles) and `app/globals.css` (CSS variables consumed by those tokens). Components must use token classes (`bg-primary`, `text-success`, `p-2` / `gap-4` on the 8px grid) rather than hardcoded hex or arbitrary pixel values.

UI primitives come from shadcn/ui (Radix) in `components/ui`.

## License

Proprietary. All rights reserved.
