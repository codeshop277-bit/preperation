function RemoveOuterParanthesis(s) {
    let level = 0;
    let result = "";
    console.log("Input is", "()(()())(())")
    for (let char of s) {
        if (char == '(') {
            if (level > 0) result += char;
            level++
        } else if (char == ')') {
            level--
            if (level > 0) result += char
        }
        console.log(`For char ${char} result is ${result}`)
    }
    return result;
}
// console.log(RemoveOuterParanthesis("()(()())(())"));

function ReverseWords(s) {
    let reversed = "";
    let i = s.length - 1;
    console.log("Initial i", i)
    while (i >= 0) {
        while (i >= 0 && s[i] === " ") {
            i--
        }
        let end = i;
        while (i >= 0 && s[i] !== " ") {
            i--
        }
        let word = s.substring(i + 1, end + 1);
        console.log(reversed.length)
        if (reversed.length > 0) reversed += " "
        reversed += word
        // console.log('After skipping spaces', i)
    }
    return reversed
}
// console.log(ReverseWords("Reverse this word  "))

function LargestOddNoInString(s) {
    let endIndex = -1;

    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] % 2 === 1) {
            endIndex = i;
            break;
        }
    }
    let j = 0;
    while (j <= endIndex && s[j] == 0) {
        j++
    }
    return s.substring(j, endIndex + 1)
}
// console.log(LargestOddNoInString('02013638'))

function CommonPrefix(str) {
    str.sort()// When sorted any non unique will be either in firdt or last
    let first = str[0];
    let last = str[str.length - 1];
    let common = ""
    for (let i = 0; i < Math.min(first.length, last.length); i++) {
        if (first[i] != last[i]) {
            return common
        }

        common += first[i]
    }
    return common
}
// console.log(CommonPrefix( ["flowers" , "flow" , "aa", "flight" ]))

function IsomorphicStrings(s, t) {
    const mapS = new Map()
    const mapT = new Map()
    for (let i = 0; i < s.length; i++) {
        if (mapS.has(s[i])) {
            if (mapS.get(s[i]) !== t[i]) {
                return false
            }
        } else {
            if (mapT.has(t[i])) {
                return false
            }
            mapS.set(s[i], t[i])
            mapT.set(t[i])
        }
    }
    return true
}
//  console.log(IsomorphicStrings("apple", "bbnbm"))

function RotateStringTOMatchGoal(s, goal) {
    for (let i = 0; i < s.length; i++) {
        let rotate = s.substring(i) + s.substring(0, i);
        if (rotate == goal) return true
    }
    return false
    let double = s + s
    return double.includes(goal)
}
// console.log(RotateStringTOMatchGoal("abcde", "bcdea"))

function CheckAnangram(s, t) {
    if (s.length != t.length) return false
    let map = new Map();

    for (let i = 0; i < s.length; i++) {
        map.set(s[i], (map.get(s[i]) || 0) + 1);
        map.set(t[i], (map.get(t[i]) || 0) - 1)
    }
    for (let [key, value] of map) {
        if (value != 0) {
            return false
        }
    }
    return true
}
// console.log(CheckAnangram("ANAGRAM", "NAGARAM"))

function frequencySort(s) {
    let map = new Map();
    let ans = []

    for (let i = 0; i < s.length; i++) {
        map.set(s[i], (map.get(s[i]) || 0) + 1)
    }
    let sorted = new Map([...map.entries()].sort((a, b) => {
        if (b[1] != a[1]) {
            return b[1] - a[1]
        }
        return a[0].localeCompare(b[0])
    }))
    for (let [key, value] of sorted) {
        if (value > 0) ans.push(key)
    }
    return ans
}
// console.log(frequencySort("tree"))

function MaxDepthParanthesis(s) {
    let level = 0;
    let maxCount = 0;

    for (let i = 0; i < s.length; i++) {
        if (s[i] == "(") {
            level++;
            maxCount = Math.max(maxCount, level)
        } else if (s[i] == ")") {
            level--
        }
    }
    return maxCount
}
// console.log(MaxDepthParanthesis("(1+(2*3)+((8)/4))+1"))

function RomanToInt(s) {
    let ans = 0;
    const roman = {
        'I': 1, 'V': 5, 'X': 10,
        'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    for (let i = 0; i < s.length - 1; i++) {
        if (roman[s[i]] < roman[s[i + 1]]) {
            ans -= roman[s[i]]
        } else {
            ans += roman[s[i]]
        }
    }
    return ans + roman[s[s.length - 1]];
}
// console.log(RomanToInt("MCMXCIV"))

function atoi(s) {
    let sign = 1;
    let i = 0;
    let res = 0;
    while (i < s.length && s[i] == " ") i++
    if (s[i] == "-") {
        sign = -1;
        i++
    } else if (s[i] == "+") {
        i++
    }
    while (i <= s.length && s[i] >= "0" && s[i] <= "9") {
        res = res * 10 + (s[i].charCodeAt(0) - "0".charCodeAt(0));
        if (sign * res > 2147483647) return 2147483647
        if (sign * res < -2147483647) return -2147483647
        i++
    }
    return sign * res
}
// console.log(atoi("4193 with words"))

function LongestPalindrome(s) {
    let start = 0;
    let maxLen = 0;

    function expandAroundCenter(left, right) {
        while (left >= 0 && right <= s.length && s[left] == s[right]) {
            left--;
            right++
        }
        return right - left - 1
    }

    for (let i = 0; i < s.length; i++) {
        let len1 = expandAroundCenter(i, i);
        let len2 = expandAroundCenter(i, i + 1);

        let len = Math.max(len1, len2)

        if (len > maxLen) {
            maxLen = len
            start = i - Math.floor((len - 1) / 2)
        }
    }
    return s.substring(start, start + maxLen)

}
//  console.log(LongestPalindrome("bababd"))

function BeautyOfSting(s) {
    let total = 0;
    let n = s.length;

    for (let i = 0; i < n; i++) {
        const freq = {}
        for (let j = i; j < n; j++) {
            const ch = s[j]
            freq[ch] = (freq[ch] || 0) + 1
            const value = Object.values(freq)
            const max = Math.max(...value)
            const min = Math.min(...value)
            total += (max - min)
        }
    }
    return total
}
// console.log(BeautyOfSting("aabcbaa"))

function MinimumReversal(sting) {
    let opening = 0;
    let closing = 0;

    for (let ch of sting) {
        if (ch === '(') {
            opening++
        } else {
            if (opening > 0) {
                opening--
            } else {
                closing++
            }
        }
    }
    if ((opening + closing) % 2 != 0) return -1
    return Math.floor((opening + 1) / 2) + Math.floor((closing + 1) / 2)
}
// console.log(MinimumReversal("()()(())"))

function countAndSay(n) {
    let result = "1";

    for (let i = 1; i < n; i++) {
        let count = 1
        let current = ""

        for (let j = 1; j < result.length; j++) {
            if (result[j] == result[j - 1]) {
                count++
            } else {
                current += count.toString() + result[j - 1]
                count = 1
            }
        }
        current += count.toString() + result[result.length - 1]
        result = current
    }
    return result
}
// console.log(countAndSay(4))
function rabinKarp(text, pattern) {
  const result = [];
  const n = text.length;
  const m = pattern.length;
  
  if (m > n || m === 0) return result;
  
  const d = 256; // Number of characters in the input alphabet
  const q = 101; // A prime number for modulo operation
  
  let patternHash = 0;
  let textHash = 0;
  let h = 1;
  
  // Calculate h = d^(m-1) % q
  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }
  
  // Calculate initial hash values for pattern and first window of text
  for (let i = 0; i < m; i++) {
    patternHash = (d * patternHash + pattern.charCodeAt(i)) % q;
    textHash = (d * textHash + text.charCodeAt(i)) % q;
  }
  
  // Slide the pattern over text one by one
  for (let i = 0; i <= n - m; i++) {
    // Check if hash values match
    if (patternHash === textHash) {
      // Hash values match, verify character by character
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        result.push(i);
      }
    }
    
    // Calculate hash for next window
    if (i < n - m) {
      textHash = (d * (textHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      
      // Handle negative hash values
      if (textHash < 0) {
        textHash = textHash + q;
      }
    }
  }
  
  return result;
}

rabinKarp('ABCABC', 'ABC');