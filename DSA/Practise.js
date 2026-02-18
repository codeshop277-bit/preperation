function MaxiMumElement(nums){
    let max = -Infinity
    for(let i=0; i<nums.length; i++){
        if(nums[i] > max){
            max = nums[i]
        }
    }
    return max
}
function HourlyTime(nums, mid){
    let avg = 0;
    for(let i=0; i<nums.length; i++){
        avg += Math.ceil(nums[i] / mid)
    }
    return avg
}
function Koko(nums, k){
    let low = 0;
    let high = MaxiMumElement(nums)

    while(low <= high){
        let mid = Math.floor((low+high)/2);
        let totalTime = HourlyTime(nums, mid);
        if(totalTime == k) return mid
        if(totalTime > k){
            low = mid +1
        }else{
            high = mid -1
        }
    }
    return -1
}

console.log(Koko([25, 12, 8, 14, 19], 5))