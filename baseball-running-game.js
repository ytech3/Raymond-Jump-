import PlayScene from './scenes/PlayScene.js';

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