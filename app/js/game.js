// document.getElementById('gameSetup').addEventListener('submit', function (event) {
//     event.preventDefault();

//     const playerName = document.getElementById('playerName').value; 
//     const difficulty = document.getElementById('difficulty').value;
//     const rounds = document.getElementById('rounds').value; 

//     window.location.href = 'clock_game.html?difficulty=' + difficulty;
// });


document.getElementById('gameSetup').addEventListener('submit', function (event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    const totalRounds = parseInt(document.getElementById('rounds').value);
    const difficulty = document.getElementById('difficulty').value;
    window.location.href = `clock_game.html?playerName=${encodeURIComponent(playerName)}&totalRounds=${totalRounds}&difficulty=${difficulty}`;
});
