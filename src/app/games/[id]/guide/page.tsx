"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import levelsData from "@/lib/bus_traffic_fever_data.json";

const PAGE_SIZE = 12;

interface Level {
  level: number;
  name: string;
  image: string;
  videoUrl: string;
}

const allLevels = (levelsData as Level[]).sort((a, b) => a.level - b.level);
const maxLevel = allLevels[allLevels.length - 1].level;
const minLevel = allLevels[0].level;

const rangeSize = 40;
const ranges: { label: string; from: number; to: number }[] = [];
for (let start = minLevel; start <= maxLevel; start += rangeSize) {
  const end = Math.min(start + rangeSize - 1, maxLevel);
  ranges.push({ label: `${start}–${end}`, from: start, to: end });
}

export default function GuidePage() {
  const params = useParams();
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [searchValue, setSearchValue] = useState("");
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredLevels = activeRange
    ? allLevels.filter((l) => {
        const range = ranges.find((r) => r.label === activeRange);
        return range ? l.level >= range.from && l.level <= range.to : true;
      })
    : allLevels;

  const visibleLevels = activeRange ? filteredLevels : allLevels.slice(0, displayCount);
  const hasMore = !activeRange && displayCount < allLevels.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(searchValue, 10);
    if (isNaN(num)) return;
    window.location.href = `/games/${params.id}/guide/${num}`;
  };

  const loadMore = useCallback(() => {
    setDisplayCount((prev) => Math.min(prev + PAGE_SIZE, allLevels.length));
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-24">
        {/* Back & header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={`/games/${params.id}`}
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
            Back to game
          </Link>

          <span className="text-xs font-medium text-slate-300 bg-slate-100 px-3 py-1 rounded-full">
            {activeRange ? `${filteredLevels.length} / ${allLevels.length} levels` : `${allLevels.length} levels`}
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            All Levels Walkthrough
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Select a level to watch the walkthrough video
          </p>
        </div>

        {/* Search & quick jump */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <div className="relative flex-1 max-w-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="number"
                min={minLevel}
                max={maxLevel}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Jump to level…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0080FF]/20 focus:border-[#0080FF] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0080FF] text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition-colors"
            >
              Go
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveRange(null)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeRange === null
                  ? "bg-[#0080FF] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              All
            </button>
            {ranges.map((r) => (
              <button
                key={r.label}
                onClick={() => setActiveRange(r.label)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeRange === r.label
                    ? "bg-[#0080FF] text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Level grid */}
        <div ref={gridRef}>
          <p className="text-sm text-slate-400 mb-5">
            {activeRange ? `Showing levels ${activeRange}` : "Pick a level below to watch its walkthrough video"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {visibleLevels.map((level) => (
              <Link
                key={level.level}
                href={`/games/${params.id}/guide/${level.level}`}
                className="group relative aspect-[3/2] rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-200 hover:shadow-md transition-all"
              >
                <img
                  src={level.image}
                  alt={`Level ${level.level}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-slate-800 ml-0.5"
                    >
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="text-sm font-bold text-white/90">
                    Level {level.level}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-[#0080FF] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
