function Pascals(n){
    let ans  = 1;
    let triangle = [1]
    for(let i=1; i<n; i++){
        ans =  Math.floor(ans * (n-i)/i)
        triangle.push(ans)
    }
    return triangle
}
console.log(Pascals(6))