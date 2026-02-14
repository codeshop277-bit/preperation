✅ What is Observer Pattern?

The Observer Pattern defines a one-to-many dependency between objects.

When one object (Subject) changes state,
all its dependents (Observers) are automatically notified.

🔹 What Problem Does It Solve?

Without Observer:
```js
componentA.update();
componentB.update();
componentC.update();
```
Problems:
Tight coupling
Subject must know all dependents
Hard to scale
Observer solves:
Loose coupling
Dynamic subscriptions
Automatic notifications
| Role     | Responsibility                          |
| -------- | --------------------------------------- |
| Subject  | Maintains list of observers             |
| Observer | Subscribes and reacts to updates        |
| Notify   | Inform all observers when state changes |

When stock price changes, all subscribers get notified.
```js
class Stock {
  constructor() {
    this.observers = [];
    this.price = 0;
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  setPrice(newPrice) {
    this.price = newPrice;
    this.notify();
  }

  notify() {
    this.observers.forEach(observer =>
      observer.update(this.price)
    );
  }
}
class Investor {
  constructor(name) {
    this.name = name;
  }

  update(price) {
    console.log(`${this.name} notified: New price is ${price}`);
  }
}
const stock = new Stock();

const investor1 = new Investor("Alice");
const investor2 = new Investor("Bob");

stock.subscribe(investor1);
stock.subscribe(investor2);

stock.setPrice(100);
// Alice notified: New price is 100
// Bob notified: New price is 100

stock.unsubscribe(investor2);

stock.setPrice(120);
// Alice notified: New price is 120
```
🔥 What Happened?
Stock doesn’t know about specific investors.
Investors decide to subscribe.
When price changes → all observers automatically notified.
Loose coupling achieved ✅

```js
function createObservable() {
  const observers = [];

  return {
    subscribe(fn) {
      observers.push(fn);
    },
    notify(data) {
      observers.forEach(fn => fn(data));
    }
  };
}

const observable = createObservable();

observable.subscribe(data => console.log("Observer1:", data));
observable.subscribe(data => console.log("Observer2:", data));

observable.notify("Hello World");
```
🔹 When To Use Observer
✔ Event systems
✔ UI updates
✔ Pub/Sub messaging
✔ Real-time systems
✔ Global state management
| Aspect        | Meaning                               |
| ------------- | ------------------------------------- |
| Purpose       | Notify multiple objects automatically |
| Pattern Type  | Behavioral                            |
| Core Idea     | Subscribe → Notify                    |
| Real Examples | DOM events, Redux, EventEmitter       |
