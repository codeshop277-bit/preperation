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