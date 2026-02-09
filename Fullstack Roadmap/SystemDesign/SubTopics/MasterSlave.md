The video "Distributed Consensus and Data Replication strategies on the server" by Gaurav Sen (index 22 in his System Design playlist) explains how databases and servers achieve reliability, fault tolerance, and scalability through replication and consensus in distributed systems. It starts with the basic problem of a single point of failure in a simple server setup and builds up to advanced strategies for handling failures, consistency, and high availability—key topics for system design interviews and real-world large-scale systems.
Core Problem
A basic architecture has clients (e.g., mobile apps) → load balancer → single database server.

If the database crashes, the entire system goes down → unacceptable for production.
Goal: Eliminate single points of failure while maintaining performance, consistency, and availability.

1. Replication Basics (Master-Slave)

Master-Slave (Primary-Replica) Replication:
One master node handles all writes (inserts, updates, deletes).
One or more slaves (replicas) copy data from the master and handle reads (scale read throughput by adding more slaves).
Slaves also serve as hot backups—if master fails, promote a slave to master (manual or automatic failover).

Replication uses transaction logs: Master records changes → sends log entries (commands like "add 100 to user ID 1") → slaves replay them.

Replication Modes:

Asynchronous Replication (common default, e.g., MySQL binlog):
Master commits write immediately after local success.
Slaves catch up later → low latency for writes, but slaves can lag (risk of data loss if master crashes before sync).

Synchronous Replication:
Master waits for at least one (or majority) slave to acknowledge before committing.
Guarantees stronger consistency (no loss on failover), but increases write latency and can reduce throughput.


Trade-offs:

Master-slave scales reads easily but writes bottleneck on single master.
Slaves typically read-only to avoid complexity.

2. Master-Master (Peer-to-Peer / Multi-Master) Replication

Both (or all) nodes accept reads and writes → better write scaling and load balancing.
Changes propagate bidirectionally (each node acts as master for some writes and slave for others).
Big Risk: Split-Brain (network partition):
Network fails → nodes can't communicate → each thinks it's the only live node → both accept conflicting writes (e.g., overdraft account balance: one deducts 100, other deducts 50 from 120 → ends up negative inconsistently).

Mitigation requires consensus to decide which state is "correct."

3. Solving Split-Brain with Consensus (Quorum / Majority Rule)

Introduce a third node (or odd number) as a tie-breaker/referee.
Nodes continuously propagate their current state (e.g., S0 → SX).
During partition:
Majority side (e.g., nodes A & C agree on SX) wins.
Minority side (B on SY) forced to rollback and sync to majority state.

Assumption: Failures are partial (network or single node, not everything at once).
This is a simplified quorum-based consensus → foundation for protocols like Raft, Paxos (used in etcd, Consul, ZooKeeper for leader election).

4. Sharding for Scale + Replication

Sharding (horizontal partitioning): Split data across nodes (e.g., users 0–100 on shard A, 101–200 on B).
Each shard can have its own master-slave pair → failure affects only subset of data.
Improves both read/write scale and fault isolation.

Routing layer (e.g., proxy or consistent hashing) directs requests to correct shard.

5. Advanced Consistency & Transaction Strategies

2-Phase Commit (2PC): Coordinator asks all participants to "prepare" → if all yes, commit; else abort. Strong consistency but slow, blocking on failures.
3-Phase Commit (3PC): Adds pre-commit phase to reduce blocking.
MVCC (Multi-Version Concurrency Control): Used in PostgreSQL/MySQL InnoDB → keeps multiple versions of data → allows concurrent reads/writes without heavy locks (supports snapshot isolation/serializable).
Sagas: For long-running distributed transactions (e.g., food ordering app):
Break into local steps (reserve funds → confirm order → deduct).
Each step commit/compensate independently (rollback via compensating actions if later step fails).
Avoids distributed locks → better availability.


Summary of End-to-End Mindset

Start simple: Single DB → single point of failure.
Add replication: Master-slave for reads + backups (async for speed, sync for safety).
Scale writes: Go master-master → but handle split-brain with quorums/third node.
Scale further: Shard data → replicate each shard.
Ensure consistency: Use consensus (quorum, Paxos/Raft), MVCC, Sagas, etc.
Trade-offs (CAP theorem implied): Strong consistency often reduces availability during partitions → choose based on needs (e.g., banking needs strong, social feed can tolerate eventual).

The video uses simple diagrams (load balancer + DB, master → slave arrows, partitioned nodes A/B/C, sharded ranges) and examples (account overdraft, food order saga) to illustrate why replication alone isn't enough—distributed consensus is the "power" that makes reliable, scalable distributed databases possible (e.g., in Cassandra, CockroachDB, Spanner). It's foundational for understanding why systems like Google Spanner or Amazon Aurora achieve high availability and consistency at global scale.