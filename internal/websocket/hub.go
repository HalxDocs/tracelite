package websocket

import (
	"encoding/json"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

const defaultReplaySize = 50 // keep last 50 traces

type Hub struct {
	clients map[*websocket.Conn]bool
	replay  []any
	maxSize int
	mu      sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		clients: make(map[*websocket.Conn]bool),
		replay:  make([]any, 0, defaultReplaySize),
		maxSize: defaultReplaySize,
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (h *Hub) Handle(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	h.mu.Lock()
	h.clients[conn] = true

	// 🔁 REPLAY HISTORY TO NEW CLIENT
	for _, item := range h.replay {
		data, _ := json.Marshal(item)
		_ = conn.WriteMessage(websocket.TextMessage, data)
	}

	h.mu.Unlock()
}

func (h *Hub) Broadcast(v any) {
	data, _ := json.Marshal(v)

	h.mu.Lock()
	defer h.mu.Unlock()

	// 🔁 STORE IN REPLAY BUFFER
	if len(h.replay) >= h.maxSize {
		h.replay = h.replay[1:] // drop oldest
	}
	h.replay = append(h.replay, v)

	for conn := range h.clients {
		if err := conn.WriteMessage(websocket.TextMessage, data); err != nil {
			conn.Close()
			delete(h.clients, conn)
		}
	}
}
