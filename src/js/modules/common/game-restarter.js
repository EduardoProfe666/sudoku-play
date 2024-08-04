// -------------------- Restart Game --------------------------- //
import {destroyGlobalValues} from "./global-state-storage";
import {stopConfetti} from "./confetti";
import {generateInitialSudoku, startSudokuAnimation} from "./sudoku-animations";

export function restartGame(){
    destroyGlobalValues();

    document.getElementById("auto-fill-button").style.display = "block";
    document.getElementById("manual-fill-button").style.display = "block";
    document.getElementById("message").style.display = "block";
    document.getElementById("timer").style.display = "none";

    stopConfetti();

    generateInitialSudoku();
    startSudokuAnimation();
}