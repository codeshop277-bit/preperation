# Request Lifecycle
7️⃣ Request lifecycle (step-by-step)
Example: HTTP request to your server
    Client sends request
    OS receives it
    libuv registers socket
    Event loop detects incoming request
    JS handler executes
    If async operation:
    Delegated to OS / thread pool
    Callback queued
    Event loop executes callback
    Response sent

# V8 Engine
    Executes Javascript
    Compiles JS to readable machine code
    Handles memory(heap and Garbage collection)

It does not handle HTTP, timers, files, async I/O.
All async tasks are handled by libuv

Execution flow:
JS parsed
AST created
Optimized machine code generated
Executed directly by CPU
⚡ This is why Node.js JS execution is fast.

# Abstract SYntax Tree(AST):
AST is a structured, tree-based representation of JavaScript code that allows V8 to understand, optimize, and execute your code efficiently.
```js
{
  "type": "FunctionDeclaration",
  "name": "square",
  "params": [
    {
      "type": "Identifier",
      "name": "x"
    }
  ],
  "body": {
    "type": "BlockStatement",
    "body": [
      {
        "type": "ReturnStatement",
        "argument": {
          "type": "BinaryExpression",
          "operator": "*",
          "left": {
            "type": "Identifier",
            "name": "x"
          },
          "right": {
            "type": "Identifier",
            "name": "x"
          }
        }
      }
    ]
  }
}
```

# Call Stacks
    Single threaded, Last In First Out, Executes functions
 ```js
    function a() {
  b();
}
function b() {
  console.log("Hello");
}
a();
```
Stack --> a-> b-> Console log

# Heap
    Stores objects and closuers
    Managed by v8 GC
const user = { name: "Balaji" };
Stored in heap, referenced from stack

Infinite loops will block stack
When memory leaks, heap grows and pauses GC which will result in slow app.

# Async Input/Output
Async I/O means performing input/output operations without blocking the main JavaScript thread, allowing Node.js to handle many operations concurrently.
Input/Output  any operation where program talks to the outer world, like
    Reading/Writing a file, Network calls, DB Queries, Timers, DNS lookups, SOckets, websockets
```js
const data = fs.readFileSync("file.txt");
console.log(data);
Blocking I/O (bad) blocks entiner thread

fs.readFile("file.txt", (err, data) => {
  console.log(data);
});
Non - blocking I/O
```
Request registered
Thread is free
OS reads file
Callback queued
Event loop executes callback

Why async I/O is critical
Handles thousands of requests
No waiting
CPU stays free

# NodeJS single threaded but async
JavaScript runs on one main thread
I/O is handled:
    By OS async APIs OR
    By libuv’s thread pool
JS thread stays free to handle more work
💡 This is the core idea behind Node.js scalability.

# Event loop
What JS should run next
Lives inside libuv

setTimeout is async - once task is done
Callback is queued
Event loop executes it later

# Event loop phases
| Phase         | Runs                        |
| ------------- | --------------------------- |
| Timers        | `setTimeout`, `setInterval` |
| I/O callbacks | OS callbacks                |
| Idle/Prepare  | Internal                    |
| Poll          | Incoming I/O                |
| Check         | `setImmediate()`            |
| Close         | Cleanup                     |

setImmediate runs in check phase
setTimeout(0) waits for timers phase

| Type           | Purpose                                        |
| -------------- | ---------------------------------------------- |
| **Microtasks** | Run **immediately after current JS execution** |
| **Macrotasks** | Scheduled in **event loop phases**             |

# MIcrotasks
What counts as Microtasks?
process.nextTick()
Promise callbacks
Promise.then
Promise.catch
Promise.finally

process.nextTick  →  Promise microtasks  →  Event loop phases
Microtasks run before the event loop moves to the next phase
process.nextTick() has higher priority than Promises
Overusing nextTick can starve the event loop

# Execution Order in NODEJS
Synchronous code
↓
process.nextTick queue
↓
Promise microtask queue
↓
Timers phase (macrotasks)
↓
I/O callbacks
↓
Poll phase
↓
Check phase
↓
Close callbacks
(repeat)

Poll phase handles Most async callbacks from:
TCP sockets
HTTP requests
File reads/writes

If poll queue is not empty → execute callbacks
If poll queue is empty:
If setImmediate exists → move to check phase
Else → wait for I/O (block efficiently)


| Scenario               | Best API       |
| ---------------------- | -------------- |
| Run after I/O finishes | `setImmediate` |Check phase
| Run after fixed delay  | `setTimeout`   |
| Handle incoming data   | Poll phase     |


# Browser VS NODE
| Aspect           | Node.js              | Browser  |
| ---------------- | -------------------- | -------- |
| Microtasks       | `nextTick`, Promises | Promises |
| Extra priority   | `process.nextTick`   | ❌        |
| Event loop owner | libuv                | Browser  |
| `setImmediate`   | ✅                    | ❌        |

| Aspect                 | Node.js                      | Browser       |
| ---------------------- | ---------------------------- | ------------- |
| Special priority queue | `process.nextTick` (highest) | ❌             |
| Microtask source       | `nextTick`, Promises         | Promises      |
| Starvation risk        | 🚨 Very high                 | 🚨 High       |
| Rendering blocked      | ❌ (no UI)                    | ✅ (UI freeze) |

# Libuv 
- written in c
libuv maintains a small pool of worker threads (default 4) to execute blocking or CPU-heavy operations off the main JavaScript thread.

Some OS operations are:
Blocking
Not truly async on all platforms
CPU expensive

Examples:
File system operations (fs)
DNS lookups
Crypto (pbkdf2, scrypt)
Compression (zlib)
These are delegated to the libuv thread pool.

```js
const fs = require("fs");

fs.readFile("data.txt", (err, data) => {
  console.log("File read done");
});

console.log("End");
```
Execution breakdown
1️⃣ JS thread starts execution
fs.readFile() is called
JS thread does NOT read the file

2️⃣ Task handed to libuv
libuv detects this is a blocking filesystem call
Pushes task into thread pool queue

3️⃣ Worker thread picks it up
One of the 4 threads:
Reads file from disk
Waits on OS
JS thread is free immediately

4️⃣ Task completes
Worker thread finishes reading
Result is placed into event loop queue

5️⃣ Event loop executes callback
Callback runs on main JS thread
console.log("File read done")

✅ Uses thread pool
fs.readFile
fs.writeFile
crypto.pbkdf2
crypto.scrypt
zlib
dns.lookup

❌ Does NOT use thread pool
HTTP networking (uses OS async sockets)
setTimeout
setImmediate
Promises
fetch

# Socket
A socket is communication endpoint that allows 2 programs to exchange data.

Node.js sockets are:
Non-blocking
Event-driven
Handled by the OS kernel, not JS threads

fetch("https://api.example.com/users");
JS Thread
  ↓
Node HTTP client
  ↓
TCP Socket (non-blocking)
  ↓
OS kernel (epoll-linux / kqueue-macos / IOCP-windowss)
  ↓
Data arrives
  ↓
Event loop notified
  ↓
JS callback executes
| Operation        | Uses socket? |
| ---------------- | ------------ |
| HTTP / HTTPS     | ✅            |
| Database queries | ✅            |
| WebSockets       | ✅            |
| gRPC             | ✅            |
| REST APIs        | ✅            |
| GraphQL          | ✅            |
| Redis / Kafka    | ✅            |
| FTP / SMTP       | ✅            |

Operations which does not use socket
| Operation          | Why                   |
| ------------------ | --------------------- |
| File system (`fs`) | Disk I/O, not network |
| Crypto hashing     | CPU-bound             |
| Compression        | CPU-bound             |
| Image processing   | CPU-bound             |

# Thread pool: what is it for?

The libuv thread pool exists for operations that:
Are blocking
Are CPU-heavy
Cannot be done async by OS

# Sockets vs Thread Pool
| Aspect             | Sockets              | Thread Pool          |
| ------------------ | -------------------- | -------------------- |
| Purpose            | Network I/O          | Blocking / CPU tasks |
| Managed by         | OS kernel            | libuv                |
| Blocking           | ❌ No                 | ❌ No (offloaded)     |
| Uses extra threads | ❌ No                 | ✅ Yes                |
| Scalability        | Very high            | Limited              |
| Typical use        | DB, APIs, WebSockets | fs, crypto, zlib     |
| Parallelism        | Event-driven         | Thread-based         |
| Max concurrency    | Thousands            | Limited by pool size |

Node can:
Handle 10k+ socket connections
With 1 JS thread

# Event driven
In Node.js, events come from the system, not from users.
Code runs in response to events instead of running sequentially and waiting.
| Event source | Example                 |
| ------------ | ----------------------- |
| Network      | Data received on socket |
| File system  | File read completed     |
| Timer        | setTimeout fired        |
| Database     | Query response arrived  |
| Stream       | Chunk received          |
| Process      | Child process exited    |

# I/O-bound (Node is GREAT)
Examples:
APIs
DB queries
File reads
Network calls

# CPU-bound (Node struggles)
Examples:
Image processing
Encryption loops
Large calculations

# When Node.js is a BAD choice
❌ Heavy CPU workloads
❌ Video transcoding
❌ Machine learning
❌ Real-time physics engines

# One Line Architecture
V8        → Executes JS
Call Stack → Runs JS (single thread)
Heap       → Stores objects
Event Loop → Schedules execution
libuv      → Handles async I/O
ThreadPool → Handles expensive tasks
OS         → Does real I/O work

# Event Loop Browser VS Node
| Aspect             | Browser           | Node.js                      |
| ------------------ | ----------------- | ---------------------------- |
| Primary goal       | UI responsiveness | Server scalability           |
| Main event sources | UI, DOM, network  | Network, file system, timers |
| Rendering involved | ✅ Yes             | ❌ No                         |
| Event loop owner   | Browser engine    | libuv                        |
| JS engine          | V8 (Chrome)       | V8                           |

Browser
Run JS
↓
Run all microtasks
↓
Render (if needed)
↓
Take next task

Node 
Phase callback
↓
process.nextTick
↓
Promise microtasks
↓
Next phase
Browser event loop is optimized for UI rendering, while Node.js event loop is optimized for high-throughput asynchronous I/O using libuv phases.