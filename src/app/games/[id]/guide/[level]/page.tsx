"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import levelsData from "@/lib/bus_traffic_fever_data.json";

interface Level {
  level: number;
  name: string;
  image: string;
  videoUrl: string;
}

const faqs = [
  {
    q: "How do I unlock new levels?",
    a: "Levels unlock progressively as you complete each stage. Finish a level to advance to the next. If a level number is missing from the list, a walkthrough video hasn't been created for it yet.",
  },
  {
    q: "What is the best strategy for busy intersections?",
    a: "Plan your routes to minimize crossing traffic. Use traffic lights strategically and avoid creating gridlock by spacing out bus stops. Sometimes a longer route with fewer turns is more efficient.",
  },
  {
    q: "Why do my buses keep getting stuck?",
    a: "This usually happens when roads are too congested or bus stops are placed too close together. Try adding more road lanes, spreading out stops, or using one-way roads to improve traffic flow.",
  },
  {
    q: "Are there any hidden rewards?",
    a: "Yes! Completing levels with high efficiency ratings and using specific route patterns can unlock bonus content. Watch the walkthrough videos to see optimal routing strategies.",
  },
];

const allLevels = (levelsData as Level[]).sort((a, b) => a.level - b.level);
const maxLevel = allLevels[allLevels.length - 1].level;
const minLevel = allLevels[0].level;

export default function LevelDetailPage() {
  const params = useParams();
  const levelNum = parseInt(params.level as string, 10);

  const current = useMemo(
    () => allLevels.find((l) => l.level === levelNum),
    [levelNum]
  );

  const { prev, next, adjacent } = useMemo(() => {
    if (!current) return { prev: null, next: null, adjacent: [] as Level[] };
    const idx = allLevels.indexOf(current);
    const prevLevel = idx > 0 ? allLevels[idx - 1] : null;
    const nextLevel = idx < allLevels.length - 1 ? allLevels[idx + 1] : null;

    // 4 before, 4 after (excluding current)
    const before = allLevels.slice(Math.max(0, idx - 4), idx);
    const after = allLevels.slice(idx + 1, idx + 5);
    return { prev: prevLevel, next: nextLevel, adjacent: [...before, ...after] };
  }, [current]);

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Level not found</h2>
          <p className="text-slate-500 mb-6">This level does not exist or has no walkthrough.</p>
          <Link
            href={`/games/${params.id}/guide`}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            Back to All Levels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-6 pb-24">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/games/${params.id}/guide`}
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
            All Levels
          </Link>

          <span className="text-xs font-medium text-slate-300 bg-slate-100 px-3 py-1 rounded-full">
            Level {current.level}
          </span>
        </div>

        {/* Level title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
            Level {current.level} Walkthrough
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            {current.name}
          </p>
        </div>

        {/* Video */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 mb-6">
          <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden">
            <iframe
              src={current.videoUrl}
              title={`Level ${current.level} walkthrough`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Next / Prev navigation */}
        <div className="flex gap-3 mb-10">
          {prev ? (
            <Link
              href={`/games/${params.id}/guide/${prev.level}`}
              className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-sm font-bold text-slate-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Level {prev.level}
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next && (
            <Link
              href={`/games/${params.id}/guide/${next.level}`}
              className="flex items-center gap-2 px-5 py-3 bg-[#0080FF] text-white rounded-2xl hover:bg-blue-600 transition-all shadow-sm text-sm font-bold ml-auto"
            >
              Next Level
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          )}
        </div>

        {/* FAQ */}
        <div className="mb-12">
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
            Tips & FAQ
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between px-5 py-4 text-sm font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-slate-300 group-open:rotate-180 transition-transform shrink-0 ml-3"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Adjacent Levels */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Adjacent Levels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {adjacent.map((level) => (
              <Link
                key={level.level}
                href={`/games/${params.id}/guide/${level.level}`}
                className="group relative aspect-[3/2] rounded-2xl overflow-hidden border border-transparent hover:border-slate-200 hover:shadow-md transition-all"
              >
                <img
                  src={level.image}
                  alt={`Level ${level.level}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-slate-800 ml-0.5"
                    >
                      <polygon points="8 5 19 12 8 19 8 5" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <span className="text-xs font-bold text-white/90">Level {level.level}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
