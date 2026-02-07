# NoSQL
This video introduces NoSQL databases, comparing them to traditional SQL/RDBMS, explaining why NoSQL became popular for large-scale distributed systems, and using Cassandra as a concrete example to show how NoSQL solves scalability problems at the cost of some guarantees (especially ACID).
Key Points Covered

SQL (RDBMS) Limitations That Led to NoSQL
Normalized tables + foreign keys force expensive joins → slow when fetching related data.
Schema rigidity — adding a column can lock tables and cause downtime.
Vertical scaling ceiling — hard/expensive to handle massive writes/reads beyond a single powerful machine.

NoSQL Core Ideas & Advantages
Denormalized data — Store everything related in one place (e.g., user + nested address object instead of separate tables).
No joins needed → fast reads for common access patterns.

Flexible / schema-less — Add new fields anytime; missing fields are simply omitted (no nulls everywhere).
Horizontal scaling — Easy sharding + replication across many cheap machines.
Great for read-heavy + write-heavy workloads, aggregations (e.g., average salary), and evolving requirements.

Cassandra as Example
Sharding via consistent hashing (key → hash → node).
Replication for redundancy (multiple copies).
Quorum reads/writes — majority of replicas must agree (e.g., 2 out of 3) → tunable consistency.
Compaction — merges immutable SSTables (like merge sort) to remove deleted/tombstone data and reclaim space.

Trade-offs & Downsides of NoSQL
No automatic foreign key / referential integrity.
Joins are manual and expensive (you merge data in application code).
Eventual consistency is default → reads can return stale/old data briefly.
Queries are access-pattern driven — design tables/documents around how you will read data (not arbitrary SQL-like queries).


ACID Properties Explained + How NoSQL Misses Them
ACID is the set of guarantees that make traditional relational databases reliable for money/banking/inventory systems:
Property,Full Name,What it Means,Typical SQL (RDBMS) Behavior,"NoSQL Reality (most distributed NoSQL like Cassandra, DynamoDB, MongoDB clusters)"
A,Atomicity,All operations in a transaction succeed or none do (all-or-nothing),Yes — BEGIN / COMMIT / ROLLBACK,"Usually no multi-document / cross-shard ACID transactions. Single-document ops are atomic, but not across nodes/shards."
C,Consistency,"Every transaction brings the database from one valid state to another (constraints, foreign keys enforced)","Yes — constraints, triggers, foreign keys enforced",No strong consistency by default. Uses eventual consistency or tunable (quorum). Referential integrity not enforced.
I,Isolation,Concurrent transactions do not interfere (partial results hidden),"Yes — isolation levels (READ COMMITTED, SERIALIZABLE)","Weak or none across nodes. You can get serializable in some cases (high quorum), but expensive/slow."
D,Durability,"Once committed, data survives crashes/power loss",Yes — write-ahead logging,Usually yes — writes are durable after quorum acknowledgement.
Why NoSQL deliberately gives up (full) ACID

ACID requires heavy locking, coordination, and 2-phase commit in distributed systems → kills performance and availability at internet scale.
CAP Theorem forces trade-off: You can have Consistency + Partition tolerance or Availability + Partition tolerance, but not all three perfectly.
→ Most NoSQL chooses AP (high availability + partition tolerance) → eventual consistency.
For money transfers or inventory, you still need ACID → use SQL, or special NoSQL modes (e.g., MongoDB transactions since v4), or patterns like sagas/compensating transactions.

Quick Verdict from the Video
Use NoSQL when you need:

Massive scale (millions+ writes/sec)
Flexible schema
Fast reads for known patterns
You can tolerate eventual consistency

Use SQL when you need:

Strong consistency & ACID
Complex joins & relations
Arbitrary queries