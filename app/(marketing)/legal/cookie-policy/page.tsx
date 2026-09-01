// PLACEHOLDER LEGAL CONTENT — must be reviewed by a lawyer before launch.
// Cookie categories and the consent control below are product placeholders.

import { CookiePreferences } from "@/components/marketing/cookie-preferences";
import { LegalLayout } from "@/components/marketing/legal-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Cookie categories and a placeholder consent-preferences control.",
  path: "/legal/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      lastUpdated="September 1, 2026"
      sections={[
        {
          id: "what",
          title: "What cookies we use",
          content: (
            <p>
              Cookies and similar storage help TravelLTK remember a session, understand
              which trips are viewed, and (if you opt in) measure marketing. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "essential",
          title: "Essential cookies",
          content: (
            <p>
              Required to sign in via Cognito/Auth.js, keep a checkout in progress, and
              protect the site. These cannot be switched off from the preferences
              control. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "analytics",
          title: "Analytics cookies",
          content: (
            <p>
              Help us see which destinations and trip pages are used. Off by default in
              this placeholder until a real analytics vendor is chosen. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "marketing",
          title: "Marketing cookies",
          content: (
            <p>
              Used only if you opt in, to measure creator-recruitment and shopper
              campaigns. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "preferences",
          title: "Consent preferences",
          content: (
            <>
              <p>
                Use the control below to set analytics and marketing cookies. This is a
                placeholder UI; it stores a choice in localStorage and does not yet
                load any third-party tags.
              </p>
              <CookiePreferences />
            </>
          ),
        },
      ]}
    />
  );
}
