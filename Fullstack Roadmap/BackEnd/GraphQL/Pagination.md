# 1️⃣ Offset Pagination (REST)
Backend (Express)
```js
app.get("/users-offset", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const users = await db.query(
    "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?",
    [limit, offset]
  );

  res.json({
    data: users,
    nextOffset: offset + limit
  });
});
import { useEffect, useState } from "react";

export default function OffsetPagination() {
  const [users, setUsers] = useState([]);
  const [offset, setOffset] = useState(0);

  const fetchUsers = async () => {
    const res = await fetch(
      `/users-offset?limit=10&offset=${offset}`
    );
    const data = await res.json();

    setUsers(prev => [...prev, ...data.data]);
    setOffset(data.nextOffset);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map(u => (
        <p key={u.id}>{u.name}</p>
      ))}
      <button onClick={fetchUsers}>Load More</button>
    </div>
  );
}
```
# Offset GraphQL
```js
type User {
  id: ID!
  name: String!
}

type Query {
  usersOffset(limit: Int!, offset: Int!): [User!]!
}
//Resolver
usersOffset: async (_, { limit, offset }) => {
  return db.query(
    "SELECT * FROM users ORDER BY id LIMIT ? OFFSET ?",
    [limit, offset]
  );
}
//React Apollo
const GET_USERS_OFFSET = gql`
  query($limit: Int!, $offset: Int!) {
    usersOffset(limit: $limit, offset: $offset) {
      id
      name
    }
  }
`;
```
# Cursor Bases REST
```js
app.get("/users-cursor", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const after = req.query.after;

  let query = "SELECT * FROM users";
  let params = [];

  if (after) {
    query += " WHERE id > ?";
    params.push(after);
  }

  query += " ORDER BY id LIMIT ?";
  params.push(limit);

  const users = await db.query(query, params);

  const nextCursor =
    users.length > 0 ? users[users.length - 1].id : null;

  res.json({
    data: users,
    nextCursor
  });
});
export default function CursorPagination() {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch(
      `/users-cursor?limit=10&after=${cursor || ""}`
    );
    const data = await res.json();

    setUsers(prev => [...prev, ...data.data]);
    setCursor(data.nextCursor);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      {users.map(u => (
        <p key={u.id}>{u.name}</p>
      ))}
      <button onClick={fetchUsers}>Load More</button>
    </div>
  );
}
```
# Cursor based Graphql
```js
users: async (_, { first, after }) => {
  let query = "SELECT * FROM users";
  let params = [];

  if (after) {
    query += " WHERE id > ?";
    params.push(parseInt(after));
  }

  query += " ORDER BY id LIMIT ?";
  params.push(first);

  const users = await db.query(query, params);

  return {
    edges: users.map(u => ({
      node: u,
      cursor: u.id.toString()
    })),
    pageInfo: {
      hasNextPage: users.length === first,
      endCursor:
        users.length > 0
          ? users[users.length - 1].id.toString()
          : null
    }
  };
}

```
# Scroll Based REST
```js
import { useEffect, useRef, useState } from "react";

export default function InfiniteScroll() {
  const [users, setUsers] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const loaderRef = useRef(null);

  const fetchUsers = async () => {
    if (!hasNext) return;

    const res = await fetch(
      `/users-cursor?limit=10&after=${cursor || ""}`
    );
    const data = await res.json();

    setUsers(prev => [...prev, ...data.data]);
    setCursor(data.nextCursor);
    if (!data.nextCursor) setHasNext(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchUsers();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [cursor]);

  return (
    <div>
      {users.map(u => (
        <p key={u.id}>{u.name}</p>
      ))}
      <div ref={loaderRef}>Loading...</div>
    </div>
  );
}
```
# Scroll GraphQL
```js
const GET_USERS = gql`
  query($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      edges {
        node {
          id
          name
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function InfiniteGraphQL() {
  const { data, fetchMore } = useQuery(GET_USERS, {
    variables: { first: 10 }
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        after: data.users.pageInfo.endCursor
      }
    });
  };

  return (
    <div>
      {data?.users.edges.map(edge => (
        <p key={edge.node.id}>{edge.node.name}</p>
      ))}
      {data?.users.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
```
| Pattern   | Easy       | Scalable           | Production Ready  |
| --------- | ---------- | ------------------ | ----------------- |
| Offset    | ✅          | ❌                  | Small apps        |
| Cursor    | Medium     | ✅                  | Yes               |
| Scroll UI | UI Trigger | Depends on backend | Yes (with cursor) |


# Offset VS Where id > 150\
SELECT * 
FROM users
WHERE id > 150
ORDER BY id
LIMIT 10;

Filter rows where id is greater than 150
Sort them in ascending order
Return the first 10 rows from that filtered result

How the Database Executes It (Index Case)

If id is indexed (primary key usually is):
The DB engine:
Finds 150 in the index tree
Moves to the next leaf node
Reads the next 10 entries
This is called:
Seek-based pagination
It does NOT scan 150 rows and discard them.

# Offset
SELECT * 
FROM users
ORDER BY id
LIMIT 10 OFFSET 150;
What happens:
DB sorts rows
Reads first 150 rows
Discards them
Returns next 10
That’s why OFFSET becomes slow at high numbers.
