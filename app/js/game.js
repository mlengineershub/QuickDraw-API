
/**
 * Submit the game settings to the server with a custom url redirection
 */
document.getElementById('gameSetup').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get game informations
    const playerName = document.getElementById('playerName').value;
    const totalRounds = parseInt(document.getElementById('rounds').value);
    const difficulty = document.getElementById('difficulty').value;
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    // Build url params
    const url_params = `clock_game.html?playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;
    
    // Redirect
    if (mode === 'time') {
        window.location.href = `clock_game.html?${url_params}`;
    } else if (mode === 'ai') {
        window.location.href = `ai_game.html?${url_params}`;
    }
});
