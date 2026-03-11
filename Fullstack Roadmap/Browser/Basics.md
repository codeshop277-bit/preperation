# HTTP Request Lifecycle (What really happens when your UI hits an API)

1. DNS Resolution
api.example.com → IP address


Browser checks DNS cache → OS cache → ISP DNS
This is why CDNs matter (closer DNS + edge servers)

2. TCP Handshake
SYN → SYN-ACK → ACK
Establishes a reliable connection
Costly if repeated → keep-alive connections help

3. TLS/SSL Handshake (HTTPS only)
Certificate verification
Key exchange

Encrypted tunnel setup
➡️ Adds latency, but mandatory for security

4. HTTP Request Sent

Includes:
Method (GET, POST)
Headers (cookies, auth tokens)
Body (JSON, FormData)

Example:

POST /login
Authorization: Bearer token
Content-Type: application/json

5. Server Processing
Auth middleware
Business logic
DB / cache calls

6. HTTP Response Returned
200 OK
Set-Cookie: sessionId=abc

7. Browser Processing

Parses headers
Stores cookies
JS Promise resolves
UI re-renders

🎯 Senior-level optimization thoughts
Avoid unnecessary round trips
Batch API calls
Cache aggressively (HTTP cache + memory)
Abort stale requests (AbortController)
Handle retries & idempotency

# HTTP Methods (Beyond “GET fetches, POST sends data”)
| Method | Purpose          | Idempotent | Cacheable |
| ------ | ---------------- | ---------- | --------- |
| GET    | Read data        | ✅          | ✅         |
| POST   | Create / trigger | ❌          | ❌         |
| PUT    | Replace resource | ✅          | ❌         |
| PATCH  | Partial update   | ❌          | ❌         |
| DELETE | Remove resource  | ✅          | ❌         |

Why UI engineers should care
Idempotency → safe retries on network failure
An API call is idempotent if making the same request multiple times has the same effect as making it once.
GET should NEVER mutate data
Browsers & proxies treat methods differently
CORS behaves differently based on method + headers

| Aspect         | SSL                   | TLS                      |
| -------------- | --------------------- | ------------------------ |
| Full form      | Secure Sockets Layer  | Transport Layer Security |
| Status         | ❌ Deprecated / broken | ✅ Actively used          |
| Latest version | SSL 3.0               | TLS 1.3                  |
| Security       | Weak, vulnerable      | Strong, modern crypto    |
| Usage today    | ❌ Should NOT be used  | ✅ Used everywhere        |
High-level handshake comparison
SSL / TLS ≤ 1.2 (simplified)
ClientHello
ServerHello
ServerCertificate
ServerKeyExchange
ClientKeyExchange
ChangeCipherSpec
Finished


Problems:

Too many round trips

Weak algorithms supported

Vulnerable to downgrade attacks

TLS 1.3 handshake (modern)
ClientHello (+ key share)
ServerHello (+ key share)
Encrypted Extensions
Certificate
Finished


Improvements:
🔥 Fewer round trips (faster)
🔐 Strong ciphers only
🚫 No insecure fallbacks
⚡ Faster page loads

# Cookies vs localstorage vs sessionstorage
Cookies
Sent automatically with every HTTP request
Size limit ~4KB
Can be HttpOnly, Secure, SameSite
Best for:
Authentication sessions
Server-managed state
⚠️ Risk:
CSRF if misconfigured

🔹 localStorage
Persistent
JS-accessible
~5–10MB
Best for:
UI preferences
Feature flags
Non-sensitive cached data
❌ Never store tokens (XSS risk)

🔹 sessionStorage
Per-tab
Cleared on tab close
Best for:
Temporary UI state
Multi-step forms

# CORS 
CORS (Cross-Origin Resource Sharing) is a browser-enforced security mechanism that controls which origins are allowed to read responses from another origin.

Key point (repeat this in interviews):
👉 CORS is NOT a backend security feature. It is enforced only by browsers.

First: Why CORS exists (the problem it solves)
Same-Origin Policy (SOP)

By default, browsers block JS from reading responses from a different origin.

Origin =

protocol + domain + port
| URL                                          | Origin                             |
| -------------------------------------------- | ---------------------------------- |
| [https://app.com](https://app.com)           | [https://app.com](https://app.com) |
| [http://app.com](http://app.com)             | ❌ different (protocol)             |
| [https://api.app.com](https://api.app.com)   | ❌ different (domain)               |
| [https://app.com:3000](https://app.com:3000) | ❌ different (port)                 |


Without SOP + CORS:

A malicious website could read:
Your bank balance
Your emails
Your private APIs (cookies auto-attached)

➡️ CORS exists to allow controlled exceptions to SOP

2️⃣ Preflight Request (OPTIONS) — the real pain point

Most modern apps trigger this.

When preflight happens

If ANY of the following is true:
Method ≠ GET/POST/HEAD
Authorization header used
Content-Type: application/json
Custom headers (X-*)
Cookies sent cross-origin

Preflight flow (step-by-step)
Step 1: Browser sends OPTIONS
OPTIONS /api/data
Origin: https://app.example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Authorization, Content-Type

Step 2: Server must explicitly approve
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true

Step 3: Browser decision
✅ Approved → actual request is sent
❌ Rejected → browser blocks request entirely

# HTTP vs HTTPS
What is HTTP?
    HTTP (HyperText Transfer Protocol) is a plain-text protocol used for client–server communication.
📦 Data is sent as-is over the network.

Problems with HTTP
❌ No encryption
❌ Anyone on the network can read/modify data
❌ Vulnerable to:

Man-in-the-Middle (MITM)
Credential theft
Data tampering
Browser ─── plain text ─── Server

What is HTTPS?
HTTPS = HTTP + TLS (Transport Layer Security)
Before HTTP data is exchanged, a TLS handshake happens to:
Authenticate the server
Establish encryption keys
Secure the connection
Browser ── TLS handshake ── encrypted HTTP ── Server

| Feature         | HTTP            | HTTPS       |
| --------------- | --------------- | ----------- |
| Encryption      | ❌ No            | ✅ Yes (TLS) |
| Data safety     | ❌ Insecure      | ✅ Secure    |
| Port            | 80              | 443         |
| Certificate     | ❌ Not needed    | ✅ Required  |
| SEO             | ❌ Penalized     | ✅ Boosted   |
| HTTP/2, HTTP/3  | ❌ No            | ✅ Yes       |
| Modern browsers | ⚠️ “Not Secure” | 🔒 Trusted  |

What exactly happens in HTTPS?
Step-by-step (simplified)
1️⃣ Browser requests https://example.com
2️⃣ TLS handshake
Server sends certificate
Browser verifies CA
Encryption keys agreed
3️⃣ Encrypted HTTP traffic starts
4️⃣ Data stays private & untampered
💡 TLS happens before any HTTP request.

HTTP sends data in plain text, while HTTPS encrypts communication using TLS to provide security, authentication, and data integrity.

Why HTTP/2 & HTTP/3 are useful here (HTTPS context)
Performance
Faster page loads
Better LCP, TTFB, CLS
Fewer connections
Security
TLS mandatory
Encrypted by default
No sniffing or tampering
Frontend impact (very relevant for you)
Faster React hydration
Better asset loading
Smooth mobile experience
Ideal for SPAs & MFEs

7️⃣ Interview-ready comparison
Feature	HTTP/1.1	HTTP/2	HTTP/3
Transport	TCP	TCP	UDP (QUIC)
Multiplexing	❌	✅	✅
HOL blocking	❌ App-level	❌ TCP-level	✅ Solved
TLS required	❌	✅	✅ (built-in)
Mobile friendly	❌	⚠️	✅
8️⃣ One-liner answers (memorize these)
Port

A port is a logical endpoint that allows multiple services to run on the same IP and route traffic to the correct application.

HTTP/2

HTTP/2 improves performance by multiplexing multiple requests over a single encrypted TCP connection.

HTTP/3

HTTP/3 runs over QUIC on UDP, eliminating transport-layer head-of-line blocking and improving performance on unreliable networks.

TL;DR mental model
Port → where traffic goes
HTTP/1.1 → slow, many connections
HTTP/2 → fast, single TCP connection
HTTP/3 → fastest, UDP + QUIC


Detect in Network tab, enable protocol col in dev tools
| Protocol value | Meaning          |
| -------------- | ---------------- |
| `http/1.1`     | Old HTTP         |
| `h2`           | HTTP/2           |
| `h3`           | HTTP/3 (QUIC)    |
| `quic`         | HTTP/3 transport |
| `(blank)`      | Cached / local   |

# TCP - Transmission comission protocol