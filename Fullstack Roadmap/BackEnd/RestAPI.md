# Idempotency
Making the same request multiple times result in same outcome as making it once

| HTTP Method | Idempotent? | Why                               |
| ----------- | ----------- | --------------------------------- |
| **GET**     | ✅ Yes       | Read-only                         |
| **PUT**     | ✅ Yes       | Replaces resource completely      |
| **DELETE**  | ✅ Yes       | Deleting again does nothing       |
| **POST**    | ❌ No        | Creates a new resource every time |
| **PATCH**   | ⚠️ Depends  | Idempotent if designed carefully  |

# Status Code
| Code | Meaning    | When to use             |
| ---- | ---------- | ----------------------- |
| 200  | OK         | GET, PUT, PATCH success |
| 201  | Created    | POST success            |
| 204  | No Content | DELETE success          |

| Code | Meaning       | Example               |
| ---- | ------------- | --------------------- |
| 400  | Bad Request   | Validation error      |
| 401  | Unauthorized  | Missing/invalid token |
| 403  | Forbidden     | No permission         |
| 404  | Not Found     | Resource missing      |
| 409  | Conflict      | Duplicate record      |
| 422  | Unprocessable | Business validation   |

✔ Use proper HTTP methods
✔ Use correct status codes
✔ Keep APIs stateless
✔ Consistent resource naming
✔ Don’t leak internal errors
✔ Version APIs (/api/v1/users)
✔ Validate input & return clear errors

# Stateless 
A REST API is stateless when each request contains all the information needed to process it, and the server does not store client session state between requests.
Every request = complete context
No dependency on previous requests

# Paginaion
GET /users?page=2&limit=10
<!-- Implement Cursor based scrolling -->

# Filtering
GET /orders?status=paid
GET /users?role=admin
GET /products?category=electronics
GET /orders?status=shipped&payment=success

# Sorting
GET /users?sort=createdAt
GET /users?sort=name
GET /users?sort=-createdAt
GET /products?sort=price

“Pagination, filtering, and sorting should be implemented using query parameters on collection resources. Offset-based pagination is suitable for tables, while cursor-based pagination is preferred for large datasets and infinite scrolling.”

# API Contract
| Aspect   | Description                  |
| -------- | ---------------------------- |
| Endpoint | URL + HTTP method            |
| Request  | Headers, params, body schema |
| Response | Body schema, status codes    |
| Errors   | Error format & codes         |
| Behavior | Rules, constraints, defaults |
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        200:
          description: User found
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
        404:
          description: User not found

# Backward Compatible
A system is backward compatible if old clients continue to work with newer API versions.