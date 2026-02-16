GraphQL is a schema-driven, client-controlled API layer that optimizes data fetching for modern frontend architectures while centralizing API contracts.

GraphQL Characteristics
Single endpoint
Schema-driven (Query, Mutation)
Client controls response shape
Strong typing & introspection
No versioning needed (additive evolution)

| Concern        | REST                | GraphQL       |
| -------------- | ------------------- | ------------- |
| Endpoints      | Many                | Single        |
| Over-fetching  | Common              | Eliminated    |
| Under-fetching | Common              | Eliminated    |
| Versioning     | Required            | Rarely needed |
| Flexibility    | Backend-driven      | Client-driven |
| Caching        | Simple (HTTP cache) | Complex       |
| Learning Curve | Low                 | Medium        |

🧠 Why GraphQL Should Be Preferred (When Appropriate)
1️⃣ Frontend-Heavy Applications (React/Next.js, Mobile)
Since you work heavily in frontend architecture — GraphQL shines when:
Multiple UI screens need different shapes of same entity
You want to reduce network calls
UI evolves frequently

2️⃣ Microservice Aggregation
GraphQL acts as a BFF (Backend for Frontend) layer:
Aggregates data from multiple services
Shields frontend from backend changes

3️⃣ Performance Control at Client Layer
Frontend controls:
Fields
Nested depth
Shape of response
This improves:
Bandwidth efficiency
Render performance
Developer velocity

```js
// RESI API
// 🔹 CREATE USER
  const createUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Balaji",
          email: "balaji@test.com"
        })
      });
      const data = await res.json();
      alert("User created: " + data.id);
    } catch (err) {
      console.error("Error creating user", err);
    }
  };

  // 🔹 DELETE USER
  const deleteUser = async () => {
    try {
      await fetch(`${BASE_URL}/users/101`, {
        method: "DELETE"
      });
      setUser(null);
      alert("User deleted");
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

//GraphQL
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://testdomain.com/graphql"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "x-tenant-id": "tenant-123"
    }
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient";
import UserGraphQL from "./UserGraphQL";

function App() {
  return (
    <ApolloProvider client={client}>
      <UserGraphQL />
    </ApolloProvider>
  );
}

export default App;

import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_USER = gql`
  query GetUser {
    user(id: 101) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser {
    createUser(input: {
      name: "Balaji"
      email: "balaji@test.com"
    }) {
      id
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser(id: 101) {
      success
    }
  }
`;

export default function UserGraphQL() {
  const { data, loading, error, refetch } = useQuery(GET_USER);

  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      <h2>GraphQL User</h2>

      {data?.user && (
        <div>
          <p>Name: {data.user.name}</p>
          <p>Email: {data.user.email}</p>
        </div>
      )}

      <button
        onClick={async () => {
          await createUser();
          refetch();
        }}
      >
        Create User
      </button>

      <button
        onClick={async () => {
          await deleteUser();
          refetch();
        }}
      >
        Delete User
      </button>
    </div>
  );
}
```
1️⃣ Query vs Mutation vs Subscription
🔹 Query
Used for read operations
Must be side-effect free
Equivalent to GET in REST
query {
  user(id: 1) {
    name
  }
}

🔹 Mutation
Used for write operations
Can modify server state
Equivalent to POST/PUT/DELETE
mutation {
  createUser(name: "Balaji") {
    id
  }
}

🔹 Subscription
Used for real-time updates
Typically WebSocket-based
Push model instead of request-response
subscription {
  userCreated {
    id
    name
  }
}
Query = read
Mutation = write
Subscription = real-time push

2️⃣ Schema
The contract of your API.
Strongly typed
Defines available queries, mutations, types
Single source of truth
Self-documenting

Example:
type Query {
  user(id: ID!): User
}
type Mutation {
  createUser(name: String!): User
}
Schema defines what is possible.
Clients cannot request fields not defined here.

3️⃣ Type System
GraphQL is strongly typed.
Core types:
String
Int
Float
Boolean
ID
Custom types:
```js
type User {
  id: ID!
  name: String!
  email: String
}
```
Key concepts:
! → Non-nullable
[User] → List
[User!]! → Non-null list of non-null users
Strong typing prevents runtime contract mismatches.

4️⃣ Resolvers
Resolvers are functions that return data for fields.
Schema:
type Query {
  user(id: ID!): User
}

Resolver:
const resolvers = {
  Query: {
    user: (_, args, context) => {
      return db.getUser(args.id);
    }
  }
};

Each field can have a resolver.
Schema defines structure.
Resolvers define execution logic.

5️⃣ Arguments
Arguments allow dynamic data fetching.
Schema:
type Query {
  user(id: ID!): User
}

Query:
query {
  user(id: 101) {
    name
  }
}

Arguments are:
Strongly typed
Validated against schema

6️⃣ Variables
Avoid hardcoding values inside query string.
Better practice:
query GetUser($id: ID!) {
  user(id: $id) {
    name
  }
}

Variables payload:
{
  "id": 101
}

Why use variables?
Cleaner queries
Better caching
Prevents query recompilation
More secure than string interpolation

7️⃣ Fragments
Fragments allow reusable field selections.
fragment UserFields on User {
  id
  name
  email
}
query {
  user(id: 1) {
    ...UserFields
  }
}
Benefits:
Avoid repetition
Shared UI data contracts
Better maintainability
In large frontend apps, fragments often mirror UI components.

| Concept      | Purpose                 |
| ------------ | ----------------------- |
| Query        | Read data               |
| Mutation     | Modify data             |
| Subscription | Real-time updates       |
| Schema       | API contract            |
| Type System  | Strong validation layer |
| Resolvers    | Execution logic         |
| Arguments    | Dynamic inputs          |
| Variables    | Runtime-safe parameters |
| Fragments    | Reusable field sets     |
