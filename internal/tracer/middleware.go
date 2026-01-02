package tracer

import (
	"net/http"

	ws "github.com/HalxDocs/tracelite/internal/websocket"
	"github.com/google/uuid"
)

func Middleware(hub *ws.Hub) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			// 🚫 Ignore internal / noise endpoints
			switch r.URL.Path {
			case "/ws", "/favicon.ico":
				next.ServeHTTP(w, r)
				return
			}

			// Create trace
			trace := &Trace{
				ID:    uuid.NewString(),
				Spans: []*Span{},
			}

			// Inject trace into context
			ctx := WithTrace(r.Context(), trace)

			// Root span
			ctx, root := Start(ctx, r.Method+" "+r.URL.Path)

			// 🔥 Panic-safe + guaranteed cleanup
			defer func() {
				Recover(root)

				if root != nil {
					End(root)

					// ⚡ Mark whole trace as slow if root is slow
					if root.Slow {
						trace.Slow = true
					}

					// ✅ ONLY emit valid traces
					hub.Broadcast(trace)
				}
			}()

			// Continue request with updated context
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}
