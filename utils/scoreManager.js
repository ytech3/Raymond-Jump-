export function updateHighScores(userID, score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ userID, score });
    highScores.sort((a, b) => b.score - a.score);
    while (highScores.length > 5) highScores.pop();
    localStorage.setItem('highScores', JSON.stringify(highScores));
    return highScores;
}