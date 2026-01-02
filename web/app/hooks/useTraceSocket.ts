import { useEffect, useState } from "react"
import type { Trace } from "~/types/tracer"

const WS_URL = "ws://localhost:8080/ws"

export function useTraceSocket() {
  const [traces, setTraces] = useState<Trace[]>([])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)

    ws.onmessage = (event) => {
      const trace: Trace = JSON.parse(event.data)

      setTraces((prev) => {
        // newest on top
        return [trace, ...prev].slice(0, 100)
      })
    }

    return () => ws.close()
  }, [])

  return traces
}
