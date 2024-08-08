// ---------------------------------------------- Main Engine Solver v3 ------------------------------------------------- //
// ------------- Common Stuff ---------------- //
function isValidSudoku(board) {
    for (let row = 0; row < 9; row++) {
        if (!isValidGroup(board[row])) return false;
    }

    for (let col = 0; col < 9; col++) {
        const column = board.map(row => row[col]);
        if (!isValidGroup(column)) return false;
    }

    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            const subgrid = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    subgrid.push(board[row + r][col + c]);
                }
            }
            if (!isValidGroup(subgrid)) return false;
        }
    }

    return true;
}

function isValidGroup(group) {
    const seen = new Set();
    for (let i = 0; i < group.length; i++) {
        if (group[i] !== 0) {
            if (seen.has(group[i])) return false;
            seen.add(group[i]);
        }
    }
    return true;
}

function countClues(board) {
    let clueCount = 0;

    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] !== 0) {
                clueCount++;
            }
        }
    }

    return clueCount;
}

function hasAtLeast17Clues(board) {
    return countClues(board) >= 17;
}


// --------------- Solve Sudoku - Manual Fill ------------------ //
function solveSudoku(board) {
    const size = 9;

    function isValid(board, row, col, num) {
        for (let x = 0; x < size; x++) {
            if (board[row][x] === num || board[x][col] === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    function solve() {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= size; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve()) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    if (solve()) {
        return board;
    } else {
        return null;
    }
}

// ------------- Sudoku Solvable? - Manual Fill -------------- //
function isSudokuSolvable(grid){
    return isValidSudoku(grid.map(row => [...row])) && hasAtLeast17Clues(grid.map(row => [...row]));
}


// --------------------- Sudoku Solved? ----------------- //
function isSudokuSolved(grid) {
    const flatGrid = grid.flat();
    const flatSolution = solution.flat();
    return flatGrid.every((value, index) => parseInt(value) === parseInt(flatSolution[index]));
}
