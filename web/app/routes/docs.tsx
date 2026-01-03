import { Link } from "react-router";
import { 
  ArrowLeft, 
  HelpCircle, 
  Lightbulb,
  CheckCircle2,
  Plug,
  Server,
  Zap,
  ExternalLink
} from "lucide-react";

export default function Docs() {
  return (
    <main className="min-h-screen bg-[#050507] text-zinc-300 selection:bg-indigo-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full" />
      </div>

      {/* Main Container - px-5 provides the essential gutter for mobile */}
      <div className="relative max-w-4xl mx-auto px-5 py-10 md:px-10 md:py-16">
        
        {/* Header */}
        <header className="mb-12 md:mb-20">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-400 transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Live Timeline
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Trace<span className="text-indigo-500">Lite</span> Docs
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed">
            A simple guide to understanding, installing, and actually using TraceLite in a backend.
          </p>
        </header>

        <div className="grid gap-12 md:gap-20">

          {/* WHAT IT IS */}
          <DocSection title="What is TraceLite?" icon={<HelpCircle className="text-indigo-400" />}>
            <p>TraceLite is a <strong>backend tracing system</strong> designed for real-time observability.</p>
            <p className="mt-4">It watches every request that hits your server and records:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside text-zinc-400">
              <li>Request start and end timestamps</li>
              <li>Functional execution paths (Spans)</li>
              <li>Latency for individual code blocks</li>
              <li>Performance bottlenecks and crashes</li>
            </ul>
            <p className="mt-4">
              All data is streamed <strong>live</strong> to your dashboard via high-speed WebSockets.
            </p>
          </DocSection>

          {/* HOW IT WORKS */}
          <DocSection title="System Architecture" icon={<Zap className="text-yellow-400" />}>
            <ol className="list-decimal list-inside space-y-3 text-zinc-400">
              <li>Request enters the Go/Node backend</li>
              <li>TraceLite middleware initializes a unique Trace ID</li>
              <li>Application logic creates child Spans</li>
              <li>Upon completion, the Trace payload is dispatched</li>
              <li>WebSocket Hub broadcasts to all active dashboards</li>
            </ol>
          </DocSection>

          {/* IMPLEMENTATION */}
          <DocSection title="Implementation" icon={<Server className="text-emerald-400" />}>
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">01</span>
                  Add the middleware
                </h4>
                <div className="relative group overflow-hidden">
                  <pre className="bg-black/60 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto border border-zinc-800/50 leading-relaxed text-indigo-100">
{`handler := tracer.Middleware(hub)(mux)
http.ListenAndServe(":8080", handler)`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30">02</span>
                   Create spans
                </h4>
                <div className="relative group overflow-hidden">
                  <pre className="bg-black/60 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto border border-zinc-800/50 leading-relaxed text-indigo-100">
{`func handler(w http.ResponseWriter, r *http.Request) {
  ctx, span := tracer.Start(r.Context(), "db.query")
  defer tracer.End(span)

  // simulate work
  time.Sleep(200 * time.Millisecond)
  w.Write([]byte("ok"))
}`}
                  </pre>
                </div>
              </div>
            </div>
          </DocSection>

          {/* ENDPOINTS */}
          <DocSection title="Connectivity" icon={<Plug className="text-blue-400" />}>
            <div className="space-y-5">
              <EndpointBlock label="Backend Production Host" url="https://tracelite-1.onrender.com" />
              <EndpointBlock label="WebSocket Feed (Live)" url="wss://tracelite-1.onrender.com/ws" />
            </div>
          </DocSection>

          {/* WHEN TO USE */}
          <DocSection title="Use Cases" icon={<Lightbulb className="text-yellow-400" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Identifying slow API routes",
                "Debugging complex logic",
                "Visualizing concurrency",
                "Production performance audits",
                "Monitoring system health",
                "Replacing messy logs"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 transition-colors">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </DocSection>

          {/* FOOTER */}
          <footer className="mt-10 py-12 border-t border-zinc-900/50 text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-white/90 italic tracking-tight mb-6">
              “TraceLite lets you <span className="text-indigo-400">see</span> your backend instead of guessing.”
            </blockquote>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-bold">
              Documentation v1.0.4
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}

/**
 * Section Layout Helper
 * Responsive spacing ensures text doesn't hit mobile borders.
 */
function DocSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="relative">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 shadow-lg">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      
      {/* Responsive indentation:
        ml-2 (mobile) ensures we don't push content too far right.
        ml-7 (desktop) provides the clean "tree" look.
      */}
      <div className="ml-2 md:ml-7 pl-5 md:pl-9 border-l border-zinc-800/80 py-1">
        <div className="text-zinc-400 leading-relaxed text-[15px] md:text-base">
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Endpoint block for URL display
 * Uses break-all to prevent long URLs from breaking mobile layouts.
 */
function EndpointBlock({ label, url }: { label: string, url: string }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{label}</p>
        <ExternalLink size={10} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className="bg-black/40 p-3.5 rounded-lg border border-zinc-800/50 break-all font-mono text-xs text-indigo-300 shadow-inner">
        {url}
      </div>
    </div>
  )
}