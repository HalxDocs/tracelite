import { Link } from "react-router";
import { useTraceSocket } from "~/hooks/useTraceSocket";
import { TraceTimeline } from "~/components/TraceTimeline";
import { Activity, BookOpen, Terminal, Zap, Star, ExternalLink, Heart } from "lucide-react"; 

export default function Index() {
  const traces = useTraceSocket();

  return (
    <main className="min-h-screen bg-[#050507] text-zinc-400 selection:bg-indigo-500/30 flex flex-col">
      {/* Subtle Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative flex-1 max-w-7xl mx-auto p-6 lg:p-10 w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-500/80">
                Live System Feed
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Terminal className="text-indigo-500" size={32} />
              Trace<span className="text-indigo-400">Lite</span>
            </h1>
          </div>

          {/* Navigation with horizontal scroll protection for mobile */}
         <nav className="flex items-center gap-3 flex-nowrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
  {/* GitHub Star Link */}
  <a
    href="https://github.com/halxdocs/tracelite"
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-amber-400 hover:border-amber-500/30 transition-all whitespace-nowrap shrink-0"
  >
    <Star size={18} className="group-hover:fill-amber-400 transition-colors" />
    <span className="text-sm font-medium">Star on GitHub</span>
  </a>

  {/* Docs Link */}
  <Link
    to="/docs"
    className="group flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 transition-all shadow-xl whitespace-nowrap shrink-0"
  >
    <BookOpen size={18} className="text-zinc-500 group-hover:text-indigo-400" />
    <span className="text-sm font-medium">Docs</span>
  </Link>
</nav>

        </header>

        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Traces" value={traces.length} icon={<Activity size={20} />} color="indigo" />
          <StatCard label="Live Connection" value="Stable" icon={<Zap size={20} />} color="emerald" />
          <StatCard label="Active Nodes" value="04" icon={<Terminal size={20} />} color="amber" />
        </div>

        {/* Main Content Area */}
        <section className="relative rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm overflow-hidden shadow-2xl mb-12">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="p-1">
            <TraceTimeline traces={traces} />
          </div>
        </section>
      </div>

      {/* Footer / Branding */}
      <footer className="relative py-8 border-t border-zinc-900 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-2">
          <p className="text-sm text-zinc-500 flex items-center gap-2">
            Built  <Heart size={14} className="text-red-500 fill-red-500" /> by 
            <span className="text-zinc-300 font-bold">halxdocs</span> btw!
          </p>
          <a 
            href="https://halxdocs.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Click me to view the creator
            <ExternalLink size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </footer>
    </main>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: any, icon: any, color: string }) {
  const colors: any = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className={`p-4 rounded-2xl border bg-zinc-900/50 backdrop-blur-md ${colors[color]}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-black/20">{icon}</div>
        <div>
          <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-zinc-100">{value}</p>
        </div>
      </div>
    </div>
  );
}