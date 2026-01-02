import type { SpanNode } from "~/utils/spanTree";


function ms(n: string | number) {
  return Number(n) / 1_000_000;
}

export function FlameGraph({
  node,
  rootDuration,
  level = 0,
}: {
  node: SpanNode;
  rootDuration: number;
  level?: number;
}) {
  const duration = ms(node.duration);
  // Calculate width, ensuring very small spans are still visible (min 0.5%)
  const width = Math.max((duration / rootDuration) * 100, 0.5);

  return (
    <div className="w-full">
      <div className="relative group mb-[2px]">
        {/* Interactive Bar */}
        <div
          className={`h-7 rounded-sm flex items-center transition-all duration-200 cursor-help relative overflow-hidden
            ${node.error 
              ? "bg-gradient-to-r from-red-600 to-red-500 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]" 
              : node.slow 
                ? "bg-gradient-to-r from-orange-600 to-orange-400" 
                : "bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-80 group-hover:opacity-100"
            }`}
          style={{ 
            width: `${width}%`,
            // level * 4 creates a subtle "staircase" effect for hierarchy
            filter: `brightness(${100 - (level * 5)}%)` 
          }}
        >
          {/* Label Layer */}
          <div className="sticky left-0 flex items-center px-2 w-full min-w-max">
            <span className={`text-[10px] font-bold tracking-tight truncate ${node.error ? 'text-white' : 'text-zinc-100'}`}>
              {node.name}
            </span>
            <span className="ml-2 text-[9px] font-mono opacity-80 text-black/70">
              {duration.toFixed(2)}ms
            </span>
          </div>

          {/* Glossy Overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Floating Tooltip Mockup (Title attribute for simplicity) */}
        <div className="hidden group-hover:block absolute z-20 top-full left-0 mt-1 p-2 bg-zinc-900 border border-zinc-700 rounded shadow-xl text-[11px] whitespace-nowrap pointer-events-none">
          <p className="font-bold text-white">{node.name}</p>
          <p className="text-zinc-400">Duration: {duration.toFixed(3)}ms</p>
          <p className="text-zinc-400 text-[10px]">Weight: {((duration/rootDuration)*100).toFixed(1)}% of total</p>
        </div>
      </div>

      {/* Children Container - No more margins here, they stack under the bar */}
      <div className="w-full">
        {node.children.map((child) => (
          <FlameGraph
            key={child.id}
            node={child}
            rootDuration={rootDuration}
            level={level + 1}
          />
        ))}
      </div>
    </div>
  );
}