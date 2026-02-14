function Pascal(r,c){
    let row = r-1;
    let col = c-1;
    let ans = 1;
    for(let i=0; i<col; i++){
        ans = Math.floor(ans *(row-i)/(i+1))
    }
    return ans
}
function PrintRow(n){
    let triangle = [1];
    let ans = 1;
    for(let i=1; i<n; i++){
        ans = Math.floor(ans * (n-i) / i)
        triangle.push(ans)
    }
    return triangle
}
console.log(Pascal(3,2))
console.log(PrintRow(5))