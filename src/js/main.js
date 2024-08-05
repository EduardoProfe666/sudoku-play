// ---------------------------- Global State Storage (kinda!!) ---------------------------------------------------- //
let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let solution = Array.from({length: 9}, () => Array(9).fill(0));
let sudokuAnimationInterval;
let startTime;
let timerInterval;
let intervalConfetti;

function destroyGlobalValues(){
    initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    sudokuAnimationInterval = undefined;
    startTime = undefined;
    timerInterval = undefined;

    localStorage.setItem('sudokuDifficulty', undefined);
    localStorage.setItem('sudokuGameMode', undefined);
    localStorage.setItem('sudokuGameMode', undefined);
}


//----------------------------------------------- Confetti -------------------------------------------------------//
function startConfetti(){
    const duration = 10 * 1000; // 10 segs
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 120, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }
    intervalConfetti = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(intervalConfetti);
        }

        const particleCount = 30 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function stopConfetti(){
    clearInterval(intervalConfetti)
}



// -------------------------------------------------------- Timer -------------------------------------------------- //
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const minutes = Math.floor(elapsedTime / (60 * 1000));
    const seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
    const milliseconds = elapsedTime % 1000;

    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
}

function stopTimer(){
    clearInterval(timerInterval);
}

function startTimer(){
    startTime = new Date().getTime();
    timerInterval = setInterval(updateTimer, 10);
}


// ------------------------------------ Sudoku Grid Creation ------------------------------------------------------ //
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
                        stopTimer   ();
                        showWinningModal();
                    }
                });
            }
            grid.appendChild(cell);
        }
    }
}


// --------------------------------------------------- Modals ---------------------------------------------------- //
// -------- Common Stuff ------- //
function startGame(difficulty) {
    stopSudokuAnimation();
    if(difficulty)
        generateSudoku(difficulty)

    createSudokuGrid(false);

    document.getElementById("auto-fill-button").style.display = "none";
    document.getElementById("manual-fill-button").style.display = "none";
    document.getElementById("message").style.display = "none";
    document.getElementById("timer").style.display = "block";

    startTimer();
}


// -------- Modal Auto-Fill -------- //
function prepareModalAutoFill(){
    document.getElementById("auto-fill-button").addEventListener("click", () => {
        let difficulty = 0;

        Swal.fire({
            title: 'Choose the game\'s difficulty',
            icon: 'question',
            html: `
            <i class="fas fa-star" id="star1" style="cursor: pointer; color: grey;" title="Easy"></i>
            <i class="fas fa-star" id="star2" style="cursor: pointer; color: grey;" title="Medium"></i>
            <i class="fas fa-star" id="star3" style="cursor: pointer; color: grey;" title="Hard"></i>
            <i class="fas fa-star" id="star4" style="cursor: pointer; color: grey;" title="Expert"></i>
        `,
            showCancelButton: false,
            confirmButtonText: '<i class="fas fa-play"></i> Start Game',
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
                startGame(result.value)
                localStorage.setItem('sudokuDifficulty', result.value);
                localStorage.setItem('sudokuGameMode', 'auto');
            }
        });
    });
}


// ------------ Modal Manual-Fill ----------- //
function prepareModalManualFill(){
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
            confirmButtonText: '<i class="fas fa-play"></i> Start Game',
            didOpen: () => {
                initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
                const manualGrid = document.getElementById("manual-sudoku-grid");
                createSudokuGrid(true, manualGrid);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                startGame();
                localStorage.setItem('sudokuGameMode', 'manual');
            }
        });
    });
}


// ----------------- Modal Winning-Congrats!!! -------------------------- //
function showWinningModal() {
    const timeDisplay = document.getElementById("timer-display").textContent;
    const difficulty = localStorage.getItem('sudokuDifficulty') || 'Unknown';
    const gameMode = localStorage.getItem('sudokuGameMode') || 'Unknown';

    let difficultyStars = '';
    if (gameMode === 'auto') {
        const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐'];
        difficultyStars = stars[difficulty - 1] || 'Unknown';
    }

    Swal.fire({
        title: '¡Congratulations!\nYou complete sudoku',
        icon: 'success',
        html: `
            <p>Elapsed Time: <strong>${timeDisplay}</strong></p>
            <p>Fill Mode: <strong>${gameMode === 'auto' ? 'Auto ' : 'Manual'}</strong></p>
            ${gameMode === 'auto' ? `<p>Difficulty: <strong>${difficultyStars}</strong></p>` : ''}
        `,
        confirmButtonText: '<i class="fas fa-redo"></i> Restart Game',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            const restartButton = Swal.getConfirmButton();
            restartButton.addEventListener('click', () => {
                restartGame();
            });
            startConfetti();
            navigator.vibrate(3000);
        }
    })
}


// -------------------------------------- Sudoku Initial Animation --------------------------------------------- //
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

function stopSudokuAnimation(){
    clearInterval(sudokuAnimationInterval);
}

// -------------------------------------- Restart Game ---------------------------------------------------------- //
function restartGame(){
    destroyGlobalValues();

    document.getElementById("auto-fill-button").style.display = "block";
    document.getElementById("manual-fill-button").style.display = "block";
    document.getElementById("message").style.display = "block";
    document.getElementById("timer").style.display = "none";

    stopConfetti();

    generateInitialSudoku();
    startSudokuAnimation();
}


// ------------------------------------------ Initialization ---------------------------------------------------- //
document.addEventListener("DOMContentLoaded", () => {
    prepareModalManualFill();
    prepareModalAutoFill();
    generateInitialSudoku();
    startSudokuAnimation();
});
