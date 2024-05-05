document.getElementById('gameSetup').addEventListener('submit', function (event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const difficulty = document.getElementById('difficulty').value;
    const rounds = document.getElementById('rounds').value;
    console.log(`Player Name: ${playerName}, Difficulty: ${difficulty}, Rounds: ${rounds}`);
    // Implement game logic or redirect to the game playing environment here.
});
