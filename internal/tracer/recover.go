package tracer

import "fmt"

func Recover(span *Span) {
	if r := recover(); r != nil {
		if span != nil {
			span.Error = fmt.Sprintf("%v", r)
		}
	}
}
