function missing(nums, k){
    let low = 0;
    let high = nums.length -1

    while(low<=high){
        let mid = Math.floor((low+high)/2);
        let missing = nums[mid] - (mid+1)
        if(missing<k){
            low =mid+1
        }else{
            high = mid-1
        }
    }
    return low+k
}
console.log(missing([4,7,9,10], 4))