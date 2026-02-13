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

# Scaling
📈 Scaling in Cloud Systems

Scaling means increasing or decreasing your system’s capacity based on traffic.

There are two types:

1️⃣ Vertical Scaling (Scale Up)
Increase CPU, RAM of the same server
Example: t3.medium → t3.large
✅ Pros
Simple
No architecture change
❌ Cons
Has limits
Downtime during resize
Single point of failure

2️⃣ Horizontal Scaling (Scale Out)
Add more servers
Use Load Balancer to distribute traffic
Example:
1 server → 5 servers during peak traffic
✅ Pros
High availability
Fault tolerant
Practically unlimited scaling
❌ Cons
Architecture complexity
Requires stateless design

# 🚀 Auto Scaling Groups (ASG)
📌 What is an Auto Scaling Group?
In AWS, Amazon EC2 Auto Scaling automatically:
Launches new EC2 instances
Terminates extra instances
Maintains desired instance count
It works together with:
Elastic Load Balancing
Amazon CloudWatch

You define:
Min instances: 2
Desired: 3
Max: 10
CloudWatch monitors:
CPU usage
Memory
Custom metrics
If CPU > 70%:
ASG launches new EC2
If CPU < 20%:
ASG removes extra EC2

🎯 Scaling Policies
1️⃣ Target Tracking
Maintain CPU at 50%
2️⃣ Step Scaling
If CPU > 70% → add 2 instances
If CPU > 85% → add 4 instances
3️⃣ Scheduled Scaling
Every day 9AM → scale to 6 instances

🧠 Stateless Services
📌 What is Stateless?
A service is stateless when:
Each request is independent
Server does NOT store session data in memory
Example:
Login → JWT token returned
Next request → token validated
No session stored in server
❌ Stateful Example
User logs in
Session stored in server memory
If request goes to another server → session lost

✅ Why Stateless Is Important?
Because in horizontal scaling:
Request 1 → Server A
Request 2 → Server C
Request 3 → Server B
If state is stored locally → chaos 😅
So modern systems:
Use JWT
Use Redis
Use DB for sessions

# Horizontal Scaling Challenges
Scaling sounds easy but comes with problems.
1️⃣ Session Management
Problem:
Multiple servers
Session in memory
Solution:
Redis
JWT
Sticky sessions (temporary fix)
2️⃣ Database Bottleneck
Even if you scale 10 servers:
Single DB may crash
Solutions:
Read replicas
Sharding
Caching layer (Redis)
3️⃣ Distributed Caching
If cache is local:
Cache inconsistency
Solution:
Central cache (Redis / Memcached)
4️⃣ Data Consistency
Multiple servers writing to DB:
Race conditions
Dirty writes
Need:
Transactions
Proper locking
Idempotent APIs
5️⃣ Deployment Complexity
Rolling deployments across 10 servers:
Need health checks
Need zero downtime
Use load balancer + ASG
6️⃣ Cold Start Time
New instance:
Needs to boot
Install dependencies
Connect to DB
Mitigation:
Keep buffer capacity
Use warm pools

# Logd
📊 Monitoring (Crisp Version)
Monitoring = Observing your system’s health, performance, and failures in real time.
Goal:
Detect issues early
Debug faster
Auto-scale smartly
Alert before users complain
☁️ CloudWatch
Amazon CloudWatch is AWS’s monitoring service.
It collects:
Metrics
Logs
Events
Alarms
It integrates with:
EC2
Lambda
Load Balancers
RDS
Auto Scaling
📈 Metrics
Metrics = Numbers over time
Examples:
CPU Utilization
Memory usage
Request count
Error rate (5xx)
Latency
Visualized as:
Graphs
Dashboards
Used for:
Scaling decisions
Performance tracking
👉 Example:
If CPU > 70% → scale out
📜 Logs
Logs = Detailed event records
Examples:
API request logs
Error stack traces
Login attempts
DB query errors
Stored in:
CloudWatch Logs
Used for:
Debugging production issues
Root cause analysis
👉 Metrics tell something is wrong
👉 Logs tell what exactly went wrong
🚨 Alerts (Alarms)
Alerts are triggered when a condition is met.
Example:
CPU > 80% for 5 minutes
5xx errors > 50
Lambda errors > threshold
CloudWatch Alarm can:
Send SNS email
Trigger Auto Scaling
Trigger Lambda
Send Slack notification
🧠 Simple Relationship
Application
   ↓
Logs → Debugging
Metrics → Performance tracking
   ↓
CloudWatch
   ↓
Alarms
   ↓
Notification / Auto Scaling
🎯 Interview Summary
Monitoring = Observe system health
CloudWatch = AWS monitoring tool
Metrics = Numeric performance data
Logs = Detailed event records
Alerts = Notifications when threshold crossed