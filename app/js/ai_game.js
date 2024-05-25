function getLabelsSync() {
    const request = new XMLHttpRequest();
    request.open('GET', '/api/labels', false);
    request.send(null);

    if (request.status === 200) {
        return JSON.parse(request.responseText);
    } else {
        console.error(`HTTP error! Status: ${request.status}`);
        return null;
    }
}

const prompts = getLabelsSync();

const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 400;
canvas.height = 400;
let painting = false;
let intervalId = null;
let timerInterval = null;
let currentRound = 1;
let totalRounds = parseInt(new URLSearchParams(window.location.search).get('totalRounds'));
let scores = new Array(totalRounds).fill(0);
let X = null;
let promptText = "";
const speed = new URLSearchParams(window.location.search).get('difficulty') === 'hard' ? 100 : 30;
let mean_time_player = 0;
let score_player = 0;
let start_time = 0;
const player_name = new URLSearchParams(window.location.search).get('playerName').toLowerCase();
const difficulty = new URLSearchParams(window.location.search).get('difficulty').toLowerCase();

const DIFFICULTY_DELAY = { "medium" : 20_000, "hard": 10_000 }


function selectRandomPrompt() {
    const promptKeys = Object.keys(prompts);
    const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
    const randomPrompt = `${prompts[randomKey]} ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}`;
    X = prompts[randomKey];
    promptText = randomKey;
    document.getElementById('randomPrompt').innerText = randomPrompt;
}

function initializeTimer() {
    clearInterval(timerInterval);
    let timer = 0, minutes, seconds;
    start_time = new Date().getTime();
    const countdown = document.getElementById('countdown');
    timerInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        countdown.textContent = minutes + ":" + seconds;
        timer++;
    }, 1000);
}

function setAIImage(name) {
    document.getElementById("ai_image").src = "images/sketchs/" + name + ".png";
}

let isAIClockEnabled = Date.now();

function initAIClock(delay) {

    isAIClockEnabled = Date.now();
    let isAIClockEnabled2 = Number(isAIClockEnabled);

    const FPS = 30;
    const start_time = Date.now();

    let o = document.getElementById("ai_image_hide");
    o.style.top = "0px";
    o.style.height = "400px";

    return new Promise(async (resolve, reject) => {

        while (isAIClockEnabled === isAIClockEnabled2 && Date.now() - start_time < delay) {

            const p = Math.min((Date.now() - start_time) / delay, 1.0);
            
            o.style.top = String(Math.floor(p * 400.0)) + "px";
            o.style.height = String(400 - Math.floor(p * 400.0)) + "px";

            await new Promise(r => setTimeout(r, Math.floor(1000 / FPS)));
        }

        o.style.top = "400px";
        o.style.height = "0px";

        if (isAIClockEnabled === isAIClockEnabled2)
            finishRound();

        o.style.top = "0px";
        o.style.height = "400px";

        resolve()
    });
}

function stopAIClock() {
    isAIClockEnabled = Date.now();
}

function finishRound() {
    stopAIClock();
    const end_time = new Date().getTime();
    const time_diff = end_time - start_time;
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
    window.location.href = `end_game.html?mode=ai&player_name=${player_name}&score=${scores.reduce((a, b) => a + b, 0)}&mean_time=${mean_time_player}&difficulty=${difficulty}&totalRounds=${totalRounds}`;
}

function resetGameForNextRound() {
    selectRandomPrompt();
    setAIImage(promptText);
    initializeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initializeTimer();
    drawingStarted = false;
}

function startPosition(e) {
    if (!drawingStarted) {
        drawingStarted = true;
        initAIClock(DIFFICULTY_DELAY[difficulty] || 20000);
    }

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

drawingStarted = false;
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
    fetch('/api/predict_with_file', {
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
