/*
 Creates and displays the pause panel in the game.
 Displays point values for collectibles (logos, hotdogs, baseballs).
 Provides legal links for users.
 Includes a "Resume" button to continue the game.
 */

export function createPausePanel(scene) {
    const overlay = document.createElement('div');
    overlay.classList.add('pause-overlay');

    //Add legal links to overlay
    overlay.innerHTML = `
        <div class="content-box">
            <h1>PAUSED</h1>

            <!-- Collectible Logo Section -->
            <div class="info-row">
                <img src="assets/astros.png" alt="Team Logo" class="info-image">
                <div class="info-text-container">
                    <p class="info-text">Team logo</p>
                    <p class="info-text">+50 points</p>
                </div>
            </div>

            <!-- Hotdog Section -->
            <div class="info-row">
                <img src="assets/hot_dog.png" alt="Hotdog" class="info-image">
                <div class="info-text-container">
                    <p class="info-text">Hotdog</p>
                    <p class="info-text">+20 points</p>
                </div>
            </div>

            <!-- Baseball Section -->
            <div class="info-row">
                <img src="assets/baseball.png" alt="Baseball" class="info-image">
                <div class="info-text-container">
                    <p class="info-text">Baseball</p>
                    <p class="info-text">+10 points</p>
                </div>
            </div>

            <button class="resume-button">Resume</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/app/ballpark/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    //Event listener for the "Resume" button
    const resumeButton = overlay.querySelector('.resume-button');
    resumeButton.addEventListener('click', () => {
        overlay.remove();
        scene.physics.resume();
        scene.isGroundMoving = true;
        scene.tubeSpawner.paused = false;
        scene.baseballSpawner.paused = false;
        scene.hotdogSpawner.paused = false;
        scene.gameStarted = true;
    });

    //Pause the game
    scene.physics.pause();
    scene.isGroundMoving = false;
    scene.hotdogSpawner.paused = true;
    scene.baseballSpawner.paused = true;
    scene.tubeSpawner.paused = true;
    scene.gameStarted = false;
}
