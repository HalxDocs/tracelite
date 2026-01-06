export type SpanDiffStatus =
  | "unchanged"
  | "slower"
  | "faster"
  | "added"
  | "removed"

export type SpanDiff = {
  id: string
  name: string
  baseDuration?: number
  newDuration?: number
  delta?: number
  status: SpanDiffStatus
  children?: SpanDiff[]
}
