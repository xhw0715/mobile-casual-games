export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-6">
      <div className="mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ maxWidth: 1200 }}>
        <p className="text-slate-400 text-sm font-medium">
          © 2026 CasualGames. All rights reserved.
        </p>
        <div className="flex gap-4 text-sm font-medium text-slate-400">
          <a href="/privacy" className="hover:text-slate-600 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-slate-600 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
