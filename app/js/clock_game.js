const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 400;
canvas.height = 400;
let painting = false;
let intervalId = null;
let timerInterval = null; // Global timer interval
let currentRound = 1;
let totalRounds = parseInt(new URLSearchParams(window.location.search).get('totalRounds'));
let scores = new Array(totalRounds).fill(0); // Initialize scores array
let X = null;
const timeLimit = new URLSearchParams(window.location.search).get('difficulty') === 'hard' ? 20 : 30;
let mean_time_player = 0;
let score_player = 0;
let start_time = 0;
const player_name = new URLSearchParams(window.location.search).get('playerName').toLowerCase();
const difficulty = new URLSearchParams(window.location.search).get('difficulty').toLowerCase();

function getLabelsSync() {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://quickdraw-endpoints:8000/labels', false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.error(`HTTP error! Status: ${request.status}`);
        return null;
    }
}

const prompts = getLabelsSync();

function selectRandomPrompt() {
    const promptKeys = Object.keys(prompts);
    const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
    const randomPrompt = `${prompts[randomKey]} ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}`;
    X = prompts[randomKey];
    document.getElementById('randomPrompt').innerText = randomPrompt;
}

function initializeTimer(duration) {
    clearInterval(timerInterval); // Clear existing timer
    let timer = duration, minutes, seconds;
    start_time = new Date().getTime();
    const countdown = document.getElementById('countdown');
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        countdown.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(timerInterval);
            finishRound();
        }
    }, 1000);
}

function finishRound() {
    const end_time = new Date().getTime();
    let time_diff = end_time - start_time;
    if (time_diff > timeLimit * 1000) {
        time_diff = timeLimit * 1000;
    };
    mean_time_player = mean_time_player + time_diff;
    callPredictionAPI();
    const scoreForRound = document.getElementById('predictionText').innerText.includes(X) ? 1 : 0;
    updateScore(scoreForRound);
}

function updateScore(newScore) {
    scores[currentRound - 1] = newScore;
    let emoji = newScore == 1 ? "✅" : "❌";   
    document.getElementById('currentRound').innerText = `Round ${currentRound}: ${emoji}`;
    document.getElementById('previousScores').innerText = `Total Score: ${scores.reduce((a, b) => a + b, 0)}`;
    if (currentRound < totalRounds) {
        currentRound++;
        resetGameForNextRound();
    } else {
        finishGame();
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    callPredictionAPI();
}

function finishGame() {
    mean_time_player = mean_time_player / totalRounds;
    mean_time_player = mean_time_player / 1000;
    window.location.href = `end_game.html?mode=clock&player_name=${player_name}&score=${scores.reduce((a, b) => a + b, 0)}&mean_time=${mean_time_player}&difficulty=${difficulty}&totalRounds=${totalRounds}`;
}

function resetGameForNextRound() {
    selectRandomPrompt();
    initializeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initializeTimer(timeLimit);
}

function startPosition(e) {
    painting = true;
    draw(e);
    if (!intervalId) intervalId = setInterval(callPredictionAPI, 1500);
}

function finishedPosition() {
    painting = false;
    clearInterval(intervalId);
    intervalId = null;
    ctx.beginPath();
    callPredictionAPI();
}

function draw(e) {
    if (!painting) return;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function initializeCanvas() {
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

function extractImage() {
    const image = canvas.toDataURL('image/png');
    return dataURItoBlob(image);
}

function callPredictionAPI() {
    const imageBlob = extractImage();
    const formData = new FormData();
    formData.append('file', imageBlob);
    fetch('http://quickdraw-endpoints:8000/predict_with_file', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const emoji = prompts[data.pred_label];
            const predictionText = `Prediction: ${emoji}`;
            document.getElementById('predictionText').innerText = predictionText;
            if (predictionText.includes(X)) {
                finishRound();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('predictionText').innerText = "Error making prediction";
        });
}

document.addEventListener("DOMContentLoaded", function () {
    resetGameForNextRound();
});
