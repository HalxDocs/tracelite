package main

import (
	"log"
	"net/http"

	"github.com/HalxDocs/tracelite/internal/tracer"
	ws "github.com/HalxDocs/tracelite/internal/websocket"
)

func main() {
	// WebSocket hub
	hub := ws.NewHub()

	// HTTP mux
	mux := http.NewServeMux()

	// WebSocket endpoint
	mux.HandleFunc("/ws", hub.Handle)

	// Test API (with child span + panic safety)
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		ctx, span := tracer.Start(r.Context(), "handler.ping")
		defer tracer.End(span)
		defer tracer.Recover(span)

		// attach updated context
		r = r.WithContext(ctx)

		// simulate work
		for i := 0; i < 1e7; i++ {
		}

		w.Write([]byte("pong"))
	})

	// Wrap mux with tracer middleware (ROOT SPAN)
	handler := tracer.Middleware(hub)(mux)

	log.Println("🚀 TraceLite backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
