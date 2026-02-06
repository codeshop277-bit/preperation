function BubbleSort(arr){
    for(let i= arr.length -1; i>=1; i--){
        for(let j=0; j<arr.length ; j++){
            if(arr[j] <arr[j-1]){
                [arr[j], arr[j-1]] = [arr[j-1], arr[j]]
            }
        }
    }
    return arr
}
console.log(BubbleSort([5, 2, 9, 1, 5, 6]))
function InsertionSort(arr){
    for(let i=0; i<arr.length ; i++){
        let j= i
        while(j>0 && arr[j] < arr[j-1]){
            [arr[j], arr[j-1]] = [arr[j-1], arr[j]]
            j--;
        }
    }
    return arr
}
console.log(InsertionSort([5, 2, 9, 1, 5, 6]))