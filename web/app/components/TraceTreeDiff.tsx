import type { SpanDiff } from "~/types/diff"

export function TraceTreeDiff({ diffs }: { diffs: SpanDiff[] }) {
  return (
    <div className="space-y-1">
      {diffs.map(d => (
        <DiffNode key={d.id} node={d} depth={0} />
      ))}
    </div>
  )
}

function DiffNode({ node, depth }: { node: SpanDiff; depth: number }) {
  return (
    <div>
      <div
        className={`flex justify-between items-center text-sm px-2 py-1 rounded border
          ${color(node.status)}`}
        style={{ marginLeft: depth * 12 }}
      >
        <span className="font-medium">{node.name}</span>
        <span className="tabular-nums text-xs">
          {render(node)}
        </span>
      </div>

      {node.children?.map(c => (
        <DiffNode key={c.id} node={c} depth={depth + 1} />
      ))}
    </div>
  )
}

function render(d: SpanDiff) {
  if (d.status === "added") return "NEW"
  if (d.status === "removed") return "REMOVED"
  return `${ms(d.newDuration)} ms (${d.delta! > 0 ? "+" : ""}${ms(d.delta)} ms)`
}

function ms(v?: number) {
  if (v == null) return "-"
  return (v / 1_000_000).toFixed(2)
}

function color(s: string) {
  switch (s) {
    case "slower":
      return "border-red-500 bg-red-500/10 text-red-400"
    case "faster":
      return "border-emerald-500 bg-emerald-500/10 text-emerald-400"
    case "added":
      return "border-blue-500 bg-blue-500/10 text-blue-400"
    case "removed":
      return "border-zinc-700 bg-zinc-900 text-zinc-500"
    default:
      return "border-zinc-800 bg-zinc-900 text-zinc-300"
  }
}
