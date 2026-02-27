const Denomination = [500, 100];
const crypto = require("crypto");

class Card {
    constructor(cardNo, pin, account) {
        this.cardNo = cardNo
        this.pin = pin
        this.account = account
    }
    hasPin(pin) {
        return crypto.createHash('256').update(pin).digest('hex')
    }
    authenticatePin(pin) {
        return this.pin === this.hasPin()
    }
}
class AccountDetails {
    constructor(accountNo, balance) {
        this.accountNo = accountNo
        this.balance = balance
    }
    getBalance() {
        return this.balance
    }
    withdraw(amount) {
        if (amount > this.balance) {
            throw new Error('Insufficient funds')
        } else {
            this.balance -= amount
        }
    }
}
class ATMInventory {
    constructor(initial) {
        this.inventory = new Map()
        Denomination.map(denom => this.inventory.set(denom, initial[denom] || 0))
    }

    getTotal() {
        let count = 0;
        for (let [denom, value] of this.inventory) {
            count += denom * value
        }
        return count
    }
    hasEnough(amount) {
        return this.getTotal() >= amount
    }
    dispenseCash(amount) {
        if (!this.hasEnough(amount)) {
            //no suff funds
        }
        let dispensed = new Map();
        let remaining = amount;
        for (let [denom, value] of this.inventory) {
            let count = Math.floor(remaining / denom)
            if (count > this.inventory.get(denom)) {
                count = this.inventory.get(denom)
            }
            if (count > 0) {
                dispensed.set(denom, count)
                this.inventory.set(denom, this.inventory.get(denom) - count)
                remaining -= denom * count
            }
        }
        return dispensed
    }
}
class ATMState {
    insertCard(context, card) {
        //
    }
    enterPin(context, card) {
        //
    }
    performTransaction(context, card) {
        //
    }
    withdrawCash(context, card) {
        //
    }
}
class InsertCardState extends ATMState {
    insertCard(context, card) {
        context.card = card
        context.setState(ATMFactory.getState("HasCard"))
    }
}
class HasCardState extends ATMState {
    enterPin(context, pin) {
        if (context.card.authenticatePin(pin)) {
            context.setState(ATMFactory.getState("SelectOperation"))
        }
    }
}
class SelectedOperationState extends ATMState {
    selectOperation(context, operation) {
        context.selectOperation = operation
        context.setState(ATMFactory.getState("Transaction"))
    }
}
class TransactionState extends ATMState {
    performTransaction(context, amount) {
        if(context.selectOperation == "CheckBalance"){
            context.account.getBalance()
        }else{
            context.account.withdraw(amount)
            const dispense = context.inventory.dispenseCash(amount)
            context.setState(ATMFactory.getState("SelectOperation"))
        }
    }
    returnCard(){
        context.card = null
        context.account = null
        context.setState(ATMFactory.getState("Idle"))
    }
}
class ATMFactory {
    static getState(type) {
        switch (type) {
            case 'Idle': return new IdleState();
            case 'HasCard': return new HasCardState();
            case 'SelectOperation': return new SelectOperationState();
            case 'Transaction': return new TransactionState();
            default: throw new Error('Invalid state type');
        }
    }
}
class ATMCOntext {
    constructor() {
        this.state = ''
        this.inventory = new ATMInventory({ 100: 10, 500: 30 })
        this.card = null
        this.account = null
        this.selectedOperation = null
    }
    setState(context) {
        this.state = context
    }
    insertCard(card) {
        this.state.insertCard(this, card)
    }
    enterPin(pin) {
        this.state.enterPin(this, pin);
    }

    selectOperation(operation) {
        this.state.selectOperation(this, operation);
    }

    performTransaction(amount) {
        this.state.performTransaction(this, amount);
    }

    returnCard() {
        this.state.returnCard(this);
    }
}
