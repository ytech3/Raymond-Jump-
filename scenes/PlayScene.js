/*
 The main game scene for "Raymond Jump".
 Loads assets.Creates the game environment.
 Handles player interactions. Spawns obstacles and collectibles.
 Tracks scores and progression.
 Managing game start, pause, and restart functionality.
 */

import { calculateScale, resizeGame } from '../utils/scaling.js';
import { setupTubeSpawner, createTubePair, cleanupTubes } from '../utils/spawner.js';
import { setupCollision } from '../utils/collision.js';
import { showGameOverPanel } from '../ui/GameOverPanel.js';
import { createHowToPlayOverlay } from '../ui/HowToPlayPanel.js';
import { createPausePanel } from '../ui/PausePanel.js';
import { createPointText } from '../utils/pointDisplay.js';
import { gameSchedule } from '../utils/schedule.js';
import { resetScheduleIndex } from '../utils/collectibles.js';


export default class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
        this.score = 0;
        this.trophyCollected = false;
    }

    preload() {
        this.load.image('mascot', 'assets/blue_mascot.png');
        this.load.image('tube', 'assets/tube.png');
        this.load.image('baseball', 'assets/baseball.png');
        this.load.image('hotdog', 'assets/hot_dog.png');
        this.load.image('pause-icon', 'assets/pause_button.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('trophy', 'assets/trophy.png');

        const uniqueTeams = [...new Set(gameSchedule.map(({ team }) => team))];
        uniqueTeams.forEach(team => {
            this.load.image(team, `assets/${team}.png`);
        });
    }

    //Generates unique userID for score tracking
    generateUserID() {
        const adjectives = [
        'Blazing', 'Flashy', 'Mighty', 'Golden', 
        'Stellar', 'Heroic', 'Swift', 'Shining', 
        'Clutch', 'Smooth', 'Diamond', 'Grand',
        'Wild', 'Epic', 'Power', 'Royal'
    ];
    
    const nouns = [
        'Bat', 'Glove', 'Arm', 'Eye', 
        'Cleats', 'Slider', 'Fastball', 'Homer', 
        'Catch', 'Steal', 'Ace', 'MVP',
        'Captain', 'Champ', 'Legend', 'Star'
    ];
    
    const numbers = Math.floor(Math.random() * 100);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${adjective}${noun}${numbers}`;
    };

    createGradientBackground(scene) {
        const width = scene.scale.width;
        const height = scene.scale.height;

        //Create an offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        //Get the Canvas 2D context
        const ctx = canvas.getContext('2d');

        //Create a linear gradient & fill
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#092C5C'); // Dark blue
        gradient.addColorStop(1, '#87CEEB'); // Light blue
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        //Create a Phaser texture from the canvas & add as image
        scene.textures.addCanvas('gradient-bg', canvas);
        const background = scene.add.image(0, 0, 'gradient-bg');
        background.setOrigin(0, 0).setDepth(-1);
    }

    //Spawns final trophy to end game after all logos are collected
    endGameWithTrophy() {
        this.tubeSpawner.paused = true;
        this.baseballSpawner.paused = true;
        this.hotdogSpawner.paused = true;
    
        const trophy = this.physics.add.sprite(
            this.scale.width + 100,
            this.scale.height / 2,
            'trophy'
        );

        trophy.setDisplaySize(250, 250);
        trophy.body.setVelocityX(-200);
        trophy.body.allowGravity = false;
        trophy.setOrigin(0.5, 0.5);
    
        this.physics.add.overlap(this.player, trophy, () => {
            trophy.destroy();
            this.trophyCollected = true;
            showGameOverPanel(this);
        });
    }

    //Initializes game scene, main area
    create() {
        const scaleFactor = calculateScale(this);
        this.createGradientBackground(this);
        createHowToPlayOverlay(this);

        this.userID = localStorage.getItem('userID') || this.generateUserID();
        localStorage.setItem('userID', this.userID);

        this.physics.pause();
        this.gameStarted = false;

        //Total logos
        this.totalLogos = gameSchedule.reduce((sum, game) => sum + game.games, 0); // Sum up all games
        this.collectedLogos = 0;

        //Difficulty scaling
        this.speedMultiplier = 1;
        this.gapSize = 550 * scaleFactor;

        const groundHeight = 100;
            this.ground1 = this.add.image(0, this.scale.height - groundHeight, 'ground')
                .setOrigin(0, 0)
                .setDepth(-0.4);
            this.ground2 = this.add.image(this.ground1.width, this.scale.height - groundHeight, 'ground')
                .setOrigin(0, 0)
                .setDepth(-0.4)
                .setFlipX(true);
        this.IsGroundMoving = false;

        //Add the player sprite, shrink collider by 10%
        const mascotWidth = this.scale.width * 0.2;
        const mascotHeight = this.scale.height * 0.1;
        this.player = this.physics.add.sprite(this.scale.width / 4, this.scale.height / 2, 'mascot');
        this.player.setDisplaySize(mascotWidth, mascotHeight);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(mascotWidth * 0.9, mascotHeight * 0.9);
        this.player.body.allowGravity = false;

        //Create tubes and collectibles groups
        this.tubes = this.physics.add.group({ allowGravity: false });
        this.collectibles = this.physics.add.group({ allowGravity: false });
        this.baseballs = this.physics.add.group({ allowGravity: false });
        this.hotdogs = this.physics.add.group({ allowGravity: false });

        //Setup spawner and collision
        setupTubeSpawner(this);
        setupCollision(this);

        //Initially pause spawners
        this.tubeSpawner.paused = true;
        this.baseballSpawner.paused = true;
        this.hotdogSpawner.paused = true;

        //Create pause button, set functionality
        const pauseButton = this.add.image(this.scale.width - 35, 35, 'pause-icon');
        pauseButton.setOrigin(1, 0).setInteractive().setDepth(10);
        pauseButton.setDisplaySize(50, 50);
        pauseButton.on('pointerdown', () => {
            createPausePanel(this);
        });

        //Resize listener
        this.scoreContainer = this.add.container(30, 40);

        //Create score text
        this.scoreText = this.add.text(10, 5, 'Score: 0', {
            fontSize: '22px',
            color: '#F5D130',
            fontFamily: 'Comic Sans MS',
        });

        //Logo amount tracker
        this.logoTrackerText = this.add.text(10, 30, `Logos: 0/${this.totalLogos}`, {
            fontSize: '22px',
            color: '#F5D130',
            fontFamily: 'Comic Sans MS',
        });

        //Add text to the container
        this.scoreContainer.add([this.scoreText, this.logoTrackerText]);
        this.scoreContainer.setDepth(10);

        //Update the score and logo text dynamically
        this.updateScoreText = (newScore) => {
            this.scoreText.setText(`Score: ${newScore}`);
        };

        this.updateLogoTracker = (collected) => {
            this.collectedLogos = collected;
            this.logoTrackerText.setText(`Logos: ${this.collectedLogos}/${this.totalLogos}`);
        };
    }
    
    startGame() {
        this.gameStarted = true;
        this.player.body.allowGravity = true;
        this.physics.resume();

        this.isGroundMoving = true; 
        this.tubeSpawner.paused = false;
        this.baseballSpawner.paused = false;
        this.hotdogSpawner.paused = false;

        this.input.on('pointerdown', () => {
            this.player.setVelocityY(-425);
        });

        this.input.keyboard.on('keydown-SPACE', () => {
            this.player.setVelocityY(-425);
        });

    }

    update() {

        const groundSpeed = 1.5;

        if (this.isGroundMoving) {
            //Move the ground images
            this.ground1.x -= groundSpeed;
            this.ground2.x -= groundSpeed;

            //If ground1 moves off-screen, snap it to the right of ground2
            if (this.ground1.x + this.ground1.width < 0) {
                this.ground1.x = this.ground2.x + this.ground2.width;
            }

            //If ground2 moves off-screen, snap it to the right of ground1
            if (this.ground2.x + this.ground2.width < 0) {
                this.ground2.x = this.ground1.x + this.ground1.width;
            }
        }

        //if game not started, freeze the mascot at its initial position
        if (!this.gameStarted) {
            this.player.setVelocity(0, 0);
            return;
        }

        if (this.collectedLogos < this.totalLogos) {
            cleanupTubes(this);
        }

        cleanupTubes(this);
    }

    restartGame() {
        //Reset game variables
        this.score = 0;
        this.updateScoreText(this.score);
        this.collectedLogos = 0;
        this.logoTrackerText.setText(`Logos: 0/${this.totalLogos}`);
        this.trophyCollected = false;
        this.gameStarted = false;
        this.speedMultiplier = 1;

        //Pause all game mechanics
        this.isGroundMoving = false;
        this.tubeSpawner.paused = true;
        this.baseballSpawner.paused = true;
        this.hotdogSpawner.paused = true;

        //Clear existing tubes and collectibles
        this.tubes.clear(true, true);
        this.collectibles.clear(true, true);
        resetScheduleIndex();

        //Reset player position and state
        this.player.setPosition(this.scale.width / 4, this.scale.height / 2);
        this.player.setVelocity(0);
        this.player.body.allowGravity = false;
        this.player.setAngle(0);

        //Start the game again
        this.startGame();
    }
}