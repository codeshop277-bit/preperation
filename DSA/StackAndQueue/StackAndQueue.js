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

class Node{
    constructor(data, next=null){
        this.data = data
        this.next = next
    }
};

class StackLL{
    constructor(){
        this.top = null;
        this.length = 0;
    };
    push(element){
        const newNode = new Node(element);
        newNode.next = this.top;
        this.top = newNode;
        this.length++;
    };
    pop(){
        if(this.isEmpty())return undefined;
        const value = this.top.data;
        this.top = this.top.next;
        this.length--;
        return value;
    };
    isEmpty(){
        return this.length == 0;
    };
    peek(){
        return this.length == 0 ? undefined : this.top.data;
    };
    size(){
        return this.length;
    };
    clear(){
        this.top = null;
        this.length = 0;
    };
};


class QueueLL{
    constructor(){
        this.start = null;
        this.end = null;
        this.length = 0;
    };
    push(element){
        const newNode = new Node(element);
        if(this.isEmpty()){
            this.start = newNode;
            this.end = newNode;
        }else{
        this.end.next = newNode;
        this.end = newNode;
        };
        this.length++;
    };
    pop(){
        if(this.isEmpty())return undefined;
        const value = this.start.data;
        this.start = this.start.next;
        this.length--;
        return value;
    };
    isEmpty(){
        return this.length == 0;
    };
    peek(){
        return this.length == 0 ? undefined : this.start.data;
    };
    size(){
        return this.length;
    };
    clear(){
        this.start = null;
        this.end = null;
        this.length = 0;
    };
};