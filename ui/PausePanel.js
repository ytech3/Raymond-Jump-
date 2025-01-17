export function createPausePanel(scene) {
    const overlay = document.createElement('div');
    overlay.classList.add('pause-overlay');

    //Add legal links to overlay
    overlay.innerHTML = `
        <div class="content-box">
            <h1>PAUSED</h1>
            <button class="resume-button">Resume</button>
            <div class="legal-links-container">
                <button class="legal-link" onclick="window.open('https://www.mlb.com/rays/official-information/contact')">Support</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/terms-of-use')">MLB TOU</button>
                <button class="legal-link" onclick="window.open('https://www.mlb.com/official-information/privacy-policy')">MLB Privacy Policy</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    //Event listener for the "Resume" button
    const resumeButton = overlay.querySelector('.resume-button');
    resumeButton.addEventListener('click', () => {
        overlay.remove();
        scene.physics.resume();
        scene.tubeSpawner.paused = false;
        scene.gameStarted = true;
    });

    //Pause the game
    scene.physics.pause();
    scene.tubeSpawner.paused = true;
    scene.gameStarted = false;
}