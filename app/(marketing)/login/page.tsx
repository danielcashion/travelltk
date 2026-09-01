import { LoginButton } from "@/components/marketing/login-button";
import { LogoWordmark } from "@/components/marketing/logo";
import { PageContainer } from "@/components/marketing/page-container";
import { isAuthConfigured } from "@/lib/config";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to TravelLTK with Google, federated through Amazon Cognito.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <main className="py-16">
      <PageContainer width="narrow" className="text-center">
        <LogoWordmark className="mx-auto h-10" />
        <h1 className="mt-8 font-display text-4xl">Sign in to TravelLTK</h1>
        <p className="mt-3 text-muted-foreground">
          Continue with Google. Sign-in is federated through Amazon Cognito — Google
          shows the account picker, Cognito issues the session tokens TravelLTK uses.
        </p>
        <div className="mt-8 flex justify-center">
          <LoginButton disabled={!isAuthConfigured} />
        </div>
        {!isAuthConfigured ? (
          <p className="mt-4 text-sm text-warning-foreground">
            Cognito is not configured in this environment. Set COGNITO_CLIENT_ID,
            COGNITO_ISSUER, and AUTH_SECRET in .env.local (see .env.example). Until
            then the UI runs against mock data and protected routes redirect here.
          </p>
        ) : null}
      </PageContainer>
    </main>
  );
}
