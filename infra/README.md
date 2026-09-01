# TravelLTK AWS backend

CDK app that provisions Cognito (Google federation), DynamoDB (single-table),
an API Gateway HTTP API with a Cognito JWT authorizer, Node.js Lambda handlers,
and a private S3 bucket in front of CloudFront for creator media.

## Prerequisites

- AWS CLI credentials (`aws configure` or environment variables)
- Node.js 20+
- A Google Cloud OAuth 2.0 **Web** client (APIs & Services → Credentials)
  with authorized redirect URI:

  `https://{cognitoDomainPrefix}.auth.{region}.amazoncognito.com/oauth2/idpresponse`

## Install

```bash
cd infra
npm install
```

## Synth / deploy

Google client ID and secret are **CDK context parameters**, not hardcoded:

```bash
npx cdk synth \
  -c googleClientId="$GOOGLE_CLIENT_ID" \
  -c googleClientSecret="$GOOGLE_CLIENT_SECRET" \
  -c cognitoDomainPrefix=travelltk-auth \
  -c callbackUrls=http://localhost:3000/api/auth/callback/cognito,https://travelltk.com/api/auth/callback/cognito \
  -c logoutUrls=http://localhost:3000/,https://travelltk.com/

npx cdk deploy \
  -c googleClientId="$GOOGLE_CLIENT_ID" \
  -c googleClientSecret="$GOOGLE_CLIENT_SECRET" \
  -c cognitoDomainPrefix=travelltk-auth \
  -c callbackUrls=http://localhost:3000/api/auth/callback/cognito,https://travelltk.com/api/auth/callback/cognito \
  -c logoutUrls=http://localhost:3000/,https://travelltk.com/
```

You can also put those `-c` values in `cdk.json` `context` (do not commit secrets).

Deploying without Google context still creates the User Pool; the Google identity
provider is skipped and a CDK warning is emitted.

## Stack outputs → Next.js env

After deploy, copy outputs into the Next.js `.env.local` (and Vercel):

| CDK output | Next.js env var |
| --- | --- |
| `ApiUrl` | `NEXT_PUBLIC_API_BASE_URL` |
| `UserPoolId` | `COGNITO_USER_POOL_ID` |
| `UserPoolClientId` | `COGNITO_CLIENT_ID` |
| `CognitoDomain` | `COGNITO_DOMAIN` |
| `CognitoIssuer` | `COGNITO_ISSUER` |
| `MediaBaseUrl` | `NEXT_PUBLIC_MEDIA_BASE_URL` |

Also set `COGNITO_CLIENT_SECRET` from the Cognito app client (the client is
generated with a secret for Auth.js). `AUTH_SECRET` is generated locally
(`openssl rand -base64 32`), not by CDK.

The Next.js typed client is `lib/api-client.ts`. `lib/data.ts` calls it when
`NEXT_PUBLIC_API_BASE_URL` is set and otherwise falls back to mock data.

## Single-table design

| Entity | pk | sk | gsi1pk |
| --- | --- | --- | --- |
| User | `USER#{cognitoSub}` | `PROFILE` | `EMAIL#{email}` |
| Creator | `USER#{id}` | `CREATOR` | `HANDLE#{handle}` |
| Trip | `TRIP#{id}` | `METADATA` | `STATUS#published` / `CREATOR#{id}` |
| TripLeg | `TRIP#{id}` | `LEG#{day}#{legId}` | — |
| Booking | `BOOKING#{id}` | `METADATA` | `USER#{id}` |
| Payout | `PAYOUT#{id}` | `METADATA` | `CREATOR#{id}` |
| Review | `TRIP#{id}` | `REVIEW#{id}` | — |
| Application | `APPLICATION#{id}` | `METADATA` | `APPLICATIONS` |

## Credentials

Use a least-privilege IAM user or SSO role that can deploy CloudFormation,
Lambda, API Gateway, Cognito, DynamoDB, S3, CloudFront, and IAM roles in the
target account. Do not use root.
