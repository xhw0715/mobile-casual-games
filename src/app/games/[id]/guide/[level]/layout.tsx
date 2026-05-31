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
  params: Promise<{ id: string; level: string }>;
}): Promise<Metadata> {
  const { id, level } = await params;
  const game = await findGameBySlug(id);
  const gameName = game?.title ?? id;

  return {
    title: `Level ${level} Walkthrough — ${gameName}`,
    description: `Watch the complete walkthrough video guide for Level ${level} of ${gameName}. Learn tips, tricks, and strategies to beat this level.`,
    openGraph: {
      title: `Level ${level} Walkthrough — ${gameName}`,
      description: `Watch the complete walkthrough video guide for Level ${level} of ${gameName}.`,
      url: `${SITE.url}/games/${id}/guide/${level}`,
      type: "video.other",
    },
    alternates: {
      canonical: `${SITE.url}/games/${id}/guide/${level}`,
    },
  };
}

export default function LevelDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
