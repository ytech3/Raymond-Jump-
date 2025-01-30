/*
 Handles updating and storing high scores locally.
 Retrieves existing high scores from local storage.
 Adds the new score and sorts the list in descending order.
 Keeps only the top 5 scores to maintain a leaderboard.
 Saves the updated leaderboard back to local storage.
 */
export function updateHighScores(userID, score) {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ userID, score });
    highScores.sort((a, b) => b.score - a.score);
    while (highScores.length > 5) highScores.pop();
    localStorage.setItem('highScores', JSON.stringify(highScores));
    return highScores;
}