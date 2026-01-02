import { Sparkles, Info, Lightbulb } from "lucide-react"; // Icons for that "insight" feel
import type { Trace } from "~/types/tracer";
import { explainTrace } from "~/utils/explainTrace";

export function TraceExplain({ trace }: { trace: Trace }) {
  const explanation = explainTrace(trace);
  
  return (
    <div className="relative group overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

      <div className="relative rounded-xl border border-indigo-500/20 bg-indigo-500/[0.03] p-4 transition-all hover:bg-indigo-500/[0.05]">
        
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-300/90">
            Analysis & Insights
          </h4>
        </div>

        {/* Content Section */}
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-sm leading-relaxed text-zinc-300 selection:bg-indigo-500/30">
              {/* If the explanation is long, we treat it like a mini-article */}
              <p className="first-letter:text-xl first-letter:font-serif first-letter:mr-1 first-letter:float-left first-letter:text-indigo-400">
                {explanation}
              </p>
            </div>
            
            {/* Quick Tip / Actionable Footer */}
            <div className="mt-4 flex items-center gap-2 py-2 px-3 rounded-lg bg-black/30 border border-zinc-800/50">
              <Lightbulb size={14} className="text-amber-400 shrink-0" />
              <p className="text-[11px] text-zinc-500 italic">
                Recommendation: Check database indexing if this pattern persists.
              </p>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-indigo-500/40 group-hover:w-full transition-all duration-500" />
      </div>
    </div>
  );
}