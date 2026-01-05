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
    let reuslt = n;
    while (low <= high) {
        let mid = Math.floor((low + high) / 2);
        if (nums[mid] >= target) {
            ans = mid
            high = mid - 1
        } else low = mid + 1
    }
    return reuslt;
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

function FindNthRootOfM(n,m){
    let low = 0;
    let high = m;

    while(low<=high){
       let mid = Math.floor((low + high) / 2);
       let value = Math.pow(mid, n)
       if((m/value) == 1){
        return mid;
       }
       if(value < m){
        low = mid+1
       }else{
        high = mid -1;
       }
    }
    return -1
}
// console.log(FindNthRootOfM(3, 28))

function MaxiMumElement(nums){
    let max = -Infinity
    for(let i =0; i<nums.length; i++){
        if(nums[i] > max){
            max = nums[i]
        }
    }
    console.log('max', max)
    return max;
}
function HourleyRate(nums, time){
    let avgTime = 0;
    for(let i=0; i<nums.length; i++){
        avgTime += Math.ceil(nums[i]/time)
    }
    console.log('avgTime', avgTime)
    return avgTime;
}
function KokoEatingBananas(nums, h){
    let low = 0; 
    let high = MaxiMumElement(nums);
    let ans = 0;

    while(low<=high){
        let mid = Math.floor((low + high) / 2);
        let rate = HourleyRate(nums, mid);
        if(rate <=h){
            ans = mid;
            high = mid -1;
        }else{
            low = mid +1;
        }
    }
    return ans;
}
// console.log(KokoEatingBananas([25, 12, 8, 14, 19], 5))