✅ What is State Pattern?
The State Pattern allows an object to change its behavior when its internal state changes.
Instead of using large if/else or switch statements, we:
Create separate state classes
Move state-specific behavior into those classes
Let the object delegate behavior to the current state
🔹 What Problem Does It Solve?
When:
An object behaves differently based on its state
Logic is full of conditionals like:
    if (status === "pending") { ... }
else if (status === "approved") { ... }
else if (status === "rejected") { ... }
Problems:
Hard to maintain
Hard to extend
Violates clean design
Becomes messy as states grow
State Pattern:
Encapsulates each state
Makes behavior scalable
Makes adding new states easy

Js Example
```js
class PendingState(){
    next(order){
        console.log("Order Approved");
        order.setState(new ApprovedState())
    }

     cancel(order) {
    console.log("Order cancelled from pending state");
  }
}
class ApprovedState {
  next(order) {
    console.log("Order shipped");
    order.setState(new ShippedState());
  }

  cancel(order) {
    console.log("Order cancelled after approval");
  }
}

class ShippedState {
  next(order) {
    console.log("Order already shipped");
  }

  cancel(order) {
    console.log("Cannot cancel. Order already shipped");
  }
}

class Order(){
    constructor(){
        this.state = new PendingState()
    }
    setState(state){
        this.state = state
    }
     next() {
    this.state.next(this);
  }

  cancel() {
    this.state.cancel(this);
  }
}

//Usage
const order = new Order();

order.next();   // Order approved
order.next();   // Order shipped
order.cancel(); // Cannot cancel. Order already shipped
```
🔹 What Happened Here?
Order delegates behavior to its current state.
Each state controls what happens next.
Behavior changes dynamically when state changes.
No if/else.
No messy condition checks.
🔹 Where It Is Used (Real Projects)
1️⃣ UI Components
Loading
Success
Error
Disabled
Empty state
Example: Button component
button.setState(new LoadingState());
2️⃣ Authentication Flow
LoggedOut
LoggingIn
LoggedIn
SessionExpired
3️⃣ Media Player
Playing
Paused
Stopped
Buffering
4️⃣ Workflow Engines
Draft
Review
Published
Archived

| Aspect    | Meaning                                   |
| --------- | ----------------------------------------- |
| Purpose   | Change behavior based on internal state   |
| Solves    | Large conditional logic blocks            |
| Structure | Context + State classes                   |
| Best Use  | UI flows, order systems, workflow engines |
