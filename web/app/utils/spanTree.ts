import type { Span } from "~/types/tracer"

export type SpanNode = Span & { children: SpanNode[] }

export function buildSpanTree(spans: Span[]): SpanNode | null {
  const map = new Map<string, SpanNode>()

  spans.forEach((span) => {
    map.set(span.id, { ...span, children: [] })
  })

  let root: SpanNode | null = null

  map.forEach((node) => {
    if (!node.parentId) {
      root = node
    } else {
      const parent = map.get(node.parentId)
      parent?.children.push(node)
    }
  })

  return root
}
