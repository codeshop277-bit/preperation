function LongestSubstringWithoutRepeatingChars(s) {
    let n = s.length;
    let map = new Map();
    let l = 0;
    let r = 0;
    let maxLen = 0;

    while (r < n) {
        if (map.has(s[r])) {
            if (map.get(s[r]) >= l) {
                l = map.get(s[r]) + 1;
            }
        }
        maxLen = Math.max(maxLen, r - l + 1);
        map.set(s[r], r);
        r++;
    }
    return maxLen;
}
// console.log(LongestSubstringWithoutRepeatingChars("abcadcbb")); //3

function MaxConsecutiveOnesWithK0s(arr, k) {
    let n = arr.length
    let l = 0;
    let r = 0;
    let maxLen = 0;
    let zeors = 0;

    while (r < n) {
        if (arr[r] == 0) zeors++;

        if (zeors > k) {
            if (arr[l] == 0) zeors--;
            l++;
        }
        if (zeors <= k) {
            let len = r - l + 1;
            maxLen = Math.max(maxLen, len);
        }
        r++;
    }
    return maxLen;
}
// console.log(MaxConsecutiveOnesWithK0s([1, 0, 1, 1, 0, 0, 1, 1, 1, 0], 2)); //7

function FruitsIntoBaskets(arr, k) {
    let maxLen = 0;
    let map = new Map();
    let l = 0;
    let r = 0;

    while (r < arr.length) {
        map.set(arr[r], map.get(arr[r]) + 1 || 1);

        if (map.size > k) {
            map.set(arr[l], map.get(arr[l]) - 1);
            if (map.get(arr[l]) == 0) {
                map.delete(arr[l]);
            }
            l++;
        }
        if (map.size <= k) {
            maxLen = Math.max(maxLen, r - l + 1);
        }
        r++
    }
    return maxLen;
}
// console.log(FruitsIntoBaskets(['A', 'B', 'C', 'C', 'A', 'C'], 2)); //3

function LongestSubstingWithKReplacement(s, k) {
    let n = s.length;
    let l = 0;
    let r = 0;
    let maxLen = 0;
    let map = new Map();
    let maxFreq = 0;

    while (r < n) {
        map.set(s[r], map.get(s[r]) + 1 || 1);
        maxFreq = Math.max(maxFreq, map.get(s[r]));

        if (r - l + 1 - maxFreq > k) {
            map.set(s[l], map.get(s[l]) - 1);
            l++;
        }
        if (r - l + 1 - maxFreq <= k) {
            maxLen = Math.max(maxLen, r - l + 1);
        }
        r++;
    }
    return maxLen;
}
// console.log(LongestSubstingWithKReplacement("AABABBA", 1)); //4

function BinarySUm(arr, target) {
    let l = 0;
    let r = 0;
    let sum = 0;
    let count = 0;
    while (r < arr.length) {
        sum += arr[r];
        while (sum > target) {
            sum = sum - arr[l];
            l++;
        }
        count += r - l + 1;
        r++
    }
    return count;
}

function BinarySubarraysWithSum(arr, target) {
    return BinarySUm(arr, target) - BinarySUm(arr, target - 1);
}
// console.log(BinarySubarraysWithSum([1,0,1,0,1], 1)); //4

function CountNiceSubarrays(arr, k) {
    //Convert odd to 1 and even to 0
    return BinarySUm(arr.map(x => x % 2), k) - BinarySUm(arr.map(x => x % 2), k - 1);
}
// console.log(CountNiceSubarrays([2,2,2,1,2,2,1,2,2,2], 2)); //16

function NoOfStringsContainingAllThreeChars(s) {
    let n = s.length;
    let map = new Map();
    let count = 0;
    map.set('a', -1);
    map.set('b', -1);
    map.set('c', -1);

    for (let i = 0; i < n; i++) {
        map.set(s[i], i);
        if (map.get('a') != -1 && map.get('b') != -1 && map.get('c') != -1) {
            let minIndex = Math.min(...map.values());
            count += minIndex + 1;
        }
    }
    return count;
}
// console.log(NoOfStringsContainingAllThreeChars("abcabc")); //10

function MaximumPointsYouCanObtainFromCards(arr, k) {
    let n = arr.length;
    let lsum = 0;
    let rsum = 0;
    let maxSum = 0;

    for (let i = 0; i <= k - 1; i++) {
        lsum += arr[i];
    }
    maxSum = lsum;
    let rightIndex = n - 1;
    for (let i = k - 1; i >= 0; i--) {
        lsum = lsum - arr[i];
        rsum += arr[rightIndex];
        rightIndex--;
        maxSum = Math.max(maxSum, lsum + rsum);
    }
    return maxSum;
}
// console.log(MaximumPointsYouCanObtainFromCards([1,2,3,4,5,6,1], 3)); //12

function LongestSubstingWithAtmostKDistinctChars(s, k) {
    const n = s.length;
    let l = 0;
    let r = 0;
    let map = new Map();
    let maxLn = 0;

    while (r < n) {
        map.set(s[r], map.get(s[r]) + 1 || 1);
        if (map.size > k) {
            map.set(s[l], map.get(s[l]) - 1);
            if (map.get(s[l]) == 0) {
                map.delete(s[l]);
            }
            l++
        }

        if (map.size <= k) {
            maxLn = Math.max(maxLn, r - l + 1);
        }
        r++;
    }
    return maxLn;
}
// console.log(LongestSubstingWithAtmostKDistinctChars("aaabbccd", 2)); //3

function MinimumWindowSubsequence(s1, s2) {
    let minStart = 0;
    let minLen = Infinity;
    let i = 0;

    while (i < s1.length) {
        let j=0;
        let start =i;
        while(j<s2.length && i<s1.length){
            if(s1[i] == s2[j]){
                j++
            }
            i++
        }
        if(j==s2.length){
            let len = i-start;
            if(len < minLen){
                minLen = len
                minStart = start
            }
            i=start +1
        }
    }
    return minLen == Infinity ? "" : s1.substring(minStart, minLen+minStart);
}
// console.log(MinimumWindowSubsequence("abcdebdde", "bde")); //"bcde"