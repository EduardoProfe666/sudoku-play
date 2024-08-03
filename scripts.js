// ---------------------------- Global State Storage (kinda!!) ----------------------------------------------- //
let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let sudokuAnimationInterval;
let startTime;
let timerInterval;


// ---------------------------------------------- Main Engine ------------------------------------------------- //

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

function isSudokuSolved(grid) {
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

function generateSudoku(difficulty, numbers = initialNumbers) {

    solveSudoku(numbers);

    const totalCells = 81;
    let cellsToRemove = 0;

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


// -------------------------------------------------- Visuals ----------------------------------------------- //

// Sudoku Grid Creation
function createSudokuGrid(editable = true, grid = document.getElementById("sudoku-grid"), initial = false, numbers = initialNumbers) {
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
                        clearInterval(timerInterval);
                        showWinningModal();
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
        title: 'Choose the game`s difficulty',
        icon: 'question',
        html: `
            <i class="fas fa-star" id="star1" style="cursor: pointer; color: grey;" title="Very Easy"></i>
            <i class="fas fa-star" id="star2" style="cursor: pointer; color: grey;" title="Easy"></i>
            <i class="fas fa-star" id="star3" style="cursor: pointer; color: grey;" title="Medium"></i>
            <i class="fas fa-star" id="star4" style="cursor: pointer; color: grey;" title="Hard"></i>
            <i class="fas fa-star" id="star5" style="cursor: pointer; color: grey;" title="Very Hard"></i>
        `,
        showCancelButton: false,
        confirmButtonText: 'Start Game',
        preConfirm: () => {
            if (difficulty === 0) {
                Swal.showValidationMessage('You must select a difficulty');
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

                star.addEventListener('mouseenter', () => {
                    stars.forEach((s, i) => {
                        if (i <= index) {
                            s.style.color = 'gold';
                        } else {
                            s.style.color = 'grey';
                        }
                    });
                });

                star.addEventListener('mouseleave', () => {
                    stars.forEach((s, i) => {
                        if (i < difficulty) {
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
            clearInterval(sudokuAnimationInterval);
            generateSudoku(result.value);
            createSudokuGrid(false);
            document.getElementById("auto-fill-button").style.display = "none";
            document.getElementById("manual-fill-button").style.display = "none";
            document.getElementById("message").style.display = "none";
            document.getElementById("timer").style.display = "block";
            startTimer();
            localStorage.setItem('sudokuDifficulty', result.value);
            localStorage.setItem('sudokuGameMode', 'auto');
        }
    });
});

// Modal Manual-Fill
document.getElementById("manual-fill-button").addEventListener("click", () => {
    Swal.fire({
        title: 'Fill the initial numbers',
        icon: "question",
        html: `
            <div id="manual-window">
                <div id="manual-sudoku-grid" style="display: grid; grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(9, 1fr); gap: 2px; border: 4px solid #000; width: 100%; max-width: 500px; aspect-ratio: 1;"></div>
            </div>
        `,
        showCancelButton: false,
        confirmButtonText: 'Start Game',
        didClose: () => {

        },
        didOpen: () => {
            initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
            const manualGrid = document.getElementById("manual-sudoku-grid");
            createSudokuGrid(true, manualGrid);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            clearInterval(sudokuAnimationInterval);
            createSudokuGrid(false);
            document.getElementById("auto-fill-button").style.display = "none";
            document.getElementById("manual-fill-button").style.display = "none";
            document.getElementById("message").style.display = "none";
            document.getElementById("timer").style.display = "block";
            startTimer();
            localStorage.setItem('sudokuGameMode', 'manual');
        }
    });
});

// Modal Winning
function showWinningModal() {
    const timeDisplay = document.getElementById("timer-display").textContent;
    const difficulty = localStorage.getItem('sudokuDifficulty') || 'Unknown';
    const gameMode = localStorage.getItem('sudokuGameMode') || 'Unknown';

    let difficultyStars = '';
    if (gameMode === 'auto') {
        const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
        difficultyStars = stars[difficulty - 1] || 'Unknown';
    }

    Swal.fire({
        title: '¡Congratulations! You complete the game',
        icon: 'success',
        html: `
            <p>Elapsed Time: <strong>${timeDisplay}</strong></p>
            <p>Fill Mode: <strong>${gameMode === 'auto' ? 'Automático' : 'Manual'}</strong></p>
            ${gameMode === 'auto' ? `<p>Difficulty: <strong>${difficultyStars}</strong></p>` : ''}
        `,
        confirmButtonText: 'Restart',
        showCancelButton: true,
        cancelButtonText: 'Share',
        didOpen: () => {
            const restartButton = Swal.getConfirmButton();
            restartButton.addEventListener('click', () => {
                location.reload();
            });

            const shareButton = Swal.getCancelButton();
            shareButton.addEventListener('click', () => {
                html2canvas(document.body).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = 'sudoku-result.png';
                    link.href = imgData;
                    link.click();
                    location.reload();
                });
            });
        }
    });
}

// ----- Sudoku Initial Animation ----- //
function generateInitialSudoku() {
    otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    generateSudoku(3, otherNumbers);
    createSudokuGrid(false, document.getElementById("sudoku-grid"), true, otherNumbers);
}

function startSudokuAnimation() {
    sudokuAnimationInterval = setInterval(() => {
        generateInitialSudoku()
    }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
    generateInitialSudoku();
    startSudokuAnimation();
});

// ---- Sudoku Timer ------ //
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const minutes = Math.floor(elapsedTime / (60 * 1000));
    const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
    const milliseconds = elapsedTime % 1000;

    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

function startTimer(){
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 10);
}

