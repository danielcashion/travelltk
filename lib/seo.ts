import type { Metadata } from "next";
import { env } from "@/lib/config";

export function absUrl(path: string): string {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = absUrl(path);
  const ogImage = image ?? absUrl("/opengraph-image");
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "TravelLTK",
      type: "website",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
