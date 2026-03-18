Middleware prepares the request
Controller handles HTTP
Service decides logic
Repository talks to DB

Request
  ↓
Validation (Zod)  ← DTOs live here
  ↓
Middleware (auth, etc.)
  ↓
Controller
  ↓
Service
  ↓
Repository

# ZOD
TypeScript-first schema validation library used to:
Validate request body / params / query
Parse & transform data
Infer TypeScript types automatically

# DTO - Data Transfer Object
A validated & well-defined data shape that moves between layers

```js
router.post('/login', validate(LoginDto), login);
//DTO 
const { z } = require('zod');

const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

module.exports = { LoginDto };

//Validate in middleware
function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body); // validated + sanitized
      next();
    } catch (err) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: err.errors
      });
    }
  };
}

module.exports = { validate };

```
```js
//Route
router.get('/users/:id', authMiddleware, getProfile);

//Controller
// controllers/user.controller.js
const userService = require('../services/user.service');

async function getProfile(req, res, next) {
  try {
    const data = await userService.getUserProfile(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile };

//Service
// services/user.service.js
const userRepo = require('../repositories/user.repository');

async function getUserProfile(userId) {
  const user = await userRepo.getUserById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user.id,
    name: user.name
  };
}

module.exports = { getUserProfile };

//Repository(all db calls)
// repositories/user.repository.js
async function getUserById(id) {
  return db.query('SELECT * FROM users WHERE id = $1', [id]);
}

module.exports = { getUserById };

```

# Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

Parse incoming request bodies
Populate req.body
Must run before routes/controllers

| Property      | Without `express.json()` / `urlencoded()` |
| ------------- | ----------------------------------------- |
| `req.body`    | ❌ **undefined**                           |
| `req.params`  | ✅ **works**                               |
| `req.query`   | ✅ **works**                               |
| `req.headers` | ✅ **works**                               |

# Avoid Middleware Pitfalls
✔ Parsing first
✔ Auth after public routes
✔ Routes before 404
✔ Error handler last
✔ Always call next()
✔ One parser only

# Error validation
Bad request
  ↓
Frontend validation → reject
  ↓
Gateway validation → reject
  ↓
Zod DTO → reject
  ↓
Service business rule → reject
  ↓
DB (LAST resort)

# Validation at the Edge
Validation done as close to the client as possible:
Frontend (browser)
Mobile app
API Gateway / CDN (Cloudflare, Nginx, API Gateway)

# Validation at the Server
Validation done inside your backend:
Express/Nest app
Zod / DTO validation
Service-level business rules

# Validation at gateway - CDN/Cloudfare
```js
export default {
  async fetch(request) {
    // 1️⃣ Allow only POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 2️⃣ Enforce Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response('Unsupported Media Type', { status: 415 });
    }

    // 3️⃣ Body size limit (fail fast)
    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > 1024) {
      return new Response('Payload Too Large', { status: 413 });
    }

    // 4️⃣ Parse + validate JSON structure
    const body = await request.json();

    if (!body.email || !body.password) {
      return new Response('Invalid payload', { status: 400 });
    }

    // 5️⃣ Forward ONLY valid requests to backend
    return fetch('https://api.myapp.com/auth/login', {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body)
    });
  }
};
```

# Cloudflare WAF rules (no code):
Example rules
Block requests if:
Body size > 1MB
Missing Content-Type
SQL injection patterns
XSS payloads

# Mutler - File upload
# Crypto - encryption, decryption, hashing
# Passports - authorisation, signins, authentication

# Piping
piping refers to the process of passing the output of one stream directly into another stream. It allows data to flow through multiple streams without needing to store it in memory or temporarily write it to disk. This is a common pattern used in file handling, HTTP requests, and other I/O operations in NodeJS.

# Cluster
cluster modules are created that provide us the way to make child processes that run simultaneously with a single parent process.
Fork(): It creates a new child process from the master. The isMaster returns true if the current process is master or else false.
isWorker: It returns true if the current process is a worker or else false.
process: It returns the child process which is global.
send(): It sends a message from worker to master or vice versa. 
kill(): It is used to kill the current worker.

# Event Emitter
In Node.js, an Event Emitter is a class that allows objects to emit events and register listeners (callbacks) to handle those events. It is part of the events module and is commonly used to handle asynchronous events and to implement an observer pattern, where an object (the emitter) triggers events, and other objects (listeners) respond to those events.