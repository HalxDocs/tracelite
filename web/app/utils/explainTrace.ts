import type { Trace } from "~/types/tracer"

function toMs(n: number | string) {
  return Number(n) / 1_000_000
}

export function explainTrace(trace: Trace): string {
  if (!trace.spans.length) {
    return "No span data available for this request."
  }

  const root = trace.spans.find((s) => !s.parentId)
  if (!root) {
    return "Unable to determine root span."
  }

  const rootDuration = toMs(root.duration)

  const children = trace.spans.filter(
    (s) => s.parentId === root.id
  )

  if (!children.length) {
    return `The request completed in ${rootDuration.toFixed(
      2
    )} ms with no internal bottlenecks.`
  }

  const slowest = children.reduce((a, b) =>
    toMs(a.duration) > toMs(b.duration) ? a : b
  )

  const slowestMs = toMs(slowest.duration)
  const percent = ((slowestMs / rootDuration) * 100).toFixed(1)

  if (trace.slow) {
    return `This request is slow because "${slowest.name}" consumed ${percent}% of the total execution time (${slowestMs.toFixed(
      2
    )} ms).`
  }

  return `Most of the request time (${percent}%) was spent in "${slowest.name}", but overall performance is within normal range.`
}
