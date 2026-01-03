import { Link } from "react-router";
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageSquare, 
  Route, 
  Layers, 
  Clock, 
  Lightbulb,
  CheckCircle2,
  Plug,
  Server,
  Zap
} from "lucide-react";

export default function Docs() {
  return (
    <main className="min-h-screen bg-[#050507] text-zinc-300 selection:bg-indigo-500/30 font-sans">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-4xl mx-auto p-8 md:p-16">
        
        {/* Header */}
        <header className="mb-16">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-400 transition-colors mb-8"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Live Timeline
          </Link>
          
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Trace<span className="text-indigo-500">Lite</span> Docs
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
            A simple guide to understanding, installing, and actually using TraceLite in a backend.
          </p>
        </header>

        <div className="grid gap-14">

          {/* WHAT IT IS */}
          <DocSection title="What is TraceLite?" icon={<HelpCircle className="text-indigo-400" />}>
            <p>
              TraceLite is a <strong>backend tracing system</strong>.
            </p>
            <p className="mt-4">
              It watches every request that hits your server and records:
            </p>
            <ul className="mt-3 list-disc list-inside text-zinc-400">
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
          <DocSection title="How TraceLite works (big picture)" icon={<Zap className="text-yellow-400" />}>
            <ol className="list-decimal list-inside space-y-2 text-zinc-400">
              <li>A request enters your backend</li>
              <li>TraceLite middleware creates a Trace</li>
              <li>Your code creates Spans (steps)</li>
              <li>The request finishes</li>
              <li>The Trace is sent over WebSocket</li>
              <li>The dashboard shows it instantly</li>
            </ol>
          </DocSection>

          {/* HOW TO USE IT */}
          <DocSection title="How to use TraceLite in your backend" icon={<Server className="text-emerald-400" />}>
            <p>
              TraceLite is already running on your hosted backend.
            </p>
            <p className="mt-4">
              You use it by doing <strong>two simple things</strong>:
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">1️⃣ Add the middleware</h4>
                <p className="text-zinc-400">
                  This wraps your entire HTTP server and automatically traces every request.
                </p>

                <pre className="mt-3 bg-black/40 p-4 rounded-xl text-sm overflow-x-auto">
{`handler := tracer.Middleware(hub)(mux)
http.ListenAndServe(":8080", handler)`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">2️⃣ Create spans inside handlers</h4>
                <p className="text-zinc-400">
                  Each span represents a step in your code.
                </p>

                <pre className="mt-3 bg-black/40 p-4 rounded-xl text-sm overflow-x-auto">
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
          </DocSection>

          {/* HOSTED USAGE */}
          <DocSection title="How to use it now that it’s hosted" icon={<Plug className="text-blue-400" />}>
            <p>
              Your backend is live at:
            </p>

            <pre className="mt-3 bg-black/40 p-3 rounded text-sm">
https://tracelite-1.onrender.com
            </pre>

            <p className="mt-4">
              Every time someone hits:
            </p>

            <pre className="mt-2 bg-black/40 p-3 rounded text-sm">
/ping
            </pre>

            <p className="mt-4">
              A trace is created automatically.
            </p>

            <p className="mt-4">
              The trace is sent to:
            </p>

            <pre className="mt-2 bg-black/40 p-3 rounded text-sm">
wss://tracelite-1.onrender.com/ws
            </pre>

            <p className="mt-4">
              Your frontend dashboard listens to this WebSocket and renders everything live.
            </p>
          </DocSection>

          {/* WHAT YOU SEE */}
          <DocSection title="What you see in the dashboard" icon={<Layers className="text-amber-400" />}>
            <ul className="space-y-3 text-zinc-400">
              <li><strong>Timeline</strong> – each request</li>
              <li><strong>Tree view</strong> – parent → child execution</li>
              <li><strong>Flame graph</strong> – where time was spent</li>
              <li><strong>Slow badges</strong> – performance problems</li>
              <li><strong>Error markers</strong> – crashes</li>
            </ul>
          </DocSection>

          {/* WHEN TO USE */}
          <DocSection title="When should you use TraceLite?" icon={<Lightbulb className="text-yellow-400" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "API feels slow",
                "You don’t know which function is slow",
                "Logs are confusing",
                "You want visual insight",
                "Debugging production issues",
                "Learning how your backend behaves"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </DocSection>

          {/* FINAL SUMMARY */}
          <footer className="mt-12 py-10 border-t border-zinc-900 text-center">
            <blockquote className="text-2xl font-medium text-white italic tracking-tight">
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
        <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <div className="pl-2 border-l-2 border-zinc-900 ml-5 py-2 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
