class Item {
    constructor(name, code, price) {
        this.code = code
        this.price = price
        this.name = name
    }
}
class Inventory {
    constructor() {
        this.shelves = new Map()
    }
    addItem(itm, quantity) {
        if (this.shelves.get(itm.code)) {
            this.shelves.get(itm.code).quantity += quantity
        } else {
            this.shelves.set(itm.code, quantity)
        }
    }
    getItem(itm) {
        if (this.shelves.get(itm.code)) {
            return this.shelves.get(itm.code)
        }
    }
    getQuantity(itm) {
        if (this.shelves.get(itm.code)) {
            return this.shelves.get(itm.code).quantity
        } else {
            return 0
        }
    }
    updateQuantity(itm, quantity) {
        if (this.shelves.get(itm.code)) {
            return this.shelves.get(itm.code).quantity += quantity
        }
    }
    dispense(itm) {
        if (this.shelves.get(itm.code)) {
            return this.shelves.get(itm.code).quantity -= 1
        }
    }

}
class VendingMachine {
    constructor() {
        this.inventory = new Inventory();
        this.paidAmount = 0;
        this.state = new IdleState(this);
        this.selectedCode = null;
    }
    setState(state) {
        this.state = state
    }
    insertCoint(amount) {
        this.state.insertCoin(amount)
    }
    selectItem(code) {
        this.state.selectItem(code)
    }
    dispenseItem() {
        this.state.dispenseItem();
    }
    refund() {
        this.state.refund()
    }
}
class State {
    constructor(machine) {
        this.machine = machine
    }
    insertCoin() {
        throw new Error("must be implemented")
    }
    selectItem() {
        throw new Error("must be implemented")
    }
    dispenseItem() {
        throw new Error("must be implemented")
    }
    refund() {
        throw new Error("must be implemented")
    }
}
class IdleState extends State {
    insertCoin(amount) {
        if (amount > 0) {
            this.machine.paidAmount += amount
            this.machine.setState(new HasMoneyState(this.machine))
        }
    }
    selectItem() {
        console.log("Pay the amount")
    }
}
class HasMoneyState extends State {
    insertCoin(amount) {
        if (amount > 0) {
            this.machine.paidAmount += amount
        }
    }
    selectItem(code) {
        const item = this.machine.inventory.getItem(code)
        if (item) {
            this.machine.selectedCode = code
            this.machine.setState(new SelectionState(this.machine))
        }
    }
    refund() {
        this.machine.paidAmount = 0;
        this.machine.setState(new IdleState(this.machine))
    }
}
class SelectionState extends State {
    insertCoin(amount) {
        if (amount > 0) {
            this.machine.paidAmount += amount
        }
    }
    selectItem(code) {
        const item = this.machine.inventory.getItem(code)
        if (item) {
            this.machine.selectedCode = code
            this.machine.setState(new SelectionState(this.machine))
        }
    }
    dispenseItem() {
        const code = this.machine.selectedCode
        const item = this.machine.inventory.get(code);
        if (item) {
            if (this.machine.inventory.get(code).quantity == 0) {
                this.machine.setState(new OutOfStockState(this.machine))
            }
            if (this.machine.paidAmount >= item.price) {
                this.machine.setState(new DispenseState(this.machine))
            }
        }
    }
    refund() {
        this.machine.paidAmount = 0;
        this.machine.selectedCode = null
        this.machine.setState(new IdleState(this.machine))
    }
}
class DispenseState extends State {
    constructor(machine) {
        super(machine)
    }
    dispenseItem() {
        const code = this.machine.selectedCode
        const item = this.machine.inventory.get(code);
        if (this.machine.inventory.dispense(code)) {
            this.machine.paidAmount = 0;
            this.machine.selectedCode = null
            this.machine.setState(new IdleState(this.machine))
        }
    }
}
class OutOfStockState extends State {
    constructor() {
        this.refund()
    }
    refund() {
        this.machine.paidAmount = 0;
        this.machine.selectedCode = null
        this.machine.setState(new IdleState(this.machine))
    }
}
const vendingMachine = new VendingMachine();
vendingMachine.inventory.addItem(new Item('A1', 'Soda', 1.5), 5);
vendingMachine.inventory.addItem(new Item('B2', 'Chips', 1.0), 3);