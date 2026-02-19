function MinAndMax(nums){
    let min = Infinity;
    let max = -Infinity
    for(let i=0; i<nums.length; i++){
        if(nums[i] > max){
            max = nums[i]
        }
        if(nums[i]<min){
            min = nums[i]
        }
    }
    return {max, min}
}

function checkPossible(nums, k, days){
    let count = 0;
    let noOfBouq = 0;

    for(let i=0; i< nums.length; i++){
        if(nums[i] <= days){
            count++
        }else{
            noOfBouq += Math.floor(count/k)
            count = 0;
        }
    }
    noOfBouq += Math.floor(count/k)
    return noOfBouq
}
function Bloom(nums, k, m){
    const minAndMax = MinAndMax(nums);

    let low = minAndMax.min
    let high = minAndMax.max
    let ans = -1

    while(low <=high){
        let mid = Math.floor((low+high)/2);
        let noOfBouq = checkPossible(nums, k, mid)
        if(noOfBouq == m){
            ans = mid
            high = mid -1
        }else{
            low = mid+1
        }
    }
    return ans
}
console.log(Bloom([7, 7, 7, 7, 13, 11, 12, 7], 3, 2))