# Deployment

TravelLTK is two deployments. **AWS first**, then the Next.js app on Vercel, so the frontend has real Cognito IDs and an API Gateway URL to point at.

## Order of operations

1. Create a Google Cloud OAuth 2.0 Web client (Authorized redirect URI will be the Cognito Hosted UI `/oauth2/idpresponse` URL — you will confirm it after step 3).
2. Create a Stripe account. Prefer a [restricted API key](https://docs.stripe.com/keys/restricted-api-keys). Enable Connect Express if creators will receive payouts. Create a webhook endpoint later (step 7) for `payment_intent.succeeded`.
3. Deploy the CDK stack (see [`infra/README.md`](./infra/README.md)):

   ```bash
   cd infra
   npm install
   npx cdk deploy \
     -c googleClientId="$GOOGLE_CLIENT_ID" \
     -c googleClientSecret="$GOOGLE_CLIENT_SECRET" \
     -c cognitoDomainPrefix=travelltk-auth \
     -c callbackUrls=https://YOUR_VERCEL_DOMAIN/api/auth/callback/cognito,http://localhost:3000/api/auth/callback/cognito \
     -c logoutUrls=https://YOUR_VERCEL_DOMAIN/,http://localhost:3000/
   ```

4. Copy stack outputs (`ApiUrl`, `UserPoolId`, `UserPoolClientId`, `CognitoDomain`, `CognitoIssuer`, `MediaBaseUrl`) and the Cognito app client secret.
5. In Google Cloud Console, add the Cognito Hosted UI redirect:
   `https://{CognitoDomain}/oauth2/idpresponse`
6. Connect this Git repository to Vercel (Import Project → Next.js). Vercel detects Next.js; no `vercel.json` is required.
7. Set Vercel environment variables (Production, Preview, Development as appropriate):

   | Variable | Source |
   | --- | --- |
   | `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` or the custom domain |
   | `NEXT_PUBLIC_API_BASE_URL` | CDK `ApiUrl` |
   | `NEXT_PUBLIC_MEDIA_BASE_URL` | CDK `MediaBaseUrl` |
   | `AUTH_SECRET` | `openssl rand -base64 32` |
   | `COGNITO_USER_POOL_ID` | CDK `UserPoolId` |
   | `COGNITO_CLIENT_ID` | CDK `UserPoolClientId` |
   | `COGNITO_CLIENT_SECRET` | Cognito app client secret |
   | `COGNITO_DOMAIN` | CDK `CognitoDomain` |
   | `COGNITO_REGION` | e.g. `us-east-1` |
   | `COGNITO_ISSUER` | CDK `CognitoIssuer` |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console (documented; live federation is on Cognito) |
   | `STRIPE_SECRET_KEY` | Stripe Dashboard (prefer `rk_`) |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard |
   | `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
   | `STRIPE_CONNECT_CLIENT_ID` | Stripe Connect settings |
   | `INSTAGRAM_APP_ID` / `INSTAGRAM_APP_SECRET` | Meta Developer App (Instagram Login) |
   | `INSTAGRAM_REDIRECT_URI` | `https://YOUR_DOMAIN/api/instagram/callback` |
   | `MIN_FOLLOWER_COUNT` | `400000` |
   | `TOKEN_ENCRYPTION_KEY` | `openssl rand -hex 32` (token encryption at rest) |
   | `ADMIN_EMAILS` | Comma-separated emails allowed to manually verify creators |
   | `CRON_SECRET` | `openssl rand -hex 24` (Vercel Cron → token refresh) |

8. Point the Stripe webhook at `https://YOUR_DOMAIN/api/webhooks/stripe`.
9. Redeploy the Vercel project so it picks up env vars. Add the production callback URL to the Cognito app client if you used a preview URL in step 3.
10. Optional: attach `travelltk.com` as a custom domain in Vercel and add that origin to the HTTP API CORS list in the CDK stack, then redeploy infra.

## Local production build

```bash
cp .env.example .env.local
# AUTH_SECRET is enough for `next build`; Cognito/Stripe/API can stay empty
npx openssl rand -base64 32  # paste into AUTH_SECRET
npm run build
```

`lib/config.ts` skips the “required in production” check during `next build` (`NEXT_PHASE=phase-production-build`) so the build can complete before Vercel env is populated. At runtime in production those variables are required.

## What you still configure by hand

- Google Cloud Console OAuth client + Cognito Hosted UI redirect
- AWS credentials for `cdk deploy`
- Stripe keys, webhook, and Connect platform
- Vercel project + environment variables
- Legal review of `/legal/*` placeholder copy
