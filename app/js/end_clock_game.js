/**
 * When DOM if loaded
 */
document.addEventListener('DOMContentLoaded', () => {

    // Get game infos
    const params = new URLSearchParams(window.location.search);
    const score = params.get('score');
    const meanTime = params.get('mean_time');
    const totalRounds = params.get('totalRounds');
    const player_name = params.get('player_name');
    const difficulty = params.get('difficulty');

    console.log('End game infos:');
    console.log('score, meanTime, totalRounds, player_name, difficulty');
    console.log(score, meanTime, totalRounds, player_name, difficulty);

    // Ensure the time is displayed in a user-friendly format (seconds with two decimal places)
    const formattedTime = parseFloat(meanTime).toFixed(2);

    // Display the score and mean time
    document.getElementById('scoreDisplay').textContent = `Your Score: ${score}`;
    document.getElementById('timeDisplay').textContent = `Average Time Per Round: ${formattedTime} seconds`;
    document.getElementById('playerName').textContent = `Player Name: ${player_name}`;
    document.getElementById('difficulty').textContent = `Difficulty: ${difficulty}`;
    document.getElementById('totalRounds').textContent = `Total Rounds: ${totalRounds}`;

    // Send the score to the server
    const postData = {
        user: player_name,
        score: parseInt(score),
        mean_time: parseFloat(meanTime),
        mode: "time", // Assuming mode is always 'time'. Modify as necessary.
        difficulty: difficulty
    };

    console.log('data to be sent:');
    console.log(JSON.stringify(postData));

    fetch('http://127.0.0.1:8000/add_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });

});