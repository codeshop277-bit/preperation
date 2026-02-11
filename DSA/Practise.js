function SetMatrixZeroesOptimal(matrix) {
    let rows = matrix.length
    let cols = matrix[0].length
    let firstRowHasZero = false
    let firstColHasZero = false

    for (let i = 0; i < rows; i++) {
        if (matrix[i][0] == 0) {
            firstColHasZero = true
        }
    }
    for (let i = 0; i < cols; i++) {
        if (matrix[0][i] == 0) {
            firstRowHasZero = true
        }
    }
    for(let i=1; i< rows; i++){
        for(let j=1; j<cols; j++){
            if(matrix[i][j] == 0){
                matrix[i][0] = 0
                matrix[0][j] = 0
            }
        }
    }
     for(let i=1; i< rows; i++){
        for(let j=1; j<cols; j++){
            if(matrix[i][0] == 0 || matrix[0][j] == 0){
                matrix[i][j] = 0
            }
        }
    }
    if(firstColHasZero){
        for(let i=0; i<rows; i++){
            matrix[i][0] = 0
        }
    }
    if(firstRowHasZero){
        for(let i=0; i<cols; i++){
            matrix[0][i] = 0
        }
    }
return matrix
}
console.log(SetMatrixZeroesOptimal([[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]))