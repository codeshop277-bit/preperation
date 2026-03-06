# Chain calculator / Method Chaining
Chaining (Fluent API) is a pattern where methods return the same object (this) so multiple operations can be executed in a single statement.

```js
query.select("users").where("age > 18").orderBy("name").execute()
new Calculator(10)
  .add(5)
  .multiply(2)
  .subtract(3)
  .result(); // 27
```
Real Frontend Example (Testing Libraries)
Libraries like Cypress / Playwright use chaining heavily.
Example style:
```js
cy.get("button")
  .click()
  .should("be.visible")
  .should("contain", "Submit")
  ```
  Chaining works because each method returns the same instance (this) or a new instance, enabling sequential operations.

# Promise Sequence
Running async operations one after another, where the next starts only after the previous resolves.
Used when operations depend on previous results.
```js
async function checkout() {
  const order = await createOrder();
  const payment = await processPayment(order.id);
  const receipt = await sendReceipt(order.id);

  return receipt;
}
createOrder → processPayment → sendReceipt
```
# Promise.all
Runs multiple promises in parallel and resolves when all succeed.
If any promise fails → entire promise rejects.
```js
async function loadDashboard() {
  const [user, posts, notifications] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchNotifications()
  ]);

  return { user, posts, notifications };
}
```
Why use it
Improves performance
Parallel API calls
API1
API2   → run together
API3

# Promise.allSettled
Waits for all promises to finish (success or failure).
Returns status of each promise.
Example (multiple uploads)
```js
const results = await Promise.allSettled([
  uploadFile(file1),
  uploadFile(file2),
  uploadFile(file3)
]);
//Result format
[
 { status: "fulfilled", value: ... },
 { status: "rejected", reason: ... }
]
```
Use case
Bulk operations
File uploads
Independent tasks

# Promise.race
Returns the first promise that settles (resolve or reject).
Whichever promise finishes first wins the race.
Very common in production systems where you don’t want a request hanging forever.
Example: cancel request if API takes more than 3 seconds.

```js
function fetchWithTimeout(url, timeout = 3000) {
  const apiCall = fetch(url);

  const timer = new Promise((_, reject) =>
    setTimeout(() => reject("Request timeout"), timeout)
  );

  return Promise.race([apiCall, timer]);
}

fetchWithTimeout("/api/user")
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
  ```
Real frontend scenarios
API timeout
Cancel slow network requests
Fastest CDN response
Fallback services

# Promise.any
Returns the first successfully resolved promise.
Rejected promises are ignored until all fail.
Suppose the same service is hosted on multiple regions or CDNs.
You only need one successful response.

```js
Promise.any([
  fetch("https://us.api.com/data"),
  fetch("https://eu.api.com/data"),
  fetch("https://asia.api.com/data")
])
.then(res => res.json())
.then(console.log)
.catch(() => console.log("All servers failed"));
```
If one service is down, use another automatically.

| Method                 | Behavior                       | Use Case         |
| ---------------------- | ------------------------------ | ---------------- |
| **Sequence**           | Run promises one after another | dependent APIs   |
| **Promise.all**        | Run in parallel, fail fast     | dashboard data   |
| **Promise.race**       | First settled promise wins     | timeouts         |
| **Promise.any**        | First successful promise wins  | CDN fallback     |
| **Promise.allSettled** | Wait for all results           | batch processing |

# Pipe and compose
Pipe and compose are function composition utilities used to combine multiple functions into a single pipeline. Pipe executes left-to-right while compose executes right-to-left. They are commonly used in functional programming and libraries like Redux middleware and Lodash.

Pipe -> pipe(f1, f2, f3)
input → f1 → f2 → f3 → result
const pipe = (...fns) => (value) =>
  fns.reduce((acc, fn) => fn(acc), value);
```js
const addTax = price => price * 1.18;
const applyDiscount = price => price * 0.9;
const format = price => `$${price.toFixed(2)}`;

const calculatePrice = pipe(addTax, applyDiscount, format);

calculatePrice(100);
```
Execution
100
→ addTax
→ applyDiscount
→ format
```js
const trim = str => str.trim();
const toLower = str => str.toLowerCase();
const validate = str => str.length > 3;

const processUsername = pipe(trim, toLower, validate);

processUsername("  JohnDoe  ");
```
# Compose
Same idea but execution is reversed.
compose(f3, f2, f1)
input → f1 → f2 → f3
const compose = (...fns) => (value) =>
  fns.reduceRight((acc, fn) => fn(acc), value);

```js
const calculatePrice = compose(format, applyDiscount, addTax);

calculatePrice(100);
```
Real Software Example (Redux)
Redux internally uses compose for middleware.
Example conceptually:

compose(
  authMiddleware,
  loggerMiddleware,
  errorMiddleware
)(dispatch);

Each middleware wraps the next one.