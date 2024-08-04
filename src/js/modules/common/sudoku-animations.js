// ----------------- Sudoku Initial Animation ---------------------- //
import {otherNumbers, sudokuAnimationInterval} from "./global-state-storage";
import {generateSudoku} from "../main-engine";
import {createSudokuGrid} from "../sudoku-grid-creation";

export function generateInitialSudoku() {
    otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    generateSudoku(3, otherNumbers);
    createSudokuGrid(false, document.getElementById("sudoku-grid"), true, otherNumbers);
}

export function startSudokuAnimation() {
    sudokuAnimationInterval = setInterval(() => {
        generateInitialSudoku()
    }, 2000);
}

export function stopSudokuAnimation(){
    clearInterval(sudokuAnimationInterval);
}
