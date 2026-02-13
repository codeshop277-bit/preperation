🔀 What is a Load Balancer?
A Load Balancer (LB) distributes incoming traffic across multiple servers (EC2 instances, containers, etc.) to:
✅ Improve availability
✅ Increase scalability
✅ Prevent server overload
✅ Enable zero-downtime deployments
In AWS, load balancers are provided under Elastic Load Balancing (ELB).

👉 What is ALB?
Application Load Balancer works at:
Layer 7 (Application Layer) of OSI model
Understands HTTP / HTTPS
It makes routing decisions based on:
URL path (/api, /login)
Hostname (api.example.com)
HTTP headers
Query parameters

✅ When to Use ALB?
Web applications
REST APIs
Microservices
Container-based apps (ECS, EKS)
Next.js frontend + Node backend

🔥 Example
If you have:
/api/* → Backend EC2
/images/* → Static service
admin.example.com → Admin app
ALB can route based on these rules.

⭐ Key Features
Path-based routing
Host-based routing
WebSockets support
Integrated with AWS WAF
SSL termination
Sticky sessions supported

2️⃣ Network Load Balancer (NLB)
👉 What is NLB?
Network Load Balancer works at:
Layer 4 (Transport Layer)
Handles TCP / UDP / TLS
It does NOT inspect HTTP content.
It routes based only on:
IP
Port

✅ When to Use NLB?
High-performance systems
Low-latency trading systems
Real-time gaming
WebSocket heavy traffic
When you need static IP

⭐ Key Features
Extremely high performance
Millions of requests per second
Ultra low latency
Static IP support
Preserves client IP

| Feature         | ALB                    | NLB                   |
| --------------- | ---------------------- | --------------------- |
| OSI Layer       | Layer 7                | Layer 4               |
| Protocol        | HTTP/HTTPS             | TCP/UDP/TLS           |
| Routing         | Path/Host/Header based | IP + Port only        |
| Static IP       | ❌ No                   | ✅ Yes                 |
| Best for        | Web apps, APIs         | High performance apps |
| SSL termination | Yes                    | Yes                   |
| Cost            | Slightly higher        | Slightly lower        |


3️⃣ Sticky Sessions (Session Affinity)
👉 What is it?
Sticky session means:
A user is always routed to the same backend server for a certain time.
🎯 Why needed?
Suppose:
User logs in
Session is stored in server memory
If next request goes to another server:
User will be logged out ❌
Sticky session solves this.

🔥 How It Works in ALB
ALB uses a cookie
Cookie contains target information
Future requests go to same instance

⚠️ Why Sticky Sessions Are Not Ideal
In modern systems:
We store sessions in:
Redis
Database
JWT (stateless auth)
So sticky sessions are often avoided.
Best practice: Make backend stateless

4️⃣ Health Checks
👉 What are Health Checks?
Load balancer periodically checks if a server is healthy.
Example:
GET /health
If response = 200 → Healthy
If response fails → Marked unhealthy

🔄 What Happens If Instance Fails?
Load balancer stops sending traffic
Traffic goes to other healthy instances
When instance recovers → Added back
🎯 Why Important?
Without health checks:
Traffic could go to crashed servers
Users see errors