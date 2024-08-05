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

function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function isValidMove(board, num, row, col) {
    return !board[row].includes(num) &&
        !board.map(r => r[col]).includes(num) &&
        !isInSubgrid(board, num, row, col);
}

function isInSubgrid(board, num, row, col) {
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) return true;
        }
    }
    return false;
}

function hasUniqueSolution(board) {
    const solutions = [];
    solveSudokuWithCount(board, solutions);
    return solutions.length === 1;
}

function solveSudokuWithCount(board, solutions) {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        solutions.push([...board.map(row => [...row])]);
        return;
    }

    const [row, col] = emptyCell;
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, num, row, col)) {
            board[row][col] = num;
            solveSudokuWithCount(board, solutions);
            board[row][col] = 0; // Backtrack
        }
    }
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
    if(isValidSudoku(grid.map(row => [...row])) && hasUniqueSolution(grid.map(row => [...row])))
        return solveSudoku(grid.map(row => [...row]));

    return undefined;
}


// --------------------- Sudoku Solved? ----------------- //
function isSudokuSolved(grid) {
    const flatGrid = grid.flat();
    const flatSolution = solution.flat();
    console.table(flatGrid)
    console.table(flatSolution)
    return flatGrid.every((value, index) => parseInt(value) === parseInt(flatSolution[index]));
}
