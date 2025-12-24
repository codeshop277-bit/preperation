function mergeSort(arr) {
  // Base case: arrays with 0 or 1 element are already sorted
  if (arr.length <= 1) {
    return arr;
  }
  
  // Divide: find the middle and split the array
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves and merge them
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  
  console.log(`\nMerging: [${left}] and [${right}]`);
  console.log('Step | i | j | left[i] | right[j] | Comparison | Action | result');
  console.log('-----|---|---|---------|----------|------------|--------|--------');
  
  let step = 1;
  
  // Compare elements from left and right arrays and add the smaller one
  while (i < left.length && j < right.length) {
    const leftVal = left[i];
    const rightVal = right[j];
    const comparison = leftVal < rightVal ? `${leftVal} < ${rightVal}` : `${leftVal} >= ${rightVal}`;
    
    if (left[i] < right[j]) {
      result.push(left[i]);
      console.log(`${step.toString().padEnd(4)} | ${i} | ${j} | ${leftVal.toString().padEnd(7)} | ${rightVal.toString().padEnd(8)} | ${comparison.padEnd(10)} | Push ${leftVal}, i++ | [${result}]`);
      i++;
    } else {
      result.push(right[j]);
      console.log(`${step.toString().padEnd(4)} | ${i} | ${j} | ${leftVal.toString().padEnd(7)} | ${rightVal.toString().padEnd(8)} | ${comparison.padEnd(10)} | Push ${rightVal}, j++ | [${result}]`);
      j++;
    }
    step++;
  }
  
  // Log the end condition
  const endCondition = i >= left.length ? 'i >= left.length' : 'j >= right.length';
  const leftRemaining = i < left.length ? left[i] : '-';
  const rightRemaining = j < right.length ? right[j] : '-';
  console.log(`${step.toString().padEnd(4)} | ${i} | ${j} | ${leftRemaining.toString().padEnd(7)} | ${rightRemaining.toString().padEnd(8)} | ${endCondition.padEnd(10)} | Loop ends | [${result}]`);
  
  // Add any remaining elements from left or right
  const finalResult = result.concat(left.slice(i)).concat(right.slice(j));
  
  if (left.slice(i).length > 0) {
    console.log(`Adding remaining from left: [${left.slice(i)}]`);
  }
  if (right.slice(j).length > 0) {
    console.log(`Adding remaining from right: [${right.slice(j)}]`);
  }
  
  console.log(`Final merged result: [${finalResult}]`);
  
  return finalResult;
}

// Example usage
console.log('=== MERGE SORT VISUALIZATION ===\n');
const unsorted = [38, 27, 43, 3];
console.log(`Original array: [${unsorted}]\n`);
const sorted = mergeSort(unsorted);
console.log(`\n=== FINAL SORTED ARRAY ===`);
console.log(`[${sorted}]`);