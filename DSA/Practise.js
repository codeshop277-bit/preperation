function SetMatrixZeroesOptimal(matrix) {
    let m = matrix.length
    for(let i=0; i<m-1; i++){
        for(let j= i+1; j<m; j++){
            [matrix[i][j], matrix[j][i]] =  [matrix[j][i], matrix[i][j]]

        }
    }

return matrix.map(m => m.reverse())
}
console.log(SetMatrixZeroesOptimal([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]))