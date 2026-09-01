# Creator verification

TravelLTK verifies that an applicant owns the Instagram account they claimed and that the account has at least **400,000** followers before the application is queued for human review.

## Instagram Login (implemented)

Creators sign in with **Instagram API with Instagram Login** — the OAuth flow that does **not** require a linked Facebook Page.

1. Applicant types a claimed handle and clicks **Connect Instagram to verify**.
2. `GET /api/instagram/auth?applicationId=…` stores a signed, short-lived CSRF `state` cookie bound to that application and redirects to `https://api.instagram.com/oauth/authorize` with `scope=instagram_business_basic`.
3. `GET /api/instagram/callback` checks `state`, exchanges the code for a **short-lived** token, immediately upgrades it to a **long-lived** token (`grant_type=ig_exchange_token`, ~60 days), then calls `GET /graph.instagram.com/v22.0/me?fields=id,username,followers_count,account_type`.
4. Outcomes:
   - **Personal account** (not `BUSINESS` / `MEDIA_CREATOR`, or no `followers_count`): rejected with a message to switch to a Professional account and retry.
   - **Handle mismatch**: application is **flagged for manual review**, not auto-approved.
   - **Below `MIN_FOLLOWER_COUNT`**: status `rejected_follower_threshold` with a clear message (not a silent 404).
   - **Success**: Instagram fields + `verified_at` + **encrypted** long-lived token are stored; application moves to `pending_review`.

Long-lived tokens are encrypted at rest with AES-256-GCM (`lib/crypto.ts`) using `TOKEN_ENCRYPTION_KEY` — a secret **separate from the database**. They are never returned to the browser.

`GET /api/cron/refresh-instagram-tokens` (Vercel Cron, daily) refreshes tokens that expire within 7 days (`grant_type=ig_refresh_token`) so follower counts can be re-checked later.

Redirect URI in the Meta app must match production exactly:

`https://www.travelltk.com/api/instagram/callback`

That is `GET /api/instagram/callback` on the Vercel deployment. Local development can keep `INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/instagram/callback` (and register that URI in Meta for local testing). On Vercel production a localhost redirect URI is ignored so a copied `.env` cannot break Login.

## TikTok (stub — not OAuth yet)

TikTok handles are collected on the apply form and stored with **`tiktokVerified: false`**.

**TODO:** Implement [TikTok Login Kit](https://developers.tiktok.com/doc/login-kit-web) after a separate TikTok developer app review. Until then, verification is **manual**: the reviewer checks the claimed handle against a screenshot or a bio-link code the applicant places in their TikTok profile.

Adding a TikTok handle still lets an applicant **submit** even if Instagram Login did not complete (agency-managed Instagram, declined OAuth, etc.).

## Manual review fallback

Legitimate creators may be unable to finish Instagram OAuth (shared/agency-managed accounts, or they decline to connect). Admins on `/admin/applications/[id]` can **Mark as manually verified** with a required reason. The write:

- Requires an authenticated admin whose email is in `ADMIN_EMAILS` (when Cognito/Auth.js is configured).
- Records **who** approved and **why** on the application audit log.
