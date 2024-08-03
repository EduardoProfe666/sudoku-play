// Main Scripts of Sudoku Game by EduardoProfe666


// ----------------------------- Logic ----------------------- //

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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

function generateSudoku(difficulty) {
    initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));

    solveSudoku(initialNumbers);

    const totalCells = 81;
    let cellsToRemove = 0;

    switch (difficulty) {
        case 1:
            cellsToRemove = 30; // Very Easy
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

        if (initialNumbers[row][col] !== 0) {
            initialNumbers[row][col] = 0;
            cellsToRemove--;
        }
    }
}



// ----------------------- Visuals -------------------------- //

// Global State Storage (kinda!!)
let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));

// Sudoku Grid Creation
function createSudokuGrid(editable = true, grid = document.getElementById("sudoku-grid")) {
    grid.innerHTML = "";
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            if (!editable && initialNumbers[row][col] !== 0) {
                cell.classList.add("initial");
                cell.textContent = initialNumbers[row][col];
            } else {
                cell.contentEditable = initialNumbers[row][col] === 0 ? true : editable;
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

// Modal Auto-Fill
document.getElementById("auto-fill-button").addEventListener("click", () => {
    let difficulty = 0;

    Swal.fire({
        title: 'Selecciona la dificultad',
        icon: 'question',
        html: `
            <i class="fas fa-star" id="star1" style="cursor: pointer; color: grey;" title="Muy fácil"></i>
            <i class="fas fa-star" id="star2" style="cursor: pointer; color: grey;" title="Fácil"></i>
            <i class="fas fa-star" id="star3" style="cursor: pointer; color: grey;" title="Medio"></i>
            <i class="fas fa-star" id="star4" style="cursor: pointer; color: grey;" title="Difícil"></i>
            <i class="fas fa-star" id="star5" style="cursor: pointer; color: grey;" title="Muy difícil"></i>
        `,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        preConfirm: () => {
            if (difficulty === 0) {
                Swal.showValidationMessage('Debes seleccionar una dificultad');
            }
            return difficulty;
        },
        didOpen: () => {
            const stars = document.querySelectorAll('.fa-star');
            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    difficulty = index + 1;
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.style.color = 'gold';
                        } else {
                            s.style.color = 'grey';
                        }
                    });
                });
            });

        }
    }).then((result) => {
        if (result.isConfirmed) {
            generateSudoku(result.value);
            createSudokuGrid(false);
            document.getElementById("auto-fill-button").style.display = "none";
            document.getElementById("manual-fill-button").style.display = "none";
            document.getElementById("message").style.display = "none";
        }
    });
});

// Modal Manual-Fill
document.getElementById("manual-fill-button").addEventListener("click", () => {
    Swal.fire({
        title: 'Rellena el Sudoku',
        icon: "question",
        html: `
            <div id="manual-sudoku-grid" style="display: grid; grid-template-columns: repeat(9, 30px); grid-template-rows: repeat(9, 30px); gap: 2px; border: 2px solid #000;"></div>
        `,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        didOpen: () => {
            const manualGrid = document.getElementById("manual-sudoku-grid");
            createSudokuGrid(true, manualGrid)
        }
    }).then((result) => {
        if (result.isConfirmed) {
            createSudokuGrid(false);
            document.getElementById("auto-fill-button").style.display = "none";
            document.getElementById("manual-fill-button").style.display = "none";
            document.getElementById("message").style.display = "none";
        }
    });
});

createSudokuGrid(true);