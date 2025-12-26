function LargestElement(arr) {
    //T.c - o(n)
    let max = arr[0];
    let maxIndex = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) { //swap this to arr[i] < min for smallest element in array
            max = arr[i];
            maxIndex = i;
        }
    }
    return { "Max-Element": max, "MaxIndex": maxIndex }
}
//console.log(LargestElement([3, 3, 0, 99, -40]))
function SecondLargestElementWOSort(arr) {
    //T.c - o(n)
    let max = arr[0];
    let secondMax = -1;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max) {
            secondMax = max
            max = arr[i];
        } else if (arr[i] < max && arr[i] > secondMax) {
            secondMax = arr[i]
        }
    }
    return { "Max-Element": max, "SecondMax": secondMax }
}
//console.log(SecondLargestElementWOSort([]))

function CheckArrayIsSorted(nums) {
    //T.c - o(n)
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            return false
        }
    }
    return true

}
//console.log(CheckArrayIsSorted([1,2,3,3,4,4,5]))


function RemoveDuplicatesFromSorted(nums) {
    //T.c - o(n)
    let unique = 0;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] != nums[unique]) {
            unique++;
            nums[unique] = nums[i]
        }
    }
    return unique + 1;

}
//console.log(RemoveDuplicatesFromSorted([1,2,3,3,4,4,5]))

function LeftRotateArrayByOne(nums) {
    //T.c - o(n)
    let temp = nums[0];
    for (let i = 1; i < nums.length; i++) {
        nums[i - 1] = nums[i]
    }
    nums[nums.length - 1] = temp
    return nums;

}
//console.log(LeftRotateArrayByOne([1,2,3,3,4,4,5]))

function LeftRotateArrayByK(nums, k) {

    k = k % nums.length;
    if (k == 0) return nums
    //T.c - n+d
    //S.c = O(d)
    let temp = nums.slice(0, k);
    let righttemp = nums.slice(nums.length - k, nums.length);
    console.log(righttemp)
    for (let i = k; i < nums.length; i++) {
        nums[i - k] = nums[i]
    }
    for (let j = 0; j < temp.length; j++) {
        nums[nums.length - k + j] = temp[j]
    }
    return nums;

}
//console.log(LeftRotateArrayByK([3, 4, 1, 5, 3, -5], 8))
function LeftRotateArrayByKReverse(nums, k) {
    k = k % nums.length;  // Handle k > array length

    function reverse(start, end) {
        while (start < end) {
            [nums[start], nums[end]] = [nums[end], nums[start]];
            start++;
            end--;
        }
    }

    reverse(0, k - 1);

    reverse(k, nums.length - 1);

    reverse(0, nums.length - 1);

    return nums;
}

// [3, 4, 5, 6, 7, 1, 2] ✓
//console.log(LeftRotateArrayByKReverse([1,2,3,4,5,6,7], 2))


function RightRotateArrayByK(nums, k) {

    k = k % nums.length;
    if (k == 0) return nums
    //T.c - n+d
    //S.c = O(d)
    let righttemp = nums.slice(nums.length - k, nums.length);
    console.log(righttemp)
    for (let i = nums.length - 1; i >= k; i--) {
        nums[i] = nums[i - k]
    }
    for (let j = 0; j < righttemp.length; j++) {
        nums[j] = righttemp[j]
    }
    return nums;

}
//console.log(RightRotateArrayByK([1,2,3,4,5,6], 2))


function MoveZerosToEnd(nums) {
    let nonZero = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] != 0) {
            nums[nonZero] = nums[i]
            nonZero++;
        }
    }
    for (let j = nonZero; j < nums.length; j++) {
        nums[j] = 0
    }
    return nums;

}
//console.log(MoveZerosToEnd([0, 0, 0, 1, 3, -2]))

function LinearSearch(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;

}
//console.log(LinearSearch([2, -4, 4, 0, 10], 5))

function UnionArray(nums1, nums2) {
    let i = 0;
    let j = 0;
    let a = nums1.length;
    let b = nums2.length;
    let union = [];

    while (i < a && j < b) {
        if (nums1[i] <= nums2[j]) {
            if (union.length == 0 || union[union.length - 1] != nums1[i]) {
                union.push(nums1[i])
            }
            i++;
        } else {
            if (union.length == 0 || union[union.length - 1] != nums2[j]) {
                union.push(nums2[j])
            }
            j++;
        }
    }
    while (i < a) {
        if (nums1[i] <= nums2[j]) {
            if (union.length == 0 || union[union.length - 1] != nums1[i]) {
                union.push(nums1[i])
            }
            i++;
        }
    }
    while (j < b) {
        if (union.length == 0 || union[union.length - 1] != nums2[j]) {
            union.push(nums2[j])
        }
        j++;
    }

    return union

}
//console.log(UnionArray([1, 2, 3, 4, 5], [1, 2, 6, 7]))


function IntersectionArray(nums1, nums2) {
    let i = 0;
    let j = 0;
    let a = nums1.length;
    let b = nums2.length;
    let intersection = [];
    while(i<a && j<b){
        if(nums1[i]< nums2[j]){
            i++
        }else if (nums2[j]< nums1[i]){
            j++
        }else{
            intersection.push(nums1[i])
            i++;
            j++
        }
    }
    return intersection

}
//console.log(IntersectionArray([1, 2, 3, 4, 5], [2,3,4,6]))

function MissingNo(nums){
    let n = nums.length
    let sumOfN = n*(n+1)/2;
    let sum = 0;
    for(let i=0; i<n; i++){
        sum += nums[i]
    }
    return sumOfN - sum;
}
//console.log(MissingNo([0,1,2,3,4,5]))

function MissingNoHash(nums){
let missingSet = new Set(nums)
for(let i=0; i<nums.length; i++){
    if(!missingSet.has(i)){
        return i;
    }
}
}
//console.log(MissingNoHash([0,1,2, 3,4,5]))

function MaxConsecutiveOne(nums){
    let max = 0;
    let cons = 0;
    for(let i=0; i<nums.length; i++){
        if(nums[i] == 1){
            cons++;
        }else{
            cons = 0;
        }
        if(cons> max){
            max = cons;
        }
    }
    return max;

}
//console.log(MaxConsecutiveOne([1, 1, 0, 0, 1, 1, 1, 0, 1,1,1,1,1,3]))

function FindSingleNo(nums){
 let map = new Map();
 for(let i=0; i<nums.length; i++){
    map.set(nums[i], (map.get(nums[i]) || 0) +1)
 }
 for(let [key, value] of map){
    if (value == 1){
        return key
    }
 }
}
//console.log(FindSingleNo([1, 2, 2, 4, 3,3, 5, 1, 4]))

function FindSingleNoXOR(nums){
 let result = 0;
 for(let i=0; i<nums.length; i++){
    result = result ^ nums[i]
 }
 return result
}
//console.log(FindSingleNoXOR([1, 2, 2, 4, 3,3, 5, 1, 4]))

function LongestSubArray(nums, k){
   let map = new Map();
   let sum = 0;
   let maxLen = 0;
   for(let i=0; i<nums.length; i++){
    sum+=nums[i];

    if(sum == k){
        maxLen = Math.max(maxLen, i+1)
    }

    if(map.has(sum-k)){
        maxLen = Math.max(maxLen, i-(map.get(sum-k)))
    }
    if(!map.has(sum)){
        map.set(sum, i)
    }
   }
   return maxLen
}
//console.log(LongestSubArray([10, 5, 2, 7, 1, 9], 15))


function ShortestSubArray(nums, k){
   let map = new Map();
   let sum = 0;
   let minLen = Infinity;
   for(let i=0; i<nums.length; i++){
    sum+=nums[i];

    if(sum == k){
        minLen = Math.min(minLen, i+1)
    }

    if(map.has(sum-k)){
        minLen = Math.min(minLen, i-(map.get(sum-k)))
    }
    if(!map.has(sum)){
        map.set(sum, i)
    }
   }
   return minLen
}
//console.log(ShortestSubArray([10, 5, 2, 7, 1, 9], 15))

function TwoSum(nums, target){
    //if map cannot be used try sorting the array and use two pointer
    let map = new Map();
    for(let i=0; i<nums.length; i++){
        if(map.has(target - nums[i])){
            return [map.get(target-nums[i]), i]
        }
        map.set(nums[i], i)

    }
}
//console.log(TwoSum([1, 3, 5, -7, 6, -3], 0))

function SortOS1S2S(nums){
    //Dutch national flag algorithm
    //Brute force - keep a counter for 0,1 and 2. Iteerate the array and get each count. Build new array with counts
    let low = 0; let mid =0; let high = nums.length -1;

    while(mid<= high){
        if(nums[mid] == 0){
            [nums[low], nums[mid]] = [nums[mid], nums[low]]
            low++;
            mid++;
        }else if(nums[mid] == 1){
            mid++;
        }else{
            [nums[mid], nums[high]] = [nums[high], nums[mid]]
            high--;
        }
    }
    return nums;
}
//console.log(SortOS1S2S([1, 0, 2, 1, 0]))

function MajorityElement(nums) {
    let map = new Map();

    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], (map.get(nums[i]) || 0) + 1)
    }
    for ([key, value] of map) {
        if (value > nums.length / 2) {
            return key
        }
    }
    return -1;
}
//console.log(MajorityElement([1, 0, 2, 1, 0, 0, 0]))

function MajorityElementMooresAlgo(nums) {
    let el;
    let count = 0;
    for(let i=0; i<nums.length; i++){
        if(count ==0){
            el = nums[i]
            count = 1;
        }else if(el == nums[i]){
            count++;
        }else{
            count--;
        }
    }
    return el > nums.lenght/2 ? el : -1;
}
//console.log(MajorityElementMooresAlgo([1, 0, 2, 1, 0, 0]))

function MaxSubarraySum(nums) {
    //Kadane's algorithm
    let sum =0;
    let max = -Infinity;
    let startIndex=0;
    let endIndex = 0;

    for(let i=0; i<nums.length; i++){
        sum+=nums[i]
        if(sum>max){
            max=sum;
            endIndex = i
        }
        if(sum<0){
            sum=0
            startIndex = i+1;
        }
    }
    return nums.slice(startIndex, endIndex+1);
}
console.log(MaxSubarraySum([-2,-3,4,-1,-2,1,5,-3]))
