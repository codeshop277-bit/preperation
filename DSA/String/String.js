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

function CommonPrefix(str){
    str.sort()// When sorted any non unique will be either in firdt or last
    let first = str[0];
    let last = str[str.length - 1];
    let common = ""
    for(let i=0; i<Math.min(first.length, last.length); i++){
        if(first[i] != last[i]){
            return common
        }   

        common += first[i]
    }
    return common
}
// console.log(CommonPrefix( ["flowers" , "flow" , "aa", "flight" ]))

function IsomorphicStrings(s,t){
    const mapS = new Map()
    const mapT = new Map()
    for (let i=0; i<s.length; i++ ){
        if(mapS.has(s[i])){
            if(mapS.get(s[i]) !== t[i]){
                return false
            }
        }else{
            if(mapT.has(t[i])){
                return false
            }
            mapS.set(s[i], t[i])
            mapT.set(t[i])
        }
    }
    return true
}
//  console.log(IsomorphicStrings("apple", "bbnbm"))

function RotateStringTOMatchGoal(s, goal){
    for(let i=0; i<s.length; i++){
        let rotate = s.substring(i) + s.substring(0,i);
        if(rotate == goal) return true
    }
    return false
    let double = s+s
    return double.includes(goal)
}
console.log(RotateStringTOMatchGoal("abcde", "bcdea"))