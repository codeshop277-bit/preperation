    It provides a thin layer of features to build web servers, API's and backend services

    Client (Browser / App)
            ↓
    HTTP Request
            ↓
    Node.js HTTP Server
            ↓
    Express App
    ├── Middleware stack
    ├── Routing layer
    ├── Controllers / Business logic
            ↓
    HTTP Response
            ↓
    Client
    ```js
    const app = express();
    app.listen(3000);

    ```
    # app - is the central object
    Registers middleware
    Registers routes
    Handles incoming requests
    Sends responses

    # Middlewares -

    (req, res, next) => { ... }
    Request
    ↓
    Middleware 1
    ↓
    Middleware 2
    ↓
    Route Handler
    ↓
    Response
    app.use(express.json()); // body parser

    app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
    });

    They can modify req and res. End the request. Pass control using next()

    # Routing
    Routes map HTTP methods + paths to handlers.
    ```js
    app.get("/users", (req, res) => {
    res.json({ users: [] });
    });
    ```
    # Controllers/ Business Logic
    This is your application code:
    DB calls
    Validation
    Computation
    External APIs

    # Request and Response Objects
    Express extends Node’s native objects.
    req
    req.params
    req.query
    req.body
    req.headers

    res
    res.send()
    res.json()
    res.status()
    res.status(201).json({ success: true });

1. Client sends HTTP request
2. Node.js receives request
3. Express app is invoked
4. Middleware stack runs in order
5. Route is matched
6. Controller executes
7. Response is sent
8. Request lifecycle ends

Express is a middleware-driven request pipeline. Built on top of Node’s HTTP server. Used heavily for APIs, microservices, and backend servers

# Dependancy Injection
Dependency Injection (DI) is a design pattern where a class or module does not create its own dependencies, but instead receives them from the outside.
class UserService {
  constructor() {
    this.db = new Database(); // tightly coupled
  }

  getUser(id) {
    return this.db.findUser(id);
  }
}
Issues ❌
UserService is tightly coupled to Database
Hard to test (you can’t easily mock Database)
Changing DB implementation affects many places

class UserService {
  constructor(db) {
    this.db = db; // injected dependency
  }

  getUser(id) {
    return this.db.findUser(id);
  }
}
const db = new Database();
const userService = new UserService(db);
Benefits ✅
Loose coupling
Easy mocking in tests
Better scalability

```js
function createUserService({ db, logger }) {
  return {
    getUser(id) {
      logger.log("Fetching user");
      return db.findUser(id);
    }
  };
}
const userService = createUserService({
  db: new Database(),
  logger: new Logger()
});
```

# Monolith vs Modular 
1️⃣ What is a Monolith?
Definition
A monolith is a backend where:
Single codebase
Single deployment unit
All features live together
src/
 ├── routes/
 ├── controllers/
 ├── services/
 ├── models/
 └── utils/

Modular
A modular is still monolith but split into independant feature models
src/
 ├── users/
 │    ├── users.controller.ts
 │    ├── users.service.ts
 │    └── users.module.ts
 ├── orders/
 │    ├── orders.controller.ts
 │    ├── orders.service.ts
 │    └── orders.module.ts
 └── app.module.ts
| Aspect              | Monolith       | Modular Backend |
| ------------------- | -------------- | --------------- |
| Deployment          | Single         | Single          |
| Codebase            | Single         | Single          |
| Structure           | Flat / layered | Feature-based   |
| Coupling            | High           | Low             |
| Team scaling        | Difficult      | Easy            |
| Refactoring         | Risky          | Safer           |
| Testing             | Hard           | Easier          |
| Microservices ready | ❌              | ✅               |
