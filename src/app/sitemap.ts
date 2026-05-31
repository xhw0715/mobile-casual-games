import type { MetadataRoute } from "next";
import { db } from "@/db";
import { games } from "@/db/schema";
import { slugify } from "@/lib/slugify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allGames = await db.select().from(games);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: "https://mobilecasualgames.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://mobilecasualgames.com/discover",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const gameRoutes: MetadataRoute.Sitemap = allGames.map((game) => ({
    url: `https://mobilecasualgames.com/games/${slugify(game.title)}`,
    lastModified: game.createdAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...gameRoutes];
}
