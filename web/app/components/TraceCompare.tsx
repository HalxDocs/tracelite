import { useState } from "react"
import { X, ArrowRightLeft, Flame, ListTree } from "lucide-react"
import type { Trace } from "~/types/tracer"
import { diffTrees } from "~/utils/traceDiff"
import { TraceTreeDiff } from "~/components/TraceTreeDiff"
import { FlameGraph } from "~/components/FlameGraph"

type TraceCompareProps = {
  baseline: Trace
  current: Trace
  onClose: () => void
}

export function TraceCompare({
  baseline,
  current,
  onClose,
}: TraceCompareProps) {
  const [view, setView] = useState<"tree" | "flame">("tree")

  const diffs = diffTrees(baseline.spans, current.spans)

  // Root duration for flame diff scaling
  const rootDuration =
    diffs[0]?.newDuration ??
    diffs[0]?.baseDuration ??
    1

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-950 w-full max-w-4xl max-h-[85vh] rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Trace Comparison
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                Baseline {baseline.id.slice(0, 8)} → Current{" "}
                {current.id.slice(0, 8)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* View Switch */}
        <div className="px-6 pt-4">
          <div className="inline-flex p-1 bg-black/40 rounded-xl border border-zinc-800">
            <button
              onClick={() => setView("tree")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all
                ${
                  view === "tree"
                    ? "bg-zinc-800 text-white shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              <ListTree size={14} /> Tree
            </button>

            <button
              onClick={() => setView("flame")}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all
                ${
                  view === "flame"
                    ? "bg-orange-500/20 text-orange-500 shadow"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
            >
              <Flame size={14} /> Flame
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {diffs.length === 0 ? (
            <div className="text-center text-zinc-500 italic py-20">
              No differences detected
            </div>
          ) : view === "tree" ? (
            <TraceTreeDiff diffs={diffs} />
          ) : (
            <div className="space-y-2">
              {diffs.map((diff) => (
                <FlameGraph
                  key={diff.id}
                  node={diff}
                  rootDuration={rootDuration}
                  mode="diff"
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500 tracking-wide uppercase font-medium">
            Red = regression • Green = improvement • Blue = new • Gray = removed
          </p>
        </div>
      </div>
    </div>
  )
}
