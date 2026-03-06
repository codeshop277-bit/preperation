function StartOfLoop(arr){
    let head = arr;
    let slow = head;
    let fast = head;
        let count = 0

    while(slow && fast && fast.next != null){
        slow = slow.next
        fast = fast.next.next
       if(slow == fast){
        slow = slow.next
        count++
        while(slow != fast){
            slow = slow.next
            count++
        }
        return count
       }
    }
}

//
Build  a gold price tracker app. It should have only one landing page. The landing page will display the gold /gm and /soverign rates for the past 5 days in tabular form. Rates should be in INR. Top right of the table should have avg proce of the week and how much it has been increased or decreased from previous day. Use rich ui like framer motion. UI should look rich. And best to have in yellow gradients. Use nextjs for ui and no need of separate backend code. Come up with a plan of what you are going to build before executing it