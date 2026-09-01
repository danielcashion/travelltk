import { notFound } from "next/navigation";
import { CreatorProfileView } from "@/components/creator-profile/creator-profile-view";
import { creators, getCreatorByHandle, getTripsByCreator } from "@/lib/mock-data";
import { creatorPath } from "@/lib/paths";
import { absUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return creators.map((creator) => ({ handle: creator.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  if (!creator) return { title: "Creator" };
  return pageMetadata({
    title: `${creator.displayName} (@${creator.handle})`,
    description: creator.bio,
    path: creatorPath(creator.handle),
    image: creator.coverImageUrl ?? creator.avatarUrl,
  });
}

export default async function CreatorPublicPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const creator = getCreatorByHandle(handle);
  if (!creator) notFound();

  const trips = getTripsByCreator(creator.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: creator.displayName,
      alternateName: `@${creator.handle}`,
      url: absUrl(creatorPath(creator.handle)),
      image: creator.avatarUrl,
      description: creator.bio,
      sameAs: Object.values(creator.socials).filter(Boolean),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CreatorProfileView creator={creator} trips={trips} />
    </>
  );
}
