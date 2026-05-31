"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

type Category =
  | "All"
  | "Puzzle"
  | "Simulation"
  | "Racing"
  | "Arcade"
  | "Multiplayer"
  | "Adventure"
  | "Sports"
  | "Casual"
  | "Board"
  | "Music"
  | "Role Playing"
  | "Action"
  | "Educational";

interface Game {
  appId: string;
  slug: string;
  title: string;
  icon: string;
  score: string;
  genre: string;
  installs: string;
  description: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

const CATEGORIES: Category[] = [
  "All",
  "Puzzle",
  "Simulation",
  "Racing",
  "Arcade",
  "Adventure",
  "Sports",
  "Casual",
  "Board",
  "Music",
  "Role Playing",
  "Action",
  "Educational",
];

function GameSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-slate-200/60" />
      <div className="px-1 space-y-2">
        <div className="h-4 bg-slate-200/60 rounded-md w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-200/60 rounded-md w-1/3" />
          <div className="h-7 w-7 bg-slate-200/60 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center animate-scale-in">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400 relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
          <path d="M20 12a8 8 0 0 1-8 8H5l3-3a8 8 0 0 1 4-13" />
        </svg>
        <div className="absolute inset-0 bg-slate-200 rounded-full -z-10 animate-pulse-glow" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">No games found</h3>
      <p className="text-slate-500 font-medium max-w-md">
        We couldn&apos;t find any games matching this category right now. Check
        back later for fresh content!
      </p>
    </div>
  );
}

export default function Discovery() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [games, setGames] = useState<Game[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchGames = useCallback(
    async (page: number, genre: string, append: boolean) => {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (genre && genre !== "All") params.set("genre", genre);

      try {
        const res = await fetch(`/api/games?${params}`);
        const json = await res.json();
        setGames((prev) =>
          append ? [...prev, ...json.data.items] : json.data.items,
        );
        setPagination(json.data.pagination);
        return json;
      } catch {
        setError(true);
        return null;
      }
    },
    [],
  );

  // Initial load or category change
  useEffect(() => {
    queueMicrotask(() => {
      setLoading(true);
      setError(false);
      setGames([]);
      setPagination(null);
      fetchGames(1, activeCategory, false).finally(() => setLoading(false));
    });
  }, [activeCategory, fetchGames]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          pagination?.hasMore &&
          !loadingMore &&
          !loading
        ) {
          setLoadingMore(true);
          fetchGames(pagination.page + 1, activeCategory, true).finally(() =>
            setLoadingMore(false),
          );
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pagination, loadingMore, loading, activeCategory, fetchGames]);

  return (
    <div className="relative min-h-[90vh] pb-24 overflow-hidden">
      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-blue-200/20 rounded-full blur-3xl opacity-60 animate-float-slow" />
        <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] bg-cyan-200/20 rounded-full blur-3xl opacity-60 animate-float-slow [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[30vw] h-[30vw] bg-indigo-200/20 rounded-full blur-3xl opacity-60 animate-float-slow [animation-delay:5s]" />
      </div>

      <div className="px-6 pt-8">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-4 animate-fade-in-up">
            Discover
          </h1>
          <p className="text-lg text-slate-500 font-medium animate-fade-in-up [animation-delay:0.1s]">
            Find your next favorite casual obsession.
          </p>
        </div>

        {/* Category filter */}
        <div className="mb-12 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex items-center gap-2 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-all outline-none ${
                  activeCategory === category
                    ? "bg-white text-[#0080FF] shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-red-400"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">
              Failed to load games
            </h3>
            <p className="text-slate-500 mb-4">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={() => {
                setError(false);
                setLoading(true);
                fetchGames(1, activeCategory, false).finally(() =>
                  setLoading(false),
                );
              }}
              className="px-6 py-2.5 bg-[#0080FF] text-white rounded-full text-sm font-bold hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Game grid */}
        {!error && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="animate-scale-in">
                  <GameSkeleton />
                </div>
              ))
            ) : games.length > 0 ? (
              games.map((game, i) => (
                <Link
                  key={game.slug}
                  href={`/games/${game.slug}`}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-slate-100/60 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-100 hover:-translate-y-1.5 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img
                      src={game.icon}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl flex items-center gap-1 shadow-sm">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-amber-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="text-xs font-extrabold text-slate-700">
                        {Number(game.score).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="px-1 pb-1 flex-grow flex flex-col">
                    <p className="text-[10px] font-bold tracking-wider text-blue-400 uppercase mb-0.5">
                      {game.genre}
                    </p>
                    <h3 className="text-sm font-bold text-slate-800 leading-tight mb-2 line-clamp-1">
                      {game.title}
                    </h3>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        <span className="text-xs font-bold">
                          {game.installs}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-[#0080FF] group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-200 transition-all active:scale-90"
                      >
                        <span className="font-bold text-base leading-none">
                          +
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}

        {/* Sentinel for infinite scroll */}
        <div
          ref={sentinelRef}
          className="h-10 mt-8 flex items-center justify-center"
        >
          {loadingMore && (
            <div className="flex items-center gap-2 text-slate-400">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm font-medium">Loading more...</span>
            </div>
          )}
          {!pagination?.hasMore && games.length > 0 && !loading && (
            <p className="text-sm text-slate-400 font-medium">
              You&rsquo;ve reached the end
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
