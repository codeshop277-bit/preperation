function Search(nums, k){
    let low = 0;
    let high = nums.length-1;
    while(low<=high){
        let mid = Math.floor((low+high)/2);
        if(nums[mid] == k) return mid
        if(nums[low] <= nums[mid] ){
            if(nums[low]<=k && k<= nums[high]){
                high = mid-1;
            }else{
                low = mid+1
            }
        }else{
            if(nums[mid] <=k && k<=nums[high]){
                low = mid+1
            }else{
                high = mid -1
            }
        }
    }
    return false
}
console.log(Search([2,5,6,0,0,1,2], 0))

function Min(nums){
    let low = 0;
    let high = nums.length-1;
    let min = Infinity
    let index = -1;
    while(low<=high){
        let mid = Math.floor((low+high)/2)
        if(nums[low] <= nums[mid]){
            if(nums[low] < min){
                min = nums[low];
                index = low;
            }

                low = mid+1
        }else{
            if(nums[mid]< min){
                min = nums[mid]
                index = mid
            }
            high  = mid -1
        }
    }
    return {index, min}
}
console.log(Min([4,5,6,7,0,1,2,3]))