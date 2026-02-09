The video "How NETFLIX onboards new content: Video Processing at scale" by Gaurav Sen explains Netflix's architecture and pipeline for ingesting, processing, encoding, storing, and delivering new video content (movies, shows, trailers, etc.) at massive global scale, handling billions of daily streaming requests efficiently.
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

The result is Netflix can onboard huge volumes of high-quality content quickly while serving billions of requests with excellent performance and controlled costs. The video draws from Netflix's own tech blog posts on video encoding, shot-based encodes, Keystone stream processing, and Open Connect.