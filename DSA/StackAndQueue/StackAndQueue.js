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
    clear(){
        this.items = [];
    };
    peek(){
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length -1];
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
    clear(){
        this.items = [];
    };
    front(){
        if (this.isEmpty()) return undefined;
        return this.items[0];
    };
    peek(){
        if (this.isEmpty()) return undefined;
        return this.items[this.items.length -1];
    };
}