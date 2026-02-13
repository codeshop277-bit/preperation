# ✅ S.O.L.I.D Principles

S — Single Responsibility Principle (SRP)

O — Open/Closed Principle (OCP)

L — Liskov Substitution Principle (LSP)

I — Interface Segregation Principle (ISP)

D — Dependency Inversion Principle (DIP)

Let’s understand each with JavaScript examples (real-world oriented).

# 1️⃣ Single Responsibility Principle (SRP)

A class should have only one reason to change.
```js
//Bad example
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  saveToDatabase() {
    console.log("Saving user to DB");
  }

  sendEmail() {
    console.log("Sending email");
  }
}
```
🔴 Problem:
This class handles:
User data
Database logic
Email logic
If email logic changes → class changes.
If DB changes → class changes.
Too many responsibilities.
```js
//Good Example
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}

class UserRepository {
  save(user) {
    console.log("Saving user to DB");
  }
}

class EmailService {
  send(user) {
    console.log("Sending email to", user.email);
  }
}
```
Now:
User → only holds data
UserRepository → DB logic
EmailService → email logic
✔ Clean separation
✔ Easier testing
✔ Easier modification

# 2️⃣ Open/Closed Principle (OCP)

Open for extension, closed for modification.

You should be able to add new behavior without modifying existing code.
```js
//Bad example
class PaymentProcessor {
  process(type) {
    if (type === "credit") {
      console.log("Processing credit card");
    } else if (type === "paypal") {
      console.log("Processing PayPal");
    }
  }
}
```
If we add UPI → modify class ❌
Violates OCP.
```js
//Good example
class PaymentMethod {
  process() {}
}

class CreditCardPayment extends PaymentMethod {
  process() {
    console.log("Processing credit card");
  }
}

class PaypalPayment extends PaymentMethod {
  process() {
    console.log("Processing PayPal");
  }
}

class PaymentProcessor {
  process(paymentMethod) {
    paymentMethod.process();
  }
}
// Now to add UPI:

class UpiPayment extends PaymentMethod {
  process() {
    console.log("Processing UPI");
  }
}
```
# 3️⃣ Liskov Substitution Principle (LSP)

Subclasses should be replaceable for their base class without breaking behavior.
```js
//Bad example
class Bike {
  startEngine() {
    console.log("Engine started");
  }
}

class Bicycle extends Bike {
  startEngine() {
    throw new Error("Bicycles don't have engines!");
  }
}

function startTrip(vehicle) {
  vehicle.startEngine();
}

const myBike = new Bike();
const myBicycle = new Bicycle();

startTrip(myBike);      // ✅ Works
startTrip(myBicycle);   // ❌ Breaks
```
🚨 Problem
Bicycle extends Bike, but:
It cannot fulfill the contract of startEngine()
Substituting Bicycle where Bike is expected breaks behavior
👉 This violates LSP.
✅ Correct Design (Following LSP)
Instead of forcing all vehicles to have engines:
```js
class Vehicle {}

class EngineVehicle extends Vehicle {
  startEngine() {
    console.log("Engine started");
  }
}

class Bike extends EngineVehicle {}

class Bicycle extends Vehicle {
  pedal() {
    console.log("Pedaling...");
  }
}

function startTrip(vehicle) {
  if (vehicle instanceof EngineVehicle) {
    vehicle.startEngine();
  }
}
```
✔ Why This Works
Bicycle is no longer forced to implement startEngine()
Only engine vehicles have startEngine()
Substitution doesn’t break behavior
🧠 In React Terms
LSP =
"If a parent component expects X behavior, any child component used in its place must honor that behavior."

# 4️⃣ Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they don’t use.

JS doesn’t have interfaces natively, but we simulate via separation.
```js
//Bad example
class Machine {
  print() {}
  scan() {}
  fax() {}
}
class BasicPrinter extends Machine {
  print() {
    console.log("Printing");
  }
}
//Now it unnecessarily depends on scan() and fax() ❌
//Good example
class Printer {
  print() {}
}

class Scanner {
  scan() {}
}

class Fax {
  fax() {}
}

class BasicPrinter extends Printer {
  print() {
    console.log("Printing");
  }
}

class MultiFunctionPrinter extends Printer {
  print() {
    console.log("Printing");
  }
  scan() {
    console.log("Scanning");
  }
  fax() {
    console.log("Faxing");
  }
}
```
Now classes only depend on what they use ✔

# 5️⃣ Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules.
Both should depend on abstractions.
```js
// ??Bad example
class MySQLDatabase {
  save(data) {
    console.log("Saving to MySQL");
  }
}

class UserService {
  constructor() {
    this.db = new MySQLDatabase();
  }

  saveUser(user) {
    this.db.save(user);
  }
}
```
🔴 UserService tightly coupled to MySQL.

If we switch to MongoDB → modify UserService ❌
```js
//Good example
class Database {
  save(data) {}
}

class MySQLDatabase extends Database {
  save(data) {
    console.log("Saving to MySQL");
  }
}

class MongoDBDatabase extends Database {
  save(data) {
    console.log("Saving to MongoDB");
  }
}

class UserService {
  constructor(database) {
    this.db = database;
  }

  saveUser(user) {
    this.db.save(user);
  }
}
//Usage
const db = new MongoDBDatabase();
const userService = new UserService(db);
```
Now:
UserService depends on abstraction
Easily switch DB
Easy to test (mock database)
✔ Loose coupling
✔ Better testability
✔ Better scalability

# ✅ DRY Principle (Don’t Repeat Yourself)

Every piece of knowledge should have a single, unambiguous, authoritative representation within a system.

In simple words:

👉 Avoid duplicating logic, rules, or behavior.
👉 If you change something, you should change it in only one place.

This is extremely important in LLD and large-scale systems.
```js
//Bad example
function createUser(user) {
  if (!user.email.includes("@")) {
    throw new Error("Invalid email");
  }
  console.log("User created");
}

function updateUser(user) {
  if (!user.email.includes("@")) {
    throw new Error("Invalid email");
  }
  console.log("User updated");
}
//Good example
function validateEmail(email) {
  if (!email.includes("@")) {
    throw new Error("Invalid email");
  }
}

function createUser(user) {
  validateEmail(user.email);
  console.log("User created");
}

function updateUser(user) {
  validateEmail(user.email);
  console.log("User updated");
}
```
Now:

Validation logic in one place

If validation rule changes → update once ✔

# ✅ KISS Principle — Keep It Simple, Stupid

Design systems as simple as possible.
Avoid unnecessary complexity, abstraction, or over-engineering.

In LLD and real-world projects, complexity increases:

Bug probability 🚨

Debugging time ⏳

Maintenance cost 💰
KISS ensures:

Readable code

Faster onboarding

Easier debugging

Better long-term scalability
❌ Over-Engineered (Violates KISS)
Problem: Check if a number is even
```js
class NumberAnalyzer {
  constructor(number) {
    this.number = number;
  }

  isEven() {
    return new Promise((resolve, reject) => {
      try {
        if (typeof this.number !== "number") {
          throw new Error("Invalid input");
        }

        const result = this.number % 2 === 0 ? true : false;

        resolve({
          input: this.number,
          result,
          checkedAt: new Date(),
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
class NumberAnalyzer {
  constructor(number) {
    this.number = number;
  }

  isEven() {
    return new Promise((resolve, reject) => {
      try {
        if (typeof this.number !== "number") {
          throw new Error("Invalid input");
        }

        const result = this.number % 2 === 0 ? true : false;

        resolve({
          input: this.number,
          result,
          checkedAt: new Date(),
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
class NumberAnalyzer {
  constructor(number) {
    this.number = number;
  }

  isEven() {
    return new Promise((resolve, reject) => {
      try {
        if (typeof this.number !== "number") {
          throw new Error("Invalid input");
        }

        const result = this.number % 2 === 0 ? true : false;

        resolve({
          input: this.number,
          result,
          checkedAt: new Date(),
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
const analyzer = new NumberAnalyzer(10);
analyzer.isEven().then(console.log);
```
🔴 Problems:
Unnecessary class
Unnecessary Promise
Overstructured response object
Too much ceremony for a simple task
Harder to read
This is classic over-engineering.
✅ KISS Version (Clean & Simple)
```js
function isEven(number) {
  if (typeof number !== "number") {
    throw new Error("Invalid input");
  }

  return number % 2 === 0;
}

// Usage
console.log(isEven(10)); // true
```
🧠 Important Insight
KISS does NOT mean:
Write naive code
Ignore scalability
Avoid design patterns completely
It means:
Start simple.
Add complexity only when necessary.

# ✅ YAGNI Principle — You Aren’t Gonna Need It
Don’t implement something until it is actually required.
This principle comes from Agile development.
Core Idea:
Avoid building features:
“Just in case”
“Maybe we’ll need later”
“Future-proofing too early”
Because:
Requirements change
Extra code increases maintenance
Unused features create bugs
You waste development time

❌ Example — Violating YAGNI
Requirement:

We only need to create a simple user and store their name.

But developer over-engineers it:
```js
class User {
  constructor(name) {
    this.name = name;
    this.roles = [];
    this.permissions = [];
    this.auditLogs = [];
    this.metadata = {};
  }

  addRole(role) {
    this.roles.push(role);
  }

  removeRole(role) {
    this.roles = this.roles.filter(r => r !== role);
  }

  addPermission(permission) {
    this.permissions.push(permission);
  }

  logActivity(activity) {
    this.auditLogs.push({
      activity,
      timestamp: new Date(),
    });
  }
}
```
🔴 Problem:
Roles not required
Permissions not required
Audit logs not required
Metadata not required
Extra code to maintain
More bugs possible
We built a mini IAM system without requirement.
✅ YAGNI Version (Simple & Correct)
```js
class User {
  constructor(name) {
    this.name = name;
  }
}

// Usage
const user = new User("Balaji");
console.log(user.name);
```
🎯 Why YAGNI Matters in LLD
In interviews and real projects:
Bad engineers think:
“Let’s make it future proof.”
Good engineers think:
“Let’s make it correct for today. Refactor when needed.”