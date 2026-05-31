"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Game {
  appId: string;
  slug: string;
  title: string;
  icon: string;
  screenshots: string[];
  score: string;
  genre: string;
  price: number;
  free: boolean;
  currency: string;
  video: string | null;
  videoImage: string | null;
  description: string;
  descriptionHTML: string | null;
  developer: string;
  installs: string;
}

function formatInstalls(installs: string): string {
  const match = installs.match(/^([\d,]+)/);
  if (!match) return installs;
  const num = parseInt(match[1].replace(/,/g, ""));
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(0)}B+`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(0)}M+`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K+`;
  return String(num);
}

export default function GameDetailPage() {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchGame = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/games/${params.id}`);
      const json = await res.json();
      if (!res.ok || json.code !== 200) throw new Error("Not found");
      setGame(json.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    queueMicrotask(() => fetchGame());
  }, [fetchGame]);

  const screenshots = game?.screenshots?.filter(Boolean) ?? [];
  const totalSlides = screenshots.length > 0 ? screenshots.length : 1;

  const goTo = (index: number) => {
    const idx = Math.max(0, Math.min(index, totalSlides - 1));
    setCurrentSlide(idx);
    carouselRef.current?.children[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      goTo(currentSlide + (diff > 0 ? 1 : -1));
    }
  };

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== currentSlide) setCurrentSlide(index);
  };

  // --- Loading skeleton ---
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-16 animate-pulse">
          {/* Carousel skeleton */}
          <div className="aspect-[16/10] md:aspect-[16/9] bg-slate-200 rounded-3xl mb-8" />
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-slate-200 rounded-full" />
            ))}
          </div>
          {/* Details skeleton */}
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="h-5 bg-slate-200 rounded-full w-20" />
            <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
            <div className="flex gap-3">
              <div className="h-8 bg-slate-200 rounded-full w-24" />
              <div className="h-8 bg-slate-200 rounded-full w-28" />
              <div className="h-8 bg-slate-200 rounded-full w-16" />
            </div>
            <div className="h-5 bg-slate-200 rounded w-40" />
            <div className="space-y-3 pt-4">
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-4 bg-slate-200 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-6 py-32">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              width="36"
              height="36"
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Game not found
          </h2>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            The game you are looking for does not exist or could not be loaded.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={fetchGame}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors"
            >
              Retry
            </button>
            <Link
              href="/discover"
              className="px-6 py-2.5 bg-white text-slate-700 rounded-full text-sm font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Browse games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!game) return null;

  const rating = Number(game.score).toFixed(1);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-slate-50 to-white">
      {/* Back button */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-6 pb-2">
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors group"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
      </div>

      {/* ======== TOP: Image Carousel ======== */}
      <div className="max-w-4xl mx-auto px-6 pb-6">
        {/* Main carousel container */}
        <div className="relative group/carousel">
          {/* Slides */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar rounded-3xl"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={handleScroll}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {screenshots.length > 0 ? (
              screenshots.map((src, i) => (
                <div key={i} className="w-full flex-shrink-0 snap-center">
                  <div className="aspect-[16/10] md:aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden">
                    <img
                      src={src}
                      alt={`${game.title} screenshot ${i + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full flex-shrink-0 snap-center">
                <div className="aspect-[16/10] md:aspect-[16/9] bg-slate-100 rounded-3xl flex items-center justify-center">
                  <img
                    src={game.icon}
                    alt={game.title}
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl opacity-40"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop arrow buttons */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={() => goTo(currentSlide - 1)}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => goTo(currentSlide + 1)}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-700"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Image counter badge */}
          {screenshots.length > 1 && (
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-bold">
              {currentSlide + 1} / {screenshots.length}
            </div>
          )}
        </div>

        {/* Dots indicator */}
        {screenshots.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-8 h-2.5 bg-[#0080FF]"
                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to screenshot ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip on desktop */}
        {screenshots.length > 1 && (
          <div className="hidden md:flex items-center justify-center gap-3 mt-4">
            {screenshots.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                  i === currentSlide
                    ? "border-[#0080FF] shadow-md shadow-blue-200/50 ring-1 ring-blue-300"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ======== BOTTOM: Game Details ======== */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        {/* Genre badge */}
        <div className="mb-3">
          <span className="inline-block px-3.5 py-1 bg-blue-50 text-[#0080FF] text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
            {game.genre}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight mb-5">
          {game.title}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Rating */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-amber-400"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-sm font-bold text-slate-700">{rating}</span>
          </div>

          {/* Downloads */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-100">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <span className="text-sm font-bold text-slate-600">
              {formatInstalls(game.installs)}
            </span>
          </div>

          {/* Price */}
          {game.free ? (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
              Free
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold border border-emerald-100">
              {game.currency} {game.price}
            </div>
          )}
        </div>

        {/* Developer */}
        <div className="flex items-center gap-2 text-slate-400 mb-8 pb-6 border-b border-slate-100">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          <span className="text-sm font-medium">{game.developer}</span>
        </div>

        {/* Guide link */}
        <Link
          href={`/games/${params.id}/guide`}
          className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm mb-8 text-sm font-bold text-slate-700"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="8" y1="7" x2="16" y2="7" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          View Guide
        </Link>

        {/* Description card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#0080FF]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            About this game
          </h2>
          <div className="text-slate-600 leading-relaxed text-sm space-y-3 [&_strong]:font-bold [&_br]:block [&_br]:content-[''] [&_a]:text-[#0080FF] [&_a]:underline">
            {game.descriptionHTML ? (
              <div dangerouslySetInnerHTML={{ __html: game.descriptionHTML }} />
            ) : (
              game.description
                .split("\n")
                .map((line, i) => <p key={i}>{line || " "}</p>)
            )}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex gap-3 sticky bottom-6 md:static">
          <a
            href={`https://play.google.com/store/apps/details?id=${game.appId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-[#0080FF] text-white rounded-2xl font-bold text-base hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-200/50 text-center block"
          >
            Download on Google Play
          </a>
          <button className="py-4 px-6 bg-white text-slate-700 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98] shadow-sm">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
