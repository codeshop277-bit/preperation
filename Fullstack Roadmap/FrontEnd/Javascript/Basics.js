/**
 * ============================================================
 * DAY 2 — JAVASCRIPT EVENT LOOP (BROWSER vs NODE.JS)
 * ============================================================
 *
 * This file contains a COMPLETE, LINEAR explanation of:
 * - Call Stack
 * - Web APIs
 * - Event Loop
 * - Microtasks vs Macrotasks
 * - Promises
 * - setTimeout vs Promise
 * - Browser Event Loop
 * - Node.js Event Loop
 * - libuv phases
 * - process.nextTick
 * - Hands-on examples
 * - Interview-focused explanations
 *
 * Read top to bottom. Run snippets individually.
 */

/* ============================================================
 * 1. CALL STACK
 * ============================================================
 *
 * JavaScript is SINGLE-THREADED.
 * All synchronous code runs on the CALL STACK.
 * The stack follows LIFO (Last In, First Out).
 */

function a() {
  b();
}
function b() {
  c();
}
function c() {
  console.log("Hello from call stack");
}
a();

/*
Execution order on call stack:
a → b → c → console.log → pop → pop → pop

If the call stack is blocked:
- Browser → UI freezes
- Node.js → Server becomes unresponsive
*/

/* ============================================================
 * 2. WEB APIs (BROWSER ONLY)
 * ============================================================
 *
 * Browsers provide Web APIs to handle async work
 * OUTSIDE the call stack.
 *
 * Examples:
 * - setTimeout
 * - DOM events
 * - fetch
 * - setInterval
 *
 * Node.js DOES NOT have Web APIs.
 */

setTimeout(() => {
  console.log("Handled by Web API, not call stack");
}, 0);

/*
Flow:
1. setTimeout is registered
2. Browser handles timer
3. Callback goes to task queue
*/

/* ============================================================
 * 3. EVENT LOOP (HIGH LEVEL)
 * ============================================================
 *
 * The event loop constantly checks:
 * - Is the call stack empty?
 * - Are microtasks pending?
 * - Can a macrotask be executed?
 * - Can rendering happen?
 *
 * This is how async JS works in a single thread.
 */

/* ============================================================
 * 4. MICROTASKS vs MACROTASKS
 * ============================================================
 *
 * MACROTASKS (Task Queue):
 * - setTimeout
 * - setInterval
 * - UI events
 * - setImmediate (Node.js)
 *
 * MICROTASKS (Higher priority):
 * - Promise.then / catch / finally
 * - queueMicrotask
 * - MutationObserver
 *
 * RULE:
 * After the call stack is empty,
 * ALL microtasks run BEFORE any macrotask.
 */

/* ============================================================
 * 5. PROMISE QUEUE (MICROTASK QUEUE)
 * ============================================================
 */

console.log("start");

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("end");

/*
Output:
start
end
promise

Why?
- Promise callback waits for stack to clear
- Microtasks run before macrotasks
*/

/* ============================================================
 * 6. setTimeout vs Promise (INTERVIEW CLASSIC)
 * ============================================================
 */

console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");

/*
Output:
A
D
C
B

Key point:
setTimeout(0) is NEVER immediate
*/

/* ============================================================
 * 7. BROWSER EVENT LOOP ORDER
 * ============================================================
 *
 * Browser execution cycle:
 *
 * 1. Execute synchronous code
 * 2. Execute ALL microtasks
 * 3. Execute ONE macrotask
 * 4. Render (layout / paint / composite)
 * 5. Repeat
 *
 * Rendering:
 * - Can happen between macrotasks
 * - NEVER between microtasks
 */

/* ============================================================
 * 8. NODE.JS EVENT LOOP (libuv)
 * ============================================================
 *
 * Node.js does NOT use Web APIs.
 * It uses libuv.
 *
 * Event loop phases:
 *
 * 1. Timers (setTimeout, setInterval)
 * 2. I/O callbacks
 * 3. Idle, prepare
 * 4. Poll
 * 5. Check (setImmediate)
 * 6. Close callbacks
 */

/* ============================================================
 * 9. MICROTASKS IN NODE.JS
 * ============================================================
 *
 * Node has TWO microtask mechanisms:
 * 1. process.nextTick (HIGHEST priority)
 * 2. Promise.then
 */

process.nextTick(() => {
  console.log("nextTick");
});

Promise.resolve().then(() => {
  console.log("promise");
});

/*
Priority order:
process.nextTick
↓
Promise callbacks
↓
Event loop phase callbacks

WARNING:
Too much process.nextTick can STARVE the event loop
*/

/* ============================================================
 * 10. BROWSER vs NODE.JS (SUMMARY)
 * ============================================================
 *
 * Browser:
 * - Uses Web APIs
 * - Has rendering
 * - No process.nextTick
 * - No setImmediate
 *
 * Node.js:
 * - Uses libuv
 * - No rendering
 * - Has process.nextTick
 * - Has setImmediate
 */

/* ============================================================
 * 11. HANDS-ON: PREDICT OUTPUT
 * ============================================================
 */

// Browser-style example
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

/*
Output:
1
4
3
2
*/

// Node-style example
setTimeout(() => console.log("timeout"));

setImmediate(() => console.log("immediate"));

Promise.resolve().then(() => console.log("promise"));

process.nextTick(() => console.log("nextTick"));

/*
Output:
nextTick
promise
timeout / immediate (order may vary)

setTimeout vs setImmediate order is NOT guaranteed
unless inside an I/O cycle
*/

/* ============================================================
 * 12. INTERVIEW ANSWER (MEMORIZE THIS)
 * ============================================================
 *
 * JavaScript is single-threaded and executes synchronous code
 * using a call stack.
 *
 * Asynchronous operations are handled by the event loop using
 * microtask and macrotask queues.
 *
 * Microtasks like Promises always execute before macrotasks
 * like setTimeout.
 *
 * In Node.js, the event loop is managed by libuv with multiple
 * phases, and process.nextTick has the highest priority.
 */

/* ============================================================
 * END OF FILE
 * ============================================================
 */
