TraceLite

See what your backend is doing — live.

TraceLite is a local-first backend tracing tool that shows you how every request moves through your code, step by step, in real time.

No guessing.
No log digging.
Just a clear picture of what’s slow, what broke, and why.

🧠 What is TraceLite?

Imagine your backend is a black box.

Requests go in.
Responses come out.
And inside… nobody really knows what happened.

TraceLite turns that black box into a story you can see.

Every request becomes a trace.
Every step becomes a span.
Everything is streamed live to a dashboard.

🧩 Important words (explained simply)
Request

A request is when someone asks your server to do something.

Example:

GET /ping


Think of it like knocking on a door.

Trace

A trace is the full story of one request.

It answers:

When did it start?

What steps happened?

How long did everything take?

Span

A span is one step inside a trace.

If the trace is “Making a sandwich”, then spans are:

slicing bread

spreading mayo

adding meat

Spans can have children, forming a tree.

⚙️ How TraceLite works (big picture)

A request enters your backend

TraceLite middleware creates a trace

Your code creates spans

The request finishes

The full trace is sent over WebSocket

The dashboard shows it instantly

That’s it.

🛠 How to use TraceLite in a backend (Go)
1️⃣ Add the middleware

Wrap your HTTP server once.

handler := tracer.Middleware(hub)(mux)
http.ListenAndServe(":8080", handler)


Now every request is traced automatically.

2️⃣ Create spans in your handlers

Spans mark important steps in your code.

func handler(w http.ResponseWriter, r *http.Request) {
    ctx, span := tracer.Start(r.Context(), "handler.work")
    defer tracer.End(span)

    time.Sleep(200 * time.Millisecond)

    w.Write([]byte("ok"))
}


Each Start / End pair becomes a visible step.

🌍 Using TraceLite when hosted

Your backend runs like a normal server.

Example:

https://tracelite-1.onrender.com


Every request (like /ping) automatically creates a trace.

Traces are streamed live over WebSocket:

wss://tracelite-1.onrender.com/ws


Any frontend (or tool) listening to this WebSocket will receive traces in real time.

🖥 What the dashboard shows

Timeline – each request as a card

Tree view – parent → child execution

Flame graph – where time was spent

Slow badges – performance problems

Error markers – crashes

Compare view – what changed between two requests

Explanation panel – plain-English summaries

❌ What TraceLite does NOT do

No cloud lock-in

No agents

No vendor accounts

No hidden data collection

You own your data.

🎯 When should you use TraceLite?

Your API feels slow

Logs are noisy and confusing

You don’t know where time is going

You want to understand a new codebase

You want visual debugging instead of guessing

🧱 Tech stack

Backend: Go, net/http, WebSockets

Frontend: React, React Router / Remix, Tailwind

Transport: WebSocket (real-time streaming)

🚧 Status

This is v0.1.

TraceLite is:

production-capable for local and internal use

intentionally simple

designed to grow

Planned for v2:

sampling

limits

auth

export

plugins

🏁 One-sentence summary

TraceLite turns backend execution into a live, visual story so you can instantly see what’s slow and why.

DO NOT FORGET TO STAR - THANKS
