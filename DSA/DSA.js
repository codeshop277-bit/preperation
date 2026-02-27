function buildLPS(pattern){
    let m = pattern.length;
    let lps = new Array(m).fill(0);
    let len = 0;
    let i = 1;

    while(i<m){
        if(pattern[i] === pattern[len]){
            len++
            lps[i] = len
            i++
        }else{
            if(len !=0){
                len = lps[len-1]
            }else{
                lps[i] = 0
                i++
            }
        }
    }
    return lps
}