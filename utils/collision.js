import { showGameOverPanel } from '../ui/GameOverPanel.js';
import { createPointText } from '../utils/pointDisplay.js';

export function setupCollision(scene) {
    //Collision between player and tubes
    scene.physics.add.overlap(scene.player, scene.tubes, () => {
        console.log('Collision detected!');
        scene.gameStarted = false;
        scene.physics.pause();
        showGameOverPanel(scene);
    });

    //Collision between player and objects
    scene.physics.add.overlap(scene.player, scene.collectibles, (player, collectible) => {
        const { x, y } = collectible;
        collectible.destroy();
        scene.score += 50;
        scene.updateScoreText(scene.score);
        createPointText(scene, x, y, 50);
    });

    scene.physics.add.overlap(scene.player, scene.baseballs, (player, baseball) => {
        const { x, y } = baseball;
        baseball.destroy();
        scene.score += 10;
        scene.updateScoreText(scene.score);
        createPointText(scene, x, y, 10);
    });

    scene.physics.add.overlap(scene.player, scene.hotdogs, (player, hotdog) => {
        const { x, y } = hotdog;
        hotdog.destroy();
        scene.score += 20;
        scene.updateScoreText(scene.score);
        createPointText(scene, x, y, 20);
    });
}