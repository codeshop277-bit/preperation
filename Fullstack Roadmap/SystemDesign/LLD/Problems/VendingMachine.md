Explain the architecture mentioned in the video and implement in js
https://www.youtube.com/watch?v=cMVSM4_2f0Y&list=PLpxM6m39X_t-Rk9lZVVD4U6JycAAIIEDW&index=36Architecture Explanation
The video discusses a Low-Level Design (LLD) for a vending machine system, emphasizing its use in technical interviews and projects. The core architecture is built around the State Design Pattern, which models the vending machine as a finite state machine to handle different operational phases and ensure valid transitions while preventing invalid actions (e.g., dispensing an item without payment). This pattern encapsulates behavior in state-specific classes, making the system extensible—for example, adding new states like a "maintenance" mode with minimal changes to existing code.
Key components include:

VendingMachineContext (or simply VendingMachine): Acts as the context, managing the current state, inventory, paid amount, and selected item. It delegates user actions (e.g., insert coin, select item, dispense) to the current state.
Inventory: Manages items, organized by shelves or codes, with methods for adding, checking stock, and dispensing items. Items have attributes like code, name, price, and quantity.
State Interface: Defines actions like inserting coins, selecting items, and dispensing. Concrete states implement these and handle transitions.
Concrete States:
IdleState: Starting point; allows coin insertion to transition to HasMoneyState.
HasMoneyState: Accumulates payment; allows more coins or item selection to move to SelectionState.
SelectionState: Verifies payment and stock; if sufficient, transitions to DispenseState for output.
DispenseState: Handles item dispensing and change return, then resets to IdleState.
OutOfStockState: Manages stock shortages by refunding and resetting to IdleState.

Additional Patterns: The Strategy Pattern is suggested for payment methods (e.g., coins, cards, UPI) to allow easy extension without modifying core logic. Other patterns like Observer (for inventory alerts), Singleton (for a single machine instance), and Factory (for object creation) are mentioned but not always fully implemented.

The design focuses on extensibility, error handling (e.g., insufficient funds, invalid selections), and state transitions via a conceptual flow diagram: Idle → HasMoney (on coin insert) → Selection (on item select) → Dispense (if valid) → Idle, or → OutOfStock (if no stock) → Idle. Inventory is category-based, and payments are processed cumulatively for coins.
This architecture ensures robust, interview-friendly code by prioritizing clarity, defensive checks, and pattern-based modularity.
JavaScript Implementation
Below is a complete JavaScript implementation of the vending machine using the State Design Pattern, based on the video's architecture. It includes basic coin-based payment (extensible via Strategy if needed), inventory management, and state transitions. For simplicity, I've used a Map for inventory (code to item/quantity) instead of full ItemShelf arrays, and assumed coin insertions add to a balance. I've omitted advanced features like Observer or full Strategy implementations but noted where extensions can be added.

```js
// Item class
class Item {
  constructor(code, name, price) {
    this.code = code;
    this.name = name;
    this.price = price;
  }
}

// Inventory class
class Inventory {
  constructor() {
    this.shelves = new Map(); // code => {item, quantity}
  }

  addItem(item, quantity) {
    if (this.shelves.has(item.code)) {
      this.shelves.get(item.code).quantity += quantity;
    } else {
      this.shelves.set(item.code, { item, quantity });
    }
  }

  getItem(code) {
    return this.shelves.get(code)?.item;
  }

  getQuantity(code) {
    return this.shelves.get(code)?.quantity || 0;
  }

  updateQuantity(code, quantity) {
    if (this.shelves.has(code)) {
      this.shelves.get(code).quantity = quantity;
    }
  }

  dispense(code) {
    const shelf = this.shelves.get(code);
    if (shelf && shelf.quantity > 0) {
      shelf.quantity--;
      return true;
    }
    return false;
  }
}

// Base State class
class State {
  constructor(machine) {
    this.machine = machine;
  }

  insertCoin(amount) {
    throw new Error('Action not allowed in this state');
  }

  selectItem(code) {
    throw new Error('Action not allowed in this state');
  }

  dispenseItem() {
    throw new Error('Action not allowed in this state');
  }

  refund() {
    throw new Error('Action not allowed in this state');
  }
}

// IdleState
class IdleState extends State {
  insertCoin(amount) {
    if (amount > 0) {
      this.machine.paidAmount += amount;
      this.machine.setState(new HasMoneyState(this.machine));
      console.log(`Inserted $${amount}. Total paid: $${this.machine.paidAmount}`);
    } else {
      console.log('Invalid amount');
    }
  }

  selectItem(code) {
    console.log('Please insert money first');
  }

  dispenseItem() {
    console.log('Please select an item first');
  }
}

// HasMoneyState
class HasMoneyState extends State {
  insertCoin(amount) {
    if (amount > 0) {
      this.machine.paidAmount += amount;
      console.log(`Inserted $${amount}. Total paid: $${this.machine.paidAmount}`);
    } else {
      console.log('Invalid amount');
    }
  }

  selectItem(code) {
    const item = this.machine.inventory.getItem(code);
    if (item) {
      this.machine.selectedCode = code;
      this.machine.setState(new SelectionState(this.machine));
      console.log(`Selected ${item.name} ($${item.price})`);
    } else {
      console.log('Invalid item code');
    }
  }

  dispenseItem() {
    console.log('Please select an item first');
  }

  refund() {
    console.log(`Refunded $${this.machine.paidAmount}`);
    this.machine.paidAmount = 0;
    this.machine.setState(new IdleState(this.machine));
  }
}

// SelectionState
class SelectionState extends State {
  insertCoin(amount) {
    if (amount > 0) {
      this.machine.paidAmount += amount;
      console.log(`Inserted $${amount}. Total paid: $${this.machine.paidAmount}`);
    } else {
      console.log('Invalid amount');
    }
  }

  selectItem(code) {
    const item = this.machine.inventory.getItem(code);
    if (item) {
      this.machine.selectedCode = code;
      console.log(`Changed selection to ${item.name} ($${item.price})`);
    } else {
      console.log('Invalid item code');
    }
  }

  dispenseItem() {
    const code = this.machine.selectedCode;
    const item = this.machine.inventory.getItem(code);
    if (!item) {
      console.log('No item selected');
      return;
    }
    if (this.machine.inventory.getQuantity(code) === 0) {
      this.machine.setState(new OutOfStockState(this.machine));
      return;
    }
    if (this.machine.paidAmount >= item.price) {
      this.machine.setState(new DispenseState(this.machine));
      this.machine.dispenseItem(); // Trigger dispense in new state
    } else {
      console.log(`Insufficient payment. Need $${item.price - this.machine.paidAmount} more`);
    }
  }

  refund() {
    console.log(`Refunded $${this.machine.paidAmount}`);
    this.machine.paidAmount = 0;
    this.machine.selectedCode = null;
    this.machine.setState(new IdleState(this.machine));
  }
}

// DispenseState
class DispenseState extends State {
  constructor(machine) {
    super(machine);
    // Auto-dispense logic can go here if needed
  }

  dispenseItem() {
    const code = this.machine.selectedCode;
    const item = this.machine.inventory.getItem(code);
    if (this.machine.inventory.dispense(code)) {
      const change = this.machine.paidAmount - item.price;
      this.machine.paidAmount = 0;
      this.machine.selectedCode = null;
      this.machine.setState(new IdleState(this.machine));
      console.log(`Dispensed ${item.name}. Change returned: $${change}`);
    } else {
      console.log('Error dispensing item');
      this.machine.setState(new IdleState(this.machine));
    }
  }

  // Other actions not allowed in dispense
  insertCoin(amount) {
    console.log('Dispensing in progress');
  }

  selectItem(code) {
    console.log('Dispensing in progress');
  }
}

// OutOfStockState
class OutOfStockState extends State {
  constructor(machine) {
    super(machine);
    // Auto-refund and reset
    console.log('Item out of stock');
    this.refund();
  }

  refund() {
    if (this.machine.paidAmount > 0) {
      console.log(`Refunded $${this.machine.paidAmount}`);
      this.machine.paidAmount = 0;
    }
    this.machine.selectedCode = null;
    this.machine.setState(new IdleState(this.machine));
  }
}

// VendingMachine Context
class VendingMachine {
  constructor() {
    this.inventory = new Inventory();
    this.currentState = new IdleState(this);
    this.selectedCode = null;
    this.paidAmount = 0;
  }

  setState(state) {
    this.currentState = state;
  }

  insertCoin(amount) {
    this.currentState.insertCoin(amount);
  }

  selectItem(code) {
    this.currentState.selectItem(code);
  }

  dispenseItem() {
    this.currentState.dispenseItem();
  }

  refund() {
    this.currentState.refund();
  }
}

// Example Usage
const vm = new VendingMachine();

// Add items to inventory
vm.inventory.addItem(new Item('A1', 'Soda', 1.5), 5);
vm.inventory.addItem(new Item('B2', 'Chips', 1.0), 3);

// Simulate usage
vm.insertCoin(1); // Idle -> HasMoney
vm.insertCoin(1); // Add more
vm.selectItem('A1'); // HasMoney -> Selection
vm.dispenseItem(); // Selection -> Dispense -> Idle (dispenses Soda, change 0.5)

// Try out of stock
vm.insertCoin(1);
vm.selectItem('B2');
vm.dispenseItem(); // Works first time
// Repeat dispense for B2 until stock 0, then it will go to OutOfStock

// For extensibility: To add Strategy Pattern for payments, create a PaymentStrategy class
// with methods like processPayment(), and set it in VendingMachine.
// e.g., class CoinPaymentStrategy { processPayment(amount) { this.machine.paidAmount += amount; } }
// Then in states, delegate to this.machine.paymentStrategy.processPayment(amount);
```