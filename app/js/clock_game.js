// const canvas = document.getElementById('drawCanvas');
// const ctx = canvas.getContext('2d', { willReadFrequently: true });
// canvas.width = 400;
// canvas.height = 400;
// let painting = false;
// let intervalId = null;

// function selectRandomPrompt() {
//     const prompts = {
//         "airplane": "✈️",
//         "banana": "🍌",
//         "computer": "💻",
//         "dog": "🐶",
//         "elephant": "🐘",
//         "fish": "🐟",
//         "garden": "🌼",
//         "helmet": "⛑️",
//         "ice cream": "🍦",
//         "jail": "🏛️",
//         "key": "🔑",
//         "lantern": "🏮",
//         "motorbike": "🏍️",
//         "necklace": "📿",
//         "onion": "🧅",
//         "penguin": "🐧",
//         "raccoon": "🦝",
//         "sandwich": "🥪",
//         "table": "🪑",
//         "underwear": "🩲",
//         "vase": "🏺",
//         "watermelon": "🍉",
//         "yoga": "🧘",
//         "zigzag": "〰️"
//     };

//     const promptKeys = Object.keys(prompts);
//     const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
//     const randomPrompt = `${prompts[randomKey]} ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}`;
//     document.getElementById('randomPrompt').innerText = randomPrompt;
// }

// function initializeTimer(duration) {
//     let timer = duration, minutes, seconds;
//     const countdown = document.getElementById('countdown');
//     const interval = setInterval(function () {
//         minutes = parseInt(timer / 60, 10);
//         seconds = parseInt(timer % 60, 10);

//         minutes = minutes < 10 ? "0" + minutes : minutes;
//         seconds = seconds < 10 ? "0" + seconds : seconds;

//         countdown.textContent = minutes + ":" + seconds;

//         if (--timer < 0) {
//             clearInterval(interval);
//             finishGame();
//         }
//     }, 1000);
// }

// function finishGame() {
//     alert("Time's up! Let's see how you did.");
//     callPredictionAPI();
// }

// document.addEventListener("DOMContentLoaded", function () {
//     const params = new URLSearchParams(window.location.search);
//     const difficulty = params.get('difficulty');
//     const timeLimit = difficulty === 'hard' ? 20 : 30;

//     initializeTimer(timeLimit);
//     initializeCanvas();
//     selectRandomPrompt();
// });


// function startPosition(e) {
//     painting = true;
//     draw(e);
//     intervalId = setInterval(callPredictionAPI, 1500); // Start calling the API every 1.5 seconds
// }

// function finishedPosition() {
//     painting = false;
//     clearInterval(intervalId); // Stop calling the API when the user stops drawing
//     ctx.beginPath();
//     callPredictionAPI(); // Call one last time on finish

// }

// function draw(e) {
//     if (!painting) return;
//     ctx.lineWidth = 5;
//     ctx.lineCap = 'round';
//     ctx.strokeStyle = 'black';

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     ctx.lineTo(x, y);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(x, y);
// }

// function initializeCanvas() {
//     canvas.addEventListener('mousedown', startPosition);
//     canvas.addEventListener('mouseup', finishedPosition);
//     canvas.addEventListener('mousemove', draw);
// }

// function dataURItoBlob(dataURI) {
//     // Decode the dataURL
//     const byteString = atob(dataURI.split(',')[1]);

//     // Get the mime type from the dataURL
//     const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

//     // Construct a byte array
//     const ia = new Uint8Array(byteString.length);
//     for (let i = 0; i < byteString.length; i++) {
//         ia[i] = byteString.charCodeAt(i);
//     }

//     // Create and return a blob from the byte array
//     return new Blob([ia], { type: mimeString });
// }

// function extractImage() {
//     /*
//     This function extracts the image from the canvas, converts it to a Blob, 
//     and returns the Blob for uploading.
//     */
//     const image = canvas.toDataURL('image/png');
//     const imageBlob = dataURItoBlob(image);
//     return imageBlob;
// }

// function callPredictionAPI() {
//     const imageBlob = extractImage(); // Get the Blob from the canvas
//     const formData = new FormData();
//     formData.append('file', imageBlob);

//     fetch('http://127.0.0.1:8000/predict_with_file', {
//         method: 'POST',
//         body: formData
//     })
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('predictionText').innerText = `Prediction: ${data.pred_label} with ${data.max_prob * 100}% confidence`;
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             document.getElementById('predictionText').innerText = "Error making prediction";
//         });
// }


const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 400;
canvas.height = 400;
let painting = false;
let intervalId = null;
let currentRound = 1;
let totalRounds = parseInt(new URLSearchParams(window.location.search).get('totalRounds'));
let scores = new Array(totalRounds).fill(0); // Initialize scores array
let X = null;
const timeLimit = new URLSearchParams(window.location.search).get('difficulty') === 'hard' ? 20 : 30;


function selectRandomPrompt() {
    const prompts = {
        "airplane": "✈️", "banana": "🍌", "computer": "💻", "dog": "🐶", "elephant": "🐘",
        "fish": "🐟", "garden": "🌼", "helmet": "⛑️", "ice cream": "🍦", "jail": "🏛️",
        "key": "🔑", "lantern": "🏮", "motorbike": "🏍️", "necklace": "📿", "onion": "🧅",
        "penguin": "🐧", "raccoon": "🦝", "sandwich": "🥪", "table": "🪑", "underwear": "🩲",
        "vase": "🏺", "watermelon": "🍉", "yoga": "🧘", "zigzag": "〰️"
    };
    const promptKeys = Object.keys(prompts);
    const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
    const randomPrompt = `${prompts[randomKey]} ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}`;
    X = randomKey;
    document.getElementById('randomPrompt').innerText = randomPrompt;
}

function initializeTimer(duration) {
    let timer = duration, minutes, seconds;
    const countdown = document.getElementById('countdown');
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        countdown.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(interval);
            finishRound();
        }
    }, 1000);
}

function finishRound() {
    // get the final prediction before updating the score
    callPredictionAPI();
    const scoreForRound = document.getElementById('predictionText').innerText.includes(X) ? 1 : 0;
    updateScore(scoreForRound);
}

function updateScore(newScore) {
    scores[currentRound - 1] = newScore;
    document.getElementById('currentRound').innerText = `Round ${currentRound}: Your score is ${newScore}`;
    // total score = sum of all scores
    document.getElementById('previousScores').innerText = `Total Score: ${scores.reduce((a, b) => a + b, 0)}`;
    if (currentRound < totalRounds) {
        currentRound++;
        resetGameForNextRound();
    } else {
        finishGame();
    }
}

function finishGame() {
    alert(`Game Over! Here are your scores: ${scores.join(', ')}`);
    // Optionally reset the game or redirect the user
}

function resetGameForNextRound() {
    selectRandomPrompt();
    initializeCanvas();
    // clear the canvas
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
    // if the user draws something and the prediction is correct, update the score and move to the next round

    if (document.getElementById('predictionText').innerText.includes(X)) {
        updateScore(1);
        // reset the clock for the next round
        clearInterval(intervalId);
    }

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
    fetch('http://127.0.0.1:8000/predict_with_file', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('predictionText').innerText = `Prediction: ${data.pred_label} with ${data.max_prob * 100}% confidence`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('predictionText').innerText = "Error making prediction";
        });
}

document.addEventListener("DOMContentLoaded", function () {
    resetGameForNextRound();
});
