"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Game {
  appId: string;
  slug: string;
  title: string;
  icon: string;
  screenshots: string[];
  score: string;
  genre: string;
  video: string | null;
  videoImage: string | null;
}

function getYoutubeEmbedUrl(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return `https://www.youtube.com/embed/${m[1]}?loop=1&playlist=${m[1]}&controls=0&rel=0`;
  }
  return url;
}

function VideoCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all block"
    >
      <div className="relative bg-black" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={getYoutubeEmbedUrl(game.video ?? "")}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-[#0080FF] transition-colors">
          {game.title}
        </h3>
      </div>
    </Link>
  );
}

export function Hero() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games/featured?ishome=true")
      .then((res) => res.json())
      .then((json) => {
        setGames(json.data ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="pt-6 pb-8">
      <div className="flex flex-col gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-white border border-slate-100 animate-pulse"
              >
                <div
                  className="w-full bg-slate-200"
                  style={{ aspectRatio: "16/9" }}
                />
                <div className="p-3">
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))
          : games.map((game) => <VideoCard key={game.slug} game={game} />)}
      </div>
    </section>
  );
}
