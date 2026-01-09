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
console.log(LargestOddNoInString('02013638'))