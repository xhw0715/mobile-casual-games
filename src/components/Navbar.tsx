"use client";

import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm animate-slide-down">
      <div className="mx-auto px-6 h-20 flex items-center justify-between" style={{ maxWidth: 1200 }}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Casual Games"
            width={80}
            height={80}
            className="w-10 h-10 rounded-2xl shadow-sm object-contain"
          />
          <span className="text-xl font-bold text-[#0080FF] hidden sm:block">
            Casual Games
          </span>
        </Link>

        <div className="hidden md:flex items-center bg-white/60 border border-slate-100 rounded-full px-4 py-2 w-72 lg:w-96 shadow-inner focus-within:shadow-md transition-shadow mx-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-slate-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search games..."
            className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-slate-100/50 text-slate-600 transition-colors">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full border border-white"></span>
          </button>

          <button className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-200 to-cyan-200 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
