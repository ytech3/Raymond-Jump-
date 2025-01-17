// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#87CEEB",
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
        },
    },
};

//Variables
let score = 0;
let scoreText;

//Calculate scale factor relative to screen size
function calculateScale(scene) {
    const baseWidth = 800;
    const baseHeight = 600;

    const scaleX = scene.scale.width / baseWidth;
    const scaleY = scene.scale.height / baseHeight;

    return Math.min(scaleX, scaleY);
}

// Resize game elements when the screen size changes
function resizeGame(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    //Update player position
    this.player.setPosition(width / 4, height / 2);

    const scaleFactor = calculateScale(this);

    const mascotWidth = width * 0.1;
    const mascotHeight = height * 0.1;
    this.player.setDisplaySize(mascotWidth, mascotHeight);

    const tubeWidth = 50 * scaleFactor;
    const tubeHeight = height * 0.5;

    this.tubes.getChildren().forEach((tube) => {
        tube.setDisplaySize(tubeWidth, tubeHeight);
    });

    scoreText.setPosition(width / 2, 20);
    scoreText.setFontSize(24 * scaleFactor);
}

/*
    Creates a pair of tubes and animates until pushed off screen.
    The tubes are scaled relative to the screen size.    
*/
function createTubePair(scene) {
    if (!scene.gameStarted) return;

    const scaleFactor = calculateScale(scene);
    const gapSize = 550 * scaleFactor;
    const tubeWidth = scaleFactor * 80;
    const tubeHeight = scene.scale.height * .7;

    const minY = 100 * scaleFactor;
    const maxY = scene.scale.height - minY - gapSize;
    const gapY = Phaser.Math.Between(minY, maxY);

    // Top tube
    const topTube = scene.tubes.create(scene.scale.width, gapY, 'tube');
    topTube.setOrigin(0.5, 1);
    topTube.setDisplaySize(tubeWidth, tubeHeight);
    topTube.body.setVelocityX(-200);

    // Bottom tube
    const bottomTube = scene.tubes.create(scene.scale.width, gapY + gapSize, 'tube');
    bottomTube.setOrigin(0.5, 0);
    bottomTube.setDisplaySize(tubeWidth, tubeHeight);
    bottomTube.body.setVelocityX(-200);

    //Collectible in center of gap
    const collectible = scene.collectibles.create(scene.scale.width, gapY + gapSize / 2, 'angels');
    collectible.setDisplaySize(200 * scaleFactor, 200 * scaleFactor);
    collectible.body.setVelocityX(-200);
    collectible.setOrigin(0.5, 0.5);
}

//Spawns tubes every 3.5 seconds
function setupTubeSpawner(scene) {
    scene.tubeSpawner = scene.time.addEvent({
        delay: 3500,
        callback: () => createTubePair(scene),
        loop: true,
    });
}

//Destroys off screen tubes
function cleanupTubes(scene) {
    scene.tubes.getChildren().forEach(tube => {
        if (tube.x + tube.width < 0) {
            tube.destroy();
        }
    });
}

//Checks collision between tube and mascot
function setupCollision(scene) {
    scene.physics.add.overlap(scene.player, scene.tubes, () => {
        console.log('Collision detected!');
        scene.gameActive = false;
        showGameOverPanel(scene);
    });

    scene.physics.add.overlap(scene.player, scene.collectibles, (player, collectible) => {
        collectible.destroy(); // Remove collectible
        scene.score += 10; // Increment score
        scene.scoreText.setText(`Score: ${scene.score}`); // Update score text
    });
}

function togglePause(scene) {
    if (!scene.pauseOverlay) {
        scene.pauseOverlay = document.createElement('div');
        scene.pauseOverlay.classList.add('pause-overlay');
        scene.pauseOverlay.innerHTML = `
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
        document.body.appendChild(scene.pauseOverlay);

        //Add functionality to resume button
        const resumeButton = scene.pauseOverlay.querySelector('.resume-button');
        resumeButton.addEventListener('click', () => {
            scene.physics.resume();
            scene.tubeSpawner.paused = false;
            scene.pauseOverlay.remove();
            scene.pauseOverlay = null;
        });

        //Pause the game
        scene.physics.pause();
        scene.tubeSpawner.paused = true;
    }
}

//Initialize the game
const game = new Phaser.Game(config);

function preload() {
    this.load.image('mascot', 'assets/blue_mascot.png');
    this.load.image('tube', 'assets/tube.png');
    this.load.image('angels', 'assets/angels.png');
}

function create() {
    const scaleFactor = calculateScale(this);
    createHowToPlayOverlay.call(this);
    this.gameStarted = false;
    
    // Add the player sprite
    const mascotWidth = this.scale.width * 0.25;
    const mascotHeight = this.scale.height * 0.15;
    this.player = this.physics.add.sprite(this.scale.width / 4, this.scale.height / 2, 'mascot');
    this.player.setDisplaySize(mascotWidth, mascotHeight);
    this.player.setCollideWorldBounds(true);
    this.player.body.allowGravity = false;
    
    // Create tubes and collectibles groups
    this.tubes = this.physics.add.group({ allowGravity: false });
    this.collectibles = this.physics.add.group({ allowGravity: false });
    
    // Setup spawner and collision
    setupTubeSpawner(this);
    setupCollision(this);
    
    //Create pause button
    const pauseButton = this.add.text(this.scale.width - 10, 10, 'Pause', {
        fontFamily: 'Comic Sans MS',
        fontSize: '24px',
        color: '#FFFFFF',
        backgroundColor: '#092C5C',
        padding: { x: 10, y: 5 },
    })
        .setOrigin(1, 0)
        .setInteractive()
        .on('pointerdown', () => {
            togglePause(this);
        });

    //Resize listener
    this.scale.on('resize', resizeGame, this);

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
        fontSize: '24px',
        color: '#FFFFFF',
    });
    this.scoreText.setDepth(10);
}

function update() {
    /*this.tubes.getChildren().forEach(tube => {
        tube.x -= 5; // Move left manually
    });*/
    if (!this.gameStarted) return;
    cleanupTubes(this);
}

//Helper function to create "How to Play" overlay
function createHowToPlayOverlay() {
    const overlay = document.createElement('div');
    overlay.classList.add('how-to-play-overlay');

    overlay.innerHTML = `
        <div class="content-box">
            <h1>HOW TO PLAY</h1>
            <p>Press SPACE or tap the screen to make the mascot fly.</p>
            <p>Avoid obstacles and collect stars for points!</p>
            <div class = "checkbox-container">
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
        startGame.call(this);
    });
}

//Function to start the actual game
function startGame() {
    this.gameStarted = true;
    this.player.body.allowGravity = true;
    this.player.setInteractive();

    this.tubeSpawner.paused = false;
    this.input.on('pointerdown', () => {
        this.player.setVelocityY(-425);
    });
    this.input.keyboard.on('keydown-SPACE', () => {
        this.player.setVelocityY(-425);
    });

}

function showGameOverPanel(scene) {
    // Pause the game
    scene.physics.pause();
    scene.tubeSpawner.paused = true;

    // Create the overlay
    const overlay = document.createElement('div');
    overlay.classList.add('game-over-overlay');

    // Add content to the overlay
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

    // Append the overlay to the document body
    document.body.appendChild(overlay);

    // Add event listener to the "Play Again" button
    const playAgainButton = overlay.querySelector('.game-over-play-again');
    playAgainButton.addEventListener('click', () => {
        overlay.remove(); // Remove the overlay
        restartGame(scene); // Restart the game
    });
}

function restartGame(scene) {
    // Reset game state
    scene.score = 0;
    scene.scoreText.setText('Score: 0');

    // Clear existing tubes
    scene.tubes.clear(true, true);
    scene.collectibles.clear(true, true);

    // Reset player position and physics
    scene.player.setPosition(scene.scale.width / 4, scene.scale.height / 2);
    scene.player.setVelocity(0);
    scene.player.setAngle(0);

    // Resume the game
    scene.physics.resume();
    scene.tubeSpawner.paused = false;
    scene.gameActive = true; // Allow the game to restart
}