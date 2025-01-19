export function createPointText(scene, x, y, points) {
    const text = scene.add.text(x, y, `+${points}`, {
        fontFamily: 'Comic Sans MS',
        fontSize: '24px',
        color: '#F5D130',
        fontWeight: 'bold',
    });

    //Move up and fade out text
    scene.tweens.add({
        targets: text,
        y: y - 50,
        alpha: 0,
        duration: 1500,
        onComplete: () => text.destroy(),
    });
}