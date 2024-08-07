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
let notes = Array.from({length: 9}, () => Array.from({length: 9}, () => Array(9).fill(false)));
let currentNotesMenu = null;
let errorsCommitted = 0;
const maxErrors = {
    1: 5,
    2: 4,
    3: 3,
    4: 2,
    5: 1
};
const soundClick = new Audio('public/audio/click.mp3');
const soundWin = new Audio('public/audio/game-win.mp3');
const soundOver = new Audio('public/audio/game-over.mp3');
const soundStart = new Audio('public/audio/game-start.mp3');

function destroyGlobalValues(){
    initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    startTime = undefined;

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
    const duration = 10 * 1000;
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

// ---------------------------------------------- Notes ---------------------------------------------------------- //
function showNotesMenu(cell, event, row, col) {
    if (currentNotesMenu) {
        currentNotesMenu.remove();
    }

    const notesMenu = document.createElement("div");
    notesMenu.classList.add("notes-menu");
    notesMenu.style.position = "fixed";

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = event.clientX;
    let top = event.clientY;

    const menuWidth = 200;
    const menuHeight = 200;

    if (left + menuWidth > screenWidth) {
        left = screenWidth - menuWidth - 10;
    }

    if (top + menuHeight > screenHeight) {
        top = screenHeight - menuHeight - 10;
    }

    notesMenu.style.left = `${left}px`;
    notesMenu.style.top = `${top}px`;

    for (let i = 1; i <= 9; i++) {
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");
        noteItem.textContent = i;
        if (notes[row][col][i - 1]) {
            noteItem.classList.add("note-active");
        }
        noteItem.addEventListener("click", () => {
            notes[row][col][i - 1] = !notes[row][col][i - 1];
            renderNotes(cell, notes[row][col]);
            noteItem.classList.toggle("note-active");
        });
        notesMenu.appendChild(noteItem);
    }

    document.body.appendChild(notesMenu);
    currentNotesMenu = notesMenu;

    document.addEventListener("click", function closeNotesMenu(e) {
        if (!notesMenu.contains(e.target)) {
            notesMenu.remove();
            currentNotesMenu = null;
            document.removeEventListener("click", closeNotesMenu);
        }
    });
}

function renderNotes(cell, notes) {
    cell.innerHTML = "";
    const notesGrid = document.createElement("div");
    notesGrid.classList.add("notes-grid");

    notes.forEach((note, index) => {
        if (note) {
            const noteCell = document.createElement("div");
            noteCell.classList.add("note-cell");
            noteCell.textContent = index + 1;
            notesGrid.appendChild(noteCell);
        }
    });

    cell.appendChild(notesGrid);
}

function enableNotes() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            showNotesMenu(cell, event, row, col);
        });

        cell.addEventListener("dblclick", function (event) {
            event.preventDefault();
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            showNotesMenu(cell, event, row, col);
        });
    });
}

function disableNotes() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.removeEventListener("contextmenu", showNotesMenu);
        cell.removeEventListener("dblclick", showNotesMenu);
    });
}

// ----------------------------------------- Conflicts ------------------------------------------------------------ //
function highlightConflicts(numbers, difficulty) {

    const conflicts = findConflicts(numbers);

    if (difficulty === 5) {
        errorsCommitted += conflicts.length;
        if (errorsCommitted >= maxErrors[difficulty]) {
            showGameOverModal();
        }
    }
    else {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.classList.remove('conflict'));
        conflicts.forEach(([row, col]) => {
            const cell = document.querySelector(`.cell:nth-child(${row * 9 + col + 1})`);
            if (cell) cell.classList.add('conflict');
        });
    }
}

function findConflicts(numbers) {
    const conflicts = new Set();
    const rows = Array.from({length: 9}, () => new Map());
    const cols = Array.from({length: 9}, () => new Map());
    const boxes = Array.from({length: 9}, () => new Map());

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = parseInt(numbers[row][col]);
            if (num !== 0) {
                const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

                if (rows[row].has(num) || cols[col].has(num) || boxes[boxIndex].has(num)) {
                    conflicts.add(`${row},${col}`);
                    if (rows[row].has(num)) {
                        rows[row].get(num).forEach(pos => conflicts.add(pos));
                    }
                    if (cols[col].has(num)) {
                        cols[col].get(num).forEach(pos => conflicts.add(pos));
                    }
                    if (boxes[boxIndex].has(num)) {
                        boxes[boxIndex].get(num).forEach(pos => conflicts.add(pos));
                    }
                }

                if (!rows[row].has(num)) rows[row].set(num, new Set());
                if (!cols[col].has(num)) cols[col].set(num, new Set());
                if (!boxes[boxIndex].has(num)) boxes[boxIndex].set(num, new Set());

                rows[row].get(num).add(`${row},${col}`);
                cols[col].get(num).add(`${row},${col}`);
                boxes[boxIndex].get(num).add(`${row},${col}`);
            }
        }
    }

    return Array.from(conflicts).map(pos => pos.split(',').map(Number));
}


// ------------------------------------ Sudoku Grid Creation ------------------------------------------------------ //
function createSudokuGrid(editable = true, grid = document.getElementById("sudoku-grid"), initial = false, numbers = initialNumbers, difficulty = 0 ) {
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
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (!editable && numbers[row][col] !== 0) {
                cell.classList.add("initial");
                cell.textContent = numbers[row][col];
            } else {
                cell.contentEditable = numbers[row][col] === 0 ? true : editable;
                cell.inputMode = 'decimal';
                cell.addEventListener("input", function () {
                    const value = this.textContent;
                    if (!/^\d$/.test(value)) {
                        this.textContent = "";
                        numbers[row][col] = 0;
                        notes[row][col] = Array(9).fill(false);
                        renderNotes(cell, notes[row][col]);
                        highlightConflicts(numbers, difficulty);
                        checkMistake(difficulty, row,  col);
                    } else {
                        numbers[row][col] = value;
                        notes[row][col] = Array(9).fill(false);
                        this.innerHTML = value;
                        highlightConflicts(numbers, difficulty);
                        checkMistake(difficulty, row,  col);
                    }
                    if (isSudokuSolved(numbers)) {
                        stopTimer();
                        showWinningModal();
                    } else {
                        updateNumberDock(numbers);
                    }
                });

                if (numbers[row][col] === 0) {
                    renderNotes(cell, notes[row][col]);
                }
            }
            grid.appendChild(cell);
        }
    }

}

// ---------------------------- Game Over ------------------------------------------------------------------------- //
function checkMistake(difficulty, row, col) {
    const currentValue = parseInt(initialNumbers[row][col]);
    if (currentValue !== 0 && currentValue !== solution[row][col]) {
        if (difficulty === 5) {
            errorsCommitted++;
        } else {

            const numbersCopy = initialNumbers.map(row => row.slice());
            numbersCopy[row][col] = currentValue;
            const conflicts = findConflicts(numbersCopy);
            const currentCellConflict = conflicts.some(([r, c]) => r === row && c === col);
            if (!currentCellConflict) {
                errorsCommitted++;
            }
        }

        if (errorsCommitted >= maxErrors[difficulty]) {
            showGameOverModal();
        }
    }
}


// --------------------------------------------------- Modals ---------------------------------------------------- //
// -------- Common Stuff ------- //
function startGame(difficulty, grid) {
    stopSudokuAnimation();
    stopTimer();
    errorsCommitted = 0;
    if (difficulty)
        generateSudoku(difficulty)

    if (grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                solution[row][col] = grid[row][col];
            }
        }
    }

    createSudokuGrid(false, document.getElementById("sudoku-grid"), false, initialNumbers, difficulty ? parseInt(difficulty) : 1);

    document.getElementById("auto-fill-button").style.display = "none";
    document.getElementById("manual-fill-button").style.display = "none";
    document.getElementById("message").style.display = "none";
    document.getElementById("timer").style.display = "block";
    document.getElementById("surrender-button").style.display = "block";

    if (difficulty !== 5) {
        document.getElementById("number-dock").style.display = "flex";
        enableNotes();
    } else {
        document.getElementById("number-dock").style.display = "none";
        disableNotes();
    }

    startTimer();
}

// ----------------------- Help Modal --------------------- //
function showHelpModal() {
    Swal.fire({
        title: 'Sudoku Help',
        icon: 'info',
        html: `
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <button id="tab1" class="tab-button active">Basic Rules</button>
                <button id="tab2" class="tab-button">Assistance Types</button>
            </div>
            <div id="tab1Content" class="tab-content" style="display: block;">
                <p>🧩 <strong>Basic Rules of Sudoku</strong></p>
                <ul>
                    <li>Each row must contain the numbers from 1 to 9, without repetitions.</li>
                    <li>Each column must contain the numbers from 1 to 9, without repetitions.</li>
                    <li>Each block must contain the numbers from 1 to 9, without repetitions.</li>
                    <li>The sum of all numbers in any complete row, column, or block is always 45.</li>
                </ul>
            </div>
            <div id="tab2Content" class="tab-content" style="display: none;">
                <p>🛠️ <strong>Assistance Types</strong></p>
                <ul>
                    <li><strong>Remaining Numbers Dock:</strong> Indicates required grid numbers, highlighting used digits. Exhausted numbers are marked, and overlimit digits turn red.</li>
                    <li><strong>Notes:</strong> Allows you to take notes on possible numbers for each cell.</li>
                    <li><strong>Conflicts:</strong> Highlights cells that contain numbers causing conflicts in their row, column, or block.</li>
                </ul>
            </div>
        `,
        preConfirm: () => {
            soundClick.play();
            return true;
        },
        showCancelButton: false,
        confirmButtonText: '<i class="fas fa-close"></i> Close',
        didOpen: () => {
            const tabButtons = document.querySelectorAll('.tab-button');
            const tabContents = document.querySelectorAll('.tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    soundClick.play();
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabContents.forEach(content => content.style.display = 'none');

                    button.classList.add('active');
                    document.getElementById(button.id + 'Content').style.display = 'block';
                });
            });
        }
    });
}

// --------- Modal Game-Over ----------- //
function showGameOverModal() {
    const timeDisplay = document.getElementById("timer-display").textContent;
    const difficulty = localStorage.getItem('sudokuDifficulty') || 'Unknown';
    const gameMode = localStorage.getItem('sudokuGameMode') || 'Unknown';

    let difficultyStars = '';
    if (gameMode === 'auto') {
        const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', "⭐⭐⭐⭐⭐"];
        difficultyStars = stars[difficulty - 1] || 'Unknown';
    }

    let image = 'public/0.png';
    if(gameMode === 'auto'){
        const images = [
            'public/easy.png',
            'public/medium.png',
            'public/hard.png',
            'public/expert.png',
            'public/insane.png',
        ];
        image = images[difficulty - 1] || 'public/0.png';
    }


    Swal.fire({
        title: '☠️ Game Over ☠️',
        icon: 'error',
        html: `
            <div style="display: flex; justify-content: center; margin: 10px;">
                <div style="display: flex; justify-content: center; align-items: center; width: 175px; height: 175px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background: linear-gradient(135deg, #f5f7fa, #c3cfe2);">
                    <img id="difficulty-image" src="${image}" alt="Difficulty Image" style="width: 150px; height: 150px; border-radius: 5px;">
                </div>
            </div>
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
            navigator.vibrate(3000);
            soundOver.play();
        }
    });
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
                <div id="difficulty-info" style="margin-top: 20px; text-align: center;"></div>
                <i class="fas fa-star" id="star1" style="cursor: pointer; color: grey;"></i>
                <i class="fas fa-star" id="star2" style="cursor: pointer; color: grey;"></i>
                <i class="fas fa-star" id="star3" style="cursor: pointer; color: grey;"></i>
                <i class="fas fa-star" id="star4" style="cursor: pointer; color: grey;"></i>
                <i class="fas fa-star" id="star5" style="cursor: pointer; color: grey;"></i>
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
                const difficultyInfo = document.getElementById('difficulty-info');

                const images = [
                    'public/0.png',
                    'public/easy.png',
                    'public/medium.png',
                    'public/hard.png',
                    'public/expert.png',
                    'public/insane.png',
                ];

                const difficultyNames = [
                    '',
                    'Easy',
                    'Medium',
                    'Hard',
                    'Expert',
                    'Insane'
                ];

                const errors = [
                    '',
                    '5',
                    '4',
                    '3',
                    '2',
                    '1'
                ];

                const updateDifficultyInfo = (index) => {
                    if (index === 5) {
                        difficultyInfo.innerHTML = `
                            <p>Name: <strong>${difficultyNames[index]}</strong> 🌟</p>  
                            <p>Level of Generated Puzzle: <strong>${difficultyNames[index-1]}</strong> 🧠</p>
                            <p>Quantity of possible errors to commit: <strong>${errors[index]}</strong> ❌</p>
                            <p>No Assistance nor Help 🚫🆘</p>
                            <p>The concept errors are count as errors to commit ❌</p>
                        `;
                    } else if(index === 0) {
                        difficultyInfo.innerHTML = `
                            <p>Name: <strong>-</strong> 🌟</p>
                            <p>Level of Generated Puzzle: <strong>-</strong> 🧠🧩</p>
                            <p>Quantity of possible errors to commit: <strong>-</strong> ❌</p>
                            <p>Assistance and Help ✅</p>
                            <p>The concept errors aren't count as errors to commit ✅</p>
                        `;
                    } else {
                        difficultyInfo.innerHTML = `
                            <p>Name: <strong>${difficultyNames[index]}</strong> 🌟</p>
                            <p>Level of Generated Puzzle: <strong>${difficultyNames[index]}</strong> 🧠🧩</p>
                            <p>Quantity of possible errors to commit: <strong>${errors[index]}</strong> ❌</p>
                            <p>Guidance and Help ✅</p>
                            <p>The concept errors aren't count as errors to commit ✅</p>
                        `;
                    }
                };

                difficultyImage.src = images[0];
                difficultyImage.style.display = 'block';
                updateDifficultyInfo(0);

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
                        updateDifficultyInfo(difficulty);
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
                        updateDifficultyInfo(index + 1);
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
                        updateDifficultyInfo(difficulty);
                    });
                });
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

    let image = 'public/0.png';
    if(gameMode === 'auto'){
        const images = [
            'public/easy.png',
            'public/medium.png',
            'public/hard.png',
            'public/expert.png',
            'public/insane.png',
        ];
        image = images[difficulty - 1] || 'public/0.png';
    }

    Swal.fire({
        title: '🎉 You Win! 🎉',
        icon: 'success',
        html: `
            <div style="display: flex; justify-content: center; margin: 10px;">
                <div style="display: flex; justify-content: center; align-items: center; width: 175px; height: 175px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background: linear-gradient(135deg, #f5f7fa, #c3cfe2);">
                    <img id="difficulty-image" src="${image}" alt="Difficulty Image" style="width: 150px; height: 150px; border-radius: 5px;">
                </div>
            </div>
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
    document.getElementById("surrender-button").style.display = "none";

    stopConfetti();
    stopSudokuAnimation();
    stopTimer();

    generateInitialSudoku();
    startSudokuAnimation();

    notes = Array.from({length: 9}, () => Array.from({length: 9}, () => Array(9).fill(false)));
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

    document.getElementById('help-button').addEventListener('click', () => {showHelpModal(); soundClick.play();});
    document.getElementById('surrender-button').addEventListener('click', () => {
        soundClick.play();
        showGameOverModal();
    });

    // --------------------------------------- Surrender Button Functionality ------------------------------------------- //
    document.getElementById('surrender-button').addEventListener('click', () => {
        soundClick.play();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '<i class="fas fa-flag"></i>  Yes, surrender!',
            cancelButtonText: '<i class="fas fa-times"></i> No, cancel!'
        }).then((result) => {
            if (result.isConfirmed) {
                soundClick.play();
                showGameOverModal();
            }
        });
    });
});
