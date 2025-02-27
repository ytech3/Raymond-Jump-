/*
 Displays the Game Over panel when the player loses.
 Pauses the game and stops all movement.
 Displays the final score with an animated counter. Awards medals and a trophy based on the player's performance.
 Shows a leaderboard with the top scores. Provides a "Play Again" button to restart.
 Includes legal links for additional information.
 */

import { updateHighScores } from '../utils/scoreManager.js';

export function showGameOverPanel(scene) {
    //Pause the game
    scene.physics.pause();
    scene.isGroundMoving = false;
    scene.tubeSpawner.paused = true;
    scene.hotdogSpawner.paused = true;
    scene.baseballSpawner.paused = true;

    //Determine Rewards
    const score = scene.score;
    const allTeamsCollected = scene.scheduleIndex === 0;
    const highScores = updateHighScores(scene.userID, scene.score);

    const isUserOnLeaderboard = highScores.some(entry => entry.userID === scene.userID && entry.score === scene.score);

    const tableRows = highScores.map((entry, index) => {
        const isCurrentUserHighScore = entry.userID === scene.userID && entry.score === scene.score;
        return `
            <tr class="${isCurrentUserHighScore ? 'highlight-row' : ''}">
                <td>${entry.userID}</td>
                <td>${entry.score}</td>
            </tr>`;
    }).join('');

    //Game Over panel
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');

    overlay.innerHTML = `
        <div class="game-over-panel">
            <h1>GAME OVER</h1>
            <p>Total score: <span id="animated-score">0</span></p>
            <div class="medal-container">
                <img src="assets/gold.png" id="gold-medal" class="medal" alt="Gold Medal">
                <img src="assets/silver.png" id="silver-medal" class="medal" alt="Silver Medal">
                <img src="assets/bronze.png" id="bronze-medal" class="medal" alt="Bronze Medal">
            </div>
            <div class="trophy-container">
                <img src="assets/trophy.png" id="trophy" class="trophy" alt="Trophy">
            </div>
            <table class="high-score-table">
                <thead>
                    <tr>
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
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/privacy-policy')">MLB Privacy Policy</button>
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
            if (currentScore >= 50 && !bronzeMedal.classList.contains('bright')) {
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
            if (scene.trophyCollected) {
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

/*
 Adds animation effects to medals and trophies.
 Makes the element brighter.
 Adds a temporary animation effect. Removes the animation class after 1 second.
 */
function triggerMedalAnimation(medal) {
    medal.classList.add('bright', 'animated');
    setTimeout(() => {
        medal.classList.remove('animated');
    }, 1000);
}
