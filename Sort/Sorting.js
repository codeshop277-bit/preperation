//Sorting

//Selection Sort


function SelectionSort(arr) {
    let n = arr.length
    for (let i = 0; i < n - 1; i++) { //you can use either n, n-1, n-2 but adjust inner loop accordingly
        let min = i;
        for (let j = i; j < n; j++) {
            if (arr[j] < arr[min]) min = j
        }
        let temp = arr[min];
        arr[min] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

function BubbleSort(arr) {
    let n = arr.length
    //In bubble max will be checked and pushed to last, we can assume i as n-1
    for (let i = n - 1; i >= 1; i--) {
        let didSwap = 0;
        for (let j = 0; j < n - 1; j++) { //j runs for n-1  since we are doing j+1 if taken till n it will throw run time error because it will access an undefined index
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                didSwap++;
            }
        }
        if (didSwap == 0) {//for best time complexity, if swap did not occur then arr is already sorted
            break;
        }
    }
    return arr;
}


function InsertionSort(arr) {
    let n = arr.length
    for (let i = 0; i <= n - 1; i++) { 
        let j = i;
        while (j > 0 && arr[j - 1] > arr[j]) {
            let temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
            j--;//doing this so element can be put in right position, without this it will swap only one position
        }
    }
    return arr;
}
function merge(left, right){
    //We compare left[i] with right[j] and push the smaller one to result
    //We increment the pointer of whichever array we took from
    //The loop continues only while both arrays have elements left to compare

    
    let result = [];
    let i =0;
    let j=0;
    while(i<left.length && j<right.length){
        if(left[i]< right[j]){
            result.push(left[i])
            i++;
        }else{
            result.push(right[j])
            j++
        }
    }
    return result.concat(left.slice(i)).concat(right.slice(j)); //After the while loop exits, one array might still have elements left. This happens because the loop stops as soon as we finish with one array.
}
function MergeSort(arr){
    if(arr.length <=1) return arr;
    //Step 1: Split the array in half and recursively split it until we have single element 
    //EX: [ 3, 9, 12, 15, 25, 48 ] --> [3], [9], [12], [15], [25], [48]
    let mid = Math.floor(arr.length/2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(MergeSort(left), MergeSort(right))
}

console.log(MergeSort([15, 12, 48, 9, 3, 25, 1]))