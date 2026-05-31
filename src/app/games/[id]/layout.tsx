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

  if (!game) {
    return { title: "Game Not Found" };
  }

  const rating = Number(game.score).toFixed(1);

  return {
    title: game.title,
    description:
      game.description.slice(0, 157).replace(/\s+\S*$/, "") + "...",
    openGraph: {
      title: game.title,
      description: `Play ${game.title} — rated ${rating}/5 with ${game.installs} downloads. By ${game.developer}.`,
      url: `${SITE.url}/games/${id}`,
      images: game.screenshots?.[0]
        ? [{ url: game.screenshots[0], width: 800, height: 500, alt: game.title }]
        : [{ url: game.icon, width: 512, height: 512, alt: game.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: game.title,
      description: `Play ${game.title} — rated ${rating}/5 with ${game.installs} downloads.`,
      images: game.screenshots?.[0] ? [game.screenshots[0]] : [game.icon],
    },
    alternates: {
      canonical: `${SITE.url}/games/${id}`,
    },
  };
}

export default async function GameDetailLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;
  const game = await findGameBySlug(id);

  const jsonLd = game
    ? {
        "@context": "https://schema.org",
        "@type": "VideoGame",
        name: game.title,
        url: `${SITE.url}/games/${id}`,
        image: game.icon,
        description: game.description.slice(0, 300),
        applicationCategory: "Game",
        operatingSystem: "Android",
        author: {
          "@type": "Organization",
          name: game.developer,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: Number(game.score).toFixed(1),
          bestRating: "5",
          ratingCount: game.installs.replace(/[^0-9]/g, ""),
        },
        offers: game.free
          ? { "@type": "Offer", price: "0", priceCurrency: "USD" }
          : {
              "@type": "Offer",
              price: String(game.price),
              priceCurrency: game.currency,
            },
        genre: game.genre,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
