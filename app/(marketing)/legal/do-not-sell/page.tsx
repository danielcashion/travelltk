// PLACEHOLDER LEGAL CONTENT — must be reviewed by a lawyer before launch.
// CCPA/CPRA opt-out UI below is a product placeholder, not a compliance program.

import { DoNotSellForm } from "@/components/marketing/do-not-sell-form";
import { LegalLayout } from "@/components/marketing/legal-layout";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Do Not Sell My Info",
  description: "CCPA/CPRA-style opt-out placeholder for TravelLTK.",
  path: "/legal/do-not-sell",
});

export default function DoNotSellPage() {
  return (
    <LegalLayout
      title="Do Not Sell or Share My Personal Information"
      lastUpdated="September 1, 2026"
      sections={[
        {
          id: "scope",
          title: "What this request covers",
          content: (
            <p>
              If you are a California resident, you may opt out of the “sale” or
              “sharing” of personal information as those words are defined under the
              CCPA/CPRA. TravelLTK does not sell personal information for money. Some
              advertising cookies could be interpreted as “sharing.” [PLACEHOLDER]
              Counsel must map our actual data flows before launch.
            </p>
          ),
        },
        {
          id: "opt-out",
          title: "Submit an opt-out",
          content: (
            <>
              <p>
                Use the form below. This is a placeholder: submissions are logged by a
                Next.js route and are not yet connected to a suppression list or GPC
                signal handler.
              </p>
              <DoNotSellForm />
            </>
          ),
        },
        {
          id: "gpc",
          title: "Global Privacy Control",
          content: (
            <p>
              [PLACEHOLDER] Honor the Global Privacy Control (GPC) signal once legal and
              engineering agree on the mapping. This page will document that behavior.
            </p>
          ),
        },
      ]}
    />
  );
}
