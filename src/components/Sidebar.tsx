"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/discover",
    label: "Discover",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="flex-1 py-6 px-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#0080FF] text-white shadow-md shadow-blue-200/50"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-4 py-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <Image
            src="/logo.png"
            alt="Casual Games"
            width={80}
            height={80}
            className="w-7 h-7 rounded-lg shadow-sm object-contain"
          />
          <span className="text-sm font-bold text-[#0080FF]">
            CasualGames
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          The coziest place on the internet to play casual games, meet new friends, and share your gaming moments.
        </p>
        <div className="flex flex-col gap-1.5">
          <Link href="/privacy" className="text-xs font-medium text-slate-400 hover:text-[#0080FF] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-xs font-medium text-slate-400 hover:text-[#0080FF] transition-colors">
            Terms of Service
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-4">© 2026 CasualGames</p>
      </div>
    </div>
  );
}
