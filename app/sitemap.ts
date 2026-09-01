import type { MetadataRoute } from "next";
import { absUrl } from "@/lib/seo";
import { allDestinations, creators, getPublishedTrips } from "@/lib/mock-data";
import { categoryPath, creatorPath, destinationPath, tripPath } from "@/lib/paths";
import { TRIP_CATEGORIES } from "@/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/explore",
    "/destinations",
    "/creators",
    "/search",
    "/creators/apply",
    "/partners",
    "/about",
    "/careers",
    "/press",
    "/help",
    "/contact",
    "/sitemap",
    "/login",
    "/legal/terms-of-service",
    "/legal/privacy-policy",
    "/legal/cookie-policy",
    "/legal/do-not-sell",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absUrl(path),
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  for (const category of TRIP_CATEGORIES) {
    entries.push({ url: absUrl(categoryPath(category.slug)), changeFrequency: "weekly", priority: 0.6 });
  }
  for (const destination of allDestinations()) {
    entries.push({
      url: absUrl(destinationPath(destination)),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }
  for (const creator of creators) {
    entries.push({
      url: absUrl(creatorPath(creator.handle)),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }
  for (const trip of getPublishedTrips()) {
    const creator = creators.find((item) => item.id === trip.creatorId);
    if (!creator) continue;
    entries.push({
      url: absUrl(tripPath(creator.handle, trip.slug)),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries;
}
