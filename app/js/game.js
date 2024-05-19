document.getElementById('gameSetup').addEventListener('submit', (event) => {
    event.preventDefault();

    const playerName = document.getElementById('playerName').value;
    const totalRounds = parseInt(document.getElementById('rounds').value);
    const difficulty = document.getElementById('difficulty').value;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    const url_params = `playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;

    if (mode === 'time') {
        window.location.href = `clock_game.html?${url_params}`;
    } else if (mode === 'ai') {
        window.location.href = `ai_game.html?${url_params}`;
    }
});

