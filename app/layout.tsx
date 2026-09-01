import { Figtree, Fraunces, Geist_Mono } from "next/font/google";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/config";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "TravelLTK — Book the trip, not just the inspiration",
    template: "%s · TravelLTK",
  },
  description:
    "Travel creators publish their exact itineraries as bookable trips. Browse a creator's Paris-to-cruise-to-Istanbul route and book the whole thing — or just the legs you want.",
  icons: {
    icon: [{ url: "/images/travelltk_icon.png", type: "image/png" }],
    apple: [{ url: "/images/travelltk_icon.png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <AuthSessionProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
