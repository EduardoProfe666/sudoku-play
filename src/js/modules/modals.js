// ------------------------ Modals ---------------------- //
import {stopSudokuAnimation} from "./common/sudoku-animations";
import {generateSudoku} from "./main-engine";
import {createSudokuGrid} from "./sudoku-grid-creation";
import {startTimer} from "./common/timer";
import {initialNumbers} from "./common/global-state-storage";
import {restartGame} from "./common/game-restarter";
import {startConfetti} from "./common/confetti";

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
export function prepareModalAutoFill(){
    document.getElementById("auto-fill-button").addEventListener("click", () => {
        let difficulty = 0;

        Swal.fire({
            title: 'Choose the game\'s difficulty',
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
                startGame(result.value)
                localStorage.setItem('sudokuDifficulty', result.value);
                localStorage.setItem('sudokuGameMode', 'auto');
            }
        });
    });
}


// ------------ Modal Manual-Fill ----------- //
export function prepareModalManualFill(){
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


// ------------ Modal Winning-Congrats!!! --------------- //
export function showWinningModal() {
    const timeDisplay = document.getElementById("timer-display").textContent;
    const difficulty = localStorage.getItem('sudokuDifficulty') || 'Unknown';
    const gameMode = localStorage.getItem('sudokuGameMode') || 'Unknown';

    let difficultyStars = '';
    if (gameMode === 'auto') {
        const stars = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];
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
        confirmButtonText: 'Restart Game',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            const restartButton = Swal.getConfirmButton();
            restartButton.addEventListener('click', () => {
                restartGame();
            });
            startConfetti();
        }
    })
}