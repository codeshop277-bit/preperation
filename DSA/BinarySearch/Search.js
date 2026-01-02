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
console.log(BinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 7));

function RecursiveBinarySearch(nums, target, low, high) {
    if (low>high) return -1;
    let mid = Math.floor((low + high) / 2)
    if(nums[mid] === target) return mid;
    else if(nums[mid] > target) return RecursiveBinarySearch(nums, target, low, mid-1)
    else return RecursiveBinarySearch(nums, target, mid+1, high);
}

console.log(RecursiveBinarySearch([1, 2, 3, 4, 5, 6, 7, 8, 9], 7, 0, 8));