package tracer

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type spanKeyType string

const spanKey spanKeyType = "active-span"

func Start(ctx context.Context, name string) (context.Context, *Span) {
	trace := FromContext(ctx)
	if trace == nil {
		return ctx, nil
	}

	parent, _ := ctx.Value(spanKey).(*Span)

	span := &Span{
		ID:       uuid.NewString(),
		TraceID: trace.ID,
		Name:     name,
		Start:    time.Now(),
	}

	if parent != nil {
		span.ParentID = parent.ID
	}

	trace.Spans = append(trace.Spans, span)

	ctx = context.WithValue(ctx, spanKey, span)
	return ctx, span
}

func End(span *Span) {
	if span == nil {
		return
	}

	span.Duration = time.Since(span.Start)

	// ⚡ Slow span detection
	if span.Duration > SlowThreshold {
		span.Slow = true
	}
}
