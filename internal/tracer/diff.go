package tracer

/*
Tree-based diff for traces.
This preserves parent → child relationships
and enables proper UI + flame diff later.
*/

type SpanDiffStatus string

const (
	Unchanged SpanDiffStatus = "unchanged"
	Slower    SpanDiffStatus = "slower"
	Faster    SpanDiffStatus = "faster"
	Added     SpanDiffStatus = "added"
	Removed   SpanDiffStatus = "removed"
)

type SpanDiff struct {
	ID           string         `json:"id"`
	Name         string         `json:"name"`
	BaseDuration *int64         `json:"baseDuration,omitempty"`
	NewDuration  *int64         `json:"newDuration,omitempty"`
	Delta        *int64         `json:"delta,omitempty"`
	Status       SpanDiffStatus `json:"status"`
	Children     []*SpanDiff    `json:"children,omitempty"`
}

/*
DiffTraces performs a hierarchical diff between
two traces and returns a tree of SpanDiffs.
*/
func DiffTraces(base, next *Trace) []*SpanDiff {
	if base == nil || next == nil {
		return nil
	}

	baseRoots := buildSpanTree(base.Spans)
	nextRoots := buildSpanTree(next.Spans)

	visited := make(map[string]bool)
	var diffs []*SpanDiff

	for id, baseNode := range baseRoots {
		if nextNode, ok := nextRoots[id]; ok {
			diffs = append(diffs, diffNode(baseNode, nextNode))
			visited[id] = true
		} else {
			diffs = append(diffs, removedNode(baseNode))
			visited[id] = true
		}
	}

	for id, nextNode := range nextRoots {
		if !visited[id] {
			diffs = append(diffs, addedNode(nextNode))
		}
	}

	return diffs
}

/* ------------------ TREE BUILDING ------------------ */

type spanNode struct {
	span     *Span
	children []*spanNode
}

func buildSpanTree(spans []*Span) map[string]*spanNode {
	nodes := make(map[string]*spanNode)
	roots := make(map[string]*spanNode)

	for _, s := range spans {
		nodes[s.ID] = &spanNode{span: s}
	}

	for _, node := range nodes {
		if node.span.ParentID != "" {
			if parent, ok := nodes[node.span.ParentID]; ok {
				parent.children = append(parent.children, node)
				continue
			}
		}
		roots[node.span.ID] = node
	}

	return roots
}

/* ------------------ DIFF ENGINE ------------------ */

func diffNode(base, next *spanNode) *SpanDiff {
	baseDur := base.span.Duration.Microseconds()
	nextDur := next.span.Duration.Microseconds()
	delta := nextDur - baseDur

	status := Unchanged
	if delta > 0 {
		status = Slower
	} else if delta < 0 {
		status = Faster
	}

	diff := &SpanDiff{
		ID:           base.span.ID,
		Name:         base.span.Name,
		BaseDuration: ptr(baseDur),
		NewDuration:  ptr(nextDur),
		Delta:        ptr(delta),
		Status:       status,
	}

	visited := make(map[string]bool)

	for _, baseChild := range base.children {
		found := false
		for _, nextChild := range next.children {
			if baseChild.span.ID == nextChild.span.ID {
				diff.Children = append(diff.Children, diffNode(baseChild, nextChild))
				visited[nextChild.span.ID] = true
				found = true
				break
			}
		}
		if !found {
			diff.Children = append(diff.Children, removedNode(baseChild))
		}
	}

	for _, nextChild := range next.children {
		if !visited[nextChild.span.ID] {
			diff.Children = append(diff.Children, addedNode(nextChild))
		}
	}

	return diff
}

func addedNode(node *spanNode) *SpanDiff {
	dur := node.span.Duration.Microseconds()
	diff := &SpanDiff{
		ID:          node.span.ID,
		Name:        node.span.Name,
		NewDuration: ptr(dur),
		Status:      Added,
	}

	for _, child := range node.children {
		diff.Children = append(diff.Children, addedNode(child))
	}

	return diff
}

func removedNode(node *spanNode) *SpanDiff {
	dur := node.span.Duration.Microseconds()
	diff := &SpanDiff{
		ID:           node.span.ID,
		Name:         node.span.Name,
		BaseDuration: ptr(dur),
		Status:       Removed,
	}

	for _, child := range node.children {
		diff.Children = append(diff.Children, removedNode(child))
	}

	return diff
}

/* ------------------ UTILS ------------------ */

func ptr[T any](v T) *T {
	return &v
}
