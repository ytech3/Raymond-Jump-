export function showGameOverPanel(scene) {
    //Pause the game
    scene.physics.pause();
    scene.tubeSpawner.paused = true;
    scene.hotdogSpawner.paused = true;
    scene.starSpawner.paused = true;

    //Game Over panel
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');

    overlay.innerHTML = `
        <div class="game-over-panel">
            <h2>Game Over!</h2>
            <p>Your Score: ${scene.score}</p>
            <button class="game-over-play-again">Play Again</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    //Restart the game on button click
    const playAgainButton = overlay.querySelector('.game-over-play-again');
    playAgainButton.addEventListener('click', () => {
        overlay.remove();
        scene.restartGame();
    });
}