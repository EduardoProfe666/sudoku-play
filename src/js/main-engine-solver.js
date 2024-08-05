// ---------------------------------------------- Main Engine Solver v3 ------------------------------------------------- //
// ------------- Common Stuff ---------------- //

// --------------- Solve Sudoku - Manual Fill ------------------ //
function solveSudoku(grid){

}

// ------------- Sudoku Solvable? - Manual Fill -------------- //
function isSudokuSolvable(grid){

}



// --------------------- Sudoku Solved? ----------------- //
function isSudokuSolved(grid) {
    const flatGrid = grid.flat();
    const flatSolution = solution.flat();
    return flatGrid.every((value, index) => value === flatSolution[index]);
}
