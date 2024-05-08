document.getElementById('gameSetup').addEventListener('submit', function (event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const totalRounds = parseInt(document.getElementById('rounds').value);
    const difficulty = document.getElementById('difficulty').value;
    window.location.href = `clock_game.html?playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;
});
