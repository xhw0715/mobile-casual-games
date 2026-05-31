import Link from "next/link";

interface GameCardProps {
  slug: string;
  title: string;
  category: string;
  image: string;
  rating: number;
  players: string;
  color: string;
}

export function GameCard({ slug, title, category, image, rating, players, color }: GameCardProps) {
  return (
    <Link href={`/games/${slug}`} className="block bg-white rounded-[14px] sm:rounded-3xl p-4 shadow-sm border border-slate-100/50 hover:shadow-xl hover:shadow-blue-100/50 transition-all cursor-pointer group hover:-translate-y-2">
      <div className="relative h-48 rounded-[10px] sm:rounded-2xl overflow-hidden mb-4">
        <div className={`absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity ${color}`}></div>
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1 shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-amber-400">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span className="text-xs font-bold text-slate-700">{rating}</span>
        </div>
      </div>

      <div className="px-2 pb-2">
        <p className="text-xs font-bold tracking-wider text-blue-400 uppercase mb-1">{category}</p>
        <h3 className="text-sm sm:text-lg font-bold text-slate-800 mb-3">{title}</h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className="text-xs sm:text-sm font-medium">{players} playing</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-[#0080FF] group-hover:text-white transition-colors">
            +
          </button>
        </div>
      </div>
    </Link>
  );
}