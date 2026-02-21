function PeakRows(matrix){
    let rows = matrix.length
    let cols = matrix[0].length
    let max = -1
    for(let i=0; i< rows; i++){
        for(let j=0; j<cols; j++){
            if(matrix[i][j] > max){
                max = matrix[i][j]
            }
        }
    }
    return max
}
console.log(PeakRows([[10, 20, 15], [21, 30, 14], [7, 16, 32]]))