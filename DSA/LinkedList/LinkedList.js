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

    while(temp != null){
        if(temp.data == key) return true
        temp = temp.next
    }
    return false
}
// console.log(SearchInLinkedList([1,2,3,4,5], 2))
// ListNode {
//   val: 7,
//   next: ListNode { val: 8, next: ListNode { val: 9, next: [ListNode] } }
// }

function DeleteKthElement(head, k){
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList
    let count = 0; let prev = null

    while(temp!= null){
        count++;
        if(count ==k){
            if(prev == null){
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
function DeleteHead(head){
    let temp = head;
    if(temp.next == null) return null
    return head.next;
}
function DeleteTail(head){
    let temp = head;
    while(temp.next.next != null){
       temp = temp.next
    }
    temp.next = null
    return head
}

function InsertELementAtHead(head, x){
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    let element = new Node(x);
    element.next = temp;

    return element
}
// console.log(InsertELementAtHead([2,3], 1))

function InsertELementAtTail(head, x){
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    let element = new Node(x);
    if(linkedList== null) return element 
    while(temp !=null){
        if(temp.next == null){
            temp.next = element
            break;
        }
        temp = temp.next
    }
    return linkedList;
}
// console.log(InsertELementAtTail([2,3], 1))

function InsertElementAtKth(head, k, x){
    const linkedList = buildLinkedListFromArr(head);
    let temp = linkedList;
    const element = new Node(x);
    let count = 1;
    if(k==1){
        element.next = temp
        return linkedList;
    }
    while(temp!=null){
        if(count == k-1){
            element.next = temp.next
            temp.next = element
            break
        }
        count++;
        temp = temp.next
    }
    return linkedList
}
console.log(InsertElementAtKth([1,2,3,4,5], 3, 10))