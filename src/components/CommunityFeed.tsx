const POSTS = [
  {
    id: 1,
    user: {
      name: "Sarah Jenkins",
      handle: "@sarahj",
      avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=150",
    },
    time: "2 hours ago",
    content: "Just hit level 50 in Cozy Farmville! 🌾 My little virtual farm is looking better than ever. Anyone want to trade some rare seeds?",
    image: "https://images.unsplash.com/photo-1771046455520-6a3db5e8707f?auto=format&fit=crop&q=80&w=800",
    likes: 124,
    comments: 18,
  },
  {
    id: 2,
    user: {
      name: "Mike Chen",
      handle: "@mikec_games",
      avatar: "https://images.unsplash.com/photo-1725273503244-3679bd832825?auto=format&fit=crop&q=80&w=150",
    },
    time: "5 hours ago",
    content: "The new update for Mini Kart Rush is insane! The rainbow track is so vibrant but tricky to master. What's your best time?",
    likes: 89,
    comments: 32,
  }
];

const LEADERBOARD = [
  { rank: 1, name: "PixelQueen", score: "12,450 XP", textColor: "text-amber-500", bg: "bg-amber-50" },
  { rank: 2, name: "NinjaStar", score: "11,200 XP", textColor: "text-slate-400", bg: "bg-slate-100" },
  { rank: 3, name: "CozyGamer", score: "10,800 XP", textColor: "text-orange-400", bg: "bg-orange-50" },
  { rank: 4, name: "SpeedRunner22", score: "9,950 XP", textColor: "text-slate-600", bg: "bg-white" },
  { rank: 5, name: "JellyBean", score: "9,100 XP", textColor: "text-slate-600", bg: "bg-white" },
];

export function CommunityFeed() {
  return (
    <section className="py-16 bg-white relative">
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-8">Community Activity</h2>

            <div className="space-y-6">
              {POSTS.map((post, i) => (
                <div
                  key={post.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-50" />
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{post.user.name}</h4>
                      <p className="text-sm text-slate-500">{post.user.handle} &bull; {post.time}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 font-medium leading-relaxed">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="rounded-2xl overflow-hidden mb-4">
                      <img src={post.image} alt="Post content" className="w-full h-64 object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                      </div>
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                        </svg>
                      </div>
                      <span className="font-medium">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors group ml-auto">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                          <polyline points="16 6 12 2 8 6"/>
                          <line x1="12" x2="12" y1="2" y2="15"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center shadow-inner">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/>
                    <path d="M4 22h16"/>
                    <path d="M10 22V8c0-1.1.9-2 2-2s2 .9 2 2v14"/>
                  </svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">Top Players</h3>
              </div>

              <div className="space-y-3">
                {LEADERBOARD.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-2xl ${player.bg} border border-slate-50`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-bold ${player.textColor}`}>
                        #{player.rank}
                      </span>
                      <span className="font-bold text-slate-700">{player.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-400 bg-white px-2 py-1 rounded-lg shadow-sm">
                      {player.score}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-colors">
                View Full Rankings
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}