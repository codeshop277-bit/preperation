# Session Based Authentication
Browser ----(login)----> Server
Server --> create session in Redis
Server --> Set-Cookie: sessionId=abc123

Next Request:
Browser --> sends cookie
Server --> finds session in Redis
Server --> attaches user to req

Because if it’s browser-only, session-based might actually be the cleaner architecture for you.

# Setup Session based auth
npm install express-session connect-redis redis

const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");

const redisClient = createClient();
redisClient.connect();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    rolling: true, //Updates expiry on each request, If remain unactive will expire in 1 hour
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

app.post("/login", async (req, res) => {
  const user = await validateUser(req.body);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  req.session.user = {
    id: user.id,
    role: user.role
  };

  res.json({ message: "Logged in" });
});

const authenticate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
router.get("/users", authenticate, getUsers);

In JWT:
You manually create token
You manually send it
Client stores it

In Session-based:
Middleware generates ID
Middleware sets cookie
Middleware persists session
It’s server-managed auth state.

# Authentication Architecture Comparison

## Overview

Comparison of 4 common authentication approaches:

1. Session-Based (Redis-backed)
2. JWT Access + Refresh Tokens
3. Opaque Tokens (DB-backed access tokens)
4. OAuth2 / Authorization Server

---

## Comparison Table

| Parameter | Session-Based (Redis) | JWT + Refresh Tokens | Opaque Token (DB Stored) | OAuth2 / Auth Server |
|------------|-----------------------|----------------------|---------------------------|----------------------|
| **Stateful / Stateless** | Stateful | Access = Stateless, Refresh = Stateful | Fully Stateful | Usually Stateless Access |
| **Best For** | Browser-only SaaS | Web + Mobile + APIs | Enterprise / High-control systems | Large ecosystems / Microservices |
| **Mobile Friendly** | ❌ Not ideal | ✅ Yes | ✅ Yes | ✅ Yes |
| **Browser Friendly** | ✅ Excellent | ✅ Excellent | ✅ Good | ✅ Good |
| **Revocation Control** | ✅ Very Easy | ⚠ Requires DB tracking | ✅ Very Easy | ✅ Centralized |
| **Token Rotation Needed** | ❌ No | ✅ Recommended | ❌ No | ✅ Often |
| **Complexity Level** | Low–Medium | Medium–High | Medium | High |
| **Horizontal Scaling** | Needs shared store (Redis) | Very Good | Needs shared DB | Excellent |
| **Performance** | Fast (Redis lookup) | Very Fast (stateless access) | Slower (DB per request) | Depends on infra |
| **Logout Implementation** | Simple | Moderate | Simple | Centralized |
| **Multi-Device Sessions** | Easy | Easy (with DB refresh tracking) | Easy | Built-in |
| **Security Surface** | Smaller | Medium (token replay risk) | Smaller | Large but standardized |
| **XSS Risk** | Low (httpOnly cookie) | Medium if misconfigured | Low | Depends |
| **CSRF Consideration** | Yes (cookie-based) | Minimal (header-based) | Minimal | Depends |
| **Microservices Friendly** | ❌ No | ✅ Yes | ⚠ Requires shared DB | ✅ Designed for it |
| **Infrastructure Required** | Redis | None mandatory | Database | Dedicated Auth Server |
| **Operational Complexity** | Low | Medium | Medium | High |

---

## When To Use Each Approach

### 1️⃣ Session-Based (Redis)

Use When:
- Browser-only application
- Single backend
- No native mobile clients
- Simple SaaS dashboards
- Easy session revocation required

Avoid When:
- Supporting native mobile apps
- Public API exposure
- Microservices architecture

---

### 2️⃣ JWT Access + Refresh Tokens

Use When:
- Web + Mobile clients
- API-first backend
- Microservices architecture
- Horizontal scaling required
- Multi-device support needed

Notes:
- Implement refresh token rotation
- Store refresh tokens in DB
- Use short-lived access tokens

---

### 3️⃣ Opaque Tokens (DB-backed Access Tokens)

Use When:
- High-security environments
- Full revocation control needed
- Enterprise systems
- Regulated industries (banking, healthcare)

Tradeoff:
- Database lookup required for each request

---

### 4️⃣ OAuth2 / Authorization Server

Use When:
- Large distributed systems
- External integrations
- Third-party login providers
- Multi-tenant ecosystems
- Enterprise SSO

Examples:
- Keycloak
- Auth0
- AWS Cognito

---

## Architectural Summary

- **Browser-only app?** → Session-Based may be simplest.
- **Web + Mobile + APIs?** → JWT + Refresh is most flexible.
- **High-security enterprise?** → Opaque tokens.
- **Large ecosystem / multiple services?** → OAuth2.

# SSO
User authenticates once with a central identity provider
All connected applications trust that provider
# Single Sign-On (SSO) Overview

## What is SSO?

**Single Sign-On (SSO)** allows a user to log in once and gain access to multiple applications without re-authenticating.

Instead of each application handling authentication independently, authentication is centralized through a trusted **Identity Provider (IdP)**.

---

## Core Components

### 1️⃣ Identity Provider (IdP)
The central authentication authority responsible for:
- Verifying user credentials
- Issuing identity tokens
- Maintaining authentication sessions

Examples:
- Keycloak
- Okta
- Azure AD
- Auth0
- Google

---

### 2️⃣ Service Providers (SP)
Applications that rely on the Identity Provider for authentication.

Examples:
- Dashboard app
- Admin portal
- Analytics platform

Service providers do not authenticate users directly. They delegate authentication to the IdP.

---

## High-Level SSO Flow

1. User attempts to access Application A.
2. Application A redirects the user to the Identity Provider.
3. User logs in at the Identity Provider.
4. The Identity Provider creates its own session.
5. The Identity Provider redirects the user back to Application A with proof of authentication.
6. Application A validates the proof and creates a local session.

Now the user is logged in.

If the user later opens Application B:
- Application B redirects to the Identity Provider.
- The Identity Provider detects the existing session.
- User is automatically redirected back without seeing the login page.

---

## Common Protocols Used in SSO

### 🔹 OAuth 2.0 + OpenID Connect (OIDC)
Modern standard for web and mobile applications.

### 🔹 SAML
Common in enterprise and legacy systems.

---

## Benefits of SSO

- Improved user experience (login once)
- Centralized authentication management
- Easier user provisioning and deprovisioning
- Consistent security policies across applications
- Reduced password fatigue

---

## Considerations

- Introduces architectural complexity
- Creates a centralized dependency (IdP becomes critical infrastructure)
- Requires secure token validation between services

---

## When to Use SSO

SSO is ideal when:
- Multiple applications share the same user base
- You need centralized identity management
- You support enterprise customers
- You provide integrations across multiple services

---

## Architectural Insight

Without SSO:
Each application manages its own authentication.

With SSO:
Authentication is externalized into a dedicated identity service,
and applications trust that service for identity verification.

# Single Sign-On (SSO) Implementation (OAuth2 + OpenID Connect)

## Overview

This project demonstrates Single Sign-On (SSO) using:

- Node.js (Express)
- OAuth 2.0
- OpenID Connect (OIDC)
- A centralized Identity Provider (IdP)

Two separate applications (App A and App B) authenticate users through a shared Identity Provider.

Once a user logs in to one application, they can access the other without logging in again.

---

## Architecture


- Identity Provider handles authentication.
- Applications delegate authentication to the IdP.
- Applications maintain their own local sessions.

---

## Core Components

### 1️⃣ Identity Provider (IdP)
Responsible for:
- User authentication
- Managing login sessions
- Issuing tokens (ID Token, Access Token)

Examples:
- Keycloak
- Auth0
- Okta
- Azure AD

---

### 2️⃣ Applications (Service Providers)
- App A
- App B

Each app:
- Redirects users to the IdP for login
- Receives an authorization code
- Exchanges the code for tokens
- Creates a local session

---

## OAuth2 Authorization Code Flow (Simplified)

1. User visits App A.
2. App A redirects user to IdP login page.
3. User authenticates at IdP.
4. IdP creates its own session.
5. IdP redirects back to App A with an authorization code.
6. App A exchanges the code for tokens.
7. App A creates a local session.

Now the user is logged in to App A.

If the user later visits App B:
- App B redirects to IdP.
- IdP detects existing session.
- User is redirected back without re-entering credentials.

This is SSO.

---

## Implementation Flow (Node.js)

### 1️⃣ Configure OAuth Client

Each app registers as a client in the Identity Provider.

Required configuration:
- `client_id`
- `client_secret`
- `redirect_uri`
- `issuer_url`

---

### 2️⃣ Login Route

App redirects to IdP authorization endpoint:

```js
res.redirect(client.authorizationUrl({
  scope: "openid profile email"
}));

