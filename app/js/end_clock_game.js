document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const score = params.get('score');
    const meanTime = params.get('mean_time');
    const totalRounds = params.get('totalRounds');
    const player_name = params.get('player_name');
    const difficulty = params.get('difficulty');

    // Ensure the time is displayed in a user-friendly format (seconds with two decimal places)
    const formattedTime = parseFloat(meanTime).toFixed(2);

    // Display the score and mean time
    document.getElementById('scoreDisplay').textContent = `Your Score: ${score}`;
    document.getElementById('timeDisplay').textContent = `Average Time Per Round: ${formattedTime} seconds`;
    document.getElementById('playerName').textContent = `Player Name: ${player_name}`;
    document.getElementById('difficulty').textContent = `Difficulty: ${difficulty}`;
    document.getElementById('totalRounds').textContent = `Total Rounds: ${totalRounds}`;
});
