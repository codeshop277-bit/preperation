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