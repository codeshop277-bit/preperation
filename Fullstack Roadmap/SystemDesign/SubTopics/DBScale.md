The video "How databases scale writes: The power of the log ✍️🗒️" by Gaurav Sen (from his System Design playlist, index 21) explains how modern databases achieve massive write scalability in high-throughput systems (e.g., social media like Instagram/Twitter feeds, time-series data, logging, or any write-heavy workload). It contrasts traditional disk-based structures with a log-structured approach, focusing on Log-Structured Merge Trees (LSM Trees) — the foundation of databases like Cassandra, HBase, BigTable, RocksDB, LevelDB, and ScyllaDB.
The core problem: Traditional databases (using B+ trees) balance reads and writes well in moderate loads (O(log n) for both), but under extreme write pressure (millions of writes/sec), random disk I/O becomes a bottleneck due to seeks, fragmentation, and page splits. LSM Trees flip this by optimizing for sequential writes (fast on HDDs/SSDs) while using background processes to keep reads efficient.
Key Concepts and Trade-offs

Write amplification vs. read amplification: LSM prioritizes low write amplification (minimal disk work per write) at the cost of higher read amplification (potentially scanning multiple structures), mitigated by clever optimizations.
Sequential vs. random I/O: Appending to a log is O(1) and sequential → extremely fast and durable.
Immutability: Once data hits disk, files are never modified → simplifies concurrency, crash recovery, and replication.

End-to-End Architecture and Flow
1. Write Path (Fast and Buffered)

Incoming writes (inserts/updates) are first appended to an in-memory structure (often a memtable, like a sorted map or skip list).
To condense requests: Buffer multiple writes in memory → batch them → reduce network I/O, headers, acks, and disk operations.
When the memtable reaches a size threshold (e.g., tens/hundreds of MB):
Sort the data (if not already sorted).
Flush it to disk as an immutable Sorted String Table (SSTable) — a sorted file of key-value pairs (keys sorted lexicographically).

Simultaneously, writes continue appending to a durable on-disk write-ahead log (WAL) (append-only log file) for crash recovery: If the system crashes before flush, replay the log to rebuild the memtable.
Result: Writes are O(1) appends → handle millions/sec with minimal latency.

2. Read Path (Efficient with Multiple Layers)

To find a key:
Check the in-memory memtable (fastest).
If not found, check recent SSTables on disk (newest first).
For each SSTable: Use binary search (O(log n) per file) since it's sorted.

Problem: Many small SSTables → read must check many files → high read amplification.
Solution layers:
Bloom filters (per SSTable): Probabilistic structure (bit array + hash functions) to quickly say "key definitely not here" (no false negatives, some false positives). Before binary search on an SSTable, check its Bloom filter → skip irrelevant files and avoid disk I/O.
Indexes (sparse): Each SSTable has an in-memory index mapping key ranges to file offsets → jump directly instead of scanning the whole file.
Caching: Hot SSTables/blocks cached in memory (OS page cache + database block cache).


3. Compaction (Background Optimization)

Over time: Many small SSTables accumulate → reads slow down.
Background compaction merges them:
Pick overlapping SSTables (by key range).
Merge-sort them like merging sorted arrays → produce fewer, larger sorted SSTables.
Levels: Often leveled compaction (e.g., Level 0: recent small files; Level 1: larger merged; exponential size growth per level).
Example progression: Merge 2×6 → 12; 2×12 → 24; etc. → reduces number of files exponentially.
Removes duplicates/tombstones (deletes marked as special entries).

Trade-off: Compaction consumes CPU, I/O, and disk space temporarily (write amplification during merge), but drastically reduces read amplification long-term.
Runs continuously in background, tunable (size tiers, triggers).

Summary of the End-to-End Flow

Client → write request → append to WAL + memtable (in-memory sorted structure).
Memtable full → sort (if needed) → flush to new SSTable on disk + create Bloom filter + index.
Read query → check memtable → check Bloom filters of SSTables → binary search only promising ones.
Background: Compaction merges SSTables → fewer files → faster future reads.
Crash recovery: Replay WAL to rebuild memtable.

Why This Scales Writes

Sequential appends → leverages disk/SSD bandwidth (100s MB/s to GB/s) instead of random seeks (ms latency).
Batching + buffering → amortizes overhead.
Immutability + background merging → no in-place updates → no fragmentation.
Bloom filters + indexes → keep read costs low despite layered structure.

This design powers many NoSQL databases handling petabyte-scale data with extreme write throughput (e.g., Instagram storing billions of posts, likes, comments). The video uses simple examples (numbers in chunks, merging sorted lists) to illustrate compaction and Bloom filters mathematically, showing how read complexity improves from linear-ish to near-logarithmic with levels.
The lesson: For write-heavy systems, prioritize sequential writes and defer organization to background jobs — the "power of the log" enables orders-of-magnitude better write scaling than traditional update-in-place structures.