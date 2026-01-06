import type { SpanDiff } from "~/types/diff"
import type { Span } from "~/types/tracer"

/**
 * Internal tree node used for diffing
 */
type Node = Span & { children: Node[] }

/**
 * Convert backend duration (string | number) to microseconds
 */
function toMicros(duration: string | number | undefined): number {
  if (!duration) return 0
  if (typeof duration === "number") return duration
  return Number(duration)
}

/**
 * Build a span tree from flat spans
 */
function buildTree(spans: Span[]): Node[] {
  const map = new Map<string, Node>()
  const roots: Node[] = []

  spans.forEach((s) => {
    map.set(s.id, { ...s, children: [] })
  })

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

/**
 * Public API:
 * Diff two traces (baseline vs current) into a tree diff
 */
export function diffTrees(base: Span[], next: Span[]): SpanDiff[] {
  const baseRoots = buildTree(base)
  const nextRoots = buildTree(next)

  const used = new Set<string>()
  const diffs: SpanDiff[] = []

  baseRoots.forEach((b) => {
    const n = nextRoots.find((x) => x.id === b.id)
    if (n) {
      diffs.push(diffNode(b, n))
      used.add(b.id)
    } else {
      diffs.push(removedNode(b))
    }
  })

  nextRoots.forEach((n) => {
    if (!used.has(n.id)) {
      diffs.push(addedNode(n))
    }
  })

  return diffs
}

/**
 * Diff two matching nodes recursively
 */
function diffNode(b: Node, n: Node): SpanDiff {
  const baseDur = toMicros(b.duration)
  const nextDur = toMicros(n.duration)
  const delta = nextDur - baseDur

  const status =
    delta > 0 ? "slower" : delta < 0 ? "faster" : "unchanged"

  const children: SpanDiff[] = []
  const used = new Set<string>()

  b.children.forEach((bc) => {
    const nc = n.children.find((c) => c.id === bc.id)
    if (nc) {
      children.push(diffNode(bc, nc))
      used.add(bc.id)
    } else {
      children.push(removedNode(bc))
    }
  })

  n.children.forEach((nc) => {
    if (!used.has(nc.id)) {
      children.push(addedNode(nc))
    }
  })

  return {
    id: b.id,
    name: b.name,
    baseDuration: baseDur,
    newDuration: nextDur,
    delta,
    status,
    children,
  }
}

/**
 * Node added in current trace
 */
function addedNode(n: Node): SpanDiff {
  return {
    id: n.id,
    name: n.name,
    newDuration: toMicros(n.duration),
    status: "added",
    children: n.children.map(addedNode),
  }
}

/**
 * Node removed from baseline trace
 */
function removedNode(b: Node): SpanDiff {
  return {
    id: b.id,
    name: b.name,
    baseDuration: toMicros(b.duration),
    status: "removed",
    children: b.children.map(removedNode),
  }
}
