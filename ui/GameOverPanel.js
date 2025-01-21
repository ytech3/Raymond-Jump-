import { updateHighScores } from '../utils/scoreManager.js';

export function showGameOverPanel(scene) {
    //Pause the game
    scene.physics.pause();
    scene.tubeSpawner.paused = true;
    scene.hotdogSpawner.paused = true;
    scene.starSpawner.paused = true;

    //Determine Rewards
    const score = scene.score;
    const allTeamsCollected = scene.scheduleIndex === 0;
    const highScores = updateHighScores(scene.userID, scene.score);

    const tableRows = highScores.map(
        (entry, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${entry.userID}</td>
            <td>${entry.score}</td>
        </tr>`
    ).join('');

    //Game Over panel
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');

    overlay.innerHTML = `
        <div class="game-over-panel">
            <h2>Game Over!</h2>
            <p>Your Score: <span id="animated-score">0</span></p>
            <div class="medal-container">
                <img src="assets/bronze.png" id="bronze-medal" class="medal" alt="Bronze Medal">
                <img src="assets/silver.png" id="silver-medal" class="medal" alt="Silver Medal">
                <img src="assets/gold.png" id="gold-medal" class="medal" alt="Gold Medal">
            </div>
            <div class="trophy-container">
                <img src="assets/trophy.png" id="trophy" class="trophy" alt="Trophy">
            </div>
            <table class="high-score-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            <button class="game-over-play-again">Play Again</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;


    document.body.appendChild(overlay);

    //Medals and Trophy Elements
    const bronzeMedal = overlay.querySelector('#bronze-medal');
    const silverMedal = overlay.querySelector('#silver-medal');
    const goldMedal = overlay.querySelector('#gold-medal');
    const trophy = overlay.querySelector('#trophy');

    // Animate the score count
    const animatedScore = overlay.querySelector('#animated-score');
    let currentScore = 0;
    const increment = Math.ceil(scene.score / 100);
    const scoreInterval = setInterval(() => {
        if (currentScore < scene.score) {
            currentScore += increment;
            animatedScore.textContent = Math.min(currentScore, scene.score);

            //Handle Medal Animations
            if (currentScore >= 0 && !bronzeMedal.classList.contains('bright')) {
                triggerMedalAnimation(bronzeMedal);
            }
            if (currentScore >= 3500 && !silverMedal.classList.contains('bright')) {
                triggerMedalAnimation(silverMedal);
            }
            if (currentScore >= 7500 && !goldMedal.classList.contains('bright')) {
                triggerMedalAnimation(goldMedal);
            }
        } else {
            clearInterval(scoreInterval);

            //If all teams collected, brighten trophy
            if (scene.scheduleIndex === 0){
                triggerMedalAnimation(trophy);
            }
        }
    }, 20);

    //Restart the game on button click
    const playAgainButton = overlay.querySelector('.game-over-play-again');
    playAgainButton.addEventListener('click', () => {
        overlay.remove();
        scene.restartGame();
    });
}

function triggerMedalAnimation(medal) {
    medal.classList.add('bright', 'animated');
    setTimeout(() => {
        medal.classList.remove('animated');
    }, 1000); // Animation duration
}