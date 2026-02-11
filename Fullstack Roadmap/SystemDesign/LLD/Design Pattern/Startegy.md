Strategy Pattern is a behavioral design pattern where:
You define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.
Instead of writing big if/else blocks, you plug in behavior dynamically.
```js
//Without strategy
function calculateDiscount(type, amount) {
  if (type === "regular") {
    return amount * 0.05;
  } else if (type === "premium") {
    return amount * 0.10;
  } else if (type === "vip") {
    return amount * 0.20;
  }
}
```
Problems:
Violates Open/Closed Principle
Hard to scale
Giant conditional blocks
Hard to test independently
Business logic tightly coupled
Strategy fixes this.
📍 When To Use Strategy
Use it when:
You have multiple ways to perform a task
Algorithm can change at runtime
You want to avoid big conditionals
Each algorithm should be independently testable
You want clean separation of concerns
💡 Real LLD Example – Payment Processing
Let’s design a system where payment can be processed differently:
Credit Card
UPI
PayPal
But this time we focus on behavior variation, not object creation.
```js
//Step1: Define strategy

class PaymentStratgey{
    pay(amount){
        throw new Error("Pay mthod must be implemented")
    }
}
//Step2: Add methods
class CreditCardStrategy extends PaymentStrategy{
    pay(amount){
        console.log("Paid using credit card")
    }
}
class UPIStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid ₹${amount} using UPI`);
  }
}

class PaypalStrategy extends PaymentStrategy {
  pay(amount) {
    console.log(`Paid ₹${amount} using PayPal`);
  }
}
//Step 3: Payment context
class PaymentContext{
    constructor(strategy){
        this.strategy = strategy
    }
    setStrategy(strategy){
        this.strategy=strategy
    }
    executePayment(amount){
        this.strategy.pay(amount)
    }
}
//Step4: Invoke strategy

const payment = new PaymentContext(new UPIStrategy());
payment.executePayment(2000)
payment.setStrategy(new CreditCardStrategy())
payment.executePayment(2000)
```
| Factory                       | Strategy                     |
| ----------------------------- | ---------------------------- |
| Creates objects               | Executes behavior            |
| Focus on object instantiation | Focus on algorithm variation |
| Creational pattern            | Behavioral pattern           |
🏗 Real World Examples
Sorting algorithms (QuickSort / MergeSort)
Authentication methods (OAuth / JWT / Session)
Discount calculation engines
Tax calculation by country
Payment gateways
Compression algorithms (zip / rar / gzip)