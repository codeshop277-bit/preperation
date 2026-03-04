Redis (Remote Dictionary Server) is an in-memory data store used as:
Cache
Database
Message broker
Session store

Unlike traditional databases like MySQL / PostgreSQL, Redis stores data in RAM instead of disk.

Key idea
Application
     ↓
Redis (RAM)
     ↓
Database (Disk)

Because it runs in memory, Redis operations are extremely fast (microseconds).

Typical latency:

Redis read → ~1ms
DB read → ~10–100ms

# 2. Why Redis Is Used
Redis solves several performance and scalability problems.
1️⃣ Caching (Most common use)

Example problem:
User loads dashboard
↓
API fetches data from DB
↓
DB query = 100ms

If 10,000 users request this:
10,000 × DB queries

Instead we cache it.
User → Redis cache → DB (if miss)
Flow:
Request
   ↓
Check Redis
   ↓
Cache Hit → return data
Cache Miss → query DB → store in Redis

Example:
GET user:123
If exists → return instantly.

# 2️⃣ Reduce Database Load
Without cache:
10k req/sec → DB

With Redis:
10k req/sec → Redis
10 req/sec → DB

Huge cost savings.

# 3️⃣ Session Storage
Web apps store sessions in Redis.
Example:

userId → session data
session:abcd123 → { userId: 42 }

Why Redis?
✔ fast lookup
✔ shared across servers
✔ supports expiration

Example:
SET session:123 "user42" EX 3600
Expires after 1 hour.

# 4️⃣ Rate Limiting
Redis counters help prevent API abuse.
Example:
User can call API 100 times per minute

Redis:
INCR api:user123
EXPIRE api:user123 60

# 5️⃣ Pub/Sub Messaging
Redis supports real-time messaging.
Example:
Publisher → Redis → Subscribers
Used in:
notifications
chat apps
real-time dashboards

Example:
PUBLISH news "hello world"
Subscriber receives instantly.

# 6️⃣ Queue / Background Jobs
Redis is used as a job queue.

Example:
Email sending
Image processing
Notifications

Flow:
App → push job → Redis queue
Worker → consume job

Popular tools:
BullMQ
Sidekiq
RQ
3. Redis Data Structures
Redis is not just key-value.
It supports multiple data structures.

1️⃣ Strings
Most common.
SET user:1 "Balaji"
GET user:1
2️⃣ Lists

Ordered collection.
LPUSH tasks "task1"
LPUSH tasks "task2"

Useful for queues.

3️⃣ Sets
Unique elements.

SADD users "balaji"
SADD users "john"

No duplicates.

4️⃣ Hashes
Store objects.
HSET user:1 name "Balaji"
HSET user:1 age 30

Equivalent to:
{
 name: "Balaji",
 age: 30
}

5️⃣ Sorted Sets
Elements sorted by score.
Example:
Leaderboard.
ZADD leaderboard 100 player1
ZADD leaderboard 200 player2

Retrieve top players.

4. How Redis Works Internally
Redis is single-threaded but event-driven.
Architecture:
Client request
     ↓
Event loop
     ↓
In-memory operations

Because everything is in memory:
O(1) operations
No disk I/O for most operations.

# 5. Installing Redis
Mac
brew install redis

Run:
redis-server
Linux
sudo apt install redis-server
Check connection:
redis-cli

Test:
SET name balaji
GET name

# 6. Using Redis in Node.js
Install client:
npm install redis

```js
import { createClient } from "redis";

const client = createClient();

await client.connect();

await client.set("name", "Balaji");

const value = await client.get("name");

console.log(value);


app.get("/users", async (req, res) => {

  const cached = await redis.get("users");

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  const users = await db.getUsers();

  await redis.set("users", JSON.stringify(users), {
    EX: 60
  });

  res.json(users);
});
```
# 8. Redis Persistence
Even though Redis is in memory, it supports disk persistence.
Two methods:
RDB (snapshot)
Saves snapshot periodically.
SAVE every 5 minutes

Example file:
dump.rdb
AOF (Append Only File)
Logs every command.
SET name balaji
Recovery replays commands.
Safer but larger file.

# 9. Redis Configuration
Main config file:
redis.conf

Important settings:
Memory limit
maxmemory 2gb

Eviction policy
What happens when memory full.
maxmemory-policy allkeys-lru

Meaning:
Remove least recently used keys
Expiration
Keys can expire automatically.
SET key value EX 60

# 10. Example Architecture
Typical production architecture:

Client
   ↓
CDN
   ↓
Backend API
   ↓
Redis Cache
   ↓
Database

Request
 ↓
Check Redis
 ↓
Cache miss → DB
 ↓
Store in Redis
 ↓
Return response

11. Redis in Large Systems

Redis is used heavily by:

Twitter
Instagram
Netflix
Uber
GitHub

Use cases:
feed caching
session storage
rate limiting
queue systems
leaderboard ranking

Redis is an in-memory data store used for caching, session storage, messaging, and queue systems. Because it stores data in RAM, it provides microsecond latency and significantly reduces database load. Redis supports multiple data structures like strings, hashes, lists, and sorted sets, making it useful for features like leaderboards, rate limiting, and pub/sub messaging.

Rate Limiter
```js
const RATE_LIMIT = 6;
const WINDOW = 60; // seconds

export const rateLimiter = async (req, res, next) => {
  const ip = req.ip;
  const key = `rate:${ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW);
  }

  if (count > RATE_LIMIT) {
    return res.status(429).json({
      error: "Too many requests. Try again later."
    });
  }

  next();
};

import express from "express";
import { rateLimiter } from "./rateLimiter.js";

const app = express();

app.get("/api/data", rateLimiter, (req, res) => {
  res.json({ message: "Success" });
});

app.listen(3000);
```