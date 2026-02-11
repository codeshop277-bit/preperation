Factory Pattern is a creational design pattern that:
Encapsulates object creation logic and returns objects without exposing the instantiation details to the client.
Instead of doing:
const car = new Car();
You do:
const car = VehicleFactory.create("car");

Why Do We Need It? (Real LLD Thinking)
In Low Level Design, we care about:
✅ Single Responsibility
✅ Open/Closed Principle
✅ Loose Coupling
✅ Code scalability
If you directly use new everywhere:
Object creation logic gets duplicated
Changes ripple across multiple files
Adding new types requires modifying many places
Violates OCP
Factory centralizes creation logic.

Without factory
```js
function processPayment(type, details) {
  if (type === "credit") {
    return new CreditCardPayment(details);
  } else if (type === "upi") {
    return new UPIPayment(details);
  } else if (type === "paypal") {
    return new PaypalPayment(details);
  }
}
```
This is bad because:
Violates Open/Closed Principle
Adding new payment requires modifying this function
Tight coupling
✅ With Factory Pattern
Step 1: Create Base Interface (Conceptual in JS)
```js
class Payment {
  pay() {
    throw new Error("Method not implemented");
  }
}
//Step 2: Create classes
class CreditCardPayment extends Payment {
  constructor(details) {
    super();
    this.details = details;
  }

  pay() {
    console.log("Processing Credit Card payment");
  }
}

class UPIPayment extends Payment {
  constructor(details) {
    super();
    this.details = details;
  }

  pay() {
    console.log("Processing UPI payment");
  }
}

class PaypalPayment extends Payment {
  constructor(details) {
    super();
    this.details = details;
  }

  pay() {
    console.log("Processing PayPal payment");
  }
}
//Step 3: Factory class
class PaymentFactory {
  static createPayment(type, details) {
    switch (type) {
      case "credit":
        return new CreditCardPayment(details);
      case "upi":
        return new UPIPayment(details);
      case "paypal":
        return new PaypalPayment(details);
      default:
        throw new Error("Invalid payment type");
    }
  }
}
//Step4: Client code
const payment = PaymentFactory.createPayment("upi", {
  id: 1,
  amount: 500
});

payment.pay();
//Switch case again violates open/close 
class PaymentFactory {
  static registry = {};

  static register(type, paymentClass) {
    PaymentFactory.registry[type] = paymentClass;
  }

  static createPayment(type, details) {
    const PaymentClass = PaymentFactory.registry[type];
    if (!PaymentClass) {
      throw new Error("Invalid payment type");
    }
    return new PaymentClass(details);
  }
}
//Register classes:
PaymentFactory.register("credit", CreditCardPayment);
PaymentFactory.register("upi", UPIPayment);
PaymentFactory.register("paypal", PaypalPayment);
//Add new payment method
class CryptoPayment extends Payment {
  pay() {
    console.log("Processing Crypto payment");
  }
}

PaymentFactory.register("crypto", CryptoPayment);
```
