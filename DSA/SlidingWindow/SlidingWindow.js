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
console.log(LongestSubstringWithoutRepeatingChars("abcadcbb")); //3

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
console.log(MaxConsecutiveOnesWithK0s([1, 0, 1, 1, 0, 0, 1, 1, 1, 0], 2)); //7