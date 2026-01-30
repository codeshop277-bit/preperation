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

class MinStack {
    constructor() {
        this.items = [];
        this.min = Infinity;
    }
    push(element) {
        if (this.isEmpty()) {
            this.items.push(element)
            this.min = element;
        }
        if (element < this.min) {
            let calc = 2 * element - this.min
            this.items.push(calc)
            this.min = element
        } else {
            this.items.push(element)
        }
    };
    pop() {
        if (this.isEmpty()) return undefined
        const ele = this.top()
        this.items.pop()
        if (ele < this.min) {
            this.min = 2 * this.min - ele
        } else {
            return ele
        }
    }
    top() {
        if (this.isEmpty()) return undefined
        const ele = this.top()
        if (this.min < ele) {
            return ele
        }
        return this.min
    }
    getMin() {
        return this.min;
    }
}

function priority(ch) {
    if (ch == '^') {
        return 3;
    } else if (ch == '*' || ch == '/') {
        return 2;
    } else if (ch == '+' || ch == '-') {
        return 1;
    } else {
        return -1;
    }
};

function InfixToPostfix(exp) {
    let i = 0;
    let stack = new Stack();
    let ans = '';

    while (i < exp.length) {
        if ((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') ||
            (exp[i] >= '0' && exp[i] <= '9')
        ) {
            ans += exp[i]
        } else if (exp[i] == '(') {
            stack.push(exp[i]);
        } else if (exp[i] == ')') {
            while (!stack.isEmpty() && stack.top() != '(') {
                ans = ans + stack.top()
                stack.pop();
            }
        } else {
            while (!stack.isEmpty() && priority(s[i]) <= priority(stack.top())) {
                ans = ans + stack.top();
                stack.pop()
            }
            stack.push(stack[i])
        }
        i++
    }
    while (!stack.isEmpty()) {
        ans = ans + stack.top()
        stack.pop()
    }
}
function reverseAndSwapBrackets(string) {
    let reversed = '';

    for (let i = string.length - 1; i >= 0; i--) {
        let char = string[i];

        // Swap brackets
        if (char == '(') {
            reversed += ')';
        } else if (char == ')') {
            reversed += '(';
        } else {
            reversed += char
        }
    }
    return reversed;
}
function InfixToPrefix(exp) {
    // step1: Reverse the string 
    let reversed = reverseAndSwapBrackets(exp);
    // Step 2: Only diff from InfixTOpostfilx is handling operand. Instead of 1 check we will have 2 checks
    else if (s[i] == '^') {
        while (!stack.isEmpty() && priority(s[i]) <= priority(stack.top())) {
            ans = ans + stack.top();
            stack.pop()
        }
    }
    else {
        while (!stack.isEmpty() && priority(s[i]) < priority(stack.top())) {
            ans = ans + stack.top();
            stack.pop()
        }
        stack.push(stack[i])
    }

    //Step 3 reverse ans
}

function PostfixToInfix(exp) {
    let i = 0;
    let stack = new Stack();
    while (i < exp.length) {
        if ((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') ||
            (exp[i] >= '0' && exp[i] <= '9')
        ) {
            stack.push(s[i])
        } else {
            let t1 = stack.top();
            stack.pop();
            let t2 = stack.top();
            stack.pop();
            let newStr = '(' + t2 + exp[i] + t1 + ')';
            stack.push(newStr);
        }
        i++
    }
    return stack.top()
}

function PrefixToInfix(exp) {
    let i = exp.length - 1;
    let stack = new Stack();
    while (i >= 0) {
        if ((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') ||
            (exp[i] >= '0' && exp[i] <= '9')
        ) {
            stack.push(s[i])
        } else {
            let t1 = stack.top();
            stack.pop();
            let t2 = stack.top();
            stack.pop();
            let newStr = '(' + t1 + exp[i] + t2 + ')';
            stack.push(newStr);
        }
        i--
    }
    return stack.top()
}
function PostfixToPrefix(exp) {
    let i = 0;
    let stack = new Stack();
    while (i < exp.length) {
        if ((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') ||
            (exp[i] >= '0' && exp[i] <= '9')
        ) {
            stack.push(s[i])
        } else {
            let t1 = stack.top();
            stack.pop();
            let t2 = stack.top();
            stack.pop();
            let newStr = exp[i] + t2 + t1;
            stack.push(newStr);
        }
        i++
    }
    return stack.top()
}

function PrefixToPostfix(exp) {
    let i = exp.length - 1;
    let stack = new Stack();
    while (i >= 0) {
        if ((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') ||
            (exp[i] >= '0' && exp[i] <= '9')
        ) {
            stack.push(s[i])
        } else {
            let t1 = stack.top();
            stack.pop();
            let t2 = stack.top();
            stack.pop();
            let newStr = t1 + t2 + exp[i];
            stack.push(newStr);
        }
        i--
    }
    return stack.top()
}

function NextGreaterElement(arr) {
    let ans = [];
    let stack = new Stack();

    for (let i = arr.length - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.top() <= arr[i]) {
            stack.pop()
        }
        if (stack.isEmpty()) {
            ans[i] = -1
        } else {
            ans[i] = stack.top()
        }
        stack.push(arr[i])
    }
    return ans
}

function NextGreaterElement2(arr) {
    //Circular array
    let ans = [];
    let stack = new Stack();

    for (let i = 2 * arr.length - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.top() <= arr[i % arr.length]) {
            stack.pop()
        }
        if (i < arr.length) {
            if (stack.isEmpty()) {
                ans[i] = -1
            } else {
                ans[i] = stack.top()
            }
        }
        stack.push(arr[i%arr.length])
    }
    return ans
}

function CountGreaterElement(arr, indices) {
    let ans = [];
    let stack = new Stack();
    let array = Array(arr.length).fill(0)

    for (let i = arr.length - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.top() <= arr[i]) {
            stack.pop()
        }
        array[i] = stack.size()
        stack.push(arr[i])
    }
    return indices.map(i=> array[i])
}
function TappingRainwater(arr){
    let n = arr.length
    let lmax = 0; let rmax = 0;
    let total = 0;
    let left =0; let right = n-1;

    while(left< right){
        if(arr[left] <=arr[right]){
            if(lmax > arr[left]){
                total += lmax-arr[left]
            }else{
                lmax = arr[left]
            }
            letf++
        }else{
             if(rmax > arr[right]){
                total += rmax-arr[right]
            }else{
                rmax = arr[right]
            }
            right--
        }
    }
    return total
}

function NextSmallerElement(arr) {
    let ans = [];
    let stack = new Stack();

    for (let i = arr.length - 1; i >= 0; i--) {
        while (!stack.isEmpty() && arr[stack.top()] >= arr[i]) {
            stack.pop()
        }
        if (stack.isEmpty()) {
            ans[i] = arr.length
        } else {
            ans[i] = stack.top()
        }
        stack.push(i)
    }
    return ans
}

function PreviousSmallerElement(arr) {
    let ans = [];
    let stack = new Stack();

    for (let i = 0; i <arr.length; i++) {
        while (!stack.isEmpty() && arr[stack.top()] >= arr[i]) {
            stack.pop()
        }
        if (stack.isEmpty()) {
            ans[i] = -1
        } else {
            ans[i] = stack.top()
        }
        stack.push(i)
    }
    return ans
}
function SumOFSubarrayMinimums(arr) {
    let nse = NextSmallerElement(arr);
    let pse = PreviousSmallerElement(arr);
    let total = 0;
    for(let i=0;i<arr.length;i++){
        let left = i-pse[i];
        let right = nse[i]-i;
        total += arr[i]*left*right
    }
    return total;
}

function SumOFSubarrayMax(arr) {
    let nse = NextGreaterElement(arr);
    let pse = PreviousGreaterElement(arr);
    let total = 0;
    for(let i=0;i<arr.length;i++){
        let left = i-pse[i];
        let right = nse[i]-i;
        total += arr[i]*left*right
    }
    return total;
}
function PreviousGreaterElement(arr) {
    let ans = [];
    let stack = new Stack();            
    for (let i = 0; i <arr.length; i++) {
        while (!stack.isEmpty() && arr[stack.top()] <= arr[i]) {
            stack.pop()
        }           
        if (stack.isEmpty()) {
            ans[i] = -1
        }           
        else {
            ans[i] = stack.top()
        }
        stack.push(i)
    }           
    return ans
}
function SumOfRanges(arr){
    let sumMax = SumOFSubarrayMax(arr);
    let sumMin = SumOFSubarrayMinimums(arr);
    return sumMax - sumMin;
}