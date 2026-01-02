export type Span = {
  id: string
  traceId: string
  parentId?: string
  name: string
  duration: string
  slow: boolean
  error?: string
}

export type Trace = {
  id: string
  slow: boolean
  spans: Span[]
}
