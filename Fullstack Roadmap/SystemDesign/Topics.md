1. Vertical Scaling

Analogy:
You have one chef in a small pizza shop. As orders increase, you ask the chef to work harder — get better tools or pay them overtime — so they produce more pizzas.

System Design Meaning:
Increasing the capacity of a single server (e.g., adding more CPU, memory, or faster disks). More powerful hardware handles more load. This is vertical scaling.

Web Development Perspective:
For a web app, this means upgrading your server instance (e.g., larger AWS EC2 machine, more memory). It works up to a point but has limits — a single machine can only scale so far.

2. Preprocessing / Scheduled Work

Analogy:
When the shop is empty (like early mornings), the chef prepares dough, so later orders are faster.

System Design Meaning:
Do heavy or repetitive work during low-traffic times (e.g., background jobs, batch processing, or cron jobs) so that peak times aren’t slowed down.

Web Dev Perspective:
Use background workers (Node workers, AWS Lambda, Sidekiq, etc.) to preprocess data, precompile assets, or warm caches early so web servers are free when users are active.

3. Redundancy & Backup

Analogy:
Your only chef calls in sick — the shop collapses. So you hire a backup chef who takes over if the main chef fails.

System Design Meaning:
Add redundant servers or components so that if one fails, another continues service. This avoids single points of failure.

Web Dev Perspective:
Multiple web servers behind a load balancer, database replicas, and failover servers ensure uptime even if one instance goes down.

4. Horizontal Scaling

Analogy:
Instead of overworking one chef, hire more chefs and split orders among them.

System Design Meaning:
Add more identical machines (servers) that serve requests in parallel — this is horizontal scaling.

Web Dev Perspective:
Deploy multiple copies of your web app (e.g., in Kubernetes pods, cloud auto-scaling groups) so many users can be served simultaneously.

5. Microservices

Analogy:
Instead of one chef doing everything, specialized chefs handle pizza, garlic bread, or desserts.

System Design Meaning:
Each piece of functionality (e.g., authentication, orders, payments) lives in its own service. This lets each one scale independently and deploy separately.

Web Dev Perspective:
Instead of a single monolithic backend, your web app can use separate services for user management, orders, data storage, etc., often communicating via APIs.

6. Distributed Systems

Analogy:
Your pizza business expands to multiple locations so a single outage doesn’t shut the whole business down.

System Design Meaning:
Running systems across multiple machines or data centers so no failure can take down the entire application.

Web Dev Perspective:
Use geographically distributed servers and databases so users around the world get faster responses and outages are isolated.

7. Load Balancing

Analogy:
A dispatcher routes pizza orders to whichever shop (or chef) is least busy.

System Design Meaning:
A load balancer routes incoming traffic intelligently across multiple servers.

Web Dev Perspective:
AWS ELB, Google Cloud Load Balancers, or NGINX can distribute HTTP requests so no one server gets overwhelmed.

8. Decoupling

Analogy:
The delivery driver doesn’t need to know how the pizza is cooked — just pick it up and deliver.

System Design Meaning:
Break a system into parts with well-defined interfaces; components don’t depend directly on each other’s internal logic.

Web Dev Perspective:
Using APIs and messaging queues ensures that changes in one part of your app don’t break others.

9. Logging & Metrics

Analogy:
If deliveries are slow, you check which part of the process is slowing down (oven, driver, etc.).

System Design Meaning:
Collect detailed logs and performance metrics to trace issues, understand load, and debug problems.

Web Dev Perspective:
Tools like Prometheus, Grafana, ELK Stack, or cloud monitors help you understand app performance and failures.

10. Extensibility

Analogy:
Your pizza shop adds burgers tomorrow — if your systems are well-designed, you don’t rewrite everything to add a new menu item.

System Design Meaning:
Architect systems so they’re easy to extend with new features or modules without massive rewrites.

Web Dev Perspective:
Design your web app with plugins, feature flags, modular components — so adding new business logic is straightforward.

# Vertical Vs Horizontal Scaling
1. What System Design Is

Explanation from Video:
System design starts when you take an algorithm or piece of code and make it available to other users — not just on your computer, but over the network using an API. Your algorithm becomes a service that runs on servers accessible online.

Analogy Used:
Though not explicitly described with a story like other system-design videos, the idea is that your code is like a service provider — you don’t hand people your laptop, you expose functions via APIs so others can make requests from anywhere.

Web Dev Connection:
This is exactly what web APIs do — they let clients (browsers, mobile apps) send HTTP requests to your service to fetch data or do work.

2. Cloud vs Local Computer

Concept:
The video contrasts running your code on your personal computer versus deploying it in the cloud. The cloud gives resilience, configurability, and reliability you don’t get on a simple desktop.

Web Dev Connection:
Most real-world web applications are deployed to cloud providers (AWS, GCP, Azure), not local machines, because cloud platforms offer load balancing, auto-scaling, and global access.  
3. Vertical Scaling (Scale Up)

What It Means:
Vertical scaling means increasing the capacity of a single server — e.g., adding more CPU, RAM, or disk to it so it can serve more users.

Analogy (Implicit from Screencaps & Notes):
Think of it as making one chef stronger. If the chef is overwhelmed, you give them better tools or more energy so they can cook faster. You don’t add more chefs — you just make the one supplier better.

Web Dev Connection:
Upgrading the server your app runs on (e.g., moving from a small VPS to a beefier instance) is vertical scaling. It’s simple but limited — a single machine can only grow so big.
4. Horizontal Scaling (Scale Out)

What It Means:
Horizontal scaling means adding more servers so that the incoming requests can be handled in parallel.

Analogy (Taken from Context Around Concept):
Instead of one overwhelmed chef, you hire multiple chefs, each cooking simultaneously. An ordering system (like a dispatcher) decides which chef takes which order so all chefs are productive.

Web Dev Connection:
This is how most large systems work: multiple instances of a web app behind a load balancer serve requests concurrently. It increases overall capacity and fault tolerance.
5. Trade-offs Between Vertical and Horizontal Scaling

The video emphasizes the pros and cons of both approaches:

Vertical Scaling Pros:

Simpler setup

Fast internal communication (everything’s on one machine)

Data stays consistent easily

Vertical Scaling Cons:

Single point of failure

Limited by hardware capacity

Horizontal Scaling Pros:

Many machines means no single point of failure

Better for handling large workloads

Horizontal Scaling Cons:

Requires load balancing

Inter-machine communication adds overhead

Web Dev Connection:
When you design a web backend, you choose vertical scaling early on for simplicity, but eventually adopt horizontal scaling with load balancers and autoscaling groups to handle traffic spikes.
6. Load Balancing

Mentioned Concept:
To use multiple machines effectively, you need a load balancer — a system that routes requests to different servers.

Analogy (from surrounding context):
It’s like someone at the front of a restaurant directing customers to different chefs based on who’s free — this spreads load and prevents overload on one chef.

Web Dev Connection:
Cloud providers offer load balancers (AWS ELB/NLB, GCP Load Balancing) that distribute HTTP requests evenly across your fleet of servers.
7. High-Level vs Low-Level Design

Towards the end, the video contrasts High-Level Design (HLD) and Low-Level Design (LLD):

HLD: Big picture — components, services, data flow

LLD: Detailed implementation — classes, modules, APIs

Web Dev Connection:
When designing a web app, HLD might involve choosing microservices and CDNs, while LLD is designing your REST endpoints and database schema.

# Hashing In Load Balancer  
Setup Scenario
You have:
3 cache servers
C1
C2
C3
You store user profiles in cache.
To decide where to store a profile, you use regular hashing (modulo hashing):
server = hash(userId) % numberOfServers
So if there are 3 servers:
server = hash(userId) % 3
🔢 Step 1: How Regular Hashing Works
Assume:
hash(101) = 1001
hash(102) = 1002
hash(103) = 1003
hash(104) = 1004
Now assign them:
1001 % 3 = 2 → C2
1002 % 3 = 0 → C0
1003 % 3 = 1 → C1
1004 % 3 = 2 → C2
So:
User	Server
101	C2
102	C0
103	C1
104	C2
Everything is working fine.
Profiles are cached.
➕ Step 2: Add a New Server
Now traffic increases.
You add C3.
Now total servers = 4
The formula becomes:
server = hash(userId) % 4
Now recompute:
1001 % 4 = 1
1002 % 4 = 2
1003 % 4 = 3
1004 % 4 = 0
New mapping:
User	Old Server	New Server
101	C2	C1
102	C0	C2
103	C1	C3
104	C2	C0
🚨 Almost everyone moved.
💥 Why Almost All Keys Change
This is the core problem.
🚨 What Happens to Cache?
Now imagine real system.
Before adding server:
User 101 profile was stored in C2.
After adding server:
System now believes user 101 belongs to C1.
So when frontend requests:
GET /profile/101
System looks in:
C1
But profile is actually in:
C2
Result?
❌ Cache miss.
System goes to database.
Loads profile again.
Stores it in C2.
Cache in c1 will expire over time.
📉 Why This Causes Massive Cache Invalidation
Let’s say:
You had 10 million cached profiles.
You add one server.
~75–100% of mappings change.
So:
Cache lookup misses spike.
Database traffic explodes.
Latency increases.
System may crash under load.
Even though you added a server to improve capacity…
You just destroyed your cache efficiency.
That’s the irony.
🎯 Concrete Profile Fetch Flow
Before new server:
User → Load Balancer → App → hash(userId)%3 → C2 → Profile found → return
After new server:
User → Load Balancer → App → hash(userId)%4 → C1 → MISS
Then:
App → Database → Fetch profile → Store in C1 → Return
Now database suddenly receives millions of requests.
This is called:
🔥 Cache churn
🔥 Cold cache problem
🔥 Rehash storm
🧮 Probability View
If you had:
n servers
Add 1 server
Probability that a key stays in same bucket:
Very small.
In practice:
~ (1 / new_server_count)
Example:
3 → 4 servers
Only about 1/4 keys might accidentally remain same.
~75% keys remap.
With 100 servers → 101 servers
Almost 99% remap.
It gets worse as system grows.
🧠 Why This Is Terrible for Profile Fetching
Profiles are:
Frequently accessed
Repeatedly accessed
Often read-heavy
You depend on high cache hit rate.
If cache hit rate drops from:
95% → 10%
Your DB load increases by:
9x
And that’s how systems melt.
🏁 Final Intuition
Regular hashing:
hash(key) % n
When n changes → entire function changes.
So:
Keys shift unpredictably.
Cache becomes useless.
Database gets hammered.
That’s why consistent hashing was invented:

2. The Core Idea of Consistent Hashing
Instead of:
hash(key) % n_servers
Consistent hashing treats both keys and servers on a circular hash ring.
Each server is hashed to a position on the ring
Each key is hashed to a position on the same ring
Keys map to the next server clockwise on the ring
This means:
When a server is added → only its neighbours’ range keys shift
When a server is removed → only the keys that mapped to it are affected
This dramatically reduces the number of keys that move — typically only a small fraction, not all of them.
3. The Intuition / Analogy
While some videos have informal analogies (like people seated around a table), consistent hashing is best visualized with the ring model:
Imagine a circular scale from 0 to max hash value
Servers are dots randomly placed on this circle
“Hash(key)” gives you a point on the circle
You walk clockwise until you hit the next server
That’s where the key belongs.
This is like:
🚶‍♂️ You start walking from a position (the key) clockwise → the next chef (server) handles your order.
Only when you insert a new chef in between do the nearby orders change chefs — not all of them.
4. How Consistent Hashing Minimizes Remapping
In regular hashing:
hash(key) % n_servers
If n changes, nearly all keys change the server mapping.
In consistent hashing:
Keys far away from the added/removed server keep their original server
Only keys that belong to that server’s interval on the ring shift
Thus only ~1/N keys are remapped when one of N servers changes
This is a major improvement in scalability.
When a server is added/removed (or fails/rejoins), only a subset of requests change their mapping — not almost every one.
This keeps:
Cache hit rate high
Databases from being overloaded
Requests directed predictably
Consistent hashing isn’t just a theory — it’s used in production systems:
✔ Distributed cache systems (e.g., Memcached clusters)
✔ Distributed key-value stores (like Cassandra and Dynamo)
✔ Load balancing logic requiring sticky sessions
✔ Sharded databases where you don’t want to reshuffle data on every scale change
| Concept         | Regular Hashing        | Consistent Hashing                             |
| --------------- | ---------------------- | ---------------------------------------------- |
| Key Mapping     | `hash(key) % n`        | Hash on a ring then *nearest clockwise server* |
| Server Scaling  | Causes huge remapping  | Only nearby keys remapped                      |
| Cache Stability | Very low after scaling | High after scaling                             |
| Typical Use     | Stateless routing      | Distributed caches & sharding                  |

Let’s walk it step-by-step using:
Request: R1
Servers: S1, S2
Using consistent hashing
S1 initially owns R1
Then S1 is removed
System does:
Hash R1
Find next server clockwise
That is now S2
Check S2
MISS (because R1 was stored in S1, which is gone)
So:
Fetch from DB
Store in S2
Return response

TTL-Based (Most Common)
Each cached entry has:
expires_in = 10 minutes
If S1 was removed permanently:
Its cached data is lost
R1 will repopulate in S2
No special cleanup required
System self-heals.
EVen if request is routed to new server. The cached data will be invalidated in old server Via TTL
So S1’s cache for R1 becomes:
❌ orphaned
❌ dead cache
❌ wasted memory (until TTL)
TTL = Time To Live
In caching, TTL means:
⏳ How long a cached value is allowed to stay valid before it expires automatically.

# Message Queue
A Message Queue (MQ) is a system that allows different parts of an application to communicate asynchronously.
Instead of:
“Do this work right now and wait.”
It says:
“Here’s the work. Do it whenever you’re ready.”
It decouples who sends the work from who processes it.
🔁 Core Concepts (All the Pieces Together)
1️⃣ Producer
The component that creates messages.
Example:
User places order
Web server produces:
{ orderId: 123, action: "processPayment" }
Producer does NOT process the task.
It just sends it to the queue.
# Queue
The buffer that stores messages temporarily.
Acts like a waiting line.
Usually FIFO (First In First Out).
Can persist messages to disk.
Absorbs traffic spikes.
It protects your system from overload.
3️⃣ Consumer
The worker that reads messages and processes them.
Example:
Payment service
Email service
Image processing worker
Consumers can scale horizontally.
Add more consumers → more throughput.
4️⃣ Asynchronous Processing
This is the main purpose.
Instead of:
User → Process everything → Respond
We do:
User → Put message in queue → Respond immediately
Actual processing happens later.
Benefits:
Faster response time
Better scalability
Reduced blocking
5️⃣ Notifier (Avoid Polling)
Problem:
Without notification, consumers keep asking:
“Is there work?”
“Is there work?”
This is called polling — wasteful.
Solution:
A Notifier alerts consumers when a message arrives.
Like a bell ringing in a kitchen when a new order comes.
Result:
Efficient wake-up
No unnecessary CPU usage
6️⃣ Load Balancer (Distribute Work)
When you have multiple consumers:
Without coordination:
One worker overloaded
Others idle
Load balancer ensures:
Messages distributed evenly
Fair work sharing
Horizontal scaling
Add workers → system capacity increases.
7️⃣ Heartbeat Mechanism (Failure Detection)
Problem:
Consumer picks a message…
Then crashes.
Now message is stuck.
Solution:
Consumers periodically send:
“I’m alive”
If heartbeat stops:
System detects failure
Message is reassigned
Work is not lost
This ensures reliability.
8️⃣ Delivery Guarantees
Different systems provide different guarantees:
At-most-once → May lose messages
At-least-once → May duplicate messages
Exactly-once → Hardest to implement
Real systems usually use at-least-once.
9️⃣ Why Message Queues Matter
They solve:
Problem	How MQ Helps
Traffic spikes	Queue buffers load
Slow services	Async decoupling
System crashes	Retry via heartbeat
Tight coupling	Producer & consumer independent
Scaling	Add more consumers
🏗 Real Web Example (Putting It All Together)
User uploads image.
Instead of resizing immediately:
App → pushes message to queue
Queue stores message
Notifier alerts worker
Load balancer assigns worker
Worker sends heartbeat
Worker processes image
If worker crashes → job reassigned
User experience:
Fast upload confirmation.
System experience:
Controlled background processing.
🔥 Big System Design Insight
Message Queue =
Buffer + Decoupler + Failure Recovery + Load Distributor
It is NOT just a list of tasks.
It is an orchestration mechanism for distributed systems.
🧩 When You Should Use It
Use MQ when:
Work doesn’t need immediate completion
System experiences bursts
Tasks are long-running
Services need decoupling
Reliability matters
Avoid MQ when:
You need real-time synchronous consistency
Latency must be near-zero
Comparison: Kafka vs RabbitMQ vs SQS

# Monolith Vs Microservice
1. What Is a Monolithic Architecture?
A monolithic application is a single unified application where:
All functionality lives in one deployable unit
All components run as one process
Business logic, UI, and database access are packaged together
This style is simple and familiar — you build one application and deploy it.
In web development, this could be:
User service + Product service + Order service
     all inside a single codebase and deployed together
2. What Is a Microservices Architecture?
In contrast, microservices break the system into many small, independent services.
Each service:
Owns a single business capability
Runs in its own process
Communicates over lightweight protocols (like HTTP/gRPC)
Can be scaled, deployed, and updated independently
So the same example becomes:
User service (own DB) 
Product service (own DB) 
Order service (own DB)
Each runs and scales on its own.
3. Why Use Microservices?
✅ a. Independent Deployment
Microservices let you deploy features separately.
Fix user service without touching order service
Roll back product service independently
This boosts development velocity.
✅ b. Scalability
You can scale only the parts that need it:
If order load spikes → scale order service
No need to scale everything as in a monolith
This is powerful in distributed systems.
✅ c. Better Fault Isolation
If one service fails:
It doesn’t necessarily bring down the whole system
Other services continue functioning
This improves reliability.
✅ d. Technology Diversity
Each service can use its own stack:
Java for order service
Node.js for user service
Python for reporting
This makes teams more flexible.
⚠️ 4. Downsides of Microservices
However, microservices also bring challenges:
❌ a. Distributed Complexity
Microservices are a distributed system:
Network calls instead of simple function calls
More points of failure
Need load balancing, service discovery, circuit breakers
This increases operational complexity.
❌ b. Data Consistency
Each service may have its own database
Maintaining consistency across services is harder
You need patterns like eventual consistency or sagas
❌ c. Deployment Complexity
More services → more deployment pipelines
More coordination required
Higher maintenance overhead
❌ d. Monitoring + Debugging
Debugging across services is harder than tracing within one process.
5. When Monolith Is Preferred Over Microservices
The video emphasizes that microservices are not always the right choice.
You should prefer a monolith when:
🟢 1. The application is small or simple
If the system is modest in scope, splitting into microservices adds unnecessary complexity.
🟢 2. The team is small
With one or two developers, managing many services is overkill:
Hard to maintain multiple repos
Harder to test distributed changes
In that case, a monolith is easier to reason about.
🟢 3. There’s no need to scale parts independently
If all parts of the system have similar load patterns:
Independent scaling may not add much benefit
A monolith with straightforward scaling might be enough
🟢 4. Want simpler deployment and testing
A monolith can:
Be tested end-to-end more easily
Be deployed in one go
Avoid complex service coordination
Many startups begin with a monolith for this reason.
This is a core trade-off highlighted in the video.
🔍 6. Justification for Microservices (When They Make Sense)
The video points out that microservices are most justified when:
🟡 a. The system is large and complex
As complexity grows:
One codebase becomes hard to maintain
Changes in one module may break others
Teams struggle without isolation
So microservices bring modularity and separation of concerns.
🟡 b. Independent Scaling Requirements
Different parts may have different usage patterns:
Example (eCommerce):
Search service (high read)
Order service (high write)
Inventory service (medium)
Each has different performance characteristics — microservices let you scale them independently.
🟡 c. Multiple Teams Working Concurrently
Large organizations:
Separate teams own separate services
Fewer merge conflicts
Teams can release on independent cycles
This improves throughput.
🟡 d. Domain-driven Design (DDD) Fit
When architecture aligns with business domains:
User domain
Product domain
Order domain
Microservices map nicely to bounded contexts.
🧠 7. How Microservices Addresses Issues of Monoliths
Problem with Monolith	Microservices Benefit
Hard to Scale selectively	Independent scalability
Hard to isolate failures	Fault isolation
Large deployment units	Smaller, frequent deploys
Slower team velocity	Independent development
One language stack	Polyglot services
Microservices are a pattern for scaling development, not just traffic.
🚦 Summary of When to Use Which
Monolith (Prefer When)
✔ Application scope is small
✔ Team is small
✔ You want simpler deployment and testing
✔ You don’t need independent scaling
✔ You want easier distributed transactions
✔ WHen all your server interactions are within same db. S1 always talks to S2
Monolith wins for simplicity and early stage.
Microservices (Prefer When)
✔ System is large and complex
✔ Multiple teams
✔ Need independent scaling
✔ Want fault isolation
✔ Domain complexity demands modularization
Microservices win for scale and team autonomy.

# Database Sharding
What Is Database Sharding?
Database sharding is the process of splitting a large database into smaller, more manageable pieces called shards. Each shard holds only a portion of the total dataset, and usually sits on a separate database server instance.
It’s a form of horizontal partitioning — data is split by rows, not columns — so each shard handles a subset of the entire table(s).
Why Sharding Is Needed
When your app scales:
One database becomes too large
Table scan and index operations slow down
Queries take longer
The database becomes a bottleneck
Even with indexing and optimization, a single database eventually fails to handle huge traffic and massive data growth.
Sharding solves this by distributing load and data across multiple servers, improving scalability and performance.
Tinder Example (Common Real-World Case)
Let’s imagine how Tinder might store user profiles and match data before sharding.
🧱 Original (Pre-Sharding) Database
Users Table
-----------------
user_id
name
age
location
preferences
photo_urls
last_active
...
Matches Table
-----------------
match_id
user_id_1
user_id_2
timestamp
All millions of users and matches are stored in one large database.
📉 Query Example Before Sharding
Suppose:
SELECT * FROM Users
WHERE location = "New York";
If Users table has 100M rows:
The DB searches through millions of rows
Even with indexing, it’s large data
Query time could be tens to hundreds of milliseconds, or slower
For large joins (e.g., users + matches), time grows significantly
This leads to:
Slow response times
Heavy load on DB
Poor user experience
🆕 After Sharding
Instead of one massive DB, you split into shards.
A shard might be based on a logical shard key such as:
✔ location
✔ user_id % N
So Tinder might shard by location:
Shard1 → Users from US & Canada
Shard2 → Users from Europe
Shard3 → Users from Asia
...
Or by user_id % 4, where each user_id maps to one of 4 shards.
Each shard holds a subset of the data.
How Query Changes After Sharding
Now if you run:
SELECT * FROM Users
WHERE location = "New York";
Instead of scanning the entire database, the system:
Determines which shard uses that location
Routes the query only to that shard
Only that shard scans its smaller dataset
This drastically reduces the query time because:
A shard might have only 10 million users instead of 100 million
Search and indexing are faster
Index smaller size → faster lookup
⚙️ How Sharding Works Mechanically
You need:
➤ Shard Key
A field that determines which shard a row belongs to. Examples:
user_id % N
geographic region
hashed value
The key must distribute data evenly to avoid hot spots.
➤ Shard Manager / Metadata
A component that maps shard keys to shard servers.
Example:
Location → Shard ID
Shard ID → DB server endpoint
When an app queries, it checks the shard manager first to know where to send the request.
➤ Router Logic
At runtime, application logic:
shard_id = shard_key % N
send query to Shard[shard_id]
This ensures queries go only to the relevant shard, not all of them.
⚠️ Trade-offs and Challenges
While sharding improves scalability, it adds complexity:
❌ Cross-Shard Joins
If your query needs data from multiple shards, you may have to query all shards and aggregate results. This is slow and complex.
❌ Resharding Difficulty
Adding new shards requires redistributing data. Unless you plan ahead with techniques like consistent hashing, resharding can be expensive.
❌ Hot Spots
If your shard key doesn’t distribute evenly (e.g., most users in New York), some shards get overloaded.
❌ Operational Overhead
You now have multiple databases to maintain, backup, monitor, and replicate.
Final Thought
Sharding is a horizontal scaling technique that trades added system complexity for major improvements in performance and scalability. For apps with huge datasets (like social apps, dating apps, globally distributed user bases), it turns an unscalable monolith into a scalable, distributed system.
Increases INfra cost
1 RDS + 1 standby
Shard1 → Primary + Standby
Shard2 → Primary + Standby
Shard3 → Primary + Standby
Shard4 → Primary + Standby
So yes — cost multiplies.
Sharding increases:
Infra cost
Operational complexity
Monitoring overhead
Shard Manager can Live in my backedn service itself
Your application itself contains shard logic:
shardId = userId % 4
connectTo(shardId)
No separate server required.
Shard logic lives inside:
API service
Backend service
This is the most common approach.
No extra infrastructure needed

# Caching
Caching means storing frequently accessed or expensive-to-compute data in fast-access memory (closer to the application) instead of always hitting a slower backend (usually a database).
Instagram news feed example (main analogy throughout):
User requests their feed → server queries DB for followed users + their posts.
Typical latency breakdown (rough numbers used):
Client ↔ server: ~100 ms each way
Server ↔ DB: ~10 ms each way
Total round-trip: ~220 ms
Goal: Reduce the server-to-DB part dramatically (from 20 ms to ~1–2 ms).
By caching the computed feed (or parts of it):
First request: Compute from DB → store result in cache → return to user.
Next similar requests: Serve directly from cache (1 ms instead of 20 ms).
Result: Much lower latency, huge savings when hit rate is high.
Key Benefits Demonstrated
Reduces latency dramatically for repeated/similar queries.
Saves computation — avoid re-doing expensive work (joins, aggregations, ranking).
Improves scalability — database gets far fewer requests.
Can apply at multiple levels:
Backend services (in-memory like Redis, Memcached)
Even client-side (mobile app caches feed locally → instant reload when reopening app)
Limitations & Trade-offs
You can't cache everything — large databases (TB/PB scale) won't fit in memory.
→ You cache only the "hot" / frequently accessed subset.
→ Effectiveness depends on access pattern (power-law / Zipf distribution: small % of data is requested most of the time).
If cache miss rate is high → you pay extra overhead (check cache + then DB).
Two big policy questions every cache must solve:
Write / Update policy (Cache-Aside, Write-Through, Write-Behind, etc. — how/when to update or invalidate cache when source data changes).
Eviction policy (when cache is full, what to remove?):
LRU (Least Recently Used) — most common
LFU (Least Frequently Used)
Others (ARC, ML-based, etc.)
Takeaways
Caching trades storage (extra memory) for speed and reduced load.
It's simple in concept but powerful — tiny changes (1 ms vs 10 ms) compound massively at scale.
Real-world systems use multi-level caching (CDN edge, app server local cache, distributed cache like Redis, database query cache).
The video teases deeper follow-ups on specific write policies, eviction strategies, consistency issues (stale data), cache stampedes/thundering herd, etc.