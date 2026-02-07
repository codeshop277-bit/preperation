# Publisher Subscriber model
This video introduces the Publisher-Subscriber (Pub/Sub) model — a foundational pattern for event-driven architectures and microservices. It explains how Pub/Sub enables loose coupling between services using asynchronous messaging, contrasting it with synchronous request-response models. Gaurav uses simple examples to show why Pub/Sub is powerful for scalability and resilience but comes with trade-offs in consistency.
Key Points & Structure
Problem with Synchronous Request-Response (0:00–1:00)
In microservices, a client request to Service S1 often cascades: S1 calls S0 and S2 synchronously.
S1 blocks and waits for responses.
If downstream services (e.g., S2) are slow/down, the whole chain suffers timeouts/delays → poor user experience.
Retries can cause duplicates/stale data.
Tight coupling: Services depend directly on each other.
Introducing Asynchronous Events & Pub/Sub (0:49–3:04)
Shift to fire-and-forget: Publisher (e.g., S1) emits an event to a message broker (Kafka, RabbitMQ, AWS SNS/SQS).
Broker routes the event to all subscribers (S0, S2, etc.) asynchronously.
Publisher returns success immediately → client gets fast response.
Broker handles persistence, retries, and delivery guarantees (at-least-once semantics).
Advantages of Pub/Sub (3:04–5:45)
Decoupling — Publishers don't know/care about subscribers (and vice versa).
Easy scaling — Add new subscribers (e.g., analytics service) without touching publishers.
Resilience — Turns many failure points into one (the broker), which is easier to make highly available.
Flexibility — Logic moves to services or broker; supports dynamic topologies.
Real-world fit: Notifications, analytics, feeds (e.g., Twitter/X tweet propagation).
Drawbacks & Challenges (5:45–10:22)
No strong consistency — Events process asynchronously → eventual consistency only.
Example: Financial transfer (deduct funds + charge commission). Out-of-order processing or failures → inconsistent state (e.g., money deducted but transfer failed).
Idempotency required — Brokers may redeliver messages (duplicates). Consumers must handle repeats safely (use unique request IDs).
Added complexity & overhead — Extra infrastructure (broker), latency from messaging layer, learning/maintenance cost.
Not for transactional systems — Avoid in banking/inventory where atomicity is critical (use sagas/2PC instead).
Conclusion & Takeaways (10:22–end)
Pub/Sub shines when loose coupling > strict consistency (most modern apps: social, e-commerce events, IoT).
Broker becomes critical infrastructure → make it redundant (clusters).
Foundation for event-driven systems; pairs with previous topics (SPOF, CDNs).
Real example: Twitter uses Pub/Sub heavily for tweet distribution.
Relevance to System Design & AI/GenAI Apps (2026 Context)
In microservices-heavy backends (FastAPI + Kubernetes), Pub/Sub decouples components like user signup → email service, analytics, vector DB indexing.
For GenAI: Publish "new document ingested" events → trigger embedding generation, RAG index updates, notification agents.
Tools like Kafka (high-throughput), RabbitMQ (simple queues), or cloud-native (GCP Pub/Sub, AWS EventBridge) are standard.
Interview gold: "Design Twitter/Instagram feed" or "Notification system" → Pub/Sub is almost always the answer for fan-out.
Trade-off reminder: Use when you can tolerate eventual consistency; combine with idempotency + out-of-order handling.

# Event Driven System
The video explains Event-Driven Systems/Architecture (EDA) — where components communicate asynchronously by producing and consuming immutable events (representing state changes) via an event bus or log, rather than direct synchronous calls. It emphasizes persistence of events, decoupling, replayability for resilience/debugging, and contrasts with request-response models. Gaurav ties it to real systems and patterns like Event Sourcing.
Key Points & Structure
Introduction to Event-Driven Systems (~0:00–1:17)
Services emit events when state changes (e.g., "user signed up", "order placed").
Producers publish to an event bus (Kafka, RabbitMQ, etc.); subscribers consume asynchronously.
No direct dependencies → loose coupling.
Real-World Examples (~1:17–3:42)
Git: Commits are events that propagate changes.
React/Node.js: Event loops drive UI/state updates.
Gaming (e.g., Counter-Strike/FPS games): Player actions (headshots, movements) are timestamped events. Server replays events to resolve latency disputes or rewind states for fairness.
Core Mechanics (~3:42–6:14)
Events are immutable and persisted (in a durable log/queue).
Subscribers store/process events locally; can replay from history.
Enables self-healing (replay missed events on restart) and state reconstruction.
Advantages (~4:09–9:00)
Decoupling — Services independent; add new consumers without changes.
High Availability — Downstream failures don't block upstream (events queue up).
Replayability — Debug bugs, recover state, audit trails, or bootstrap new services by replaying history.
Smooth Scaling/Replacement — New version of a service replays events to catch up.
Idempotency & Retries — At-least-once delivery with retries; preserves intent ("why" a change happened).
Rollback — Rewind to prior state by replaying up to a point.
Delivery Semantics (~7:30–9:00)
At-most-once (fire-and-forget, e.g., welcome email).
At-least-once (retry until success, e.g., critical invoices).
Drawbacks & Challenges (~9:00–12:32)
Eventual Consistency — Services may temporarily diverge.
Observability — Hard to trace event flows/dependencies.
Complexity — Unpredictable side effects on replay (e.g., time-sensitive external APIs).
No Fine Control — Timing/routing less predictable than direct calls.
Security — Risk of leaking sensitive data in events.
Hard to Exit — Once deeply event-driven, switching back is tough.
When to Use It (~12:32–end)
Ideal for high-availability, audit-heavy, or reactive systems (social feeds, notifications, CI/CD, trading).
Avoid for strict ACID transactions or synchronous needs.
Related patterns: Event Sourcing (state from events), CQRS.
Relevance to System Design & GenAI Apps (2026 Context)
EDA is everywhere in modern backends: Kafka for event streaming in microservices.
In GenAI: Publish "document processed" → trigger embedding, index update, agent notification; or "user query logged" → analytics/feedback loop.
Pairs with Pub/Sub: Pub/Sub is the messaging primitive; EDA adds persistence + replay.