document.addEventListener('DOMContentLoaded', () => {

    // Get game infos
    const params = new URLSearchParams(window.location.search);
    const score = params.get('score');
    const meanTime = params.get('mean_time');
    const totalRounds = params.get('totalRounds');
    const player_name = params.get('player_name').toLowerCase();
    const difficulty = params.get('difficulty').toLowerCase();
    const mode = params.get('mode').toLowerCase();

    // Ensure the time is displayed in a user-friendly format (seconds with two decimal places)
    const formattedTime = parseFloat(meanTime).toFixed(2);

    // Display the score and mean time
    document.getElementById('scoreValue').textContent = `${score}`;
    document.getElementById('timeValue').textContent = `${formattedTime} seconds`;
    document.getElementById('playerNameValue').textContent = `${player_name}`;
    document.getElementById('difficultyValue').textContent = `${difficulty}`;
    document.getElementById('totalRoundsValue').textContent = `${totalRounds}`;

    // Send the score to the server
    const postData = {
        user: player_name,
        score: parseInt(score),
        mean_time: parseFloat(meanTime),
        mode: mode,
        difficulty: difficulty
    };

    console.log('data to be sent:');
    console.log(JSON.stringify(postData));

    fetch('/api/add_score', {
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

    // Get the podium from the server 
    fetch('http://api/scores')
        .then(response => response.json())
        .then(data => {
            console.log('All scores data:', data);
            // Sort the data by score (descending) and mean_time (ascending)
            const sortedData = data.sort((a, b) => {
                if (b.score === a.score) {
                    return a.mean_time - b.mean_time;
                }
                return b.score - a.score;
            });
            // Take the top 3 scores
            const top3 = sortedData.slice(0, 3);
            displayPodium(top3);
        })
        .catch((error) => {
            console.error('Error fetching scores data:', error);
        });

    function displayPodium(scores) {
        const podiumContainer = document.getElementById('podium-container');
        podiumContainer.innerHTML = '';

        scores.forEach((score, index) => {
            const podiumBlock = document.createElement('div');
            podiumBlock.classList.add('podium-block');

            if (index === 0) {
                podiumBlock.id = 'first-place';
            } else if (index === 1) {
                podiumBlock.id = 'second-place';
            } else if (index === 2) {
                podiumBlock.id = 'third-place';
            }

            const position = document.createElement('h3');
            position.textContent = `#${index + 1}`;

            const playerName = document.createElement('p');
            playerName.textContent = score.user;

            const playerScore = document.createElement('p');
            playerScore.textContent = `Score: ${score.score}`;

            const meanTime = document.createElement('p');
            meanTime.textContent = `Time: ${score.mean_time.toFixed(2)}s`;

            podiumBlock.appendChild(position);
            podiumBlock.appendChild(playerName);
            podiumBlock.appendChild(playerScore);
            podiumBlock.appendChild(meanTime);

            podiumContainer.appendChild(podiumBlock);
        });
    }
});