The video provides a comprehensive system design walkthrough for building a URL shortening service, similar to TinyURL or Bitly. It starts by explaining the motivation behind URL shorteners—making lengthy web addresses more shareable, reducing storage needs, and improving performance in applications like social media or APIs. The core focus is on the architecture, scalability considerations, and, most importantly, the algorithms for generating unique short URLs from long ones. These short URLs act as keys that redirect users back to the original long URL via HTTP redirects (typically 301 for permanent/cached or 302 for temporary/tracked access).
The video assumes a high-scale scenario: handling 100 million URLs per day, leading to about 365 billion records over 10 years and roughly 36.5 terabytes of storage (estimating 100 bytes per record). It covers requirements like short URL length (6–8 characters), character set (alphanumeric: 0–9, a–z, A–Z for 62 possibilities), and optional features like updates, deletions, or custom short URLs. The workflow is straightforward: a client submits a long URL, the server generates and stores a short URL, and accessing the short one triggers a database lookup and redirect.
The video emphasizes two main methods for generating short URLs: a hash-based approach with collision resolution (more random and secure but prone to conflicts) and an ID-based approach using base-62 encoding (simpler and collision-free but potentially guessable). It highlights trade-offs, database design, caching, and load balancing for production readiness. The explanation uses examples to illustrate calculations and stresses that no single method is perfect—designs should adapt to specific needs like security or custom aliases.
Detailed Explanation of Methods for Generating Short URLs
The video dives deeply into the generation process, treating it as the heart of the system. Short URLs are typically 6–8 characters long from a 62-character alphabet, allowing up to 62^7 ≈ 3.5 trillion unique codes—far exceeding most needs. Both methods store mappings in a database (e.g., columns for short URL, long URL, and optional ID), with global servers querying it for redirects.
Method 1: Hash-Based Generation with Collision Resolution
This approach leverages cryptographic hashing for determinism and randomness, ideal for avoiding sequential predictability. However, truncating hashes to short lengths risks collisions (multiple long URLs mapping to the same short code), so the video stresses robust resolution techniques.
Step-by-Step Process:

Input Preparation: Take the long URL (e.g., "https://www.example.com/very/long/path?query=param").
Hash Computation: Apply a fast, fixed-output hash function like MD5 (128 bits), SHA-1 (160 bits), or CRC32 (32 bits). These produce a hexadecimal string, e.g., MD5 of the URL might yield "d41d8cd98f00b204e9800998ecf8427e".
Truncation: Extract the first N characters (e.g., 7) from the hash and convert to base-62 for readability. For the above MD5, take "d41d8cd" → encode to alphanumeric like "aB3k9pQ".
Uniqueness Check: Query the database for this short code.
No Collision: Store the pair (short URL → long URL) and return the short URL (e.g., "short.ly/aB3k9pQ").
Collision Detected: Modify the input to force a new hash:
Append a counter or predefined string (e.g., "abc" for first retry, "xyz" for second).
Re-hash the modified URL (e.g., "https://www.example.com/... + abc").
Truncate and check again. Repeat up to a max (e.g., 3–5 tries) or fall back to another method.


Edge Handling: The video notes that collisions are rare (<<1% with good hashes) but more likely for similar URLs (e.g., from the same domain). It recommends indexing the database on short URLs for O(1) lookups.

Strengths and Stress Points: This method ensures even distribution and security (hard to reverse-engineer long URLs), but the video warns about computational overhead from retries. It's collision-resistant by design, making it suitable for high-traffic systems where randomness prevents abuse like URL guessing.
Method 2: ID-Based Generation with Base-62 Encoding
This counter-driven method treats short URLs as encoded database auto-increment IDs, ensuring uniqueness without hashing. The video praises its simplicity—no collisions possible—and walks through the math for base conversion, a staple in distributed systems.
Step-by-Step Process:

ID Assignment: Use a global counter (e.g., via database auto-increment or distributed ID generator like Twitter's Snowflake) to assign a unique integer ID (starting from 1).
Base-62 Conversion: Encode the ID into a short string using the 62-character set (0–9 = 0–9, a–z = 10–35, A–Z = 36–61).
Algorithm (similar to converting decimal to any base):
Divide ID by 62, track remainders.
Map remainders to characters (e.g., 0='0', 10='a', 36='A').
Read remainders from last to first (reverse for final string).

Example Calculation (from video, for ID 11157, targeting ~3–7 chars):
11157 ÷ 62 = 179 remainder 59 → 'X' (59 maps to 'X').
179 ÷ 62 = 2 remainder 55 → 't' (55 maps to 't').
2 ÷ 62 = 0 remainder 2 → '2'.
Result: "2tx" (reversed remainders).


Storage and Return: Insert into database (ID, short URL "2tx", long URL) and return "short.ly/2tx".
Lookup: On access, decode "2tx" back to ID (reverse base-62), fetch long URL by ID for efficiency.

Strengths and Stress Points: Zero collisions and low compute cost, but the video stresses vulnerabilities: sequential IDs enable enumeration attacks (e.g., guessing "short.ly/aaa" after "short.ly/aaz"). Length varies (shorter IDs yield fewer chars, e.g., ID 1 = "1"), so padding may be needed. It's efficient for writes but requires careful ID management in sharded databases.
The video compares them: Hashing for security/randomness, ID for speed/simplicity. It also touches on hybrids (e.g., hash IDs for obfuscation) and extras like analytics tracking via redirect hits.
JavaScript Implementation
Below is a simple Node.js implementation of both methods. It uses an in-memory Map for storage (replace with a real DB like MongoDB for production). For hashing, it uses Node's crypto module (MD5). Base-62 uses custom encode/decode functions. Run with node urlShortener.js.

```js

const crypto = require('crypto');

// Character set for base-62
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SHORT_LENGTH = 7; // Target length
let counter = 0; // For ID-based method
const db = new Map(); // In-memory storage: shortUrl -> {longUrl, id?}

// Method 1: Hash-based with collision resolution
function generateHashShortUrl(longUrl) {
  let attempts = 0;
  const maxAttempts = 5;
  let suffix = '';
  
  while (attempts < maxAttempts) {
    const input = longUrl + suffix;
    const hash = crypto.createHash('md5').update(input).digest('hex');
    // Take first SHORT_LENGTH * 2 hex chars (for ~7 base-62 chars) and convert to base-62
    const shortHex = hash.substring(0, SHORT_LENGTH * 2);
    let shortUrl = '';
    for (let i = 0; i < shortHex.length; i += 2) {
      const byte = parseInt(shortHex.substr(i, 2), 16);
      shortUrl += BASE62_CHARS[byte % 62]; // Simple conversion (not full base-62, but approx for demo)
    }
    shortUrl = shortUrl.substring(0, SHORT_LENGTH);
    
    if (!db.has(shortUrl)) {
      db.set(shortUrl, { longUrl });
      return `short.ly/${shortUrl}`;
    }
    // Collision: append suffix for retry
    suffix = attempts === 0 ? 'abc' : attempts === 1 ? 'xyz' : `retry${attempts}`;
    attempts++;
  }
  throw new Error('Collision resolution failed after max attempts');
}

// Method 2: ID-based with base-62 encoding
function toBase62(num) {
  if (num === 0) return BASE62_CHARS[0];
  let encoded = '';
  while (num > 0) {
    encoded = BASE62_CHARS[num % 62] + encoded;
    num = Math.floor(num / 62);
  }
  // Pad to SHORT_LENGTH if needed
  while (encoded.length < SHORT_LENGTH) {
    encoded = BASE62_CHARS[0] + encoded;
  }
  return encoded.substring(0, SHORT_LENGTH);
}

function fromBase62(shortCode) {
  let num = 0;
  for (let i = 0; i < shortCode.length; i++) {
    num = num * 62 + BASE62_CHARS.indexOf(shortCode[i]);
  }
  return num;
}

function generateIdShortUrl(longUrl) {
  counter++;
  const id = counter;
  const shortCode = toBase62(id);
  const shortUrl = `short.ly/${shortCode}`;
  db.set(shortCode, { longUrl, id });
  return shortUrl;
}

// Redirect lookup (common to both)
function getLongUrl(shortUrl) {
  const shortCode = shortUrl.replace('short.ly/', '');
  const entry = db.get(shortCode);
  if (!entry) throw new Error('Short URL not found');
  return entry.longUrl;
}

// Example usage
const longUrl1 = 'https://www.example.com/very/long/path?query=param';
const shortHash = generateHashShortUrl(longUrl1);
console.log('Hash-based short URL:', shortHash);

const longUrl2 = 'https://www.example.com/another/long/path';
const shortId = generateIdShortUrl(longUrl2);
console.log('ID-based short URL:', shortId);

console.log('Redirect for hash:', getLongUrl(shortHash));
console.log('Redirect for ID:', getLongUrl(shortId));
```
Notes on Implementation:

Hash Method: Uses MD5 for speed; truncates and approximates base-62 (full hex-to-base62 is more involved but similar). Retries with suffixes as described.
ID Method: Full base-62 encode/decode; pads short codes. Counter simulates auto-increment.
Scalability: In production, use Redis for caching, sharding for DB, and distributed locks for counter.
Test by running: Collisions trigger retries; decoding works for lookups.

Practical Scenarios for URL Shorteners
URL shorteners shine in real-world apps where brevity and tracking matter. Here are key use cases:

Social Media Sharing: Platforms like Twitter (now X) or LinkedIn auto-shorten links in posts to fit character limits. E.g., sharing a 200-char blog post URL becomes "bit.ly/abc123", boosting click-through rates by 20–30% (per studies). The hash method prevents predictable spam links.
Email Marketing & SMS Campaigns: Long affiliate or promo URLs (e.g., e-commerce tracking links) are shortened to avoid truncation in mobile previews. Bitly's analytics track opens/clicks via 302 redirects, helping optimize campaigns—e.g., a retailer shortens "amazon.com/deal?ref=mar2026" to monitor ROI.
IoT and Embedded Systems: Devices with tiny screens (e.g., smartwatches) share diagnostic URLs. ID-based method suits low-compute edge devices, encoding firmware update links sequentially for easy versioning.
API Rate Limiting & Obfuscation: In microservices, shorten internal endpoints (e.g., "api.internal.com/v1/long/path") to external short codes. Hashing adds security against scraping; useful in fintech for masking transaction APIs.
Event Tracking in Ads: Google Ads or Facebook uses shorteners for UTM parameters. E.g., "fb.com/ad?campaign=delhi2026" → "tinyurl.com/delhiad". Custom short URLs (premium feature) brand them (e.g., "nike.ly/run"), increasing trust and recall.
QR Codes and Print Media: Short URLs fit better in QR generation tools, reducing scannability errors. In magazines, a hashed short link to a video tutorial avoids exposing full affiliate params.

These scenarios leverage the methods' strengths: hashing for unpredictable, secure links in public sharing; ID for ordered, efficient internal systems. Always pair with HTTPS and expiration policies to mitigate abuse.