export function calculateScale(scene) {
    const baseWidth = 800;
    const baseHeight = 600;

    const scaleX = scene.scale.width / baseWidth;
    const scaleY = scene.scale.height / baseHeight;

    return Math.min(scaleX, scaleY);
}

export function resizeGame(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    const scaleFactor = calculateScale(this);

    this.player.setPosition(width / 4, height / 2);
    this.player.setDisplaySize(width * 0.1, height * 0.1);

    this.tubes.getChildren().forEach((tube) => {
        tube.setScale(scaleFactor);
    });

    this.scoreContainer.setPosition(20, 20); 
}