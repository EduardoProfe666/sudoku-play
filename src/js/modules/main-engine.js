// ---------------------------------------------- Main Engine v2 ------------------------------------------------- //
import {initialNumbers} from "./common/global-state-storage";

// ------------- Common Stuff ---------------- //
function isSafe(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) {
            return false;
        }
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) {
                return false;
            }
        }
    }

    return true;
}

function isUnique(arr) {
    const seen = new Set();
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 1 || arr[i] > 9 || seen.has(arr[i])) {
            return false;
        }
        seen.add(arr[i]);
    }
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


// --------------------- Sudoku Solved? ----------------- //
export function isSudokuSolved(grid) {
    // Verificar filas
    for (let row = 0; row < 9; row++) {
        if (!isUnique(grid[row])) {
            return false;
        }
    }

    // Verificar columnas
    for (let col = 0; col < 9; col++) {
        const column = [];
        for (let row = 0; row < 9; row++) {
            column.push(grid[row][col]);
        }
        if (!isUnique(column)) {
            return false;
        }
    }

    // Verificar subcuadrículas de 3x3
    for (let row = 0; row < 9; row += 3) {
        for (let col = 0; col < 9; col += 3) {
            const subgrid = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    subgrid.push(grid[row + r][col + c]);
                }
            }
            if (!isUnique(subgrid)) {
                return false;
            }
        }
    }

    return true;
}


// ----------------------- Generate Sudoku with Backtracking Algorithm -------------------- //
function solveSudoku(grid) {
    let row = -1;
    let col = -1;
    let isEmpty = true;

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) {
                row = i;
                col = j;
                isEmpty = false;
                break;
            }
        }
        if (!isEmpty) {
            break;
        }
    }

    if (isEmpty) {
        return true;
    }

    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);

    for (let num of nums) {
        if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
                return true;
            }
            grid[row][col] = 0;
        }
    }

    return false;
}

// --------------- Sudoku Generation with Levels of Difficulty -------------- //
export function generateSudoku(difficulty, numbers = initialNumbers) {

    solveSudoku(numbers);

    // Total Cells = 81
    let cellsToRemove;

    switch (difficulty) {
        case 1:
            cellsToRemove = 1; // Very Easy
            break;
        case 2:
            cellsToRemove = 40; // Easy
            break;
        case 3:
            cellsToRemove = 50; // Medium
            break;
        case 4:
            cellsToRemove = 65; // Hard
            break;
        case 5:
            cellsToRemove = 72; // Very Hard
            break;
        default:
            cellsToRemove = 35; // By default, between Very Easy and Easy
            break;
    }

    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        if (numbers[row][col] !== 0) {
            numbers[row][col] = 0;
            cellsToRemove--;
        }
    }
}