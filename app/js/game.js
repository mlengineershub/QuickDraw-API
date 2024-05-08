document.getElementById('gameSetup').addEventListener('submit', function (event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const totalRounds = parseInt(document.getElementById('rounds').value);
    const difficulty = document.getElementById('difficulty').value;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'time') {
        window.location.href = `clock_game.html?playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;
    } else if (mode === 'ai') {
        window.location.href = `ai_game.html?playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;
    }
});
