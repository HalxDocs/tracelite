import { Link } from "react-router";
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageSquare, 
  Route, 
  Layers, 
  Clock, 
  Lightbulb,
  CheckCircle2
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
        
        {/* Header Section */}
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
            The simple guide to seeing how your code breathes, moves, and occasionally takes a nap.
          </p>
        </header>

        <div className="grid gap-12">
          
          {/* Main Content Cards */}
          <DocSection 
            title="What is TraceLite?" 
            icon={<HelpCircle className="text-indigo-400" />}
          >
            <p>Imagine your backend is a busy kitchen. TraceLite is like having a <strong>magic camera</strong> that records every order from the moment it’s written down until the plate hits the table.</p>
            <p className="mt-4 text-zinc-400 italic text-sm">No more guessing what happened to the soup.</p>
          </DocSection>

          <div className="grid md:grid-cols-2 gap-6">
            <DocSection 
              title="What is a Request?" 
              icon={<MessageSquare className="text-emerald-400" />}
            >
              <p>A request is like a <strong>knock on the door</strong>. Someone says, "Hey! Can you show me my photos?" and your server starts working.</p>
            </DocSection>

            <DocSection 
              title="What is a Trace?" 
              icon={<Route className="text-blue-400" />}
            >
              <p>A trace is the <strong>full story</strong>. It’s the map of everywhere your server went to get that one job done.</p>
            </DocSection>
          </div>

          <DocSection 
            title="What is a Span?" 
            icon={<Layers className="text-amber-400" />}
          >
            <p>A span is <strong>one tiny step</strong>. If "Making a Sandwich" is the Trace, then "Slicing the Bread" is a Span.</p>
            
            <div className="mt-6 bg-black/40 border border-zinc-800 rounded-2xl p-6 font-mono text-sm overflow-hidden relative">
               <div className="absolute top-0 right-0 p-3 opacity-20"><Layers size={40} /></div>
               <div className="text-indigo-400 font-bold mb-2">GET /sandwich</div>
               <div className="flex items-center gap-2 text-zinc-500">
                 <span className="ml-4 italic">└─</span> 
                 <span className="text-zinc-300">slice.bread</span> 
                 <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">12ms</span>
               </div>
               <div className="flex items-center gap-2 text-zinc-500">
                 <span className="ml-4 italic">└─</span> 
                 <span className="text-zinc-300">apply.mayo</span> 
                 <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">450ms</span>
                 <span className="text-[10px] text-amber-500 font-bold ml-2">SLOW!</span>
               </div>
            </div>
          </DocSection>

          <DocSection 
            title="Why use this?" 
            icon={<Lightbulb className="text-yellow-400" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {[
                "Find slow parts instantly",
                "See errors as they happen",
                "Understand complex code",
                "Sleep better at night"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </DocSection>

          {/* Final Summary Quote */}
          <footer className="mt-12 py-10 border-t border-zinc-900 text-center">
            <blockquote className="text-2xl font-medium text-white italic tracking-tight">
              "TraceLite turns the 'black box' of your backend into a <span className="text-indigo-400">transparent story</span>."
            </blockquote>
          </footer>

        </div>
      </div>
    </main>
  );
}

function DocSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
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