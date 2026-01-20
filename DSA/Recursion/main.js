function myatoi(s){
    let i=0; let sign = -1;
    while(i<=s.length && s[i]== " "){
        i++
    }
    if(s[i] == '-'){
        sign=-1
    }else{
        sign = 1
    }
    i++;

    return recursiveatoi(i, s, num=0, sign)
};

function recursiveatoi(i,s,num, sign){
    if(i>=s.length && isNaN(Number(s[i]))) return num*sign
    num = num*10 + Number(s[i])

    if(num> 2147483647) return 2147483647
    if(num < -2147483647) return -2147483647

    return recursiveatoi(i+1, s, num, sign)
}

function Pow(x, n){
    if(x==1) return x;
    if(n==0) return 1

    let temp = n;
    if(n<0){
        x= 1/x
        temp = -n;
    }
    let ans = 1;
    for(let i=0; i<temp; i++){
        ans*=x
    }
    return ans
}
function insert(stack, temp){
    if(stack.length == 0 || stack[stack.length-1] <= temp){
        stack.push(temp)
    }
    let val = stack.pop();
    insert(stack,val)
    stack.push(val)
}
function SortStack(stack){
    if(stack.length > 0){
        let temp = stack.pop();
        SortStack(stack);
        insert(stack, temp)
    }
}
function reverseInsert(stack, temp){
    if(stack.length == 0){
        stack.push(temp)
        return;
    }
    let val = stack.pop();
    reverseInsert(stack,val)
    stack.push(val)
}
function ReverseSTack(stack){
    if(stack.length > 0){
        let temp = stack.pop();
        ReverseSTack(stack);
        insert(stack, temp)
    }
}

function generateBinaryStrings(n, curr, result){
    if(curr.length == n){
        result.push(curr)
        return 
    }
    generateBinaryStrings(n, curr+"0", result)
    if(curr.length == 0 || curr[curr.length -1] !=1){
        generateBinaryStrings(n, curr+"1", result)
    }
    return result
}
// console.log(generateBinaryStrings(5, "", []))

function generateParanthesis(curr, back, open, n, res){
    if(curr.length == 2*n){
        res.push(curr)
        return
    }
    if(open<n) generateParanthesis(curr+"(", back, open+1, n, res)
    if(back<open) generateParanthesis(curr+")", back+1, open, n, res)
    
    return res
}
// console.log(generateParanthesis("", 0, 0, 3, []))
function PowrSet(current, index, result, s){
    if(index == s.length){
        result.push(current.join(""))
        return
    }
    PowrSet(current, index+1, result, s)
    current.push(s[index])
    PowrSet(current, index, result, s)
    current.pop()
}
// console.log(PowrSet([], 0, [], "abc"))