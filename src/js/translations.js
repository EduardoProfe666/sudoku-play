const translations = {
    en: {
        title: "Sudoku Game",
        message: "Choose the game's fill mode",
        autoFillButton: "<i class='fas fa-magic'></i> Auto Fill",
        manualFillButton: "<i class='fas fa-pencil-alt'></i> Manual Fill",
        timer: "Elapsed Time: ",
        surrender: "Surrender",
        help: "Help",
        gameOverTitle: "☠️ Game Over ☠️",
        gameOverText: "Elapsed Time: ",
        gameOverFillMode: "Fill Mode: ",
        gameOverDifficulty: "Difficulty: ",
        winningTitle: "🎉 You Win! 🎉",
        winningText: "Elapsed Time: ",
        winningFillMode: "Fill Mode: ",
        winningDifficulty: "Difficulty: ",
        restartGame: "<i class='fas fa-redo'></i> Restart Game",
        language: "Language"
    },
    es: {
        title: "Juego del Sudoku",
        message: "Elige el modo de relleno del juego",
        autoFillButton: "<i class='fas fa-magic'></i> Relleno Automático",
        manualFillButton: "<i class='fas fa-pencil-alt'></i> Relleno Manual",
        timer: "Tiempo Transcurrido: ",
        surrender: "Rendirse",
        help: "Ayuda",
        gameOverTitle: "☠️ Fin del Juego ☠️",
        gameOverText: "Tiempo Transcurrido: ",
        gameOverFillMode: "Modo de Relleno: ",
        gameOverDifficulty: "Dificultad: ",
        winningTitle: "🎉 ¡Ganaste! 🎉",
        winningText: "Tiempo Transcurrido: ",
        winningFillMode: "Modo de Relleno: ",
        winningDifficulty: "Dificultad: ",
        restartGame: "<i class='fas fa-redo'></i> Reiniciar Juego",
        language: "Idioma"
    },
    fr: {
        title: "Jeu de Sudoku",
        message: "Choisissez le mode de remplissage du jeu",
        autoFillButton: "<i class='fas fa-magic'></i> Remplissage Automatique",
        manualFillButton: "<i class='fas fa-pencil-alt'></i> Remplissage Manuel",
        timer: "Temps écoulé: ",
        surrender: "Abandonner",
        help: "Aide",
        gameOverTitle: "☠️ Fin de la Partie ☠️",
        gameOverText: "Temps écoulé: ",
        gameOverFillMode: "Mode de Remplissage: ",
        gameOverDifficulty: "Difficulté: ",
        winningTitle: "🎉 Vous avez gagné! 🎉",
        winningText: "Temps écoulé: ",
        winningFillMode: "Mode de Remplissage: ",
        winningDifficulty: "Difficulté: ",
        restartGame: "<i class='fas fa-redo'></i> Recommencer le Jeu",
        language: "Langue"
    }
};

let currentLanguage = 'en';

function translatePage() {
    document.getElementById('title').innerText = translations[currentLanguage].title;
    document.getElementById('message').innerText = translations[currentLanguage].message;
    document.getElementById('auto-fill-button').innerHTML = translations[currentLanguage].autoFillButton;
    document.getElementById('manual-fill-button').innerHTML = translations[currentLanguage].manualFillButton;
    document.getElementById('timer').innerHTML = `<span id="time-emoji">⏱️</span> ${translations[currentLanguage].timer} <span id="timer-display">00:00:000</span>`;
}