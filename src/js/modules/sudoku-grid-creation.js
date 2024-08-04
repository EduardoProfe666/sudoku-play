// ------------------------- Sudoku Grid Creation -------------------- //
import {initialNumbers} from "./common/global-state-storage";
import {isSudokuSolved} from "./main-engine";
import {stopTimer} from "./common/timer";
import {showWinningModal} from "./modals";

export function createSudokuGrid(editable = true, grid = document.getElementById("sudoku-grid"), initial = false, numbers = initialNumbers) {
    grid.classList.remove('magictime', 'vanishIn');

    grid.innerHTML = "";
    if (initial) {
        grid.style.animation = 'none';
        void grid.offsetWidth;
        grid.style.animation = 'fadeIn 0.3s';
    } else if (!editable) {
        grid.style.animation = 'none';
        void grid.offsetWidth;
        grid.style.animation = 'fadeIn 1s';
    }

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (!editable && numbers[row][col] !== 0) {
                cell.classList.add("initial");
                cell.textContent = numbers[row][col];
            } else {
                cell.contentEditable = numbers[row][col] === 0 ? true : editable;
                cell.addEventListener("input", function () {
                    const value = this.textContent;
                    if (!/^\d$/.test(value)) {
                        this.textContent = "";
                    } else {
                        numbers[row][col] = value;
                    }
                    if (isSudokuSolved(numbers)) {
                        stopTimer();
                        showWinningModal();
                    }
                });
            }
            grid.appendChild(cell);
        }
    }
}