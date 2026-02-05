function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;

    while(i<left.length && j<right.length){
        if(left[i] < right[j]){
            result.push(left[i]);
            i++
        }else{
            result.push(right[j]);
            j++
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}
function SOrt(arr) {
    if(arr.length <=1) return arr
   let mid = Math.floor(arr.length/2);
   let left = arr.slice(0, mid);
   let right = arr.slice(mid)
   return merge(SOrt(left), SOrt(right))
}
console.log(SOrt([5, 4, 3, 2, 1]))

function InsertionSort(arr){
    for(let i=0; i<=arr.length; i++){
        let j=i;
        while(j>0 && arr[j-1] > arr[j]){
            [arr[j-1], arr[j]] = [arr[j], arr[j-1]];
            j--;
            console.log(arr)
        }
    }
    return arr
}
console.log(InsertionSort([5, 4, 3, 2, 1]))