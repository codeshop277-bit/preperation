WHERE filters individual rows before grouping or aggregation, so it can’t use aggregate functions like SUM or COUNT; it’s best for narrowing raw data early (e.g., a date range or status).

HAVING filters the resulting groups after GROUP BY, so it’s meant for conditions on aggregates (e.g., groups with totals above a threshold).


# Composite primary key
A composite primary key uses two or more columns together to uniquely identify each row when one column alone isn’t sufficient

# Joins
SQL joins combine rows from two tables based on a matching condition (typically keys) to answer questions that span both tables.

An INNER JOIN returns only matches that exist in both tables (the intersection).
A LEFT JOIN returns all rows from the left table and the matching rows from the right; when there’s no match, right-side columns are NULL.
A RIGHT JOIN is the mirror image: all rows from the right table plus matches from the left, NULL when absent.
A FULL (OUTER) JOIN returns all rows from either table, filling in NULL where a counterpart is missing.

# Union
UNION combines results from two (or more) SELECTs and removes duplicates (it performs a DISTINCT across all columns), which adds sorting/hash work and can be slower.
UNION ALL keeps duplicates and usually runs faster because it simply appends result sets.

# Clustered vs Non CLustered
| Feature        | Clustered Index        | Non-Clustered Index            |
| -------------- | ---------------------- | ------------------------------ |
| Data storage   | Physically sorted      | Separate structure             |
| Number allowed | 1 per table            | Multiple                       |
| Speed          | Faster (direct access) | Slightly slower (needs lookup) |
| Use case       | Range queries, sorting | Search/filter queries          |
| Leaf nodes     | Actual data            | Pointers to data               |

A clustered index defines how the actual data is stored on disk.
Rows are physically sorted based on the index key
The table itself becomes the index

A non-clustered index is a separate structure that stores:
Indexed column values
A pointer/reference to actual data rows

Clustered Index = Books arranged on a shelf by title
Non-Clustered Index = Index page at the back of a book pointing to page numbers

# Anti join
An anti-join returns rows from one table (the “left”) that have no matching rows in another table (the “right”) based on a join condition

ROW_NUMBER() assigns a unique sequential number to each row within a partition based on the order—no ties share a number (ties are broken arbitrarily by the ORDER BY). RANK() assigns the same rank to tied rows but leaves gaps after ties (1,1,3…). DENSE_RANK() also assigns the same rank to ties but doesn’t leave gaps (1,1,2…).

# Cross join
A CROSS JOIN returns the cartesian product of two tables—every row from A paired with every row from B so the result size is rows(A) × rows(B), and it doesn’t use a join condition

# Foreign key
A foreign key (FK) is a column (or set of columns) in a child table that references a primary/unique key in a parent table to ensure the child’s values actually exist in the parent. This enforces referential integrity by preventing actions that would create “orphan” rows.

UNION returns the distinct union of both result sets (removes duplicates).
Use it to merge similar data from multiple sources
INTERSECT returns only rows common to both queries—ideal for finding overlap.
EXCEPT (called MINUS in Oracle) returns rows in the first query that aren’t in the second.

# Optimize slow query
start by analyzing the execution plan using EXPLAIN to identify bottlenecks like full table scans. Then I check indexing, especially on WHERE, JOIN, and ORDER BY columns. I reduce unnecessary data, optimize joins, avoid anti-patterns like functions on indexed columns, and refactor queries if needed. If required, I also consider caching or partitioning for large datasets.

# Group by
The GROUP BY clause is used to arrange identical data into groups. It is typically used with aggregate functions (such as COUNT, SUM, AVG) to perform calculations on each group rather than on the entire dataset.

# Aggregate functions
COUNT(): Returns the number of rows.
SUM(): Returns the total sum of values.
AVG(): Returns the average of values.
MIN(): Returns the smallest value.
MAX(): Returns the largest value

# Index
Indexes are database objects that improve query performance by allowing faster retrieval of rows. They function like a book’s index, making it quicker to find specific data without scanning the entire table. However, indexes require additional storage and can slightly slow down data modification operations. Types of Indexes:

Clustered Index: Sorts and stores data rows in order of the key (only one per table).
Non-Clustered Index: Separate structure with pointers to data rows (can be many per table).
Unique Index: Ensures no duplicate values.
Composite Index: Index on multiple columns.

DELETE: Removes rows one at a time and records each deletion in the transaction log, allowing rollback. It can have a WHERE clause.
TRUNCATE: Removes all rows at once without logging individual row deletions. It cannot have a WHERE clause and is faster than DELETE for large data sets.

# Commands
DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE.
DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE.
DCL (Data Control Language): GRANT, REVOKE.
TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT.

# Trigger
A trigger is a set of SQL statements that automatically execute in response to certain events on a table, such as INSERT, UPDATE, or DELETE. Triggers help maintain data consistency, enforce business rules, and implement complex integrity constraints.

# store procedure
A stored procedure is a precompiled set of SQL statements stored in the database. It can take input parameters, perform logic and queries, and return output values or result sets. Stored procedures improve performance and maintainability by centralizing business logic.

NVL() replaces a NULL value with a specified replacement value (e.g., NVL(Salary, 0)).
NVL2() returns one value if the expression is NOT NULL and another value if it is NULL.

# Scalar functions
They are often used for formatting or converting data. Common examples include:
LEN(): Returns the length of a string.
ROUND(): Rounds a numeric value.
CONVERT(): Converts a value from one data type to another.

COUNT(column) ignores NULL values and only counts non-NULL entries.
COUNT(*) counts all rows, including those with NULL values in columns.

# Window function
A window function performs a calculation across a set of rows (window) related to the current row without collapsing rows (unlike GROUP BY).

GROUP BY → reduces rows
Window function → keeps all rows + adds computed value

These functions can be used to compute running totals, moving averages, rank rows, etc.
Example: Calculating a running total
SELECT Name, Salary, 
    SUM(Salary) OVER (ORDER BY Salary) AS RunningTotal  
FROM Employees;

# Index vs Key
Index

An index is a database object created to speed up data retrieval. It stores a sorted reference to table data, which helps the database engine find rows more quickly than scanning the entire table.
Example: A non-unique index on a column like LastName allows quick lookups of rows where the last name matches a specific value.
Instead of reading each row sequentially, the database uses the index to jump directly to the relevant data pages. This reduces the number of disk I/O operations and speeds up query execution, especially for large tables.

Disadv:
Increased storage space for the index structures.
Additional overhead for write operations (INSERT, UPDATE, DELETE), as indexes must be updated whenever the underlying data changes.

2. Key
A key is a logical concept that enforces rules for uniqueness or relationships in the data.
For instance, a PRIMARY KEY uniquely identifies each row in a table and ensures that no duplicate or NULL values exist in the key column(s).
A FOREIGN KEY maintains referential integrity by linking rows in one table to rows in another.

# Sequence
A sequence is a database object that generates a series of unique numeric values. It’s often used to produce unique identifiers for primary keys or other columns requiring sequential values.

Local Temporary Table:
Prefixed with # (e.g., #TempTable).
Exists only within the session that created it.
Automatically dropped when the session ends.

Global Temporary Table:
Prefixed with ## (e.g., ##GlobalTempTable).
Visible to all sessions.
Dropped only when all sessions referencing it are closed.

# ACID
is an acronym that stands for Atomicity, Consistency, Isolation, and Durability, four key properties that ensure database transactions are processed reliably.

1. Atomicity:

A transaction is treated as a single unit of work, meaning all operations must succeed or fail as a whole.
If any part of the transaction fails, the entire transaction is rolled back.
Example: In banking, transferring money must debit one account and credit another; if one fails, both roll back.
2. Consistency:

A transaction must take the database from one valid state to another, maintaining all defined rules and constraints.
This ensures data integrity is preserved throughout the transaction process.
Example: Inventory count cannot drop below zero.
3. Isolation:

Transactions should not interfere with each other.
Even if multiple transactions occur simultaneously, each must operate as if it were the only one in the system until it is complete.
Example: Two people booking the same seat won’t overwrite each other’s data.
4. Durability:

Once a transaction is committed, its changes must persist, even in the event of a system failure.
This ensures the data remains stable after the transaction is successfully completed.
Example: A confirmed order stays in the system despite a server restart.


# Isolation
Isolation levels define the extent to which the operations in one transaction are isolated from those in other transactions. They are critical for managing concurrency and ensuring data integrity. Common isolation levels include:

1. Read Uncommitted:

Allows reading uncommitted changes from other transactions.
Can result in dirty reads, where a transaction reads data that might later be rolled back.
2. Read Committed:

Ensures a transaction can only read committed data.
Prevents dirty reads but does not protect against non-repeatable reads or phantom reads.
3. Repeatable Read:

Ensures that if a transaction reads a row, that row cannot change until the transaction is complete.
Prevents dirty reads and non-repeatable reads but not phantom reads.
4. Serializable:

The highest level of isolation.
Ensures full isolation by effectively serializing transactions, meaning no other transaction can read or modify data that another transaction is using.
Prevents dirty reads, non-repeatable reads, and phantom reads, but may introduce performance overhead due to locking and reduced concurrency.


# How do you handle deadlocks in SQL databases?
Deadlocks occur when two or more transactions hold resources that the other transactions need, resulting in a cycle of dependency that prevents progress. Strategies to handle deadlocks include:

1. Deadlock detection and retry:

Many database systems have mechanisms to detect deadlocks and terminate one of the transactions to break the cycle.
The terminated transaction can be retried after the other transactions complete.
2. Reducing lock contention:

Use indexes and optimized queries to minimize the duration and scope of locks.
Break transactions into smaller steps to reduce the likelihood of conflicts.
3. Using proper isolation levels:

In some cases, lower isolation levels can help reduce locking.
Conversely, higher isolation levels (like Serializable) may ensure a predictable order of operations, reducing deadlock risk.
4. Consistent ordering of resource access:

Ensure that transactions acquire resources in the same order to prevent cyclical dependencies.

1. Live Lock
Occurs when two or more transactions keep responding to each other’s changes, but no progress is made.
Unlike a deadlock, the transactions are not blocked; they are actively running, but they cannot complete.

2. Deadlock
A deadlock occurs when two or more transactions are waiting on each other’s resources indefinitely, blocking all progress.
No progress can be made unless one of the transactions is terminated

# Partitioning
Horizontal partitioning is row-based, focusing on distributing the dataset’s rows across partitions.
Vertical partitioning is column-based, aiming to separate less-used columns into different partitions or tables.
Partitioning splits a single table into smaller, logical pieces, usually within the same database.

# Shards
Sharding involves splitting a database into multiple smaller, independent databases (shards).

# Recursive Query
SQL handles recursive queries using Common Table Expressions (CTEs). A recursive CTE repeatedly references itself to process hierarchical or tree-structured data.

Key Components:

Anchor Member: The initial query that starts the recursion.
Recursive Member: A query that references the CTE to continue building the result set.
Termination Condition: Ensures that recursion stops after a certain depth or condition is met.