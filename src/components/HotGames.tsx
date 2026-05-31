"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Game {
  appId: string;
  slug: string;
  title: string;
  icon: string;
  score: string;
  genre: string;
  installs: string;
}

function formatInstalls(installs: string): string {
  const match = installs.match(/^([\d,]+)/);
  if (!match) return installs;
  const num = parseInt(match[1].replace(/,/g, ""));
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(0)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return String(num);
}

export function HotGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games/featured")
      .then((res) => res.json())
      .then((json) => {
        setGames(json.data?.slice(0, 10) ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full h-full py-6 px-4">
      <div className="sticky top-24">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3 className="text-base font-extrabold text-slate-800">Hot Games</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded w-3/4 mb-1" />
                  <div className="h-2 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : games.length === 0 ? null : (
          <ul className="space-y-1">
            {games.map((game, index) => (
              <li key={game.slug}>
                <Link
                  href={`/games/${game.slug}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <span className={`w-6 text-center text-sm font-extrabold shrink-0 ${
                    index < 3 ? "text-[#0080FF]" : "text-slate-300"
                  }`}>
                    #{index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={game.icon}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate group-hover:text-[#0080FF] transition-colors">
                      {game.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-400">
                        {game.genre}
                      </span>
                      <span className="text-[11px] text-slate-300">·</span>
                      <div className="flex items-center gap-0.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <span className="text-[11px] font-bold text-slate-500">
                          {Number(game.score).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 shrink-0">
                    {formatInstalls(game.installs)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/discover"
          className="mt-4 block w-full py-2.5 rounded-xl bg-slate-50 text-center text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          View All Games
        </Link>
      </div>
    </div>
  );
}
