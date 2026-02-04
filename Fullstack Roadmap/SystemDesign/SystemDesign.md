1. System Design Fundamentals (HLD Core)
Must Know Concepts
Functional vs Non-functional requirements
Capacity estimation (RPS, storage, bandwidth)
Horizontal vs Vertical scaling
Stateless vs Stateful services
Monolith vs Microservices
REST vs GraphQL vs gRPC
API Gateway
Load Balancer
Reverse Proxy
Caching (Client / CDN / App / DB)
CDN
CAP Theorem
ACID vs BASE
Strong vs Eventual Consistency
Idempotency
Rate limiting (concept)
Circuit breaker (concept)

# Frequently Asked HLD Questions
How do you approach system design?
Design a URL shortener.
Design a rate limiter.
What happens if traffic increases 10x?
How do you scale to 1M users?
SQL vs NoSQL — when and why?
How does load balancing work?
How does caching improve performance?

# 🌐 2. Web & Frontend System Design
Must Know Topics
Browser & Rendering
Critical Rendering Path
Event Loop
Reflow & Repaint
Hydration
Memory leaks

Rendering Strategies
CSR
SSR
SSG
ISR
Edge rendering

Performance
Code splitting
Tree shaking
Lazy loading
Bundle optimization
Web workers
Service workers
HTTP/1 vs HTTP/2 vs HTTP/3

Frontend Architecture
Large React app structuring
Global state design
Server state vs Client state
Caching strategies
Feature modularization
Microfrontend architecture
Module Federation basics

Frequently Asked Frontend HLD Questions
How do you reduce React initial load time?
SSR vs CSR — tradeoffs?
How to structure a large frontend app?
How to support 1M concurrent users?
How to share state between microfrontends?
How to avoid duplicate bundles in MFEs?
Design a scalable dashboard.

# 3. Database & Storage Design
Must Know Topics
SQL
Indexing (B-Tree)
Composite indexes
Query optimization
Transactions
Isolation levels
Connection pooling

NoSQL
Key-value vs Document vs Column
Denormalization
Data modeling tradeoffs

Scaling
Sharding
Replication
Read replicas
Leader-Follower model
Partitioning
Data migration

Frequently Asked DB Questions
How do you scale a relational DB?
What if the primary DB fails?
How does indexing improve performance?
When to choose NoSQL?
Explain sharding.
What are isolation levels?

# 4. Distributed Systems Essentials
Must Know Topics
Event-driven architecture
Pub/Sub
Message queues
At-least-once vs Exactly-once
Retry strategies
Backpressure
Dead letter queues
Distributed caching
Consistent hashing
Failure handling

Frequently Asked Distributed Questions
Design a real-time chat system.
Design a notification system.
How do you guarantee message delivery?
How do you handle partial failures?
What is eventual consistency?
Design a scalable feed system.

# 5. Most Repeated System Design Problems
You must practice these:
URL Shortener
Twitter Feed
Instagram
WhatsApp / Chat system
Notification system
File upload system (large files)
Search autocomplete
Rate limiter
Analytics system
Payment Gateway
Distributed cache

# 6. Low Level Design (LLD)
Core Principles
SOLID
Clean Architecture
Composition over inheritance
Dependency Injection
Interface segregation
Design Patterns
Factory
Strategy
Observer
Singleton
Builder
Adapter
Decorator

Frequently Asked LLD Questions
Design Parking Lot
Design Vending Machine
Design Elevator
Design Tic Tac Toe
Design Splitwise
Design Logging framework
Design LRU Cache
Design Rate limiter class
Design Notification service

# 7. Capacity Estimation (Critical Skill)
Be comfortable estimating:
Requests per second
Storage per day/year
Server count
Cache size
Bandwidth
Example prompts:
10M users, 20% active daily — estimate infra.
Each user uploads 2MB daily — storage for 1 year?