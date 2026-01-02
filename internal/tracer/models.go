package tracer

import "time"

type Trace struct {
	ID    string  `json:"id"`
	Spans []*Span `json:"spans"`

	// ⚡ marks entire request as slow
	Slow bool `json:"slow"`
}

type Span struct {
	ID        string        `json:"id"`
	TraceID  string        `json:"traceId"`
	ParentID string        `json:"parentId,omitempty"`
	Name      string        `json:"name"`
	Start     time.Time     `json:"start"`
	Duration  time.Duration `json:"duration"`

	Slow  bool   `json:"slow"`
	Error string `json:"error,omitempty"`
}
