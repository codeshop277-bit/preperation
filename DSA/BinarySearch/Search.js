function BinarySearch(nums, target) {
    let n = nums.length

    let low = 0;
    let high = n - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2)

        if (nums[mid] === target) return mid;
        else if (nums[mid] > target) high = mid - 1;
        else low = mid + 1;
    }

    return -1;
}
// console.log(BinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 7));

function RecursiveBinarySearch(nums, target, low, high) {
    //T.c log base 2 n
    if (low > high) return -1;
    let mid = Math.floor((low + high) / 2)
    if (nums[mid] === target) return mid;
    else if (nums[mid] > target) return RecursiveBinarySearch(nums, target, low, mid - 1)
    else return RecursiveBinarySearch(nums, target, mid + 1, high);
}

// console.log(RecursiveBinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 7, 0, 8));

function LowerBoundBinarySearch(nums, target) {
    // Bound arr[i] >=target lower implies first occurence of target
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let result = n;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] >= target) {
            result = mid
            high = mid - 1
        } else low = mid + 1
    }
    return result;
}
// console.log(LowerBoundBinarySearch([1, 2, 2, 2, 3, 4, 5], 2));


function UpperBound(nums, target) {
    //Upper bound arr[i] > target upper implies last occurence of target
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let reuslt = n;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] < target) {
            ans = mid
            low = mid + 1
        } else high = mid - 1
    }
    return reuslt;
}
// console.log(UpperBound([1, 2, 2, 2, 3, 4, 5], 2));

function Floor(nums, target) {
    //Floor is the greatest element less than or equal to target
    //Ceil is the smallest element greater than or equal to target - lower bound
    let floor = -1;
    let n = nums.length;
    let low = 0;
    let high = n - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] <= target) {
            floor = nums[mid];
            low = mid + 1;
        } else high = mid - 1;
    }
    return floor
}

// console.log(Floor([1, 2, 4, 6, 8, 10], 5));//{4,6}


function Ceil(nums, target) {
    // Ceil is the smallest element greater than or equal to target
    let ceil = -1;
    let n = nums.length;
    let low = 0;
    let high = n - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] >= target) {
            ceil = nums[mid];
            high = mid - 1;  // Look for a smaller ceil in left half
        } else {
            low = mid + 1;   // Look in right half
        }
    }
    return ceil;
}

function FloorAndCeil(nums, target) {
    return {
        floor: Floor(nums, target),
        ceil: Ceil(nums, target)
    };
}

// Test cases
// console.log(FloorAndCeil([1, 2, 4, 6, 8, 10], 5));  // {floor: 4, ceil: 6}

function firstOcccurance(nums, target) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let first = -1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] == target) {
            first = mid;
            high = mid - 1;
        } else if (nums[mid] > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return first
};
// console.log(firstOcccurance([1,2,2,2,3,4,5], 15));

function LastOcccurance(nums, target) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let last = -1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] === target) {
            last = mid;
            low = mid + 1
        } else if (nums[mid] > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return last
}

// console.log(LastOcccurance([1,2,2,2,3,4,5], 15));

function firstAndLastOcccurance(nums, target) {
    return [firstOcccurance(nums, target), LastOcccurance(nums, target)]
}
// console.log(firstAndLastOcccurance([1,2,2,2,3,4,5], 2));
function CountOcccurance(nums, target) {
    let first = firstOcccurance(nums, target);
    if (first === -1) return 0;
    let last = LastOcccurance(nums, target);

    return last - first + 1; //Since it is a sorted array, all occurances will be in between first and last index, so the last - first +1 will give the count of occurances
}
// console.log(CountOcccurance([1,2,2,2,3,4,5], 2));

function SearchInRotatedSortedArray(nums, target) {

    //Key is to indentify which part is sorted
    let n = nums.length;
    let low = 0;
    let high = n - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] == target) return mid;
        //If left part is sorted, then check if target lies in left part else search in right part and also target should be in between low and mid
        //In first  dry run, for the given input [4,5,6,7,0,1,2], mid = 3, nums[mid] = 7, nums[low] = 4 and target = 0, so left part is sorted but target is not in between low and mid
        //So we will search in right part by updating low = mid +1
        //In
        if (nums[low] <= nums[mid]) { //This ensures left part is sorted
            if (nums[low] <= target && target <= nums[mid]) {
                high = mid - 1; //Search in left part
            } else {
                low = mid + 1; //Search in right part
            }
        } else {
            if (nums[mid] <= target && target <= nums[high]) {
                low = mid + 1; //Search in right part
            } else {
                high = mid - 1; //Search in left part
            }
        }
    }
    return -1;
}
// console.log(SearchInRotatedSortedArray([4,5,6,7,0,1,2], 0));

function SearchInSortedArrayWIthDuplicates(nums, k) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] == k) return true;
        //If we have duplicates, we can not determine which part is sorted, so we will just move the low and high pointers
        if (nums[low] == nums[mid] && nums[mid] == nums[high]) {
            low = low + 1;
            high = high - 1;
            continue;
        }
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= k && k <= nums[mid]) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        } else {
            if (nums[mid] <= k && k <= nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

    }

    return false;
}
// console.log(SearchInSortedArrayWIthDuplicates([2,5,6,0,0,1,2], 0));

function MinimunInSortedRotatedArray(nums) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let min = Infinity;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[low] <= nums[high]) { //If the subarray is already sorted
            min = Math.min(min, nums[low]);
            break;
        }
        if (nums[low] <= nums[mid]) {//left part is sorted
            min = Math.min(min, nums[low]); //Update min with the first element of the sorted part, since it is the smallest in that part
            low = mid + 1
        } else {
            min = Math.min(min, nums[mid]); //upadate min with mid element since right part is unsorted and mid could be the smallest
            high = mid - 1
        }
    }
    return min;
}

// console.log(MinimunInSortedRotatedArray([3,4,5,0,1,2]));


function MinimunInSortedRotatedArrayDuplicates(nums) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let min = Infinity;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[low] == nums[mid] && nums[mid] == nums[high]) {
            min = Math.min(min, nums[low]);
            low = low + 1;
            high = high - 1;
            continue;
        }
        if (nums[low] <= nums[high]) { //If the subarray is already sorted
            min = Math.min(min, nums[low]);
            break;
        }
        if (nums[low] <= nums[mid]) {//left part is sorted
            min = Math.min(min, nums[low]); //Update min with the first element of the sorted part, since it is the smallest in that part
            low = mid + 1
        } else {
            min = Math.min(min, nums[mid]); //upadate min with mid element since right part is unsorted and mid could be the smallest
            high = mid - 1
        }
    }
    return min;
}

// console.log(MinimunInSortedRotatedArrayDuplocates([3,4,5,0, 0,1,2]));

function TimesArrayIsRotated(nums) {
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let min = Infinity;
    let index = -1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[low] <= nums[high]) { //If the subarray is already sorted
            if (nums[low] < min) {
                min = nums[low];
                index = low
            }
            break;
        }
        if (nums[low] <= nums[mid]) {//left part is sorted
            if (nums[low] < min) {
                min = nums[low];
                index = low;
            }
            //Update min with the first element of the sorted part, since it is the smallest in that part
            low = mid + 1
        } else {
            if (nums[mid] < min) {
                min = nums[mid];
                index = mid;
            }
            //upadate min with mid element since right part is unsorted and mid could be the smallest
            high = mid - 1
        }
    }
    return index;
}
// console.log(TimesArrayIsRotated([3,4,5,1,2]));

function SingleElementInSortedArray(nums) {
    let n = nums.length;
    if (nums[0] != nums[1]) return nums[0];
    if (nums[n - 1] != nums[n - 2]) return nums[n - 1];

    let low = 1;
    let high = n - 2;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] != nums[mid - 1] && nums[mid] != nums[mid + 1]) {
            return nums[mid];
        };
        if ((mid % 2 == 1 && nums[mid] == nums[mid - 1]) || (mid % 2 == 0 && nums[mid] == nums[mid + 1])) {//We are on the left part of array
            low = mid + 1;
        } else {
            high = mid - 1
        }
    }
    return -1
}
// console.log(SingleElementInSortedArray([1,1,2,2,3,3,4,5,5]));

function PeakElement(nums) {
    let n = nums.length;
    if (nums[0] > nums[1]) return nums[0];
    if (nums[n - 1] > nums[n - 2]) return nums[n - 2];

    let low = 1;
    let high = n - 2;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] > nums[mid - 1] && nums[mid] > nums[mid + 1]) {
            return nums[mid]
        };
        if (nums[mid] > nums[mid - 1]) {
            low = mid + 1;
        } else {
            high = mid - 1
        }
    }
    return -1;
}

// console.log(PeakElement([1,10,13,7,6,5,4,3,2,1,0]))

function FindSquareRoot(n) {
    let low = 0;
    let high = n;
    let ans = 0;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (mid * mid <= n) {
            ans = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return ans;
}
// console.log(FindSquareRoot(82))

function FindNthRootOfM(n, m) {
    let low = 0;
    let high = m;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let value = Math.pow(mid, n)
        if ((m / value) == 1) {
            return mid;
        }
        if (value < m) {
            low = mid + 1
        } else {
            high = mid - 1;
        }
    }
    return -1
}
// console.log(FindNthRootOfM(3, 28))

function MaxiMumElement(nums) {
    let max = -Infinity
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i]
        }
    }
    return max;
}
function MiniMumELement(nums) {
    let max = Infinity
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] < max) {
            max = nums[i]
        }
    }
    return max;
}
function HourleyRate(nums, time) {
    let avgTime = 0;
    for (let i = 0; i < nums.length; i++) {
        avgTime += Math.ceil(nums[i] / time)
    }
    console.log('avgTime', avgTime)
    return avgTime;
}
function KokoEatingBananas(nums, h) {
    let low = 0;
    let high = MaxiMumElement(nums);
    let ans = 0;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let rate = HourleyRate(nums, mid);
        if (rate <= h) {
            ans = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return ans;
}
// console.log(KokoEatingBananas([25, 12, 8, 14, 19], 5))

function MinAndMax(nums) {
    let max = -Infinity;
    let min = Infinity;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > max) {
            max = nums[i]
        }
        if (nums[i] < min) {
            min = nums[i]
        }
    }
    return { max, min };
}
function CheckIfPossible(nums, k, days) {
    let count = 0;
    let noOfBouq = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] <= days) {
            count++;
        } else {
            noOfBouq += Math.floor((count / k));
            count = 0
        }
    }
    noOfBouq += Math.floor((count / k));
    return noOfBouq
}
function FindMinNoDaysToMakeBouquets(n, nums, k, m) {
    //n arr length;
    //k adjacent flowers
    //m no of bouqets
    const range = MinAndMax(nums);
    let low = range.min;
    let high = range.max;
    let ans = -1;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const noOfBouq = CheckIfPossible(nums, k, mid);
        if (noOfBouq == m) {
            ans = mid;
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return ans;
}
// console.log(FindMinNoDaysToMakeBouquets(8, [7, 7, 7, 7, 13, 11, 12, 7], 2, 3))

function FindSum(nums, divisor) {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += Math.ceil(nums[i] / divisor)
    }
    return sum;
}
function SmallestDivisorForTThreshold(nums, limit) {
    let low = 1;
    let high = MaxiMumElement(nums);
    let ans = -1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const sum = FindSum(nums, mid);
        if (sum <= limit) {
            ans = mid;
            high = mid - 1
        } else {
            low = mid + 1
        }
    }
    return ans;
}
// console.log(SmallestDivisorForTThreshold([8,4,2,3], 10))

function findSum(nums) {
    let sum = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i]
    }
    return sum;
};

function CheckIfCapIsPossible(weights, maxDays, cap) {
    let days = 1;
    let sumOfWeightsPerDay = 0;
    for (let i = 0; i < weights.length; i++) {
        if ((sumOfWeightsPerDay + weights[i]) > cap) {
            sumOfWeightsPerDay = weights[i];
            days = days + 1;
        } else {
            sumOfWeightsPerDay += weights[i]
        }
    }
    if (days <= maxDays) {
        return true
    }

    return false;
}
function LeastCapacityToShipPackagesWithinDdays(weights, days) {
    let low = MaxiMumElement(weights);
    let high = findSum(weights);
    let ans = 0;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const isPossible = CheckIfCapIsPossible(weights, days, mid)
        if (isPossible) {
            high = mid - 1;
            ans = mid;
        } else {
            low = mid + 1
        }
    }
    return low;
}

// console.log(LeastCapacityToShipPackagesWithinDdays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5))

function FindMissingKthNumber(arr, k) {

    //Bruet
    // for(let i=0; i<arr.length; i++){
    //     if(arr[i] < k){
    //         k++
    //     }
    // }
    // return k
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        let missing = arr[mid] - (mid + 1);
        if (missing < k) {
            low = mid + 1
        } else {
            high = mid - 1
        }
    }
    return low + k
}
// console.log(FindMissingKthNumber([3, 5, 7, 10], 6))

function CanWePlaceCows(nums, noOfCows, distance) {
    let cowsPlaced = 1;
    let lastPlacedIndex = nums[0];
    for (let i = 0; i < nums.length; i++) {
        if ((nums[i] - lastPlacedIndex) >= distance) {
            cowsPlaced += 1;
            lastPlacedIndex = nums[i]
        }
    }
    if (cowsPlaced >= noOfCows) {
        return true;
    }
    return false;
}
function AggressiveCows(nums, k) {
    let sorted = nums.sort((a, b) => a - b)
    let low = 0;
    let high = sorted[sorted.length - 1] - sorted[0];
    let ans = 0;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const checkPossible = CanWePlaceCows(sorted, k, mid);
        if (checkPossible) {
            low = mid + 1
            ans = mid
        } else {
            high = mid - 1
        }
    }
    return ans
}
// console.log(AggressiveCows([0, 3, 7, 10, 9], 4))

function findAllocationPossible(nums, minCapacity) {
    let countOfStu = 1;
    let totalPages = 0

    for (let i = 0; i < nums.length; i++) {
        if ((totalPages + nums[i]) <= minCapacity) {
            totalPages += nums[i]
        } else {
            countOfStu++;
            totalPages = nums[i]
        }
    }
    return countOfStu
}
function BookAllocation(nums, m) {
    let low = MaxiMumElement(nums);
    let high = findSum(nums);
    let ans = 0;

    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        const count = findAllocationPossible(nums, mid, m);
        if (count > m) {
            low = mid + 1
        } else {
            ans = mid
            high = mid - 1
        }
    }
    return { ans, low, high }
}
// console.log(BookAllocation([25, 46, 28, 49, 24],4))

function MedianOfTwoSortedArrays(arr1, arr2) {
    let n1 = arr1.length;
    let n2 = arr2.length;
    let i = 0;
    let j = 0;
    let el1 = -1;
    let el2 = -1;
    let index2 = Math.floor((n1 + n2) / 2);
    let index1 = index2 - 1;
    let count = 0;

    while (i < n1 && j < n2) {
        if (arr1[i] < arr2[j]) {
            if (count == index1) el1 = arr1[i];
            if (count == index2) el2 = arr1[i]
            count++;
            i++;
        } else {
            if (count == index1) el1 = arr2[j];
            if (count == index2) el2 = arr2[j]
            count++;
            j++;
        }
    }
    while (i < n1) {
        if (count == index1) el1 = arr1[i];
        if (count == index2) el2 = arr1[i]
        count++;
        i++;
    }
    while (j < n2) {
        if (count == index1) el1 = arr2[j];
        if (count == index2) el2 = arr2[j]
        count++;
        j++;
    }
    if ((n1 + n2) % 2 == 0) {
        return (el1 + el2) / 2
    } else {
        return el2;
    }
}
// console.log(MedianOfTwoSortedArrays([2,4,6], [1,3]))

function KthElement(a, b, k) {
    let n1 = a.length;
    let n2 = b.length;
    let i = 0;
    let j = 0;
    let el1 = -1;
    let count = 1;

    while (i < n1 && j < n2) {
        if (a[i] < b[j]) {
            if (count == k) el1 = a[i];
            count++;
            i++;
        } else {
            if (count == k) el1 = b[j];
            count++;
            j++;
        }
    }
    while (i < n1) {
        if (count == k) el1 = a[i];
        count++;
        i++;
    }
    while (j < n2) {
        if (count == k) el1 = b[j];
        count++;
        j++;
    }
    return el1
}
// console.log(KthElement([100, 112, 256, 349, 770], [72, 86, 113, 119, 265, 445, 892], 7))
function UpperBound(nums, target) {
    // Find first position where element > target
    let n = nums.length;
    let low = 0;
    let high = n - 1;
    let result = 0; // Changed to 0
    
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] > target) {
            result = mid;
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return result;
}

function rowsWithMax1(mat){
    let row = mat.length;
    let col = mat[0].length;
    let maxCount = 0;
    let index = -1;

    for(let i = 0; i < row; i++){
        // For rows like [1,1,0], UpperBound(1) gives index where values > 1
        // So count of 1s = UpperBound position
        let count = UpperBound(mat[i], 1);
        if(count > maxCount){
            maxCount = count;
            index = i;
        }
    }
    return index;
}
console.log(rowsWithMax1([[1, 1, 0], [0, 0, 1], [0, 0, 0], [1, 1, 1]]));
// Output: 3 ✓

function searchMatrix(mat, target) {
    let row = mat.length
    let col = mat[0].length
    let total = row * col;

    let low = 0;
    let high = total -1;
    while(low<=high){
        let mid = Math.floor((low + high)/2)
        let rowIndex = Math.floor(mid/col);
        let colIndex = mid%col;
        if(mat[rowIndex][colIndex] ==target){
            return true
        }else if(mat[rowIndex][colIndex] < target){
            low = mid+1
        }else{
            high = mid-1
        }
    }
return false
}
// console.log(searchMatrix([ [1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12] ], 18))

function Search2DMatrix(matrix, target){
    let row = 0;
    let col = matrix[0].length -1;

    while(row < matrix.length && col >=0){
        if(matrix[row][col] == target){
            return true
        }else if(matrix[row][col] <target){
            row++;
        }else{
            col--;
        }
    }
    return false
}
// console.log(Search2DMatrix( [ [1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30] ], 5))

function findPeakRow(mat, rows, currentCol){
    let index = -1;
    let max = -1;
    for(let i=0; i<rows; i++){
        if(mat[i][currentCol] > max){
            max = mat[i][currentCol]
            index = i
        }
    }
    return index
}
function PeakELementIn2D(mat){
    let rows = mat.length;
    let col = mat[0].length;

    let low = 0;
    let high = col-1;

    while(low<=high){
        let mid = Math.floor((low+high)/2);

        let peakRow = findPeakRow(mat, rows, mid);
        let left = mid -1 >= 0 ? mat[peakRow][mid-1]: -1;
        let right = mid + 1< col ?  mat[peakRow][mid+1] : -1
        if((mat[peakRow][mid] >  left)&& (mat[peakRow][mid] > right)) {
            return [peakRow, mid]
        } 
        else if(mat[peakRow][mid] < left){
            high = mid-1
        }else{
            low = mid+1
        }
    }
    return [-1]
}
// console.log(PeakELementIn2D([[10, 20, 15], [21, 30, 14], [7, 16, 32]]))

function findNoSmallerThanMedian(mat, row, target){
    let count = 0;
    for(let i=0; i<row; i++){
        count+=UpperBound(mat[i], target)
    }
    return count
}
function MedianInSortedMatrix(matrix){
    let row = matrix.length
    let col = matrix[0].length
    let low = matrix[0][0]
    let high = matrix[0][col-1]
    let median = Math.floor((row*col)/2)
    for(i=0; i< row; i++){
        low = Math.min(low, matrix[i][0])
        high = Math.max(high, matrix[i][col-1])
    }

    while(low<=high){
        let mid = Math.floor((low+high)/2);
        let smallestEqual = findNoSmallerThanMedian(matrix, row, mid)
        if(smallestEqual<= median){
            low = mid+1
        }else{
            high = mid-1
        }
    }
    return low;
}
console.log(MedianInSortedMatrix([ [1, 4, 9], [2, 5, 6], [3, 7, 8] ] ))