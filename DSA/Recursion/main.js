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