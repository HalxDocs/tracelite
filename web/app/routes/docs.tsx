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
    <main className="min-h-screen bg-[#050507] text-zinc-300 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      
      {/* Background Decor (clipped to viewport) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-indigo-500/5 blur-[80px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-[400px] h-64 sm:h-[400px] bg-emerald-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-16">
        
        {/* Header */}
        <header className="mb-12 md:mb-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-400 transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Live Timeline
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            Trace<span className="text-indigo-500">Lite</span> Docs
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed">
            A simple guide to understanding, installing, and actually using TraceLite in a backend.
          </p>
        </header>

        <div className="space-y-14 md:space-y-20">

          <DocSection title="What is TraceLite?" icon={<HelpCircle className="text-indigo-400" />}>
            <p><strong>TraceLite is a backend tracing system</strong> built for real-time observability.</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Request timing</li>
              <li>Execution paths (spans)</li>
              <li>Latency hotspots</li>
              <li>Crashes & slow operations</li>
            </ul>
            <p className="mt-4">
              Everything is streamed live over WebSockets.
            </p>
          </DocSection>

          <DocSection title="System Architecture" icon={<Zap className="text-yellow-400" />}>
            <ol className="list-decimal list-inside space-y-3">
              <li>Request enters backend</li>
              <li>Trace ID is created</li>
              <li>Spans track execution</li>
              <li>Trace is broadcast</li>
              <li>Dashboard updates live</li>
            </ol>
          </DocSection>

          <DocSection title="Implementation" icon={<Server className="text-emerald-400" />}>
            <Step title="Add middleware" index="01">
              <CodeBlock>
{`handler := tracer.Middleware(hub)(mux)
http.ListenAndServe(":8080", handler)`}
              </CodeBlock>
            </Step>

            <Step title="Create spans" index="02">
              <CodeBlock>
{`func handler(w http.ResponseWriter, r *http.Request) {
  ctx, span := tracer.Start(r.Context(), "db.query")
  defer tracer.End(span)

  time.Sleep(200 * time.Millisecond)
  w.Write([]byte("ok"))
}`}
              </CodeBlock>
            </Step>
          </DocSection>

          <DocSection title="Connectivity" icon={<Plug className="text-blue-400" />}>
            <div className="space-y-6">
              <EndpointBlock label="Backend Host" url="https://tracelite-1.onrender.com" />
              <EndpointBlock label="WebSocket Feed" url="wss://tracelite-1.onrender.com/ws" />
            </div>
          </DocSection>

          <DocSection title="Use Cases" icon={<Lightbulb className="text-yellow-400" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Find slow APIs",
                "Debug logic",
                "Understand concurrency",
                "Audit production",
                "Replace noisy logs",
                "Learn system behavior"
              ].map(item => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </DocSection>

          <footer className="pt-12 border-t border-zinc-900 text-center">
            <blockquote className="text-lg sm:text-xl md:text-2xl italic text-white/90">
              “TraceLite lets you <span className="text-indigo-400">see</span> your backend instead of guessing.”
            </blockquote>
            <p className="mt-4 text-xs text-zinc-600 uppercase tracking-widest">
              Documentation v1.0.4
            </p>
          </footer>

        </div>
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

function DocSection({ title, icon, children }: any) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
          {icon}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>

      {/* mobile-friendly indentation */}
      <div className="pl-3 sm:pl-6 border-l border-zinc-800 text-zinc-400 space-y-4">
        {children}
      </div>
    </section>
  );
}

function Step({ title, index, children }: any) {
  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-semibold text-white">
        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] border border-indigo-500/30">
          {index}
        </span>
        {title}
      </h4>
      {children}
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-black/60 p-4 rounded-xl text-xs sm:text-sm overflow-x-auto border border-zinc-800 text-indigo-100">
      <code>{children}</code>
    </pre>
  );
}

function EndpointBlock({ label, url }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          {label}
        </p>
        <ExternalLink size={10} className="text-zinc-600" />
      </div>
      <div className="bg-black/40 p-3 rounded-lg border border-zinc-800 break-all font-mono text-xs text-indigo-300">
        {url}
      </div>
    </div>
  );
}
