// function PrintNo(n){
// if(n==3) return
// console.log(n)
// n++
// PrintNo(n)
// }
// PrintNo(0)

// //Print name n times

// function PrintName(i, n){
//     if(i>n) return
//     console.log('Recursion')
//     PrintName(i+1, n)
// }
// PrintName(1, 4)

//Print linearly from 1 to N
// function Print1toN(i, n){
//     if(i>n) return
//     console.log(i)
//     Print1toN(i+1, n)
// }
// Print1toN(1, 5)

//Print linearly from N to 1
// function PrintNto1(i, n){
//     if(n<i) return
//     console.log(n)
//     //If n = 5, then n-- evaluates to 5, and only after that does n become 4 in the current scope.
//     PrintNto1(i, n-1)
// }
// PrintNto1(1, 5)

// Print backtracking
// function Print1toN(i, n){
//     if(i>n) return
//     Print1toN(i+1, n)
//     console.log(i)
// }
// Print1toN(1, 5)

//Print Sum of  1 to N
// let sum = 0;
// function PrintSum(i, n){
//     if(i>n) return
//     sum = sum+i
//     PrintSum(i+1, n)
//     //console.log(i)
// }
// PrintSum(0, 5)
// console.log(sum)

//Using function to print sum of 1 to N
// function PrintSumFN(n){
//    if(n==0) return 0;
//    return n + PrintSumFN(n-1)
// }
// console.log(PrintSumFN(10))

//Using function to print factorial of 1 to N
// function PrintSumFN(n){
//    if(n==1) return 1;
//    return n * PrintSumFN(n-1)
// }
// console.log(PrintSumFN(5))

//Reverse an array
// let array = [1,2,3,4,5]

// function SwapArray(l, r){

//     if(l>=r) return
//     let temp = array[l];
//     array[l] = array[r]
//     array[r]= temp

//     SwapArray(l+1, r-1)
// }

// SwapArray(0, array.length-1)
// console.log(array)

//Reverse usong single pointer
let array = [1,2,3,4,5, 7]

function SwapArray(i){

    if(i>= array.length/2) return
    let temp = array[i];
     array[i] = array[array.length - i -1]
    array[array.length -i-1]= temp

    SwapArray(i+1)
}

SwapArray(0)
console.log(array)

//Check palindrome
let string = "MADAME"

function CheckPalindrome(i){

    if(i>= string.length/2) return true; //always true
    if(string[i] != string[string.length -i -1]) return false;

    return CheckPalindrome(i+1)
}
console.log(CheckPalindrome(0))

//Fibonacci
f(n) = f(n-1) + f(n-2)
function fibonacci(n){
    if (n<=1) return n;
    let last = fibonacci(n-1);
    let secondLast = fibonacci(n-2);
    return last + secondLast
}
console.log(fibonacci(4))