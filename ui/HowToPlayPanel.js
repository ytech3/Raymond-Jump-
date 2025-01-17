export function createHowToPlayOverlay(scene) {
    const overlay = document.createElement('div');
    overlay.classList.add('how-to-play-overlay');

    overlay.innerHTML = `
        <div class="content-box">
            <h1>HOW TO PLAY</h1>
            <p>Tap the screen to make Raymond jump.</p>
            <p>Avoid obstacles and collect opponents for points!</p>
            <div class="checkbox-container">
                <input type="checkbox" id="agreeCheckbox">
                <label for="agreeCheckbox">I agree to the game rules</label>
            </div>
            <button class="start-button" disabled>Start Game</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const checkbox = overlay.querySelector('#agreeCheckbox');
    const startButton = overlay.querySelector('.start-button');

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
