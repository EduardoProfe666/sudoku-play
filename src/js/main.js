import {generateInitialSudoku, startSudokuAnimation} from "./modules/common/sudoku-animations";
import {prepareModalAutoFill, prepareModalManualFill} from "./modules/modals";

document.addEventListener("DOMContentLoaded", () => {
    prepareModalManualFill();
    prepareModalAutoFill();
    generateInitialSudoku();
    startSudokuAnimation();
});