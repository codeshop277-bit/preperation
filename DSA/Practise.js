function InsertionSOrt(nums){
    for(let i=0; i<nums.length; i++){
        let j= i;
        while(j>0 && nums[j-1] > nums[j]){
            [nums[j-1], nums[j]] = [nums[j], nums[j-1]];
            j--
        }
    }
    return nums
}
console.log(InsertionSOrt([9,14,15,12,8,13]))

function merge(left, right, nums){
    let i=0;
    let j=0;
    let ans = []

    while(i<left.length && j<right.length){
        if(left[i] < right[j]){
            ans.push(left[i])
            i++
        }else{
            ans.push(right[j])
            j++
        }
    }
    return ans.concat(left.slice(i)).concat(right.slice(j))
    
}
function MergeSOrt(nums){
    if(nums.length <=1) return nums;

    let mid = Math.floor(nums.length/2)
    let left = nums.slice(0, mid);
    let right = nums.slice(mid)
    return merge(MergeSOrt(left), MergeSOrt(right))
}

console.log(MergeSOrt([2,1,7,6,9,5,0]))