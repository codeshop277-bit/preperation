Explain the entire architecture mentioned in the video. Don't add timestamps
https://www.youtube.com/watch?v=x9Hrn0oNmJMThe video "How NETFLIX onboards new content: Video Processing at scale" by Gaurav Sen explains Netflix's architecture and pipeline for ingesting, processing, encoding, storing, and delivering new video content (movies, shows, trailers, etc.) at massive global scale, handling billions of daily streaming requests efficiently.
The overall architecture focuses on three main phases: ingestion & encoding (onboarding new content), storage, and delivery/caching. It emphasizes scalability, parallelism, cost-efficiency, low latency, and reduced bandwidth usage through smart encoding and a custom CDN approach.
1. Problem Context and Video Requirements
Netflix must support:

Multiple video formats (e.g., different codecs/containers).
Numerous resolutions/bit rates (e.g., 480p, 720p, 1080p, 4K, and adaptive bitrate variants) to handle varying device types, screen sizes, and network conditions.
High-quality encoding while keeping processing time reasonable and costs low.
Global delivery with minimal buffering and low latency for millions of concurrent users.

Encoding a full high-quality movie in a single stream would take far too long and be inefficient, so Netflix uses a distributed, parallelized approach.
2. Chunk / Shot-Based Processing (Encoding Pipeline)
Instead of processing entire videos linearly, Netflix breaks content into small, independent units for parallel encoding:

Videos are divided into short shots, typically around 4-second chunks.
These shots are analyzed and grouped into scenes (using scene-detection algorithms to identify natural breaks where visuals/audio change significantly).
Scene-based chunking is preferred over fixed-time chunks because:
It aligns with natural viewing patterns.
It enables better compression and prefetching during playback (viewers rarely jump mid-scene).
It supports optimized "shot-based encodes" for quality vs. bitrate efficiency.

Each chunk/scene is encoded independently in parallel across a large cluster of machines/processors.
This massively reduces total encoding time (from days to hours) and improves fault tolerance—if one machine fails, only a small chunk is reprocessed.
Multiple encodes are produced per chunk: different resolutions, bitrates, and possibly codecs to support adaptive streaming (HLS/DASH protocols).
Netflix uses advanced techniques like per-shot optimization to allocate bits intelligently (more bits for complex/action scenes, fewer for static ones).

3. Storage

After encoding, all these variant chunks/files are stored in Amazon S3.
S3 serves as durable, highly available, cost-effective object storage for the massive volume of encoded assets.
No complex database is needed here; it's primarily static blob storage with metadata managed separately.
This decouples processing from delivery and allows Netflix to scale storage independently.

4. Content Delivery and Caching with Open Connect
The most innovative part for scale is how Netflix delivers content to reduce backbone internet traffic and latency:

Netflix operates its own custom Content Delivery Network (CDN) called Open Connect.
Instead of relying solely on traditional third-party CDNs, Netflix deploys physical servers (called Open Connect Appliances or boxes) directly at Internet Service Providers (ISPs) worldwide.
These boxes are filled with the most popular / recently added content (encoded files from S3).
When a user requests a video:
The Netflix client/app first tries to fetch from the nearest Open Connect box at the user's ISP.
A very high percentage (often cited around 90%+ in many regions) of traffic is served directly from these local ISP caches → dramatically reduces latency, buffering, and Netflix's bandwidth costs.
Only cache misses (rare/new content or less popular titles) fall back to Netflix's origin servers or cross-region pulls over the public internet.

This "push" model (Netflix proactively fills ISP boxes based on popularity predictions) is revolutionary and more efficient than pure pull-based CDNs for video workloads.
It creates synergy: ISPs benefit from reduced transit costs, users get faster/better streaming, and Netflix saves massively on bandwidth.

Summary of the End-to-End Flow

New video arrives (studio upload or internal).
Video is analyzed → split into ~4-second shots → grouped into scenes.
Parallel encoding jobs run across many machines → produce multi-resolution, multi-bitrate variants.
Encoded files are uploaded to Amazon S3.
Popular/recent files are pushed to Open Connect appliances at ISPs globally.
User playback request → client gets manifest → streams chunks primarily from local Open Connect cache (with adaptive bitrate switching).
Fallback to origin only when necessary.

This architecture combines:

Scene/shot-based parallel processing for fast onboarding.
Cloud storage (S3) for durability and scale.
A highly customized ISP-embedded CDN (Open Connect) for efficient global delivery.

The result is Netflix can onboard huge volumes of high-quality content quickly while serving billions of requests with excellent performance and controlled costs. The video draws from Netflix's own tech blog posts on video encoding, shot-based encodes, Keystone stream processing, and Open Connect.2.9sFast40 sourcesIn the same way explain
https://www.youtube.com/watch?v=0myM0k1mjZw&list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX&index=20The video "Capacity Planning and Estimation: How much data does YouTube store daily?" by Gaurav Sen (from his System Design playlist) explains back-of-the-envelope capacity planning and estimation techniques, using YouTube as a real-world example system. It teaches how to roughly calculate storage, bandwidth, requests per second (RPS), and other resource needs for a massive-scale video platform like YouTube. This is a classic system design interview preparation topic: starting from high-level assumptions and arriving at order-of-magnitude numbers to understand infrastructure scale.
The approach is step-by-step, conservative, and iterative—making reasonable assumptions, stating them clearly, and calculating daily/annual figures for storage, upload traffic, playback traffic, and more. The goal is not pixel-perfect accuracy but understanding the scale (e.g., petabytes, terabits per second) to guide architecture decisions like sharding, caching, CDN usage, and cost estimation.
Key Assumptions Made in the Video (Typical 2020-era numbers, adjusted conceptually for scale)

Active users: ~1 billion monthly active users (MAU), but for daily activity, assume ~1/3 to 1/2 are daily active → roughly 300–500 million DAU. For simplicity, many use ~1 billion active users.
Content creators / upload rate: Assume ~1 in 1000 users uploads a video per day → ~1 million new videos uploaded daily.
Average video length: 10 minutes.
Average video file size (uploaded/raw): ~1 GB per video (conservative; modern compressed uploads might be lower, but this accounts for higher-quality uploads).
Encoded / streamed variants: YouTube produces multiple resolutions (360p, 720p, 1080p, 4K, etc.) → total encoded storage per original video is roughly 5–10× the original size due to multiple bitrates/formats.
Viewership distribution: Highly skewed (Zipf/power-law): a tiny fraction of videos get the majority of views (top videos viewed billions of times, long tail viewed rarely).
Average views per video per day: For new videos, low; overall, total daily views ~5–10 billion (YouTube stats around that era).
Average watch time per view: ~5–10 minutes (partial watches common).
Bitrate for streaming: Varies by resolution; average effective bitrate ~3–5 Mbps for HD.

Main Components and Calculations Explained
1. Daily Storage Requirement (New Content)

New videos per day: 1 million.
Size per video (uploaded): ~1 GB.
Raw daily upload storage: 1 million × 1 GB = 1 PB/day.
Encoded variants: Assume ~5–10× multiplier (multiple resolutions + formats like VP9, AV1, H.264) → 5–10 PB/day of new encoded storage.
Retention: Videos are kept indefinitely (YouTube rarely deletes), so storage grows linearly over years → annual addition ~365 × 5–10 PB = ~2–4 EB/year.
Total historical storage: With years of accumulation, YouTube's total video storage is in the tens to hundreds of exabytes range (exact figures are proprietary but align with this order of magnitude).

2. Daily Upload Traffic / Ingress Bandwidth

1 million videos × 1 GB each = 1 PB/day ingress.
Converted to bandwidth: 1 PB = 8 × 10¹⁵ bits → spread over 86,400 seconds → ~100 Gbps average upload bandwidth globally (peaks much higher).
This drives the need for massive, distributed ingest points and transcoding clusters.

3. Daily Playback / Views / Egress Bandwidth

Total daily video views: Assume ~5 billion views/day (conservative; actual has been higher).
Average watch time per view: ~5 minutes.
Total watch minutes/day: 5 billion × 5 min = 25 billion minutes.
Converted to hours: ~417 million hours/day.
Average streaming bitrate: ~4 Mbps (blending SD/HD/mobile/4K).
Total daily egress data: (25 billion minutes × 60 seconds × 4 Mbit/s) / 8 = ~several dozen to 100+ PB/day egress.
Bandwidth: Spread over 86,400 s → tens of Tbps average egress (peaks 100+ Tbps).
This is why YouTube invests heavily in CDN (Google's global cache network), peering, and edge caching—most views are served from local caches, not origin.

4. Requests Per Second (RPS) and QPS

Page views / home feed loads: Hundreds of millions to billions daily → RPS in hundreds of thousands to millions.
Video playback start requests: ~5 billion views/day → ~58,000 video starts/second average (peaks much higher).
Metadata / thumbnail requests: Multiples of video requests (recommendations, comments, likes) → total frontend RPS easily in millions.
Backend services (recommendation, search, ads) handle similar or higher scale with sharding, caching (Memcache/Redis), and eventual consistency.

5. Other Key Considerations Discussed

Hot vs. cold data: Popular videos (top 1%) account for most traffic → heavy caching + replication of hot content across data centers / edges.
Transcoding pipeline: Videos uploaded → queued → parallel transcoded into multiple formats/resolutions → stored in blob storage (Google Cloud Storage equivalent).
Recommendation system impact: Drives uneven load (viral videos spike traffic).
Growth factor: YouTube storage and bandwidth grow roughly linearly with time/users, but efficiency improvements (better codecs like AV1, shorter default bitrates) reduce per-video cost.
Why order-of-magnitude is enough: In interviews/system design, exact numbers matter less than showing you understand scale, bottlenecks (egress cost, storage growth, peak handling), and mitigation strategies (caching, compression, tiered storage, sharding).

Summary of the End-to-End Estimation Mindset

Start with user base and behavior assumptions (DAU, upload rate, view rate, watch time).
Calculate daily new data (uploads, encoded storage).
Estimate traffic volume (ingress for uploads, egress for playback).
Convert to bandwidth (Gbps/Tbps) and RPS/QPS.
Think about growth and non-functional requirements (durability, low latency via CDN, cost optimization).
Identify architecture implications: distributed storage, massive transcoding clusters, global CDN with intelligent prefetching/caching, microservices for metadata/recommendations.

This video teaches the foundational skill for any large-scale system design interview: breaking down ambiguous scale questions into calculable parts with clear assumptions. The YouTube example illustrates why companies like Google/YouTube need exabyte-scale storage, multi-Tbps networks, and sophisticated caching/CDN layers. Similar logic applies to Netflix, TikTok, Instagram Reels, etc., with adjustments for upload/view ratios and video lengths.