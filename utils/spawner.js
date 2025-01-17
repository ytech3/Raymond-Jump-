import { calculateScale } from './scaling.js';

export function setupTubeSpawner(scene) {
    scene.tubeSpawner = scene.time.addEvent({
        delay: 3500,
        callback: () => createTubePair(scene),
        loop: true,
        paused: true,
    });

    scene.starSpawner = scene.time.addEvent({
        delay: 5000,
        callback: () => spawnStar(scene),
        loop: true,
        paused: true,
    });

    scene.hotdogSpawner = scene.time.addEvent({
        delay: 8000,
        callback: () => spawnHotdog(scene),
        loop: true,
        paused: true,
    });
}

export function createTubePair(scene) {
    if (!scene.gameStarted) {
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
    collectible.setDisplaySize(250 * scaleFactor, 250 * scaleFactor);
    collectible.body.setVelocityX(-200);
    collectible.setOrigin(0.5, 0.5);
}

export function cleanupTubes(scene) {
    scene.tubes.getChildren().forEach((tube) => {
        if (tube.x + tube.width < 0) {
            tube.destroy();
        }
    });

    scene.stars.getChildren().forEach((star) => {
        if (star.x + star.width < 0) {
            star.destroy();
        }
    });

    scene.hotdogs.getChildren().forEach((hotdog) => {
        if (hotdog.x + hotdog.width < 0) {
            hotdog.destroy();
        }
    });
}

export function spawnStar(scene) {
    const scaleFactor = calculateScale(scene);
    const starSize = 120 * scaleFactor;

    //Generate random Y position
    const randomY = Phaser.Math.Between(100, scene.scale.height - 100);

    //Create the star powerup
    const star = scene.stars.create(scene.scale.width, randomY, 'star');
    star.setDisplaySize(starSize, starSize);
    star.body.setVelocityX(-200);
    star.setOrigin(0.5, 0.5);
}

export function spawnHotdog(scene) {
    const scaleFactor = calculateScale(scene);
    const hotdogSize = 120 * scaleFactor;

    const randomY = Phaser.Math.Between(100, scene.scale.height - 100);

    //Create the hotdog powerup
    const hotdog = scene.hotdogs.create(scene.scale.width, randomY, 'hotdog');
    hotdog.setDisplaySize(hotdogSize, hotdogSize);
    hotdog.body.setVelocityX(-200);
    hotdog.setOrigin(0.5, 0.5);
}