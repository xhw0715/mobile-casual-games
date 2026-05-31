import type { Metadata } from "next";
import { db } from "@/db";
import { games } from "@/db/schema";
import { SITE } from "@/lib/seo";
import { slugify } from "@/lib/slugify";

async function findGameBySlug(slug: string) {
  try {
    const allGames = await db.select().from(games);
    return allGames.find((g) => slugify(g.title) === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const game = await findGameBySlug(id);
  const gameName = game?.title ?? id;

  return {
    title: `All Levels Walkthrough — ${gameName}`,
    description: `Browse all level walkthroughs and video guides for ${gameName}. Watch step-by-step tutorials to beat every level.`,
    openGraph: {
      title: `All Levels Walkthrough — ${gameName}`,
      description: `Browse all level walkthroughs and video guides for ${gameName}.`,
      url: `${SITE.url}/games/${id}/guide`,
    },
    alternates: {
      canonical: `${SITE.url}/games/${id}/guide`,
    },
  };
}

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
