import type { SpanNode } from "~/utils/spanTree"
import type { SpanDiff } from "~/types/diff"

type FlameNode = SpanNode | SpanDiff

type Props = {
  node: FlameNode
  rootDuration: number
  depth?: number
  mode?: "normal" | "diff"
}

export function FlameGraph({
  node,
  rootDuration,
  depth = 0,
  mode = "normal",
}: Props) {
  const duration = getDuration(node, mode)

  const width =
    rootDuration > 0
      ? Math.max((duration / rootDuration) * 100, 2)
      : 2

  return (
    <div className="mb-1 relative group">
      <div
        className="flex items-center"
        style={{ marginLeft: depth * 12 }}
      >
        {/* Flame Bar */}
        <div
          className={`h-6 rounded px-2 text-xs flex items-center truncate font-medium cursor-default
            ${getColor(node, mode)}`}
          style={{ width: `${width}%` }}
        >
          <span className="truncate">{node.name}</span>

          <span className="ml-2 opacity-70">
            {ms(duration)}
          </span>

          {/* % Regression Label */}
          {mode === "diff" &&
            isSpanDiff(node) &&
            node.baseDuration &&
            node.newDuration && (
              <span className="ml-2 text-[10px] font-bold opacity-80">
                {percent(node.baseDuration, node.newDuration)}
              </span>
            )}
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute z-50 hidden group-hover:block top-full left-0 mt-1 w-max max-w-xs rounded-lg bg-black border border-zinc-800 px-3 py-2 text-[11px] text-zinc-300 shadow-xl">
        <div className="font-bold text-white mb-1">
          {node.name}
        </div>

        {mode === "diff" && isSpanDiff(node) ? (
          <>
            <div>Base: {ms(node.baseDuration ?? 0)}</div>
            <div>Current: {ms(node.newDuration ?? 0)}</div>
            <div className="font-bold mt-1">
              Δ {ms(node.delta ?? 0)}
            </div>
          </>
        ) : (
          <div>Duration: {ms(Number((node as SpanNode).duration))}</div>
        )}
      </div>

      {/* Children */}
      {getChildren(node).map((child) => (
        <FlameGraph
          key={child.id}
          node={child}
          rootDuration={rootDuration}
          depth={depth + 1}
          mode={mode}
        />
      ))}
    </div>
  )
}

/* ---------------- helpers ---------------- */

function isSpanDiff(node: FlameNode): node is SpanDiff {
  return "status" in node
}

function getDuration(node: FlameNode, mode: Props["mode"]) {
  if (mode === "diff" && isSpanDiff(node)) {
    return node.newDuration ?? node.baseDuration ?? 0
  }

  return Number((node as SpanNode).duration)
}

function getChildren(node: FlameNode): FlameNode[] {
  if ("children" in node && node.children) {
    return node.children as FlameNode[]
  }
  return []
}

function ms(v: number) {
  return `${(v / 1_000_000).toFixed(1)}ms`
}

function percent(base: number, next: number) {
  const value = ((next - base) / base) * 100
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

function getColor(node: FlameNode, mode: Props["mode"]) {
  if (mode !== "diff" || !isSpanDiff(node)) {
    return "bg-orange-500 text-black"
  }

  switch (node.status) {
    case "slower":
      return "bg-red-500/80 text-black"
    case "faster":
      return "bg-emerald-500/80 text-black"
    case "added":
      return "bg-blue-500/80 text-black"
    case "removed":
      return "bg-zinc-700 text-zinc-300"
    default:
      return "bg-zinc-500/40 text-zinc-200"
  }
}
