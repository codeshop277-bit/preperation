function Kadene(nums){
    let sum = 0;
    let max = -Infinity
    let start = 0;
    let end = 0;

    for(let i=0; i<nums.length; i++){
        sum+=nums[i]
        if(sum > max){
            max = sum
            end = i
        }else if(sum <=0){
            start = i
        }
    }
    return nums.slice(start, end+1);
}
console.log(Kadene([2, 3, 5, -2, 7, -4]))