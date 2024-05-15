
/*
 * Redirect the player when clicked on the "play against time" button
 */
document.getElementById('playTime').addEventListener('click', () => {
    window.location.href = 'game.html?mode=time';
});

/*
 * Redirect the player when clicked on the "play against AI" button
 */
document.getElementById('playAI').addEventListener('click', () => {
    window.location.href = 'game.html?mode=ai';
});
