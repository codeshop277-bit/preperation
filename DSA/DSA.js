function MaxDepth(str){
    let count = 0;
    let max = 0;
    for(let char of str){
        if(char == '('){
            count++
            max = Math.max(count, max)
        }else if(char == ")"){
            count--
        }
    }
    return max
}
console.log(MaxDepth("(1)+((2))+(((3())))"))