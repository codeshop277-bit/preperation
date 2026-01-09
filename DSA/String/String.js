function RemoveOuterParanthesis(s){
    let level =0;
    let result = "";
    console.log("Input is", "()(()())(())")
    for(let char of s){
        if(char == '('){
            if (level > 0) result += char;
            level++
        }else if(char == ')'){
            level--
            if(level>0) result+=char
        }
        console.log(`For char ${char} result is ${result}`)
    }
    return result;
}
console.log(RemoveOuterParanthesis("()(()())(())"))