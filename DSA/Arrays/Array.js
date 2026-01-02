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
    while (i < a && j < b) {
        if (nums1[i] < nums2[j]) {
            i++
        } else if (nums2[j] < nums1[i]) {
            j++
        } else {
            intersection.push(nums1[i])
            i++;
            j++
        }
    }
    return intersection

}
//console.log(IntersectionArray([1, 2, 3, 4, 5], [2,3,4,6]))

function MissingNo(nums) {
    let n = nums.length
    let sumOfN = n * (n + 1) / 2;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += nums[i]
    }
    return sumOfN - sum;
}
//console.log(MissingNo([0,1,2,3,4,5]))

function MissingNoHash(nums) {
    let missingSet = new Set(nums)
    for (let i = 0; i < nums.length; i++) {
        if (!missingSet.has(i)) {
            return i;
        }
    }
}
//console.log(MissingNoHash([0,1,2, 3,4,5]))

function MaxConsecutiveOne(nums) {
    let max = 0;
    let cons = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] == 1) {
            cons++;
        } else {
            cons = 0;
        }
        if (cons > max) {
            max = cons;
        }
    }
    return max;

}
//console.log(MaxConsecutiveOne([1, 1, 0, 0, 1, 1, 1, 0, 1,1,1,1,1,3]))

function FindSingleNo(nums) {
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], (map.get(nums[i]) || 0) + 1)
    }
    for (let [key, value] of map) {
        if (value == 1) {
            return key
        }
    }
}
//console.log(FindSingleNo([1, 2, 2, 4, 3,3, 5, 1, 4]))

function FindSingleNoXOR(nums) {
    let result = 0;
    for (let i = 0; i < nums.length; i++) {
        result = result ^ nums[i]
    }
    return result
}
//console.log(FindSingleNoXOR([1, 2, 2, 4, 3,3, 5, 1, 4]))

function LongestSubArray(nums, k) {
    let map = new Map();
    let sum = 0;
    let maxLen = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];

        if (sum == k) {
            maxLen = Math.max(maxLen, i + 1)
        }

        if (map.has(sum - k)) {
            maxLen = Math.max(maxLen, i - (map.get(sum - k)))
        }
        if (!map.has(sum)) {
            map.set(sum, i)
        }
    }
    return maxLen
}
//console.log(LongestSubArray([10, 5, 2, 7, 1, 9], 15))


function ShortestSubArray(nums, k) {
    let map = new Map();
    let sum = 0;
    let minLen = Infinity;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];

        if (sum == k) {
            minLen = Math.min(minLen, i + 1)
        }

        if (map.has(sum - k)) {
            minLen = Math.min(minLen, i - (map.get(sum - k)))
        }
        if (!map.has(sum)) {
            map.set(sum, i)
        }
    }
    return minLen
}
//console.log(ShortestSubArray([10, 5, 2, 7, 1, 9], 15))

function TwoSum(nums, target) {
    //if map cannot be used try sorting the array and use two pointer
    let map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(target - nums[i])) {
            return [map.get(target - nums[i]), i]
        }
        map.set(nums[i], i)

    }
}
//console.log(TwoSum([1, 3, 5, -7, 6, -3], 0))

function SortOS1S2S(nums) {
    //Dutch national flag algorithm
    //Brute force - keep a counter for 0,1 and 2. Iteerate the array and get each count. Build new array with counts
    let low = 0; let mid = 0; let high = nums.length - 1;

    while (mid <= high) {
        if (nums[mid] == 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]]
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
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
    for (let i = 0; i < nums.length; i++) {
        if (count == 0) {
            el = nums[i]
            count = 1;
        } else if (el == nums[i]) {
            count++;
        } else {
            count--;
        }
    }
    return el > nums.lenght / 2 ? el : -1;
}
//console.log(MajorityElementMooresAlgo([1, 0, 2, 1, 0, 0]))

function MaxSubarraySum(nums) {
    //Kadane's algorithm
    let sum = 0;
    let max = -Infinity;
    let startIndex = 0;
    let endIndex = 0;

    for (let i = 0; i < nums.length; i++) {
        sum += nums[i]
        if (sum > max) {
            max = sum;
            endIndex = i
        }
        if (sum < 0) {
            sum = 0
            startIndex = i + 1;
        }
    }
    return nums.slice(startIndex, endIndex + 1);
}
//console.log(MaxSubarraySum([-2,-3,4,-1,-2,1,5,-3]))
function RearrangeElementsOfN(nums) {
    //only if pos == neg
    let posIndex = 0;
    let final = []
    let negIndex = 1;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            final[posIndex] = nums[i];
            posIndex += 2
        } else {
            final[negIndex] = nums[i];
            negIndex += 2
        }
    }

    return final
}
//console.log(RearrangeElementsOfN([3, 1, -2, -5, 2, -4]))
function RearrangeElements(nums) {
    let pos = [];
    let neg = [];
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > 0) {
            pos.push(nums[i])
        } else {
            neg.push(nums[i])
        }
    }
    //if pos>neg
    if (pos.length == neg.length) {

        for (let i = 0; i < (nums.length) / 2; i++) {
            nums[2 * i] = pos[i]
            nums[2 * i + 1] = neg[i]
        }
    } else if (pos.length > neg.length) {
        for (let i = 0; i < neg.length; i++) {
            nums[2 * i] = pos[i]
            nums[2 * i + 1] = neg[i]
        }
        let index = neg.length * 2;
        for (let i = neg.length; i < pos.length; i++) {
            nums[index] = pos[i];
            index++;
        }
    } else {
        for (let i = 0; i < pos.length; i++) {
            nums[2 * i] = pos[i]
            nums[2 * i + 1] = neg[i]
        }
        let index = pos.length * 2;
        for (let i = pos.length; i < neg.length; i++) {
            nums[index] = neg[i];
            index++;
        }
    }

    return nums
}
//console.log(RearrangeElements([3, 1, -2, -5, 2, -4, 1, 5]))

function NextPermutation(nums) {
    //refer book for steps
    let index = -1;
    let n = nums.length
    for (let i = n - 2; i >= 0; i--) {
        if (nums[i] < nums[i + 1]) {
            index = i;
            break;
        }
    }
    if (index == -1) {
        return nums.reverse()
    }
    for (let i = n - 1; i > index; i--) {
        if (nums[i] > nums[index]) {
            [nums[i], nums[index]] = [nums[index], nums[i]]
        }
    }
    function reverseRange(arr, start, end) {
        return [
            ...arr.slice(0, start),
            ...arr.slice(start, end + 1).reverse(),
            ...arr.slice(end + 1)
        ];
    }

    let result = reverseRange(nums, index + 1, n - 1);
    return result
}
//console.log(NextPermutation([2, 1, 5, 4, 3, 0, 0]))

function LeaderArray(nums) {
    let max = -Infinity;
    let ans = []
    for (let i = nums.length - 1; i >= 0; i--) {
        if (nums[i] > max) {
            ans.push(nums[i])
            max = Math.max(max, nums[i])
        }
    }
    return ans
}
//console.log(LeaderArray([10,22,12,3,0,6]))

function LongestConsecutive(nums) {
    let set = new Set();
    let maxCons = 1;
    for (let i = 0; i < nums.length; i++) {
        set.add(nums[i])
    }
    for (let i of set) {
        if (!set.has(i - 1)) {
            let count = 1;
            let x = i;

            while (set.has(x + 1)) {
                count++;
                x++;
            }
            maxCons = Math.max(maxCons, count)
        }
    }
    return maxCons
}
// console.log(LongestConsecutive([1,1, 2,0,4, 5,6,7,3]))
function SetMatrixZeroes(matrix) {
    let m = matrix.length; // number of rows
    let n = matrix[0].length; // number of columns
    let zeroRows = new Set();
    let zeroCols = new Set();

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] == 0) {
                zeroRows.add(i);
                zeroCols.add(j);
            }
        }
    }
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (zeroRows.has(i) || zeroCols.has(j)) {
                matrix[i][j] = 0;
            }
        }
    }
    return matrix;

}
// console.log(SetMatrixZeroes([[0,1,2,0], [3,4,5,2], [1,3,1,5]]))
function SetMatrixZeroesOptimal(matrix) {
    let m = matrix.length; // number of rows
    let n = matrix[0].length; // number of columns

    let firstRowHasZero = false;
    let firstColHasZero = false;

    for (let i = 0; i < m; i++) {
        if (matrix[i][0] == 0) {
            firstColHasZero = true;
            break;
        }
    }
    for (let j = 0; j < n; j++) {
        if (matrix[0][j] == 0) {
            firstRowHasZero = true;
            break;
        }
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0
            }
        }
    }
    if (firstRowHasZero) {
        for (let j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    if (firstColHasZero) {
        for (let i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
    return matrix;
}
// console.log(SetMatrixZeroesOptimal([[0,1,2,0], [3,4,5,2], [1,3,1,5]]))

function RotateMatrixBy90Degrees(matrix) {
    let m = matrix.length;

    for (let i = 0; i < m - 1; i++) {
        for (let j = i + 1; j < m; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]
        }
    }
    return matrix.map(row => row.reverse());
}
// console.log(RotateMatrixBy90Degrees([[1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,16]]))

function SpiralTraversalOfMatrix(matrix) {
    let m = matrix.length;
    let n = matrix[0].length;
    let ans = [];
    let top = 0, bottom = m - 1;
    let left = 0; right = n - 1;

    while (top <= bottom && left <= right) {

        for (let i = left; i <= right; i++) {
            ans.push(matrix[top][i])
        };
        top++;
        for (let i = top; i <= bottom; i++) {
            ans.push(matrix[i][right])
        };
        right--;
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                ans.push(matrix[bottom][i])
            }
            bottom--;
        }
        if (left <= right) {
            for (i = bottom; i >= top; i--) {
                ans.push(matrix[i][left])
            }
            left++;
        }
    }
    return ans
}
// console.log(SpiralTraversalOfMatrix([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]))

function CountSubArraysWithGivenSum(nums, k) {
    let map = new Map();
    let count = 0, prefixSum = 0;
    map.set(0, 1)
    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];

        let remove = prefixSum - k;
        count += map.get(remove) || 0;
        map.set(prefixSum, map.get(prefixSum) + 1 || 1)
    }
    return count
}
// console.log(CountSubArraysWithGivenSum([3, 1, 2, 4, 6], 6))

function MajorityElement(nums) {
    let n = nums.length;
    let ans = [];
    let map = new Map();
    for (let i = 0; i < n; i++) {
        map.set(nums[i], (map.get(nums[i]) || 0) + 1)
    };

    for (let [key, value] of map) {
        if (value > Math.floor(n / 3)) {
            ans.push(key)
        }
    }
    return ans;
}
// console.log(MajorityElement([3, 2, 3, 1, 2, 3, 3, 2]))

function MajorityElementMoore(nums) {
    // in an array of size n, there can be atmost 2 elements with freq > n/3
    let el1 = -Infinity, el2 = -Infinity;
    let count1 = 0, count2 = 0;
    let n = nums.length;
    let ans = [];
    for (let i = 0; i < n; i++) {
        if (count1 == 0 && nums[i] != el2) {
            el1 = nums[i]
            count1 = 1;
        } else if (count2 == 0 && nums[i] != el1) {
            count2 = 1;
            el2 = nums[i]
        } else if (nums[i] == el1) {
            count1++;
        } else if (nums[i] == el2) {
            count2++
        } else {
            count1--;
            count2--;
        }

    }

    let cnt1 = 0; let cnt2 = 0;
    for (let i = 0; i < n; i++) {
        if (nums[i] == el1) cnt1++;
        if (nums[i] == el2) cnt2++;
    }
    if (cnt1 >= Math.floor((n / 3) + 1)) {
        ans.push(el1)
    }
    if (cnt2 >= Math.floor((n / 3) + 1)) {
        ans.push(el2)
    }
    return ans;
}
// console.log(MajorityElementMoore([3, 2, 3, 1, 2, 3, 3, 2]))

function ThreeSum(nums) {
    let n = nums.length;
    let set = new Set();
    let ans = [];

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            for (let k = j + 1; k < n; k++) {
                if (nums[i] + nums[k] + nums[j] == 0) {
                    let triplet = [nums[i], nums[j], nums[k]];
                    set.add(triplet.sort())
                }
            }
        }
    }
    for (let st of set) {
        ans.push(st)
    }
    return ans
}
// console.log(ThreeSum([-1, 0, 1, 2, -1, -4]))


function ThreeSumBetter(nums) {
    let n = nums.length;
    let set = new Set();
    let ans = [];

    for (let i = 0; i < n; i++) {
        let map = new Map();
        for (let j = i + 1; j < n; j++) {
            let third = -(nums[i] + nums[j]);
            if (map.has(third)) {
                if (nums[i] + nums[j] + third == 0) {
                    let triplet = [nums[i], nums[j], third];
                    set.add(triplet.sort())
                }
            }
            map.set(nums[j], j)

        }
    }
    for (let st of set) {
        ans.push(st)
    }
    return ans
}
// console.log(ThreeSumBetter([-1, 0, 1, 2, -1, -4]))

function ThreeSumOptimal(nums) {
    let n = nums.length;
    let ans = [];
    //using two pinter approach, sort the array first then fix one element and use two pointer for other two elements for example if we fix i, then left = i+1 and right = n-1 and move accordingly
    nums.sort((a, b) => a - b) //T>c - o(nlogn)
    //Also if nums[i] == nums[i-1] continue to avoid duplicates similarly for left and right pointers
    for (let i = 0; i < n; i++) {
        let j = i + 1; let k = n - 1;
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        while (j < k) {
            let sum = nums[i] + nums[j] + nums[k];
            if (sum < 0) {
                j++;
            } else if (sum > 0) {
                k--;
            } else {
                ans.push([nums[i], nums[j], nums[k]]);
                j++;
                k--;
                while (j < k && nums[j] == nums[j - 1]) j++;
                while (j < k && nums[k] == nums[k + 1]) k--;
            }
        }
    }

    return ans
}
// console.log(ThreeSumBetter([-1, 0, 1, 2, -1, -4]))

function FourSum(nums, target) {
    let n = nums.length;
    let ans = [];
    nums.sort((a, b) => a - b)

    for (let i = 0; i < n; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        for (let j = i + 1; j < n; j++) {
            let k = j + 1;
            let l = n - 1;
            if (j > i + 1 && nums[j] == nums[j - 1]) continue
            while (k < l) {
                let sum = nums[i] + nums[j] + nums[k] + nums[l];
                if (sum < target) {
                    k++
                } else if (sum > target) {
                    l--;
                } else {
                    ans.push([nums[i], nums[j], nums[k], nums[l]]);
                    k++
                    l--;
                    while (k < l && nums[k] == nums[k - 1]) k++;
                    while (k < l && nums[l] == nums[l + 1]) l--;
                }
            }
        }
    }
    return ans
}
// console.log(FourSum([1, -2, 3, 5, 7, 9], 7))

function LargestSubArrayWith0Sum(nums) {
    let n = nums.length;
    let map = new Map();
    let max = -Infinity;;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += nums[i]
        if (map.get(sum) != undefined) {
            max = Math.max(max, i - (map.get(sum)))
            // Here i - map.get(sum) gives length of subarray with 0 sum, for ex - if sum repeats at index 2 and 5, then subarray from 3 to 5 has 0 sum, length = 5-2 =3
        } else {
            map.set(sum, i)
        }
    }
    return max;
}
// console.log(LargestSubArrayWith0Sum([15, -2, 2, -8, 1, 7, 10, 23]))

function CountSubArraysWithGivenSum(nums, k) {
    let n = nums.length;
    let map = new Map();
    let xor = 0;

    let count = 0;
    map.set(0, 1)
    for (let i = 0; i < n; i++) {
        xor = xor ^ nums[i];

        let remove = xor ^ k;
        if (map.get(remove)) {
            count += map.get(remove)
        }
        map.set(xor, (map.get(xor) || 0) + 1)
    }
    return count;
}

// console.log(CountSubArraysWithGivenSum([4,2,2,6,4], 6))

function MergeOverlappingIntervals(intervals) {
    let n = intervals.length
    intervals.sort((a, b) => a[0] - b[0]);
    let ans = [];

    for (let i = 0; i < n; i++) {
        let start = intervals[i][0];
        let end = intervals[i][1];
        if (ans.length == 0 || ans[ans.length - 1][1] < start) {
            ans.push(start, end)
        } else {
            ans[ans.length - 1][1] = Math.max(ans[ans.length - 1][1], end)
        }
    }
    return ans;
}
// console.log(MergeOverlappingIntervals([[1, 3], [2, 4], [5, 7], [6, 8]]))

function MergeSortedArray(nums1, m, nums2, n) {
    let ans = [];
    let left = 0; let right = 0;

    while (left < m && right < n) {
        if (nums1[left] <= nums2[right]) {
            ans.push(nums1[left])
            left++;
        } else {
            ans.push(nums2[right])
            right++;
        }
    }
    while (left < m) {
        ans.push(nums1[left])
        left++;
    }
    while (right < n) {
        ans.push(nums2[right])
        right++;
    }
    return ans

}

// console.log(MergeSortedArray([5, -2, 4, 5], 4, [-3, 1, 8], 3))

function MergeSortedArrayInPlace(nums1, m, nums2, n) {
    let left = m - 1;  // Start at last element of nums1
    let right = 0;

    // Swap elements to get smaller ones in nums1
    while (left >= 0 && right < n) {
        if (nums1[left] > nums2[right]) {
            [nums1[left], nums2[right]] = [nums2[right], nums1[left]];
            left--;
            right++;
        } else {
            break;
        }
    }
    
    // Sort both arrays
    nums1.sort((a, b) => a - b);
    nums2.sort((a, b) => a - b);
    
    return {nums1, nums2};
}

// console.log(MergeSortedArrayInPlace([5, -2, 4, 5], 4, [-3, 1, 8], 3));
function merge(left, right){
    let result = [];
    let i = 0;
    let j = 0;
    let inversions = 0;
    
    while(i < left.length && j < right.length){
        if(left[i] <= right[j]){
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
            // When we pick from right array, all remaining elements in left are inversions
            inversions += (left.length - i);
        }
    }
    
    const merged = result.concat(left.slice(i)).concat(right.slice(j));
    return { merged, inversions };
}

function MergeSort(arr){
    if(arr.length <= 1) return { sorted: arr, inversions: 0 };
    
    let mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    const leftResult = MergeSort(left);
    const rightResult = MergeSort(right);
    const mergeResult = merge(leftResult.sorted, rightResult.sorted);
    
    return {
        sorted: mergeResult.merged,
        inversions: leftResult.inversions + rightResult.inversions + mergeResult.inversions
    };
}

function countInversions(nums) {
    return MergeSort(nums).inversions;
}

// Test cases
console.log(countInversions([2, 3, 7, 1, 3, 5])); // Output: 5