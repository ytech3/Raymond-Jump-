/*
 Main game configuration script
 Initializes the Phaser game with automatic scaling and a sky-blue background.
 Loads the PlayScene where the actual game logic is handled.
 Enables Arcade Physics.
 */

import PlayScene from './scenes/PlayScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'game-container',
    scene: [PlayScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
        },
    },
};

const game = new Phaser.Game(config);