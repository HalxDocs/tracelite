package tracer

import "context"

type traceKeyType string

const traceKey traceKeyType = "tracelite-trace"

func WithTrace(ctx context.Context, trace *Trace) context.Context {
	return context.WithValue(ctx, traceKey, trace)
}

func FromContext(ctx context.Context) *Trace {
	trace, _ := ctx.Value(traceKey).(*Trace)
	return trace
}
