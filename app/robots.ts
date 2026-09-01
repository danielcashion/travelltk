import type { MetadataRoute } from "next";
import { env } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_APP_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/creator-studio", "/admin", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
