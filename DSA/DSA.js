function Median(nums1, nums2, k){
    let m = nums1.length
    let n = nums2.length
    let sorted = [];
    let i=0;
    let j=0;

    while(i<m && j<n){
        if(nums1[i] < nums2[j]){
            sorted.push(nums1[i])
            i++
        }else{
            sorted.push(nums2[j])
            j++
        }
    }
    while(i<m){
         sorted.push(nums1[i])
            i++
    }
    while(j<n){
         sorted.push(nums2[j])
            j++
    }
    let low = 0;
    let high = sorted.length-1;
    let median = -1;
    let mid =Math.floor((low+high)/2)
    if(sorted.length % 2 == 0){
        median = (sorted[mid] + sorted[mid+1])/2
    }else{
        median = sorted[mid]
    }
    return sorted[k-1]
    //return median
}
console.log(Median( [100, 112, 256, 349, 770],  [72, 86, 113, 119, 265, 445, 892], 7 ))