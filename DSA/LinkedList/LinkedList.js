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
        if (nextEl != null) nextEl.prev = null
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
        if (count == k) break;
        temp = temp.next
    }
    let back = temp.prev;
    if (back == null) {
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

function ReverseDoubleLL(arr) {
    const linkedlist = buildDoubleLinkedList(arr)
    let head = linkedlist
    let current = head;
    let last = null;

    while (current != null) {
        last = current.prev
        current.prev = current.next
        current.next = last

        current = current.prev
    }
    return last.prev
}
// console.log(ReverseDoubleLL([1,2,3,4,5]))

function FindMiddle(arr) {
    const linkedlist = buildDoubleLinkedList(arr)
    //Tortoise and hare algrithm
    //Hare moves 2 steps
    //Tortoise moves 1 step
    // While hare moves to end of ll, tortoise will be in middle
    let head = linkedlist
    let slow = head
    let fast = head

    while (slow && fast && fast.next) {
        fast = fast.next.next
        slow = slow.next
    }
    return slow.data
}
// console.log([FindMiddle([1,2,3,4,5, 6])])

function ReverseSingleLL(arr) {
    const linked = buildLinkedListFromArr(arr);
    let head = linked;
    let current = head;
    let prev = null;

    while (current != null) {
        let nextEl = current.next;
        current.next = prev;
        prev = current;
        current = nextEl
    }
    return prev
}
// console.log(ReverseSingleLL([1,2,3,4]))

function RecursiveReverse(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist
    let current = head

    function recursive(current, prev = null) {
        if (current == null) return prev
        let nextEl = current.next
        current.next = prev

        return recursive(nextEl, current)
    }
    return recursive(current)
}
// console.log(RecursiveReverse([1,2,3,4]))

function DetectLoop(arr) {
    const linkedlist = buildLinkedListFromArr(arr)
    let head = linkedlist
    let temp = head
    let map = new Map()
    while (temp != null) {
        if (map.has(temp)) return true
        map.set(temp, 1)
        temp = temp.next
    }
    return false
}

function DetectLoopOptimal(arr) {
    const linkedlist = buildLinkedListFromArr(arr)
    let head = linkedlist
    let slow = head
    let fast = head
    while (slow && fast && fast.next != null) {
        slow = slow.next
        fast = fast.next.next
        if (slow == fast) return true
    }
    return false
}
function StartingPointOfLoop(arr) {
    const linkedlist = buildLinkedListFromArr(arr)
    let head = linkedlist
    let slow = head
    let fast = head
    while (slow && fast && fast.next != null) {
        slow = slow.next
        fast = fast.next.next
        if (slow == fast) {
            slow = head;
            while (slow == fast) {
                slow = slow.next
                fast = fast.next
            }
            return slow
        }
    }
    return null
}
function LengthOfLoop(arr) {
    let linkedlist = buildLinkedListFromArr(arr)
    let head = linkedlist
    let slow = head
    let fast = head
    let count = 0;
    while (slow && fast && fast.next != null) {
        slow = slow.next
        fast = fast.next.next
        if (slow == fast) {
            slow = slow.next;
            count++;
            while (slow != fast) {
                slow = slow.next;
                count++;
            }
            return count
        }

    }
    return 0;
}

function checkIFPalindrome(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist;
    let slow = head;
    let fast = head;

    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let newHead = ReverseSingleLL(slow.next);
    let first = head; let second = newHead;

    while (second != null) {
        if (first.data != second.data) {
            ReverseSingleLL(newHead);
            return false;
        }
        first = first.next;
        second = second.next;
    }
    ReverseSingleLL(newHead)
    return true
}

function GroupOddEven(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist;
    let odd = head;
    let even = head.next;
    let evenHead = head.next;

    while (even != null && even.next != null) {
        odd.next = odd.next.next;
        odd = odd.next;
        even.next = even.next.next;
        even = even.next;
    }
    odd.next = evenHead
    return head;
}
function RemoveKthfromEnd(arr, k) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist;

    let fast = head;
    let slow = head;
    for (let i = 0; i < k; i++) {
        fast = fast.next
    }
    while (fast != null && fast.next != null) {
        slow = slow.next
        fast = fast.next
    }
    if (fast == null) return head.next
    slow.next = slow.next.next;

    return head;
}
function DeleteMiddle(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist
    let slow = head
    let fast = head
    fast = fast.next.next //require middle.prev so we skip slow 1st time

    while (fast != null && fast.next != null) {
        slow = slow.next
        fast = fast.next.next;
    }
    let deleteEl = slow.next
    slow.next = slow.next.next
    deleteEl.next = null

    return head
};

function mergeSortLL(list1, list2) {
    let temp = new Node(-1);
    let current = temp; // Keep reference to build the list

    while (list1 != null && list2 != null) {
        if (list1.data <= list2.data) {
            current.next = list1;
            list1 = list1.next;
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;
    }

    if (list1 != null) {
        current.next = list1;
    } else {
        current.next = list2;
    }

    return temp.next;
}

function findMiddle1st(head) {
    let slow = head;
    let fast = head.next;

    while (fast != null && fast.next != null) {
        slow = slow.next
        fast = fast.next.next
    }
    return slow
}
function SortLinkedList(head) {
    if (head == null || head.next == null) {
        return head;
    }
    let middle = findMiddle1st(head);
    let right = middle.next;
    middle.next = null;
    let left = head;
    
    let leftNode = SortLinkedList(left)
    let rightNode = SortLinkedList(right)

    return mergeSortLL(leftNode, rightNode)
}

function SORT(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    return SortLinkedList(linkedlist)

}
console.log(SORT([5, 1, 2, 4]))