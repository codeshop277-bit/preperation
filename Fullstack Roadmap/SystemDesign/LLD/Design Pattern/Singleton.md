✅ What is Singleton?

Singleton ensures that:

Only one instance of a class exists.

That instance is globally accessible.

🔹 What Problem Does It Solve?

Without Singleton:

Multiple instances may be created accidentally.

Shared state becomes inconsistent.

Resource-heavy objects (DB connections, loggers, configs) get duplicated.

Example Problem:

Imagine creating multiple DB connections in your Node.js app:
```js
const db1 = new Database();
const db2 = new Database();
```
Now you have:
Multiple connections
Wasted memory
Possible data inconsistency
Singleton prevents this.
🔹 Basic JS Example
Classic Singleton (ES6 Class)
```js
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }

    this.data = "I am single instance";
    Singleton.instance = this;
  }

  getData() {
    return this.data;
  }
}

const obj1 = new Singleton();
const obj2 = new Singleton();

console.log(obj1 === obj2); // true ✅
```
👉 Even though we used new twice, both variables point to the same object.
🔹 Better Real-World Example (Logger)
```js
class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    this.logs = [];
    Logger.instance = this;
  }

  log(message) {
    this.logs.push(message);
    console.log(message);
  }

  getLogs() {
    return this.logs;
  }
}

const logger1 = new Logger();
const logger2 = new Logger();

logger1.log("App started");

console.log(logger2.getLogs()); 
// ["App started"]

console.log(logger1 === logger2); // true
```
Why this is useful?
Central logging system
Shared logs across app
No duplicate logger objects
1️⃣ Database Connections
Prevent multiple connections
Maintain shared pool
2️⃣ Logger
Central logging system
3️⃣ Configuration Manager
Store ENV variables once
4️⃣ Cache Manager
Shared in-memory cache
5️⃣ Redux Store (Frontend)
In your React apps (since you use Redux), the store is effectively a Singleton:
One global state
One store instance