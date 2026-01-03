import { Link } from "react-router";
import { 
  ArrowLeft, 
  HelpCircle, 
  Route, 
  Layers, 
  Lightbulb,
  CheckCircle2,
  Plug,
  Server,
  Zap
} from "lucide-react";

export default function Docs() {
  return (
    <main className="min-h-screen bg-[#050507] text-zinc-300 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Background Decor - Adjusted for mobile visibility */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/5 blur-[80px] md:blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto p-6 md:p-16">
        
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-400 transition-colors mb-6 md:mb-8"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Live Timeline
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Trace<span className="text-indigo-500">Lite</span> Docs
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed">
            A simple guide to understanding, installing, and actually using TraceLite in a backend.
          </p>
        </header>

        <div className="grid gap-10 md:gap-14">

          {/* WHAT IT IS */}
          <DocSection title="What is TraceLite?" icon={<HelpCircle className="text-indigo-400" />}>
            <p>
              TraceLite is a <strong>backend tracing system</strong>.
            </p>
            <p className="mt-4">
              It watches every request that hits your server and records:
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-zinc-400">
              <li>when the request started</li>
              <li>what code ran</li>
              <li>how long each step took</li>
              <li>what was slow</li>
              <li>what crashed</li>
            </ul>
            <p className="mt-4">
              Then it sends all of that information <strong>live</strong> to a dashboard using WebSockets.
            </p>
          </DocSection>

          {/* HOW IT WORKS */}
          <DocSection title="How TraceLite works" icon={<Zap className="text-yellow-400" />}>
            <ol className="list-decimal list-inside space-y-3 text-zinc-400">
              <li>A request enters your backend</li>
              <li>TraceLite middleware creates a Trace</li>
              <li>Your code creates Spans (steps)</li>
              <li>The request finishes</li>
              <li>The Trace is sent over WebSocket</li>
              <li>The dashboard shows it instantly</li>
            </ol>
          </DocSection>

          {/* HOW TO USE IT */}
          <DocSection title="Implementation" icon={<Server className="text-emerald-400" />}>
            <p>
              TraceLite is already running on your hosted backend. Use it via these steps:
            </p>

            <div className="mt-6 space-y-8">
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs">1</span>
                  Add the middleware
                </h4>
                <p className="text-zinc-400 text-sm mb-3">
                  This wraps your entire HTTP server and automatically traces every request.
                </p>
                <div className="relative group">
                  <pre className="bg-black/40 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto border border-zinc-800/50">
{`handler := tracer.Middleware(hub)(mux)
http.ListenAndServe(":8080", handler)`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs">2</span>
                   Create spans inside handlers
                </h4>
                <p className="text-zinc-400 text-sm mb-3">
                  Each span represents a step in your code.
                </p>
                <div className="relative group">
                  <pre className="bg-black/40 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto border border-zinc-800/50">
{`func handler(w http.ResponseWriter, r *http.Request) {
  ctx, span := tracer.Start(r.Context(), "handler.work")
  defer tracer.End(span)

  // do work here
  time.Sleep(200 * time.Millisecond)

  w.Write([]byte("ok"))
}`}
                  </pre>
                </div>
              </div>
            </div>
          </DocSection>

          {/* HOSTED USAGE */}
          <DocSection title="Endpoints" icon={<Plug className="text-blue-400" />}>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Backend Host</p>
                <pre className="bg-black/40 p-3 rounded-lg text-xs sm:text-sm border border-zinc-800/50 break-all whitespace-pre-wrap">
                  https://tracelite-1.onrender.com
                </pre>
              </div>

              <div>
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">WebSocket Feed</p>
                <pre className="bg-black/40 p-3 rounded-lg text-xs sm:text-sm border border-zinc-800/50 break-all whitespace-pre-wrap">
                  wss://tracelite-1.onrender.com/ws
                </pre>
              </div>
            </div>
          </DocSection>

          {/* WHEN TO USE */}
          <DocSection title="When to use TraceLite?" icon={<Lightbulb className="text-yellow-400" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                "API feels slow",
                "Function bottlenecks",
                "Confusing log files",
                "Visual execution paths",
                "Production debugging",
                "Backend behavior audits"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </DocSection>

          {/* FINAL SUMMARY */}
          <footer className="mt-8 md:mt-12 py-10 border-t border-zinc-900 text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-white italic tracking-tight px-4">
              “TraceLite lets you <span className="text-indigo-400">see</span> your backend instead of guessing.”
            </blockquote>
          </footer>

        </div>
      </div>
    </main>
  );
}

function DocSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="group relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-transform group-hover:scale-110 shrink-0">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <div className="pl-4 md:pl-5 border-l-2 border-zinc-900 ml-5 py-2 leading-relaxed text-sm md:text-base">
        {children}
      </div>
    </section>
  );
}