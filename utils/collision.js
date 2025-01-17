import { showGameOverPanel } from '../ui/GameOverPanel.js';

export function setupCollision(scene) {
    //Collision between player and tubes
    scene.physics.add.overlap(scene.player, scene.tubes, () => {
        console.log('Collision detected!');
        scene.gameStarted = false;
        scene.physics.pause();
        scene.tubeSpawner.paused = true;
        showGameOverPanel(scene);
    });

    //Collision between player and collectibles
    scene.physics.add.overlap(scene.player, scene.collectibles, (player, collectible) => {
        collectible.destroy();
        scene.score += 10;
        scene.scoreText.setText(`Score: ${scene.score}`);
    });
}