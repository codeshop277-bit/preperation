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
    if (low>high) return -1;
    let mid = Math.floor((low + high) / 2)
    if(nums[mid] === target) return mid;
    else if(nums[mid] > target) return RecursiveBinarySearch(nums, target, low, mid-1)
    else return RecursiveBinarySearch(nums, target, mid+1, high);
}

// console.log(RecursiveBinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 7, 0, 8));

function LowerBoundBinarySearch(nums, target) {
    // Bound arr[i] >=target lower implies first occurence of target
    let n = nums.length;
    let low =0; 
    let high = n-1;
    let reuslt = n;
    while(low<=high){
        let mid = Math.floor((low+high)/2);
        if(nums[mid] >= target){
            ans = mid
            high = mid -1
        }else low = mid +1
    }
    return reuslt;
}
// console.log(LowerBoundBinarySearch([1, 2, 2, 2, 3, 4, 5], 2));


function UpperBound(nums, target) {
    //Upper bound arr[i] > target upper implies last occurence of target
    let n = nums.length;
    let low =0; 
    let high = n-1;
    let reuslt = n;
    while(low<=high){
        let mid = Math.floor((low+high)/2);
        if(nums[mid] < target){
            ans = mid
            low = mid +1
        }else  high = mid -1
    }
    return reuslt;
}
// console.log(UpperBound([1, 2, 2, 2, 3, 4, 5], 2));

function Floor(nums, target){
    //Floor is the greatest element less than or equal to target
    //Ceil is the smallest element greater than or equal to target - lower bound
    let floor = -1;
    let n= nums.length;
    let low =0;
    let high = n-1;

    while(low<=high){
        let mid = Math.floor((low+high)/2);
       if(nums[mid] <= target){
        floor = nums[mid];
        low = mid +1;
       }else high = mid -1;
    }
    return floor
}

// console.log(Floor([1, 2, 4, 6, 8, 10], 5));//{4,6}


function Ceil(nums, target){
    // Ceil is the smallest element greater than or equal to target
    let ceil = -1;
    let n = nums.length;
    let low = 0;
    let high = n - 1;

    while(low <= high){
        let mid = Math.floor((low + high) / 2);
        if(nums[mid] >= target){
            ceil = nums[mid];
            high = mid - 1;  // Look for a smaller ceil in left half
        } else {
            low = mid + 1;   // Look in right half
        }
    }
    return ceil;
}

function FloorAndCeil(nums, target){
    return {
        floor: Floor(nums, target),
        ceil: Ceil(nums, target)
    };
}

// Test cases
// console.log(FloorAndCeil([1, 2, 4, 6, 8, 10], 5));  // {floor: 4, ceil: 6}

function firstOcccurance(nums, target){
    let n = nums.length;
    let low = 0;
    let high = n-1;
    let first = -1;

    while (low<=high){
        let mid = Math.floor((low+high)/2);
        if(nums[mid] == target){
            first = mid;
            high = mid-1;
        }else if (nums[mid] > target){
            high = mid -1;
        }else {
            low = mid + 1;
        }
    }
    return first
};
// console.log(firstOcccurance([1,2,2,2,3,4,5], 15));

function LastOcccurance(nums, target){
    let n = nums.length;
    let low = 0;
    let high = n-1;
    let last = -1;

    while(low<=high){
        let mid = Math.floor((low + high)/2);
        if(nums[mid] === target){
            last = mid;
            low = mid+1
        }else if(nums[mid] > target){
            high = mid-1;
        }else{
            low = mid + 1;
        }
    }
    return last
}

// console.log(LastOcccurance([1,2,2,2,3,4,5], 15));

function firstAndLastOcccurance(nums, target){
    return [firstOcccurance(nums, target), LastOcccurance(nums, target)]
}
// console.log(firstAndLastOcccurance([1,2,2,2,3,4,5], 2));
function CountOcccurance(nums, target){
    let first = firstOcccurance(nums, target);
    if(first === -1) return 0;
    let last = LastOcccurance(nums, target);

    return last-first +1; //Since it is a sorted array, all occurances will be in between first and last index, so the last - first +1 will give the count of occurances
}
// console.log(CountOcccurance([1,2,2,2,3,4,5], 2));