function SelectionSOrt(nums){
    let n = nums.length
    for(let i=0; i<n; i++){
        let min = i;
        for(let j=i+1; j<n; j++){
            if(nums[j] < nums[min]){
                min = j
            }
            [nums[i], nums[min]] = [nums[min], nums[i]]
        }
    }
    return nums;
}
console.log(SelectionSOrt([13, 46, 24, 20, 9]))

function RecursiveBubbleSort(nums, i){
    let n = nums.length
    let min = i
    if(i> n-1) return nums
    for(let j = i+1; j<n; j++){
        if(nums[j] < nums[min]){
            min=j
        }
    }
 [nums[i], nums[min]] = [nums[min], nums[i]]
 return RecursiveBubbleSort(nums, i+1)
}
console.log(RecursiveBubbleSort([13, 46, 24, 20, 9], 0))

function BubbleSort(nums){
     let n = nums.length
     for(let i=0; i<n-1; i++){

        for(let j=0; j<n-1; j++){
            if(nums[j] > nums[j+1]){
                [nums[j], nums[j+1]] = [nums[j+1], nums[j]]
            }
        }
     }
     return nums
}
console.log(BubbleSort([7, 46, 24, 20, 9]))