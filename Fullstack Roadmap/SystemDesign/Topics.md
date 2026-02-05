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