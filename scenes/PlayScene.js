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
    }

    preload() {
        this.load.image('mascot', 'assets/blue_mascot.png');
        this.load.image('tube', 'assets/tube.png');
        this.load.image('baseball', 'assets/baseball.png');
        this.load.image('hotdog', 'assets/hot_dog.png');
        this.load.image('pause-icon', 'assets/pause_button.png');

        const uniqueTeams = [...new Set(gameSchedule.map(({ team }) => team))];
        uniqueTeams.forEach(team => {
            this.load.image(team, `assets/${team}.png`); // Load dynamically
        });
    }

    //Create user ID
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


    create() {
        const scaleFactor = calculateScale(this);
        createHowToPlayOverlay(this);

        this.userID = localStorage.getItem('userID') || this.generateUserID();
        localStorage.setItem('userID', this.userID);

        this.physics.pause();
        this.gameStarted = false;

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

        //Create the background and score text
        const scoreBackground = this.add.rectangle(0, 0, 120, 40, 0x092C5C);
        scoreBackground.setOrigin(0, 0);
        this.scoreText = this.add.text(10, 5, 'Score: 0', {
            fontSize: '22px',
            color: '#F5D130',
            fontFamily: 'Comic Sans MS',
        });

        //Add the background and text to the container
        this.scoreContainer.add([scoreBackground, this.scoreText]);
        this.scoreContainer.setDepth(10);

        //Adjust background size based on text
        this.updateScoreBackground = () => {
            const textWidth = this.scoreText.width;
            const textHeight = this.scoreText.height;
            scoreBackground.width = textWidth + 20;
            scoreBackground.height = textHeight + 10;
        };
        this.updateScoreBackground();

        //Update the score text dynamically
        this.updateScoreText = (newScore) => {
            this.scoreText.setText(`Score: ${newScore}`);
            this.updateScoreBackground();
        };
    }
    
    startGame() {
        this.gameStarted = true;
        this.player.body.allowGravity = true;
        this.physics.resume();

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
        //if game not started, freeze the mascot at its initial position
        if (!this.gameStarted) {
        this.player.setVelocity(0, 0);
        return;
        }
        
        cleanupTubes(this);
    }

    restartGame() {
        // Reset game variables
        this.score = 0;
        scene.updateScoreText(scene.score);
        this.scoreText.setText('Score: 0');
        this.gameStarted = false;

        //Pause all game mechanics
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