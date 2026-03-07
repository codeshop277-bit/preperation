function Sort(ll){
    let niddle = findMiddle(ll)
    let right = FindMiddle.next
    FindMiddle.next = null
    let left = head

    let leftNode = Sort(left)
    let rightNode = Sort(right)
    return mergeSortLL(leftNode, rightNode)
}

function mergeSort(l1, le2){
    let temp = new Node(-1)
    let current = temp
    while(l1 != null && l2 != null){
        if(l1.data <= l2.data){
            current.next = l1
            l1 = l1.next
        }
    }
}

function SOrt012(ll){
    let zero = new Node(-1)
    let one = new Node(-1)
    let two = new Node(-1)

    let zeroNode = zero
    let  oneNode = one
    let twoNode = two

    while(temp != null){
        if(temp.data == 0){
            zero.next = temp
            zero = zero.next
        }else if(temp.data == 1){
            one.next = temp
            one = one.next
        }else{
            two.next = temp
            two = two.next
        }
    }
    zero.next = oneNode.next ? oneNode.next : twoNode.next
    one.next = twoNode.next
    two.next = null
}
function add(){
    let head1;
    let head2;
    let carry = 0

    while(head1 != null && head2 != null){
        let sum = carry
        if(head1) sum+=head1.data
        if(head2) sum+=head2.data

        carry = Math.floor(sum/100)
        let newNode = new Node(sum %10)
        current.next = newNode
        current = current.next

        if(head2) head2 = head2.next
        if(head1) head1 = head1.next

    }
    if(carry >0){
        let newNode = new Node(1)
        newNode.next = current
    }
}