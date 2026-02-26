function Beauty(str){
    
    let total =0;
    for(let i=0; i< str.length; i++){
        let freq = {}
        for(let j=i; j< str.length; j++){
            const ch = str[j]
            freq[ch] = (freq[ch] || 0) +1
            const values = Object.values(freq)
            const max = Math.max(...values)
            const min = Math.min(...values)
            total += (max-min)
        }
    }
    return total

}
console.log(Beauty("aabcbaa"))