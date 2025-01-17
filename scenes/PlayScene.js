import { calculateScale, resizeGame } from '../utils/scaling.js';
import { setupTubeSpawner, createTubePair, cleanupTubes } from '../utils/spawner.js';
import { setupCollision } from '../utils/collision.js';
import { showGameOverPanel } from '../ui/GameOverPanel.js';
import { createHowToPlayOverlay } from '../ui/HowToPlayPanel.js';
import { createPausePanel } from '../ui/PausePanel.js';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
        this.score = 0;
    }

    preload() {
        this.load.image('mascot', 'assets/blue_mascot.png');
        this.load.image('tube', 'assets/tube.png');
        this.load.image('angels', 'assets/angels.png');
    }

    create() {
        const scaleFactor = calculateScale(this);
        createHowToPlayOverlay(this);

        this.physics.pause();
        this.gameStarted = false;

        //Add the player sprite, shrink collider by 10%
        const mascotWidth = this.scale.width * 0.25;
        const mascotHeight = this.scale.height * 0.15;
        this.player = this.physics.add.sprite(this.scale.width / 4, this.scale.height / 2, 'mascot');
        this.player.setDisplaySize(mascotWidth, mascotHeight);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(mascotWidth * 0.9, mascotHeight * 0.9);
        this.player.body.allowGravity = false;

        //Create tubes and collectibles groups
        this.tubes = this.physics.add.group({ allowGravity: false });
        this.collectibles = this.physics.add.group({ allowGravity: false });

        //Setup spawner and collision
        setupTubeSpawner(this);
        setupCollision(this);

        //Create pause button, set functionality
        const pauseButton = this.add.text(this.scale.width - 10, 10, 'Pause', {
            fontFamily: 'Comic Sans MS',
            fontSize: '24px',
            color: '#FFFFFF',
            backgroundColor: '#092C5C',
            padding: { x: 10, y: 5 },
        })
            .setOrigin(1, 0)
            .setInteractive()
            .on('pointerdown', () => createPausePanel(this));
        pauseButton.setDepth(10);

        //Resize listener
        this.scale.on('resize', resizeGame, this);

        //Score text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '24px',
            color: '#FFFFFF',
        });
        this.scoreText.setDepth(10);
    }
    
    startGame() {
        this.gameStarted = true;
        this.player.body.allowGravity = true;
        this.physics.resume();

        if(this.tubeSpawner){
            console.log('unpausing tube spawner');
            this.tubeSpawner.paused = false;
        }

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
        this.scoreText.setText('Score: 0');
        this.gameStarted = false;
        this.tubeSpawner.paused = true;

        //Clear existing tubes and collectibles
        this.tubes.clear(true, true);
        this.collectibles.clear(true, true);

        //Reset player position and state
        this.player.setPosition(this.scale.width / 4, this.scale.height / 2);
        this.player.setVelocity(0);
        this.player.body.allowGravity = false;
        this.player.setAngle(0);

        //Start the game again
        this.startGame();
    }
}