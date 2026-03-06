# Polyfill
Polyfills help understand how built-in methods work internally.
A polyfill is a custom implementation of a JavaScript feature so it works in environments where it doesn't exist.

# Map
Purpose: transform each element.
Returns: new array
Mutates original: ❌ No
```js
const arr = [1, 2, 3];

const result = arr.map(x => x * 2);
// [2,4,6]

Array.prototype.myMap = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    result.push(callback(this[i], i, this));
  }

  return result;
};
```
# Filter
Purpose: select elements that match condition.
Returns: new array
Mutates original: ❌ No
```js
const arr = [1,2,3,4];

arr.filter(x => x % 2 === 0);
// [2,4]
Array.prototype.myFilter = function (callback) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      result.push(this[i]);
    }
  }

  return result;
};
```
# Reduce
Purpose: reduce array into a single value
Returns: single value
Mutates original: ❌ No
```js
[1,2,3].reduce((sum, num) => sum + num, 0)
// 6
Array.prototype.myReduce = function (callback, initial) {
  let acc = initial;

  for (let i = 0; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }

  return acc;
};
```
# forEach
Purpose: iterate array
Returns: undefined
Mutates original: ❌ No (but callback can)
```js
arr.forEach(x => console.log(x));
Array.prototype.myForEach = function (callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);
  }
};
```

# find
Purpose: return first matching element.
Returns: element
Mutates original: ❌ No
```js
[1,3,5,6].find(x => x % 2 === 0)
// 6
Array.prototype.myFind = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return this[i];
    }
  }
};
```

# some
Purpose: checks if any element satisfies condition
Returns: boolean
Mutates original: ❌ No
```js
[1,2,3].some(x => x > 2)
// true
Array.prototype.mySome = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      return true;
    }
  }
  return false;
};
```
# every
Purpose: checks if all elements satisfy condition
Returns: boolean
Mutates original: ❌ No
```js
[2,4,6].every(x => x % 2 === 0)
// true
Array.prototype.myEvery = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (!callback(this[i], i, this)) {
      return false;
    }
  }
  return true;
};
```

# includes
Purpose: check if array contains value
Returns: boolean
Mutates original: ❌ No
```js
[1,2,3].includes(2)
// true
Array.prototype.myIncludes = function (value) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === value) return true;
  }
  return false;
};
```
# flat
Purpose: flatten nested arrays
Returns: new array
Mutates original: ❌ No
```js
[1,[2,[3]]].flat(2)
// [1,2,3]
Array.prototype.myFlat = function (depth = 1) {
  let result = [];

  for (let el of this) {
    if (Array.isArray(el) && depth > 0) {
      result = result.concat(el.myFlat(depth - 1));
    } else {
      result.push(el);
    }
  }

  return result;
};
```
# push
Purpose: add element to the end of array
Mutates original: ✅ Yes
const arr = [1,2,3];
arr.push(4);
[1,2,3,4]

# pop
Purpose: remove last element
Mutates original: ✅ Yes
const arr = [1,2,3];
arr.pop();
[1,2]

# splice
Purpose: add/remove elements at any position
Mutates original: ✅ Yes

const arr = [1,2,3,4];
arr.splice(1,2); //1- starting position, 2 = no of elements
console.log(arr);
// [1,4]

Add element in the middle
const arr = [1, 2, 5, 6];
arr.splice(2, 0, 3, 4);//startIndex → Position where changes start, deleteCount → Number of elements to remove, item1, item2... → Elements to insert
console.log(arr);
[1, 2, 3, 4, 5, 6]

# shift
Purpose: remove first element
Mutates original: ✅ Yes
const arr = [1,2,3];
arr.shift();
console.log(arr);
// [2,3]

# unshift
Purpose: add element at the start
Mutates original: ✅ Yes
const arr = [2,3];
arr.unshift(1);
console.log(arr);
// [1,2,3]

# sort
Purpose: sort array
Mutates original: ✅ Yes
const arr = [3,1,2];
arr.sort();
// [1,2,3]

# slice
urpose: extract portion of array
Mutates original: ❌ No
const arr = [1,2,3,4];
const result = arr.slice(1,3); //1- start index, 3-end index
console.log(result);
// [2,3]
console.log(arr);
// [1,2,3,4]

# concat
Purpose: merge arrays
Mutates original: ❌ No
const arr1 = [1,2];
const arr2 = [3,4];
const result = arr1.concat(arr2);
// [1,2,3,4]

# reverse
Purpose: reverse array order
Mutates original: ✅ Yes
const arr = [1,2,3];
arr.reverse();
// [3,2,1]