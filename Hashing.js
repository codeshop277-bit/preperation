let arr = [1,3,2,4,5,3,1,1,2,4]
let count = 0;
let intMap = new Map()
function ArrCount(n, arr){
    for(let i=0; i<arr.length; i++){
        if(arr[i] == n){
            count++;
        }
    }
    return count;
}
for (let i of arr){
    intMap.set(i, (intMap.get(i) ||0)+1)
}
console.log('intmap', intMap)
console.log(ArrCount(4, arr))

//Above method is applicable only when the element is provided for which the count should be found

//Using hasing we can count all the elements in an array at once
const size = 10 ** 3;   // or Math.pow(10, 3)
const arr1 = Array(size).fill(0);
let hasedArray = new Array(12).fill(0)
function hasing(arr){
    for(let i=0; i<arr.length; i++){
        hasedArray[arr[i]] += 1;
    }
    return hasedArray
}
console.log(hasing(arr))

//Character hasing
let CharhasedArray =new Array(256).fill(0)
// new Array(26).fill(0).map((a, i) => String.fromCharCode(65 + i))
let charArr = "abcdfcabuecab"
function Charhasing(charArr){
    for(let i=0; i<charArr.length; i++){
        const code = charArr.charCodeAt(i)// js cannot parse string to int
        CharhasedArray[code] += 1;
    }
    return CharhasedArray
}
console.log(Charhasing(charArr))


// Using MAP

let charMap = new Map()
let str = "abygfdbtasecsdasesfgacsa";
for(const ch of str){
    charMap.set(ch, (charMap.get(ch) || 0)+1)
}
console.log(charMap)


// Given an array nums of n integers, find the most frequent element in it i.e., the element that occurs the maximum number of times. If there are multiple elements that appear a maximum number of times, find the smallest of them.

class Solution {
    mostFrequentElement(nums) {
        let freq = new Map();

        for(let num of nums){
            freq.set(num, (freq.get(num) ||0) +1)
        }
        let maxFreq = 0;
        let result = Infinity;
        for (const [sum, count] of freq){
            if(count > maxFreq || (count === maxFreq && num < result)){
                maxFreq = count;
                result = num;
            }

        }
        return result;
    }
}