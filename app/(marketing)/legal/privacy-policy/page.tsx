// PLACEHOLDER LEGAL CONTENT — must be reviewed by a lawyer before launch.
// This file is not a privacy notice. Do not present it as a GDPR/CCPA-compliant policy.

import { LegalLayout } from "@/components/marketing/legal-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Placeholder privacy policy covering Google account data, bookings, and supplier sharing.",
  path: "/legal/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="September 1, 2026"
      sections={[
        {
          id: "collect",
          title: "What data is collected",
          content: (
            <>
              <p>
                Account data: name, email, avatar, and Cognito subject identifier when
                you sign in. Google account data received through Cognito’s Google
                identity provider typically includes email, name, and profile image. We
                do not receive your Google password.
              </p>
              <p>
                Booking data: traveler names, dates of birth, contact details, trip and
                leg selections, payment tokens (Stripe handles raw card data). Usage
                data: pages viewed, saved trips, device and approximate location.
                [PLACEHOLDER] Complete the record-of-processing list with counsel.
              </p>
            </>
          ),
        },
        {
          id: "use",
          title: "How data is used",
          content: (
            <p>
              To create your account, fulfill bookings, pay creators, prevent fraud,
              improve the product, and communicate about trips you saved or booked.
              Google account data is used to identify you on TravelLTK, not to advertise
              on Google properties. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "share",
          title: "How data is shared with travel suppliers",
          content: (
            <p>
              To complete a booking we share the minimum traveler details a supplier
              requires (name, dates, contact, sometimes date of birth or passport data
              when a cruise or international flight demands it). We also share data with
              Stripe, Amazon Web Services (Cognito, API, storage), and Vercel. We do not
              sell personal information. [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "cookies",
          title: "Cookies and tracking",
          content: (
            <p>
              Essential cookies keep you signed in. Analytics and marketing cookies are
              described in the Cookie Policy and can be controlled from that page.
              [PLACEHOLDER]
            </p>
          ),
        },
        {
          id: "rights",
          title: "User rights",
          content: (
            <p>
              Depending on where you live you may request access, correction, deletion,
              portability, or restriction, and you may object to certain processing.
              California residents see Do Not Sell My Info. [PLACEHOLDER] Add EU/UK
              representative and lawful bases.
            </p>
          ),
        },
        {
          id: "retention",
          title: "Data retention",
          content: (
            <p>
              Account data is kept while the account is open. Booking records are kept
              for the period required by tax and travel-supplier rules, then deleted or
              de-identified. [PLACEHOLDER] Insert actual schedules.
            </p>
          ),
        },
        {
          id: "contact",
          title: "Contact",
          content: (
            <p>
              Privacy questions: privacy@travelltk.com. [PLACEHOLDER] Add mailing
              address and DPO once appointed.
            </p>
          ),
        },
      ]}
    />
  );
}
