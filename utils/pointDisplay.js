/*
 Creates a floating point text animation when the player earns points.
 Moves the text upward while gradually fading it out.
 Destroys the text object after the animation completes.
 */

export function createPointText(scene, x, y, points) {
    const text = scene.add.text(x, y, `+${points}`, {
        fontFamily: 'Comic Sans MS',
        fontSize: '24px',
        color: '#F5D130',
        fontWeight: 'bold',
    });

    scene.tweens.add({
        targets: text,
        y: y - 50,
        alpha: 0,
        duration: 1500,
        onComplete: () => text.destroy(),
    });
}