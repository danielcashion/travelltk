// PLACEHOLDER LEGAL CONTENT — must be reviewed by a lawyer before launch.
// This file is not a legal document. Do not present it as binding policy.

import { LegalLayout } from "@/components/marketing/legal-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Placeholder terms for the TravelLTK marketplace. Counsel must review before launch.",
  path: "/legal/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated="September 1, 2026"
      sections={[
        {
          id: "acceptance",
          title: "Acceptance of terms",
          content: (
            <>
              <p>
                By creating an account, browsing trips, or completing a booking on
                TravelLTK, you agree to these Terms of Service. If you do not agree, do
                not use the service.
              </p>
              <p>
                [PLACEHOLDER] These terms are a working outline for engineering and
                product. They have not been reviewed by counsel and are not in force.
              </p>
            </>
          ),
        },
        {
          id: "description",
          title: "Description of service",
          content: (
            <p>
              TravelLTK is a marketplace where creators publish itineraries as bookable
              trips and shoppers book a whole trip or individual legs (flights, hotels,
              cruises, activities, restaurants, transport). Travel is fulfilled by
              third-party suppliers. TravelLTK is not a carrier, hotel, or cruise line.
            </p>
          ),
        },
        {
          id: "creator-obligations",
          title: "Creator obligations",
          content: (
            <p>
              Creators must publish trips they can stand behind: accurate nights,
              destinations, supplier names, and price estimates. Misleading itineraries,
              undisclosed paid placements, or fabricated reviews are prohibited.
              [PLACEHOLDER] Add IP, publicity rights, and takedown process after legal
              review.
            </p>
          ),
        },
        {
          id: "booking-cancellation",
          title: "Booking terms and cancellation policy",
          content: (
            <p>
              Each leg may carry the supplier’s own cancellation rules. Cancellations
              requested through TravelLTK will be passed to the relevant supplier.
              Platform booking fees may be non-refundable. [PLACEHOLDER] Insert the
              actual refund waterfall, force majeure, and schedule-change rules.
            </p>
          ),
        },
        {
          id: "payment-fees",
          title: "Payment and fees",
          content: (
            <p>
              Shoppers pay trip/leg cost plus a separately itemized TravelLTK booking
              fee, plus estimated taxes. Payments are processed by Stripe. Creators
              receive payouts through Stripe Connect Express according to a then-current
              commission schedule. [PLACEHOLDER] Insert fee table and chargeback
              allocation.
            </p>
          ),
        },
        {
          id: "prohibited",
          title: "Prohibited conduct",
          content: (
            <p>
              You may not scrape the catalog, circumvent fees, impersonate a creator,
              post malware, harass other users, or use the service to book travel for
              unlawful purposes. [PLACEHOLDER] Expand with export, sanctions, and
              underage-travel rules.
            </p>
          ),
        },
        {
          id: "disclaimers",
          title: "Disclaimers",
          content: (
            <p>
              Trips are provided “as is.” TravelLTK does not warrant that a supplier
              will honor a rate, that a ship will sail, or that a creator’s notes match
              conditions on the ground. [PLACEHOLDER] Counsel to rewrite.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Limitation of liability",
          content: (
            <p>
              [PLACEHOLDER] Cap liability, exclude consequential damages, and carve out
              non-waivable consumer rights. Do not ship this sentence as-is.
            </p>
          ),
        },
        {
          id: "dispute",
          title: "Dispute resolution / arbitration",
          content: (
            <p>
              [PLACEHOLDER] Insert governing law, venue, informal dispute window,
              binding arbitration, class-action waiver, and opt-out instructions after
              legal review. Do not assume arbitration is appropriate in every
              jurisdiction.
            </p>
          ),
        },
        {
          id: "changes",
          title: "Changes to terms",
          content: (
            <p>
              We may update these terms. Material changes will be posted with a new
              “last updated” date. Continued use after the effective date constitutes
              acceptance. [PLACEHOLDER] Confirm notice method with counsel.
            </p>
          ),
        },
      ]}
    />
  );
}
