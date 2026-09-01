export const SITE_NAME = "TravelLTK";
export const SITE_TAGLINE = "Book the trip, not just the inspiration.";

/** High-resolution brand files in /public/images. */
export const BRAND_ASSETS = {
  wordmark: "/images/travelltk_logo.png",
  wordmarkOnDark: "/images/travelltk_logo_white.png",
  icon: "/images/travelltk_icon.png",
} as const;

export const PRIMARY_NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/creators", label: "Creators" },
  { href: "/destinations", label: "Destinations" },
  { href: "/creators/apply", label: "Become a Creator" },
  { href: "/partners", label: "For Partners" },
] as const;

export const SOCIAL_LINKS = [
  { href: "https://instagram.com/travelltk", label: "Instagram" },
  { href: "https://tiktok.com/@travelltk", label: "TikTok" },
  { href: "https://youtube.com/@travelltk", label: "YouTube" },
  { href: "https://x.com/travelltk", label: "X" },
] as const;

export const FOOTER_LEARN_MORE = [
  { href: "/about", label: "About" },
  { href: "/creators", label: "Creators" },
  { href: "/creators/apply", label: "Become a Creator" },
  { href: "/partners", label: "Partners" },
  { href: "/press", label: "Press" },
  { href: "/careers", label: "Careers" },
] as const;

export const FOOTER_LEGAL = [
  { href: "/legal/terms-of-service", label: "Terms of Service" },
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/cookie-policy", label: "Cookie Policy" },
  { href: "/legal/do-not-sell", label: "Do Not Sell My Info" },
] as const;

export const FOOTER_SUPPORT = [
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact" },
  { href: "/sitemap", label: "Sitemap" },
] as const;

export const PLATFORM_BOOKING_FEE_LABEL = "TravelLTK booking fee";
