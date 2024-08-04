// ---------------------------- Global State Storage (kinda!!) ----------------------------------------------- //
export let initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));

export let otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));

export let sudokuAnimationInterval;

export let startTime;

export let timerInterval;

export let intervalConfetti;

export function destroyGlobalValues(){
    initialNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    otherNumbers = Array.from({length: 9}, () => Array(9).fill(0));
    sudokuAnimationInterval = undefined;
    startTime = undefined;
    timerInterval = undefined;

    localStorage.setItem('sudokuDifficulty', undefined);
    localStorage.setItem('sudokuGameMode', undefined);
    localStorage.setItem('sudokuGameMode', undefined);
}
