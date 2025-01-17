import { calculateScale } from './scaling.js';

export function setupTubeSpawner(scene) {
    scene.tubeSpawner = scene.time.addEvent({
        delay: 3500,
        callback: () => createTubePair(scene),
        loop: true,
        paused: true,
    });
    console.log('Tube spawner setup. Initial paused state:', scene.tubeSpawner.paused);
}

export function createTubePair(scene) {
    if (!scene.gameStarted) {
        console.log('Game not started; skipping tube creation');
        return;
    }

    const scaleFactor = calculateScale(scene);
    const gapSize = 550 * scaleFactor;
    const tubeWidth = scaleFactor * 80;
    const tubeHeight = scene.scale.height * 0.7;

    const minY = 100 * scaleFactor;
    const maxY = scene.scale.height - minY - gapSize;
    const gapY = Phaser.Math.Between(minY, maxY);

    //Top tube
    const topTube = scene.tubes.create(scene.scale.width, gapY, 'tube');
    topTube.setOrigin(0.5, 1);
    topTube.setDisplaySize(tubeWidth, tubeHeight);
    topTube.body.setVelocityX(-200);

    //Bottom tube
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

export function cleanupTubes(scene) {
    scene.tubes.getChildren().forEach((tube) => {
        if (tube.x + tube.width < 0) {
            tube.destroy();
        }
    });
}