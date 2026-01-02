import type { Trace, Span } from "~/types/tracer"

function toMs(v: number | string) {
  return Number(v) / 1_000_000
}

export type SpanDiff = {
  name: string
  a: number
  b: number
  delta: number
}

export function compareTraces(a: Trace, b: Trace): SpanDiff[] {
  const mapA = new Map<string, Span>()
  const mapB = new Map<string, Span>()

  a.spans.forEach((s) => mapA.set(s.name, s))
  b.spans.forEach((s) => mapB.set(s.name, s))

  const names = new Set([...mapA.keys(), ...mapB.keys()])

  const diffs: SpanDiff[] = []

  names.forEach((name) => {
    const sa = mapA.get(name)
    const sb = mapB.get(name)

    const aMs = sa ? toMs(sa.duration) : 0
    const bMs = sb ? toMs(sb.duration) : 0

    diffs.push({
      name,
      a: aMs,
      b: bMs,
      delta: bMs - aMs,
    })
  })

  return diffs.sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta))
}
