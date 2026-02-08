It focuses on designing the server-side architecture for Instagram-like features, specifically handling four core requirements: storing/retrieving images, liking and commenting on posts, following/unfollowing users, and generating a personalized newsfeed (home feed showing recent posts from followed users). The design targets scalability for millions of users, using microservices, caching, pre-computation, and efficient data models.
High-Level Architecture Overview

Clients (mobile apps) communicate only with a central Gateway (API gateway/reverse proxy/load balancer entry point).
Gateway handles:
External protocols (HTTP for most requests, WebSockets or similar for real-time).
Authentication (tokens).
Routing to internal microservices.
Conversion to internal protocols for security/efficiency.

Load balancing uses consistent hashing (keyed on user_id) to route requests to service instances.
Maintains a system snapshot (updated ~every 10 seconds) of service locations to avoid per-request queries to the load balancer.

Core microservices (decoupled for independent scaling):
Profile Service: Manages user profiles, profile pictures, sessions, authentication.
Follow Service: Handles follow/follower relationships (who follows whom).
Post Service: Creates, stores, retrieves posts (metadata + image references).
Activity Service (or integrated): Manages likes, comments as activities.
User Feed Service (core for newsfeed): Generates and serves personalized feeds.
Image Service (implied/separate): Uploads, stores, serves media.

Additional: Cache layer (e.g., Redis/Memcached), relational database for persistent storage.

Database Schema and Storage Choices

Relational database (e.g., SQL like PostgreSQL) for structured, consistent data (relationships, timestamps).
Key tables:
User (implied): Profile data.
Post: post_id, user_id (author), timestamp, metadata.
Follower/Followee: follower_user_id, followee_user_id, timestamp (for bidirectional queries).
Activity (unified for likes/comments): activity_id, parent_id (post or comment), type (post/comment), user_id (actor), timestamp.
Avoids separate like/comment tables; uses type enum for uniformity.

Comment: comment_id, post_id, user_id, text, timestamp (no nested/replies for simplicity).

No denormalization: Avoid storing aggregated counts (e.g., like count) in Post/Comment tables to prevent integrity issues and write contention.
Counts computed on-the-fly (e.g., SELECT COUNT(*) FROM activity WHERE parent_id = ? AND type = 'post').

Images/Media Storage:
Never store as BLOBs in database (large, immutable, no indexing benefit, bloats DB, slows queries).
Use distributed file system (e.g., S3-like object storage) for actual image files.
Store only references (image IDs + URLs) in Post table or separate metadata.
Serve via CDN for global low-latency, cost-effective delivery.
Uploads handled by Image Service (resizing, formats).


Newsfeed Generation (Core Focus)

Requirement: Show latest ~20 posts from followed users, fast and personalized.
Naive approach (not used): On feed request → fetch followees → fetch each's recent posts → merge/sort → N+1 query explosion, poor scale.
Optimized: Pre-computed feeds in cache.
User Feed Service (stateless) maintains per-user list of top ~20 recent posts in cache (Redis/Memcached).
Fast O(1) read.
On cache miss: Fall back to brute-force (fetch followees → fetch posts → sort/merge), then cache result.
Eviction via LRU for active users.

Post creation flow (fan-in write):
Client → Gateway → Post Service: Persist post (DB + file storage).
Post Service notifies User Feed Service (e.g., via message queue).
User Feed Service:
Queries Follow Service for author's followers.
Adds new post to top of each follower's cached feed (trim to 20).


Handles celebrities/high-follower counts via batching/rate limiting.

Likes, Comments, and Activity

Unified Activity table for likes on posts/comments.
On like/comment: Insert into Activity table.
Counts computed dynamically (no stored counters).
Notifications: Hybrid push/pull.
Push (WebSockets/long-polling) for real-time to normal users.
Pull (client polling every ~10s) for celebrities to avoid fan-out overload (millions of pushes).
Gateway routes real-time via WebSockets.


Scalability and Trade-offs

Horizontal scaling: Multiple service instances; consistent hashing minimizes reshuffling.
Caching: Feeds in cache for speed; recomputable on miss → eventual consistency ok.
Stateless services: Easy to scale (e.g., User Feed Service).
Microservices decoupling: Independent deployment, scaling per feature (e.g., more Feed instances during peak).
Protocols:
External: HTTP (main), WebSockets (real-time push).
Gateway abstracts internal routing.

Avoids complex features: No nested comments, no stored aggregates.
Patterns: Pre-computation for expensive reads, fan-in writes for updates, hybrid notifications, consistent hashing for load distribution.

Overall, the architecture prioritizes fast feed serving via pre-computation + caching, relational consistency for relationships, distributed storage for media, and microservices for modularity — classic for feed-heavy social apps like Instagram.