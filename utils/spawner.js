import { calculateScale } from './scaling.js';
import { getNextCollectibleTeam } from './collectibles.js';

export function setupTubeSpawner(scene) {
    scene.tubeSpawner = scene.time.addEvent({
        delay: 3500 / scene.speedMultiplier,
        callback: () => createTubePair(scene),
        loop: true,
        paused: true,
    });

    scene.baseballSpawner = scene.time.addEvent({
        delay: 5000 / scene.speedMultiplier,
        callback: () => spawnBaseball(scene),
        loop: true,
        paused: true,
    });

    scene.hotdogSpawner = scene.time.addEvent({
        delay: 8000 / scene.speedMultiplier,
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
    const tubeWidth = scaleFactor * 90;
    const tubeHeight = scene.scale.height * 0.6;

    const minY = 100 * scaleFactor;
    const maxY = scene.scale.height - minY - scene.gapSize;
    const gapY = Phaser.Math.Between(minY, maxY);

    const tubeVelocity = -200 * scene.speedMultiplier;

    //Top tube
    const topTube = scene.tubes.create(scene.scale.width, gapY, 'tube');
    topTube.setOrigin(0.5, 1);
    topTube.setDisplaySize(tubeWidth, tubeHeight);
    topTube.setFlipY(true);
    topTube.body.setVelocityX(tubeVelocity);

    //Bottom tube
    const bottomTube = scene.tubes.create(scene.scale.width, gapY + scene.gapSize, 'tube');
    bottomTube.setOrigin(0.5, 0);
    bottomTube.setDisplaySize(tubeWidth, tubeHeight);
    bottomTube.body.setVelocityX(tubeVelocity);

    //Team collectible in center of gap
    const team = getNextCollectibleTeam();
    const collectible = scene.collectibles.create(scene.scale.width, gapY + scene.gapSize / 2, team);
    collectible.setDisplaySize(250 * scaleFactor, 250 * scaleFactor);
    collectible.body.setVelocityX(tubeVelocity);
    collectible.setOrigin(0.5, 0.5);
    console.log(`Current Gap Size: ${scene.gapSize}`);
    
}

export function cleanupTubes(scene) {
    scene.tubes.getChildren().forEach((tube) => {
        if (tube.x + tube.width < 0) {
            tube.destroy();
        }
    });

    scene.baseballs.getChildren().forEach((baseball) => { // Fixed typo here
        if (baseball.x + baseball.width < 0) {
            baseball.destroy();
        }
    });

    scene.hotdogs.getChildren().forEach((hotdog) => {
        if (hotdog.x + hotdog.width < 0) {
            hotdog.destroy();
        }
    });
}

export function spawnBaseball(scene) {
    const scaleFactor = calculateScale(scene);
    const baseballWidth = 120 * scaleFactor;
    const baseballHeight = 100 * scaleFactor;

    //Generate random Y position
    const randomY = Phaser.Math.Between(100, scene.scale.height - 100);

    //Create the baseball powerup
    const baseball = scene.baseballs.create(scene.scale.width, randomY, 'baseball');
    baseball.setDisplaySize(baseballWidth, baseballHeight);
    baseball.body.setVelocityX(-200);
    baseball.setOrigin(0.5, 0.5);
}

export function spawnHotdog(scene) {
    const scaleFactor = calculateScale(scene);
    const hotdogWidth = 140 * scaleFactor;
    const hotdogHeight = 120 * scaleFactor;

    const randomY = Phaser.Math.Between(100, scene.scale.height - 100);

    //Create the hotdog powerup
    const hotdog = scene.hotdogs.create(scene.scale.width, randomY, 'hotdog');
    hotdog.setDisplaySize(hotdogWidth, hotdogHeight);
    hotdog.body.setVelocityX(-200);
    hotdog.setOrigin(0.5, 0.5);
}