function createNode(value){
    return{
        value: value,
        next: null
    }
}
let x = createNode([10,20,30])
let y = x.value[1]
console.log(y)
x.next = createNode([40])
console.log(x)

function getArrayElementAtNode(head, nodeIndex, arrayIndex) {
  let current = head;
  let count = 0;

  while (current) {
    if (count === nodeIndex) {
      return current.value[arrayIndex];
    }
    current = current.next;
    count++;
  }

  return undefined;
}

const forty = getArrayElementAtNode(x, 1, 0); // Here i points to node index
console.log(forty); // 40
function findValue(head, target) {
  let current = head;

  while (current !== null) {
    // search inside the array at this node
    if (current.value.includes(target)) {
      return target;
    }
    current = current.next;
  }

  return undefined; // not found
}

const result = findValue(x, 40);
console.log(result); // 40
 

class Node{
     constructor(data, next=null){
        this.data = data
        this.next = next
     }
}
let arr = [2,1,5,6];
let x1 = new Node(arr)
let y1 = new Node(arr[1])
console.log('y1', x1)