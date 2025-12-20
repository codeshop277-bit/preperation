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

console.log(InsertionSort([15, 12, 48, 9, 3, 25]))