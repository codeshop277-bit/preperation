function LongestSubArray(nums,k){
    let n = nums.length;
    let sum = 0;
    let map = new Map();
    let maxLen = 0;
    let start = 0;
    let end = -1;
    map.set(0,-1)
    for(let i=0; i<n; i++){
        sum+=nums[i];
        if(sum == k){
            if(i+1 > maxLen){
                start = 0;
                end = i
                maxLen = i+1
            }
        }
        if(map.has(sum-k)){
            let prefix  = i-(map.get(sum-k))
            if(prefix > maxLen){
                maxLen = prefix 
                end = i
                start = map.get(sum-k) +1
            }
        }

        if(!map.has(sum)){
            map.set(sum, i)
        }
    }
    return nums.slice(start, end+1)
}
console.log(LongestSubArray([2,3,1,5,1,1,2,1], 5))

function Kadene(nums,k){
    let n = nums.length;
    let sum = 0;
    let max = 0;
    let start = 0;
    let end = -1;
    for(let i=0; i<n; i++){
        sum+=nums[i];
        if(sum >max){
            max = sum
            end = i
        }
        if(sum < 0){
            sum = 0;
            start = i+1
        }
    }
    return nums.slice(start, end+1)
}
console.log(Kadene([2,3,1,-5,1,1,2,1]))

function MajorityElement(nums){
    let n = nums.length;
    let el;
    let count =0;
    let map = new Map()


    for(let i=0; i<n; i++){
        map.set(nums[i], (map.get(nums[i]) || 0)+1)
        if(count ==0){
            el = nums[i]
            count = 1
        }else{
            count--
        }
    }
    return map.get(el) > n/2 ? el : -1;
}
console.log(MajorityElement([7, 0, 0, 1, 7, 7, 2, 7, 7]))