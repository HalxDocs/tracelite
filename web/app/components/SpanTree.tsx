import type { SpanNode } from "~/utils/spanTree";
import { AlertCircle, Bug, ChevronRight } from "lucide-react";

export function SpanTree({ node, level = 0 }: { node: SpanNode; level?: number }) {
  const durationMs = Number(node.duration) / 1_000_000;
  
  return (
    <div className="relative">
      {/* The Row */}
      <div className="group relative flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-zinc-800/40 transition-colors">
        
        {/* Indentation & Thread Lines */}
        {level > 0 && (
          <div 
            className="absolute border-l border-b border-zinc-700 rounded-bl-xl"
            style={{ 
              left: `calc(${level * 1.25}rem - 0.75rem)`, 
              width: "0.75rem", 
              height: "1.25rem",
              top: "-0.5rem" 
            }}
          />
        )}

        {/* Content Container */}
        <div 
          className="flex flex-1 items-center gap-3"
          style={{ marginLeft: level * 20 }}
        >
          {/* Status Icon */}
          <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${
            node.error ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : 
            node.slow ? "bg-amber-500" : "bg-indigo-500/40"
          }`} />

          {/* Span Label */}
          <span className={`text-sm font-mono tracking-tight transition-colors ${
            node.error ? "text-red-400" : "text-zinc-200 group-hover:text-indigo-300"
          }`}>
            {node.name}
          </span>

          {/* Duration Badge */}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500">
            {durationMs.toFixed(2)} ms
          </span>

          {/* Badges */}
          <div className="flex gap-1.5 ml-auto">
            {node.slow && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <AlertCircle size={12} />
                LATE
              </div>
            )}
            {node.error && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-100 bg-red-600 px-2 py-0.5 rounded shadow-lg shadow-red-900/20">
                <Bug size={12} />
                FAIL
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children Container */}
      <div className="relative">
        {/* Vertical Thread Line for deep nesting */}
        {node.children.length > 0 && (
          <div 
            className="absolute left-0 border-l border-zinc-800/50" 
            style={{ 
              left: `calc(${(level + 1) * 1.25}rem - 0.75rem)`, 
              top: 0, 
              bottom: "1rem" 
            }} 
          />
        )}
        
        {node.children.map((child) => (
          <SpanTree key={child.id} node={child} level={level + 1} />
        ))}
      </div>
    </div>
  );
}