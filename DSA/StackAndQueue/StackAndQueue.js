class Stack {
    constructor() {
        this.items = [];
    };
    push(element) {
        this.items.push(element)
    };
    isEmpty() {
        return this.items.length === 0;
    };
    pop() {
        if (this.isEmpty()) return undefined;
        return this.items.pop();
    };
    size() {
        return this.items.length;
    };
    clear() {
        this.items = [];
    };
    peek() {
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length - 1];
    }
};
class Queue {
    constructor() {
        this.items = [];
    };
    push(element) {
        this.items.push(element)
    };
    isEmpty() {
        return this.items.length === 0;
    };
    pop() {
        if (this.isEmpty()) return undefined;
        return this.items.shift();
    };
    size() {
        return this.items.length;
    };
    clear() {
        this.items = [];
    };
    front() {
        if (this.isEmpty()) return undefined;
        return this.items[0];
    };
    peek() {
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length - 1];
    };
}

class Node {
    constructor(data, next = null) {
        this.data = data
        this.next = next
    }
};

class StackLL {
    constructor() {
        this.top = null;
        this.length = 0;
    };
    push(element) {
        const newNode = new Node(element);
        newNode.next = this.top;
        this.top = newNode;
        this.length++;
    };
    pop() {
        if (this.isEmpty()) return undefined;
        const value = this.top.data;
        this.top = this.top.next;
        this.length--;
        return value;
    };
    isEmpty() {
        return this.length == 0;
    };
    peek() {
        return this.length == 0 ? undefined : this.top.data;
    };
    size() {
        return this.length;
    };
    clear() {
        this.top = null;
        this.length = 0;
    };
};


class QueueLL {
    constructor() {
        this.start = null;
        this.end = null;
        this.length = 0;
    };
    push(element) {
        const newNode = new Node(element);
        if (this.isEmpty()) {
            this.start = newNode;
            this.end = newNode;
        } else {
            this.end.next = newNode;
            this.end = newNode;
        };
        this.length++;
    };
    pop() {
        if (this.isEmpty()) return undefined;
        const value = this.start.data;
        this.start = this.start.next;
        this.length--;
        return value;
    };
    isEmpty() {
        return this.length == 0;
    };
    peek() {
        return this.length == 0 ? undefined : this.start.data;
    };
    size() {
        return this.length;
    };
    clear() {
        this.start = null;
        this.end = null;
        this.length = 0;
    };
};

function BalancedParanthesis(string) {
    const stack = new Stack();
    for (let i = 0; i < string.length; i++) {
        if (string[i] == '(' || string[i] == '[' || string[i] == '{') {
            stack.push(string[i])
        } else if (stack.isEmpty()) {
            return false;
        } else {
            const top = stack.pop();
            if ((string[i] == ')' && top != '(') || (string[i] == '}' && top != '{') ||
                (string[i] == ']' && top != '[')) {

                return false
            }
        }
    }
    return stack.isEmpty();
}
console.log(BalancedParanthesis('()[{}()'))

class MinStack{
    constructor(){
        this.items = [];
        this.min = Infinity;
    }
    push(element){
        if(this.isEmpty()){
            this.items.push(element)
            this.min = element;
        }
        if(element<this.min){
            let calc = 2*element - this.min
            this.items.push(calc)
            this.min = element
        }else{
            this.items.push(element)
        }
    };
    pop(){
        if(this.isEmpty()) return undefined
        const ele = this.top()
        this.items.pop()
        if(ele < this.min){
            this.min = 2 * this.min - ele
        }else{
            return ele
        }
    }
    top(){
        if(this.isEmpty()) return undefined
        const ele = this.top()
        if(this.min < ele){
           return ele
        }
        return this.min
    }
    getMin(){
        return this.min;
    }
}