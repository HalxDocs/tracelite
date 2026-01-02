import { X, ArrowRightLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Trace } from "~/types/tracer";
import { compareTraces } from "~/utils/compareTraces";

export function TraceCompare({ a, b, onClose }: { a: Trace; b: Trace; onClose: () => void }) {
  const diffs = compareTraces(a, b);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-950 w-full max-w-3xl max-h-[85vh] rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Trace Comparison</h2>
              <p className="text-xs text-zinc-500 font-mono">Comparing: {a.id.slice(0,8)} vs {b.id.slice(0,8)}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Diff Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-12 gap-4 mb-4 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <div className="col-span-6">Span Identity</div>
            <div className="col-span-2 text-right">Base (A)</div>
            <div className="col-span-2 text-right">Target (B)</div>
            <div className="col-span-2 text-right">Variance</div>
          </div>

          <div className="space-y-1">
            {diffs.map((d) => {
              const isSlower = d.delta > 0;
              const isFaster = d.delta < 0;

              return (
                <div 
                  key={d.name} 
                  className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-zinc-900/50 border border-transparent hover:border-zinc-800 transition-all group"
                >
                  {/* Span Name */}
                  <div className="col-span-6">
                    <p className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate">
                      {d.name}
                    </p>
                  </div>

                  {/* Timing A */}
                  <div className="col-span-2 text-right font-mono text-sm text-zinc-400">
                    {d.a.toFixed(2)}<span className="text-[10px] ml-0.5">ms</span>
                  </div>

                  {/* Timing B */}
                  <div className="col-span-2 text-right font-mono text-sm text-zinc-400">
                    {d.b.toFixed(2)}<span className="text-[10px] ml-0.5">ms</span>
                  </div>

                  {/* Delta Variance */}
                  <div className="col-span-2 flex justify-end items-center gap-1.5">
                    <span className={`text-sm font-bold font-mono ${
                      isSlower ? "text-red-400" : isFaster ? "text-emerald-400" : "text-zinc-600"
                    }`}>
                      {isSlower && "+"}
                      {d.delta.toFixed(2)}
                    </span>
                    {isSlower ? (
                      <TrendingUp size={14} className="text-red-500/50" />
                    ) : isFaster ? (
                      <TrendingDown size={14} className="text-emerald-500/50" />
                    ) : (
                      <Minus size={14} className="text-zinc-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500 tracking-wide uppercase font-medium">
            Positive values indicate <span className="text-red-400">regression</span> • Negative values indicate <span className="text-emerald-400">improvement</span>
          </p>
        </div>
      </div>
    </div>
  );
}