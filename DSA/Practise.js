function Pattern(nums) {
    const map = new Map();
    for(let i=0; i<nums.length; i++){
        map.set(nums[i], (map.get(nums[i]) ||0)+1);
    }
    let maxFreq = 0;
    let result = -Infinity
    for (const [key, value] of map){
        if((value > maxFreq) || (value == maxFreq && key < result)){
            maxFreq = value;
            result = key;
        }
    }
    return {maxFreq, result}
    
}

console.log(Pattern([1,1,2,3,4,5,2,3,23,2,2,3])); //3