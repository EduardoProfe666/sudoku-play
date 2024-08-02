const grid = document.getElementById("sudoku-grid");
let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));

function createSudokuGrid(editable = true) {
    grid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (!editable && initialNumbers[row][col] !== 0) {
                cell.classList.add("initial");
                cell.textContent = initialNumbers[row][col];
            } else {
                cell.contentEditable =
                    initialNumbers[row][col] === 0 ? true : editable;
                cell.addEventListener("input", function () {
                    const value = this.textContent;
                    if (!/^\d$/.test(value)) {
                        this.textContent = "";
                    } else {
                        initialNumbers[row][col] = value;
                    }
                });
            }
            grid.appendChild(cell);
        }
    }
}

document.getElementById("start-button").addEventListener("click", () => {
    createSudokuGrid(false);
    document.getElementById("start-button").style.display = "none";
    document.getElementById("message").style.display = "none";
});

createSudokuGrid(true);