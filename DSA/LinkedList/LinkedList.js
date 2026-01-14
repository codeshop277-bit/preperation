class Node {
    constructor(data, next = null) {
        this.data = data
        this.next = next
    }
}

function buildLinkedListFromArr(arr) {
    let head = new Node(arr[0]);//Forms the basic structure
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new Node(arr[i]);
        current = current.next//this is done so a linear chain is mapped
    }
    return head
}
function LengthOfLinkedList(head) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    let count = 0;

    while (temp != null) {
        count++;
        temp = temp.next
    }
    return count;

}
// console.log(LengthOfLinkedList([1, 2, 3, 4, 5]))

function SearchInLinkedList(head, key) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;

    while (temp != null) {
        if (temp.data == key) return true
        temp = temp.next
    }
    return false
}
// console.log(SearchInLinkedList([1,2,3,4,5], 2))
// ListNode {
//   val: 7,
//   next: ListNode { val: 8, next: ListNode { val: 9, next: [ListNode] } }
// }

function DeleteKthElement(head, k) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList
    let count = 0; let prev = null

    while (temp != null) {
        count++;
        if (count == k) {
            if (prev == null) {
                return head.next
            }
            prev.next = temp.next;
            break;
        }
        prev = temp;
        temp = temp.next
    }
    return linkedList
}
// console.log(DeleteKthElement([1,2,3,4,5], 2))
function DeleteHead(head) {
    let temp = head;
    if (temp.next == null) return null
    return head.next;
}
function DeleteTail(head) {
    let temp = head;
    while (temp.next.next != null) {
        temp = temp.next
    }
    temp.next = null
    return head
}

function InsertELementAtHead(head, x) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    let element = new Node(x);
    element.next = temp;

    return element
}
// console.log(InsertELementAtHead([2,3], 1))

function InsertELementAtTail(head, x) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    let element = new Node(x);
    if (linkedList == null) return element
    while (temp != null) {
        if (temp.next == null) {
            temp.next = element
            break;
        }
        temp = temp.next
    }
    return linkedList;
}
// console.log(InsertELementAtTail([2,3], 1))

function InsertElementAtKth(head, k, x) {
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    const element = new Node(x);
    let count = 1;
    if (k == 1) {
        element.next = temp
        return linkedList;
    }
    while (temp != null) {
        if (count == k - 1) {
            element.next = temp.next
            temp.next = element
            break
        }
        count++;
        temp = temp.next
    }
    return linkedList
}
// console.log(InsertElementAtKth([1,2,3,4,5], 3, 10))
// ``````````````````````````Double Linked li``````````````````

class DoubleNode {
    constructor(data, next = null, prev = null) {
        this.data = data;
        this.next = next;
        this.prev = prev;
    }
}

function buildDoubleLinkedList(arr) {
    let head = new DoubleNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        let newNode = new DoubleNode(arr[i]);
        current.next = newNode
        newNode.prev = current
        current = newNode
    }
    return head;
}

// console.log(buildDoubleLinkedList([1,2,3]))

function DeleteDLLHead(arr) {
    const linkedlist = buildDoubleLinkedList(arr);
    let head = linkedlist;
    let prev = head;
    if (head == null || head.next == null) return null
    head = head.next;
    head.prev = null
    prev.next = null

    return head
}
// console.log(DeleteDLLHead([1,2,3]));

function DeleteDLLTail(arr) {
    const linkedlist = buildDoubleLinkedList(arr);
    let head = linkedlist;
    let temp = head;
    if (head == null || head.next == null) return null
    while (temp.next.next != null) {
        temp = temp.next
    }
    temp.next = null;

    return head
}
// console.log(DeleteDLLTail([1,2,3]))

function DeleteDLLTailAtk(arr, k) {
    const linkedlist = buildDoubleLinkedList(arr);
    let head = linkedlist;
    let temp = head;
    let count = 0;
    if (head == null || head.next == null) return null
    while (temp != null) {
        count++;
        if (count == k) break;
        temp = temp.next
    }
    if (temp == null) return head; //Out of bound
    let nextEl = temp.next;
    let prevEl = temp.prev;
    if (prevEl == null) {//Delete head
        head = nextEl
        if(nextEl != null) nextEl.prev = null
    } else if (nextEl == null) {//Delete tail
        prevEl.next = null
    } else {
        prevEl.next = nextEl;
        nextEl.prev = prevEl;
    }
    temp.next = null
    temp.prev = null
    return head
}
// console.log(DeleteDLLTailAtk([1, 2, 3, 4, 5], 4))

function InsertDLLHead(arr, x) {
    const linkedlist = buildDoubleLinkedList(arr);
    let headNode = new DoubleNode(x)
    let head = linkedlist;
    if (head == null) return headNode
    head.prev = headNode
    headNode.next = head;

    return headNode
}
// console.log(InsertDLLHead([2,3], 1))

function InsertDLLTail(arr, x) {
    const linkedlist = buildDoubleLinkedList(arr);
    let headNode = new DoubleNode(x)
    let head = linkedlist;
    let temp = head;
    if (head == null) return headNode
    while (temp.next != null) {
        temp = temp.next
    }
    headNode.prev = temp;
    temp.next = headNode

    return linkedlist
}
// console.log(InsertDLLTail([2, 3], 1))


function InsertDLLAtK(arr, k, x) {
    //k place at which new node should be inserted
    //x new node
    const linkedlist = buildDoubleLinkedList(arr);
    let newNode = new DoubleNode(x)
    let head = linkedlist;
    let temp = head;
    let count = 0;
    if (head == null) return newNode
    while (temp != null) {
        count++
        if(count == k) break;
        temp = temp.next
    }
    let back = temp.prev;
    if(back == null) {
        newNode.next = head
        head.prev = newNode
        return newNode
    }
    temp.prev = newNode
    newNode.prev = back;
    newNode.next = temp;
    back.next = newNode
    return head
}
// console.log(InsertDLLAtK([1,2,4], 3, 5))

function ReverseDoubleLL(arr){
    const linkedlist = buildDoubleLinkedList(arr)
    let head = linkedlist
    let current = head;
    let last = null;

    while(current != null){
        last = current.prev
        current.prev = current.next
        current.next = last

        current = current.prev
    }
    return last.prev
}
console.log(ReverseDoubleLL([1,2,3,4,5]))