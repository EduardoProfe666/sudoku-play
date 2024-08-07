// --------------------------------------- PWA!!! -------------------------------------------------------------- //
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker
            .register("serviceWorker.js")
            .then(res => console.log("service worker registered"))
            .catch(err => console.log("service worker not registered", err))
    })
}

// ---------------------------- Global State Storage (kinda!!) ---------------------------------------------------- //
let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
let solution = Array.from({length: 9}, () => Array(9).fill(0));
let sudokuAnimationInterval;
let startTime;
let timerInterval;
let intervalConfetti;
const soundClick = new Audio('public/audio/click.mp3');
const soundWin = new Audio('public/audio/game-win.mp3');
const soundOver = new Audio('public/audio/game-over.mp3');
const soundStart = new Audio('public/audio/game-start.mp3');

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

// --- JUST FOR TESTING... DELETE IN THE FUTURE --- //
function printSolution(){
    console.table(solution)
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

// ---------------------------------- Number Dock ----------------------------------------------------------------- //
function updateNumberDock(initialNumbers) {
    const numberCounts = Array(10).fill(0);
    initialNumbers.forEach(row => {
        row.forEach(num => {
            if (num !== 0) numberCounts[num]++;
        });
    });

    const numberItems = document.querySelectorAll('#number-dock .number-item');
    numberItems.forEach(item => {
        const number = parseInt(item.getAttribute('data-number'));
        if (numberCounts[number] === 9) {
            item.classList.add('crossed');
            item.classList.remove('red');
        } else if (numberCounts[number] > 9) {
            item.classList.add('red');
            item.classList.remove('crossed');
        } else {
            item.classList.remove('crossed', 'red');
        }
    });
}

function highlightNumber(number) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.textContent.toString() === number.toString()) {
            cell.classList.add('highlight');
        }
    });
}

function resetHighlight() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('highlight');
    });
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
                const input = document.createElement("input");
                input.type = "number";
                input.min = 1;
                input.max = 9;
                input.value = numbers[row][col] === 0 ? "" : numbers[row][col];
                input.addEventListener("input", function () {
                    const value = this.value;
                    if (!/^\d$/.test(value) || value < 1 || value > 9) {
                        this.value = "";
                        numbers[row][col] = 0;
                    } else {
                        numbers[row][col] = parseInt(value);
                    }
                    if (isSudokuSolved(numbers)) {
                        stopTimer();
                        showWinningModal();
                    } else {
                        updateNumberDock(numbers);
                    }
                });
                cell.appendChild(input);
            }
            grid.appendChild(cell);
        }
    }
}


// --------------------------------------------------- Modals ---------------------------------------------------- //
// -------- Common Stuff ------- //
function startGame(difficulty, grid) {
    stopSudokuAnimation();
    if(difficulty)
        generateSudoku(difficulty)

    if(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                solution[row][col] = grid[row][col];
            }
        }
    }

    createSudokuGrid(false);

    document.getElementById("auto-fill-button").style.display = "none";
    document.getElementById("manual-fill-button").style.display = "none";
    document.getElementById("message").style.display = "none";
    document.getElementById("timer").style.display = "block";
    document.getElementById("number-dock").style.display = "flex";


    startTimer();
}


// -------- Modal Auto-Fill -------- //
function prepareModalAutoFill() {
    document.getElementById("auto-fill-button").addEventListener("click", () => {
        soundClick.play();
        let difficulty = 0;

        Swal.fire({
            title: 'Choose the game\'s difficulty',
            icon: 'question',
            html: `
                <div style="display: flex; justify-content: center; margin: 10px;">
                    <div style="display: flex; justify-content: center; align-items: center; width: 175px; height: 175px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background: linear-gradient(135deg, #f5f7fa, #c3cfe2);">
                        <img id="difficulty-image" src="" alt="Difficulty Image" style="display: none; width: 150px; height: 150px; border-radius: 5px;">
                    </div>
                </div>
                <i class="fas fa-star" id="star1" style="cursor: pointer; color: grey;" title="Easy"></i>
                <i class="fas fa-star" id="star2" style="cursor: pointer; color: grey;" title="Medium"></i>
                <i class="fas fa-star" id="star3" style="cursor: pointer; color: grey;" title="Hard"></i>
                <i class="fas fa-star" id="star4" style="cursor: pointer; color: grey;" title="Expert"></i>
                <i class="fas fa-star" id="star5" style="cursor: pointer; color: grey;" title="Insane"></i>
            `,
            showCancelButton: false,
            confirmButtonText: '<i class="fas fa-play"></i> Start Game',
            preConfirm: () => {
                soundClick.play();
                if (difficulty === 0) {
                    Swal.showValidationMessage('You must select a difficulty');
                }
                return difficulty;
            },
            didOpen: () => {
                const stars = document.querySelectorAll('.fa-star');
                const difficultyImage = document.getElementById('difficulty-image');

                const images = [
                    'public/0.png',
                    'public/easy.png',
                    'public/medium.png',
                    'public/hard.png',
                    'public/expert.png',
                    'public/insane.png',
                ];

                stars.forEach((star, index) => {

                    star.addEventListener('click', () => {
                        soundClick.play();
                        difficulty = index + 1;
                        stars.forEach((s, i) => {
                            if (i <= index) {
                                s.style.color = 'gold';
                            } else {
                                s.style.color = 'grey';
                            }
                        });
                        difficultyImage.src = images[difficulty];
                        difficultyImage.style.display = 'block';
                    });

                    star.addEventListener('mouseenter', () => {
                        stars.forEach((s, i) => {
                            if (i <= index) {
                                s.style.color = 'gold';
                            } else {
                                s.style.color = 'grey';
                            }
                        });
                        difficultyImage.src = images[index + 1];
                        difficultyImage.style.display = 'block';
                    });

                    star.addEventListener('mouseleave', () => {
                        stars.forEach((s, i) => {
                            if (i < difficulty) {
                                s.style.color = 'gold';
                            } else {
                                s.style.color = 'grey';
                            }
                        });
                        difficultyImage.src = images[difficulty];
                    });
                });

                difficultyImage.src = 'public/0.png';
            }
        }).then((result) => {
            if (result.isConfirmed) {
                startGame(result.value);
                localStorage.setItem('sudokuDifficulty', result.value);
                localStorage.setItem('sudokuGameMode', 'auto');
                soundStart.play();
            }
        });
    });
}


// ------------ Modal Manual-Fill ----------- //
function prepareModalManualFill(){
    document.getElementById("manual-fill-button").addEventListener("click", () => {
        soundClick.play();
        Swal.fire({
            title: 'Fill the initial numbers',
            icon: "question",
            html: `
            <div id="manual-window">
                <div id="manual-sudoku-grid" style="display: grid; grid-template-columns: repeat(9, 1fr); grid-template-rows: repeat(9, 1fr); gap: 2px; border: 4px solid #000; width: 100%; max-width: 500px; aspect-ratio: 1;"></div>
            </div>
        `,
            showCancelButton: false,
            footer: '<a target="_blank" href="https://www.technologyreview.com/2012/01/06/188520/mathematicians-solve-minimum-sudoku-problem/">Human Solvable Sudoku Article</a>',
            preConfirm: () => {
                soundClick.play();
                if(!isSudokuSolvable(initialNumbers)){
                    Swal.showValidationMessage('Given sudoku must has a unique solution and be human solvable (at least 17 clues)');
                    return false;
                }
                return true;
            },
            confirmButtonText: '<i class="fas fa-play"></i> Start Game',
            didOpen: () => {
                initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
                const manualGrid = document.getElementById("manual-sudoku-grid");
                createSudokuGrid(true, manualGrid);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                startGame(undefined, solveSudoku(initialNumbers.map(row => [...row])));
                localStorage.setItem('sudokuGameMode', 'manual');
                soundStart.play();
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
        const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', "⭐⭐⭐⭐⭐"];
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
            soundWin.play();
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
    soundClick.play();
    destroyGlobalValues();

    document.getElementById("auto-fill-button").style.display = "block";
    document.getElementById("manual-fill-button").style.display = "block";
    document.getElementById("message").style.display = "block";
    document.getElementById("timer").style.display = "none";
    document.getElementById("number-dock").style.display = "none";

    stopConfetti();

    generateInitialSudoku();
    startSudokuAnimation();
}


// ------------------------------------------ Initialization ---------------------------------------------------- //
document.addEventListener("DOMContentLoaded", () => {
    const numberItems = document.querySelectorAll('#number-dock .number-item');

    numberItems.forEach(item => {
        const number = parseInt(item.getAttribute('data-number'));
        item.addEventListener('mouseenter', () => highlightNumber(number));
        item.addEventListener('mouseleave', () => resetHighlight());
        item.addEventListener('touchstart', () => highlightNumber(number));
        item.addEventListener('touchend', () => resetHighlight());
    });

    prepareModalManualFill();
    prepareModalAutoFill();
    generateInitialSudoku();
    startSudokuAnimation();
});
