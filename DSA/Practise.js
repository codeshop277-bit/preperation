function EucledianGCD(n1, n2) {
    let count = 0;

    while(n1>0 & n2>0){
        count++
        console.log('n1', n1, 'n2', n2)
        console.log('count', count)
        if(n1> n2){
            n1= n1 % n2
        }else{
            n2= n2 % n1
        }
        if(n1==0){
            return n2
        }else if(n2==0){
            return n1
        }
    }
}
console.log(EucledianGCD(90,180)) //6