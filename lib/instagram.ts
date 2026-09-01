import { env, isInstagramConfigured } from "@/lib/config";
import { unsplash } from "@/lib/images";

export const FEATURED_INSTAGRAM_HANDLE = "eileengu";
export const FEATURED_INSTAGRAM_PROFILE_URL = `https://www.instagram.com/${FEATURED_INSTAGRAM_HANDLE}/`;
export const FEATURED_INSTAGRAM_EMBED_URL = `https://www.instagram.com/${FEATURED_INSTAGRAM_HANDLE}/embed/`;

/** Quiet alpine luxury — Eileen Gu's world, not a desert highway. */
export const EILEEN_HERO_IMAGE_ID = "photo-1470770841072-f978cf4d019e";

export interface InstagramPost {
  permalink: string;
  caption: string | null;
  imageUrl: string | null;
  mediaType: string | null;
  timestamp: string | null;
  username: string;
}

export interface FeaturedCreator {
  name: string;
  handle: string;
  tagline: string;
  profileUrl: string;
  moodImageUrl: string;
  latestPost: InstagramPost | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
}

export const FEATURED_CREATORS = [
  {
    name: "Eileen Gu",
    handle: "eileengu",
    tagline: "Olympic alpine. Couture fittings. The itinerary after the podium.",
    moodImageId: "photo-1605540436563-5bca919ae766",
  },
  {
    name: "Leonie Hanne",
    handle: "leoniehanne",
    tagline: "Riviera fashion weeks, and the yacht that follows.",
    moodImageId: "photo-1567899378494-47b22a2ae96a",
  },
  {
    name: "Chiara Ferragni",
    handle: "chiaraferragni",
    tagline: "Italian cities, booked in the order she actually moved through them.",
    moodImageId: "photo-1523906834658-6e24ef2386f9",
  },
  {
    name: "Camila Coelho",
    handle: "camilacoelho",
    tagline: "Warm-weather suites and the beauty case that travels with them.",
    moodImageId: "photo-1540541338287-41700207dee6",
  },
  {
    name: "Negin Mirsalehi",
    handle: "negin_mirsalehi",
    tagline: "Garden tables, European seasons, no guesswork.",
    moodImageId: "photo-1490750967868-88aa4486c946",
  },
  {
    name: "Sami Slimani",
    handle: "samislimani",
    tagline: "City suites and the reservation already made.",
    moodImageId: "photo-1502602898657-3e91760cbb34",
  },
] as const;

interface DiscoveryResponse {
  business_discovery?: {
    username?: string;
    name?: string;
    profile_picture_url?: string;
    followers_count?: number;
    media?: {
      data?: {
        permalink?: string;
        caption?: string;
        media_url?: string;
        thumbnail_url?: string;
        media_type?: string;
        timestamp?: string;
      }[];
    };
  };
  error?: { message?: string };
}

let discoveryWarned = false;

function profileUrl(handle: string): string {
  return `https://www.instagram.com/${handle}/`;
}

function mapPost(
  username: string,
  media:
    | {
        permalink?: string;
        caption?: string;
        media_url?: string;
        thumbnail_url?: string;
        media_type?: string;
        timestamp?: string;
      }
    | undefined,
): InstagramPost | null {
  if (!media?.permalink) return null;
  return {
    permalink: media.permalink,
    caption: media.caption ?? null,
    imageUrl: media.media_url ?? media.thumbnail_url ?? null,
    mediaType: media.media_type ?? null,
    timestamp: media.timestamp ?? null,
    username,
  };
}

async function discoverCreator(handle: string): Promise<{
  latestPost: InstagramPost | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
}> {
  const empty = {
    latestPost: null,
    profilePictureUrl: null,
    followersCount: null,
  };
  if (!isInstagramConfigured) return empty;

  const fields = `business_discovery.username(${handle}){username,name,profile_picture_url,followers_count,media.limit(1){caption,media_url,media_type,permalink,thumbnail_url,timestamp}}`;
  const url = new URL(`https://graph.facebook.com/v21.0/${env.INSTAGRAM_BUSINESS_ACCOUNT_ID}`);
  url.searchParams.set("fields", fields);
  url.searchParams.set("access_token", env.INSTAGRAM_ACCESS_TOKEN as string);

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    const payload = (await response.json()) as DiscoveryResponse;
    if (!response.ok || payload.error) {
      if (!discoveryWarned) {
        discoveryWarned = true;
        console.warn(
          "[instagram] Business Discovery is not available with this token (need instagram_manage_insights on a live app). Homepage will use editorial covers until then.",
          payload.error?.message ?? response.status,
        );
      }
      return empty;
    }
    const discovery = payload.business_discovery;
    const username = discovery?.username ?? handle;
    return {
      latestPost: mapPost(username, discovery?.media?.data?.[0]),
      profilePictureUrl: discovery?.profile_picture_url ?? null,
      followersCount: discovery?.followers_count ?? null,
    };
  } catch (error) {
    console.warn(`[instagram] fetch failed for @${handle}`, error);
    return empty;
  }
}

/**
 * Latest public post from a professional Instagram account, via Business
 * Discovery. Returns null when Graph credentials are unset, the app lacks
 * `instagram_manage_insights`, or the call fails.
 */
export async function getLatestInstagramPost(
  username = FEATURED_INSTAGRAM_HANDLE,
): Promise<InstagramPost | null> {
  const result = await discoverCreator(username);
  return result.latestPost;
}

export async function getFeaturedCreators(): Promise<FeaturedCreator[]> {
  const discovered = await Promise.all(
    FEATURED_CREATORS.map((creator) => discoverCreator(creator.handle)),
  );

  return FEATURED_CREATORS.map((creator, index) => ({
    name: creator.name,
    handle: creator.handle,
    tagline: creator.tagline,
    profileUrl: profileUrl(creator.handle),
    moodImageUrl: unsplash(creator.moodImageId),
    latestPost: discovered[index]?.latestPost ?? null,
    profilePictureUrl: discovered[index]?.profilePictureUrl ?? null,
    followersCount: discovered[index]?.followersCount ?? null,
  }));
}

export function getHeroCreator(creators: FeaturedCreator[]): FeaturedCreator {
  return creators.find((creator) => creator.handle === FEATURED_INSTAGRAM_HANDLE) ?? creators[0];
}

export function getCreatorCoverUrl(creator: FeaturedCreator): string {
  return creator.latestPost?.imageUrl ?? creator.moodImageUrl;
}

export function getCreatorHref(creator: FeaturedCreator): string {
  return creator.latestPost?.permalink ?? creator.profileUrl;
}
