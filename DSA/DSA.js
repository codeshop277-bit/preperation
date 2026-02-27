function MinimumReversal(str){
    let starting = 0;
    let closing = 0;

    for(let i=0; i<str.length; i++){
        if(str[i] == "("){
            starting++
        }else{
            if(starting> 0){
                starting--
            }else{
                closing++
            }
        }
    }
    return {starting, closing}
    //Math.floor((starting+1)/ 2) + Math.floor((closing+1)/ 2)
}
console.log(MinimumReversal(")(())((("))