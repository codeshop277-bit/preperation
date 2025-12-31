//FOr a given r and c in a pascal triangle, return the value at that position

function PascalTriangleValue(r, c){
    let row = r-1;
    let col = c-1;
    let ans = 1;

    for(i=0; i<col; i++){
      ans = Math.floor(ans * (row-i) / (i+1)); 
    }
    return ans;
}
console.log(PascalTriangleValue(3,2)) 

//Return n rows of pascal triangle
function PrintPascalTriangle(n){
    let triangle = [1];
    let ans = 1;
    for(let i=1; i<n; i++){
        ans = Math.floor(ans * (n-i)/ i)
        triangle.push(ans);
    }
    return triangle;
}
console.log(PrintPascalTriangle(5));

//Generate first n rows of pascal triangle
function GeneratePascalTriangle(n){
    for(let i=0; i<n; i++){
        console.log(PrintPascalTriangle(i+1));
    }
}
GeneratePascalTriangle(5);