import { redirect } from "next/navigation";
import { creatorPath } from "@/lib/paths";

export default async function LegacyCreatorExplorePage({
  params,
}: {
  params: Promise<{ creatorHandle: string }>;
}) {
  const { creatorHandle } = await params;
  redirect(creatorPath(creatorHandle));
}
