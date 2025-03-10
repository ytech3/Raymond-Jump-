/*
 Creates and displays the "How to Play" overlay at the start of the game.
 Provides instructions, displays images and text for bonus items.
 Requires the player to agree to the game rules before starting.
 Includes legal links for additional information.
 */

export function createHowToPlayOverlay(scene) {
    const overlay = document.createElement('div');
    overlay.classList.add('how-to-play-overlay');

    overlay.innerHTML = `
        <div class="content-box">
            <img src="assets/rays.png" alt="Rays Logo" class="rays-logo">
            <h1>HOW TO PLAY</h1>
            <p>Tap the screen to make Raymond fly</p>
            <p class="bonus-points">
                <img src="assets/baseball.png" alt="Bonus Item" class="bonus-icon">
                Pickup items for bonus points
                <img src="assets/hot_dog.png" alt="Bonus Item" class="bonus-icon">
            </p>
            <p>Collect all team logos to win the trophy!</p>
            <div class="checkbox-container">
                <input type="checkbox" id="agreeCheckbox">
                <label for="agreeCheckbox">I agree to the game rules</label>
            </div>
            <button class="start-button" disabled>Start Game</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const checkbox = overlay.querySelector('#agreeCheckbox');
    const startButton = overlay.querySelector('.start-button');

    //Enables start button only if checkbox checked
    checkbox.addEventListener('change', () => {
        startButton.disabled = !checkbox.checked;
    });

    startButton.addEventListener('click', () => {
        overlay.remove();
        scene.startGame();
        scene.player.body.allowGravity = true;
        scene.tubeSpawner.paused = false;
    });
}
