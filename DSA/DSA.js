function NextGreater(arr){
    let stack = new Stack();
    let ans = []

    for(let i= arr.length; i>0; i--){
        while(!stack.isEmpty() && arr[stack.top()] <= arr[i]){
            stack.pop()
        }
        ans[i] = stack.isEmpty() ? arr.length : stack.top()
        stack.push(i)
    }
}

function previousgreate(arr){
    let ans = []
    let stack = new Stack()

    for(let i=0; i<arr.length; i++){
        while(!stack.isEmpty() && arr[stack.top()] <= arr[i]){
            stack.pop()
        }
        ans[i] = stack.isEmpty() ? -1 : stack.top()
        stack.push(i)
    }
}

function nextsmaller(arr){
    let ans = []
    let stack = new Stack()

    for(let i= arr.lenght; i>0; i--){

        while(!stack.isEmpty() && arr[stack.top()] >= arr[i]){
            stack.pop()
        }

        ans[i] = stack.isEmpty() ? arr.lenght : stack.top()
        stack.push(i)
    }
}

function previoussmaller(arr){
    let ans = []
    let stack = new Stack()

    for(let i=0; i<arr.length; i++){
        while(!stack.isEmpty() && arr[stack.top()] >= arr[i]){
            stack.pop()
        }
        ans[i] = stack.isEmpty() ? -1 : stack.top()
        stack.push(i)
    }
}

function asteroidCollision(arr){
    let stack = new Stack()
    let ans = []

    for(let i=0; i<arr.length; i++){
        if(arr[i] > 0){
            stack.push(arr[i])
        }else{
        while(!stack.isEmpty() && stack.top() > 0 && stack.top() < Math.abs(arr[i])){
            stack.pop()
        }
        if(!stack.isEmpty() && stack.top() == Math.abs(arr[i])){
            stack.pop()
        }else if(stack.isEmpty() && stack.top){
            stack.push(arr[i])
        }
        }
        
    }
}

function stockspan(proces){
    let spans = Array(proces.length).fill(0)
    const pge = previousgreate(proces)
    for(let i=0; i< proces.length; i++){
        spans[i] = i- pge[i]
    }
}
function celebrity(matrix){
    let n = matrix.length
    const knowMe = Array(n).fill(0)
    const knownByMe = Array(n).fill(0)

    for(let i=0; i< n; i++){
        for(let j=0; j< matrix[0].length; j++){
            if(matrix[i][j] == 1){
                knowMe[i]++
                knownByMe[i]++
            }
        }
    }
    for(let i=0; i<n; i++){
        if(knowMe[i] == n-1 && knownByMe[i] == 0){
            return i
        }
    }
}

class LRUCache{
    constructor(capacity){
        this.Node=function (key, value){
            this.next = null
            this.prev = null
            this.key = key
            this.value = value
        }

        this.head = this.Node(-1,-1)
        this.tail = this.Node(-1,-1)
        this.map = new Map()
        this.capacity = capacity
        this.head.next = this.tail
        this.tail.prev = this.head
    }
    deleteNode(node){
        let prev = node.prev
        let next = node .next
        prev.next = next
        next.prev = prev
    }
    addToHead(node){
        let temp = this.head.next
        node.next = temp
        node.prev = this.head
        temp.prev = node
        this.head.next = node
    }
    get(key){
        if(this.map.has(key)){
            let node = this.map.get(key);
            let value = node.value;
            this.map.delete(key)
            this.deleteNode(node)
            this.addToHead(node)
            return value
        }
        return -1
    }
    put(key, value){
        if(this.map.has(key)){
            let exisisting = this.map.get(key)
            exisisting.value = value
            this.deleteNode(exisisting)
            this.addToHead(exisisting)
        }
        if(this.map.size() == this.capacity){
            let tail = this.tail.prev
            this.map.delete(tail.key)
            this.deleteNode(tail)
        }
        let newNode = this.Node(key, value)
        this.map.set(key, newNode)
        this.addToHead(newNode)
    }
}