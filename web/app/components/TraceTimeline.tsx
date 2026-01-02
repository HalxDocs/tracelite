import { useState } from "react";
import type { Trace } from "~/types/tracer";
import { buildSpanTree } from "~/utils/spanTree";
import { SpanTree } from "~/components/SpanTree";
import { FlameGraph } from "~/components/FlameGraph";
import { TraceExplain } from "~/components/TraceExplain";
import { TraceCompare } from "~/components/TraceCompare";
import { ChevronRight, ChevronDown, Flame, ListTree, AlertCircle, Clock, GitCompare } from "lucide-react";

export function TraceTimeline({ traces }: { traces: Trace[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [view, setView] = useState<"tree" | "flame">("tree");
  const [selected, setSelected] = useState<Trace[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  return (
    <div className="relative space-y-4">
      {/* Floating Compare Action Bar */}
      {selected.length === 2 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setShowCompare(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all scale-105 active:scale-95"
          >
            <GitCompare size={20} />
            Compare Traces ({selected.length})
          </button>
        </div>
      )}

      {traces.map((trace) => {
        const root = buildSpanTree(trace.spans);
        if (!root) return null;

        const isOpen = open === trace.id;
        const hasError = trace.spans.some((s) => s.error);
        const rootDurationMs = root.duration ? Number(root.duration) / 1_000_000 : 0;

        return (
          <div
            key={trace.id}
            className={`group rounded-2xl border transition-all duration-300 overflow-hidden
              ${isOpen ? "bg-zinc-900/80 border-zinc-700 shadow-2xl" : "bg-zinc-950/40 border-zinc-800/50 hover:border-zinc-700"}
              ${trace.slow && !isOpen ? "border-l-4 border-l-red-500" : ""}
            `}
          >
            {/* Header / Trigger */}
            <div className="flex items-center p-4 gap-4">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selected.some((t) => t.id === trace.id)}
                  onChange={(e) => {
                    setSelected((prev) =>
                      e.target.checked
                        ? [...prev, trace].slice(0, 2)
                        : prev.filter((t) => t.id !== trace.id)
                    );
                  }}
                />
                <div className="w-5 h-5 border-2 border-zinc-700 rounded-md peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
              </label>

              <div 
                className="flex-1 flex items-center justify-between cursor-pointer"
                onClick={() => setOpen(isOpen ? null : trace.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isOpen ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                      {root.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] font-mono text-zinc-500">ID: {trace.id.slice(0, 8)}</span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                        <Clock size={12} className="text-zinc-600" />
                        {rootDurationMs.toFixed(2)}ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {trace.slow && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20">
                      <AlertCircle size={10} /> SLOW
                    </span>
                  )}
                  {hasError && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <AlertCircle size={10} /> ERROR
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Content Area */}
            {isOpen && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-4" />
                
                {/* View Switcher Control */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex p-1 bg-black/40 rounded-xl border border-zinc-800">
                    <button
                      onClick={() => setView("tree")}
                      className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all
                        ${view === "tree" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                      <ListTree size={14} /> Tree
                    </button>
                    <button
                      onClick={() => setView("flame")}
                      className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all
                        ${view === "flame" ? "bg-orange-500/20 text-orange-500 shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                      <Flame size={14} /> Flame
                    </button>
                  </div>
                </div>

                {/* Main Data Visualization */}
                <div className="rounded-xl bg-black/30 border border-zinc-800/50 p-4 mb-4">
                  {view === "tree" ? (
                    <SpanTree node={root} />
                  ) : rootDurationMs > 0 ? (
                    <FlameGraph node={root} rootDuration={rootDurationMs} />
                  ) : (
                    <div className="py-10 text-center text-zinc-600 italic">No duration data available</div>
                  )}
                </div>

                {/* AI Explanation Section */}
                <div className="rounded-xl bg-indigo-500/5 border border-indigo-500/10 p-4">
                  <TraceExplain trace={trace} />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {showCompare && selected.length === 2 && (
        <TraceCompare
          a={selected[0]}
          b={selected[1]}
          onClose={() => setShowCompare(false)}
        />
      )}
    </div>
  );
}