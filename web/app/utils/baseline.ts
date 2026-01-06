import type { Trace } from "~/types/tracer"

const KEY = "tracelite:baseline"

export function saveBaseline(trace: Trace) {
  localStorage.setItem(KEY, JSON.stringify(trace))
}

export function loadBaseline(): Trace | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearBaseline() {
  localStorage.removeItem(KEY)
}
