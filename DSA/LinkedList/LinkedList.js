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
// console.log(SORT([5, 1, 2, 4]))

function Sort012(arr) {
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist;
    let zeroNode = new Node(-1);
    let oneNode = new Node(-1);
    let twoNode = new Node(-1);
    let one = oneNode;
    let two = twoNode;
    let zero = zeroNode;

    let temp = head;

    while (temp != null) {
        if (temp.data == 0) {
            zero.next = temp;
            zero = zero.next;
        } else if (temp.data == 1) {
            one.next = temp;
            one = one.next;
        } else {
            two.next = temp;
            two = two.next;
        }
        temp = temp.next
    }
    zero.next = oneNode.next ? oneNode.next : twoNode.next;
    one.next = twoNode.next;
    two.next = null

    return zeroNode.next
}

// console.log(Sort012([1,0,2,0,1]))

function IntersectionPoint(arr1, arr2){
    const headA = buildLinkedListFromArr(arr1);
    const headB = buildLinkedListFromArr(arr2);
    let temp1 = headA;
    let temp2= headB

    if(headA == null || headB == null) return null

    while(temp1 != temp2){
       temp1 = temp1 == null ? headB : temp1.next;
    temp2 = temp2 == null ? headA : temp2.next;
    }
    return temp1
}
function RecursiveCarry(temp){
    if(temp == null) return 1;

    let carry = RecursiveCarry(temp.next);
    temp.data+=carry
    if(temp.data < 10) return 0;
    temp.data = 0;
    return 1;
}
function Add1ToLL(arr){
    const linkedlist = buildLinkedListFromArr(arr)
    let head = linkedlist;

    let carry = RecursiveCarry(head);

    if(carry == 1){
        let newHead = new Node(1);
        newHead.next = head
        head = newHead
    }
    return head;
}

// console.log(Add1ToLL([1,2,3]))

function Add2LL(arr1, arr2){
    const linkedlist1 = buildLinkedListFromArr(arr1);
    const linkedlist2 = buildLinkedListFromArr(arr2);
    let head1 = linkedlist1
    let head2 = linkedlist2

    let result = new Node(-1);
    let current = result;
    let carry = 0;

    while(head1 != null || head2 != null){
       let sum = carry
       if(head1) sum+= head1.data
       if(head2) sum+=head2.data

       carry = Math.floor(sum/100);
        let newNode = new Node(sum%10);
        current.next = newNode;
        current = current.next
        if(head1) head1 = head1.next
        if(head2) head2 = head2.next
    }
    if(carry!=0){
        let newHead = new Node(carry)
        current.next = newHead;
    }
    return result.next;
}
// console.log(Add2LL([1,2,3], [4,5,6]))
function DeleteAllOccOfKeyInDLL(arr, target){
    const linkedlist = buildDoubleLinkedList(arr);
    let head = linkedlist;
    let temp = head;

    while(temp !=null){
        if(temp.data == target){
            if(temp == head) head = head.next
            let prev = temp.prev;
            let next = temp.next
            if(prev) prev.next = next
            if(next)next.prev = prev

            temp = next
        }else{
        temp= temp.next
        }

    }
    return head
}
// console.log(DeleteAllOccOfKeyInDLL([10,2, 10, 1,10], 10))

function findTail(head){
    let temp = head;
    while(temp.next != null){
        temp = temp.next;
    }
    return temp;
}
function PairsOfGivenSum(arr, target){
    const linkedlist = buildDoubleLinkedList(arr);
    let head = linkedlist;
    let temp = head;
    let ans = [];
    let left = head;
    let right = findTail(head);
    while(left.data <right.data){
        if(left.data + right.data == target){
            ans.push([left.data, right.data])
            left = left.next
            right = right.prev
        }else if(left.data + right.data <target){
            left = left.next
        }else{
            right = right.prev
        }
    }
return ans
}

// console.log(PairsOfGivenSum([1,2,3,4,9], 5))

function RemoveDUplicatesFromSortedDLL(arr){
    const linkedList = buildDoubleLinkedList(arr);
    let head = linkedList
    let temp = head;

    while(temp!= null && temp.next != null){
        let nextNode = temp.next;
        while(nextNode != null && nextNode.data == temp.data){
            nextNode = nextNode.next;
        }
        temp.next = nextNode
        if(nextNode) nextNode.prev = temp
        temp = temp.next
    }
    return head
}
// console.log(RemoveDUplicatesFromSortedDLL([1,1,1,2,3,3,4]))

function findKthNode( head, k){
    k-=1
    while(head!= null && k>0){
        k--
        head=head.next
    }
    return head
}
function ReverseNodesInKGroup(arr,k){
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist;
    let temp = head;
    let nextNode = null;
    let prevNode = null;

    while(temp != null){
        let kthNode = findKthNode(temp, k);
        if(kthNode == null){
            if(prevNode) prevNode.next = temp
            break;
        }
        nextNode = kthNode.next;
        kthNode.next = null;
        
        // Reverse returns the new head (which is kthNode)
        // temp is now the tail of the reversed segment
        ReverseSingleLL(temp);
        
        if(temp == head){
            head = kthNode; // kthNode is new head of entire list
        } else {
            prevNode.next = kthNode; // Connect previous segment to new head
        }
        
        prevNode = temp; // temp is now the tail, correct!
        temp = nextNode; // Move to 
    }
    return head
}
// console.log(ReverseNodesInKGroup([1,2,3,4,5,6,7], 3))

function ROtateLinkedList(arr, k){
    const linkedList = buildLinkedListFromArr(arr);
    let head = linkedList
    let temp = head;
    let tail = head;
    let count = 1;
    while(tail.next != null){
        count++
        tail = tail.next
    }
    tail.next = head;
    k = k%count;
    let diff = count - k;
    diff-=1
    while(temp!= null && diff>0){
        diff--
        temp = temp.next
    }
    head = temp.next
    temp.next = null
    return head

}
console.log(ROtateLinkedList([1,2,3,4,5], 2))

function FlattenLL(arr){
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist
    let temp = head;

    function mergeLL(list1, list2){
        let dummyNode = new Node(-1);
        let res = dummyNode;
        while(list1 != null && list2 != null){
            if(list1.data <list2.data){
                res.child = list1;
                res = list1;
                list1 = list1.child
            }else{
                res.child = list2;
                res = list2;
                list2 = list2.child
            }
            res.next = null;
        }
        if(list1) {
            res.child = list1
        }else{
            res.child = list2
        }
        if(dummyNode.child) dummyNode.child.next = null
        return dummyNode.child
    }
    function recursivehead(val){
        if(val == null || val.next == null) return val
        let mergedHead = recursivehead(val.next);
        return mergeLL(val, mergedHead)
    }

    recursivehead(temp)
}

function CloneLLWIthDummyAndRandom(arr){
    const linkedlist = buildLinkedListFromArr(arr);
    let head = linkedlist
    let temp = head

    while(temp!= null){
        let copy = new Node(temp.data);
        copy.next = temp.next
        temp.next = copy
        temp = temp.next
    }
    temp = head
    while(temp != null){
        let copyNode = temp.next
         if (temp.random) {
            copyNode.random = temp.random.next;
        } else {
            copyNode.random = null;
        }
        temp = temp.next
    }
    let dummyNode = new Node(-1)
    let res = dummyNode
    temp = head
    while(temp != null){
        res.next = temp.next
        temp.next = temp.next.next
    }
    return dummyNode.next
}
class Browser{
    constructor(homepage){
        this.currentPage = new DoubleNode(homepage)
    };
    visit(url){
        const newNode = new DoubleNode(url);
        newNode.back = this.currentPage;
        this.currentPage.next = newNode;
        this.currentPage = newNode;
    };
    back(steps){
        while(steps > 0){
            if(this.currentPage.back){
                this.currentPage = this.currentPage.back;
            }else{
                break;
            }
            steps--;
        }
    };
     forward(steps){
        while(steps > 0){
            if(this.currentPage.next){
                this.currentPage = this.currentPage.next
            }else{
                break;
            }
            steps--;
        }
    }
}