// Quick Sort Implementation
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // Partition the array and get the pivot index
    const pivotIndex = partition(arr, left, right);
    
    // Recursively sort elements before and after partition
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  // Choose the rightmost element as pivot
  const pivot = arr[right];
  
  // Index of smaller element (indicates the right position of pivot)
  console.log('i', left)
  let i = left - 1;
  
  // Compare each element with pivot
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      // Swap elements at i and j
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  // Place pivot in its correct position
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  
  return i + 1;
}

// Example usage
const unsorted = [64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 30];
console.log("Original array:", unsorted);

const sorted = quickSort([...unsorted]);
console.log("Sorted array:", sorted);

// Example with negative numbers
// const mixedNumbers = [3, -1, 4, -5, 2, 0, -3];
// console.log("\nOriginal mixed array:", mixedNumbers);
// console.log("Sorted mixed array:", quickSort([...mixedNumbers]));

// // Step-by-step example with small array
// console.log("\n--- Step-by-step example ---");
// const small = [5, 2, 8, 1, 9];
// console.log("Array: [5, 2, 8, 1, 9]");
// console.log("Pivot: 9 (last element)");
// console.log("After partition: [5, 2, 8, 1] | 9");
// console.log("Continue sorting left and right...");
// console.log("Final result:", quickSort([...small]));