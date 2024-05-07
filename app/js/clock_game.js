const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 400;
canvas.height = 400;
let painting = false;
let intervalId = null;

function selectRandomPrompt() {
    const prompts = {
        "airplane": "✈️",
        "banana": "🍌",
        "computer": "💻",
        "dog": "🐶",
        "elephant": "🐘",
        "fish": "🐟",
        "garden": "🌼",
        "helmet": "⛑️",
        "ice cream": "🍦",
        "jail": "🏛️",
        "key": "🔑",
        "lantern": "🏮",
        "motorbike": "🏍️",
        "necklace": "📿",
        "onion": "🧅",
        "penguin": "🐧",
        "raccoon": "🦝",
        "sandwich": "🥪",
        "table": "🪑",
        "underwear": "🩲",
        "vase": "🏺",
        "watermelon": "🍉",
        "yoga": "🧘",
        "zigzag": "〰️"
    };

    const promptKeys = Object.keys(prompts);
    const randomKey = promptKeys[Math.floor(Math.random() * promptKeys.length)];
    const randomPrompt = `${prompts[randomKey]} ${randomKey.charAt(0).toUpperCase() + randomKey.slice(1)}`;
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
            finishGame();
        }
    }, 1000);
}

function finishGame() {
    alert("Time's up! Let's see how you did.");
    callPredictionAPI();
}

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get('difficulty');
    const timeLimit = difficulty === 'hard' ? 20 : 30;

    initializeTimer(timeLimit);
    initializeCanvas();
    selectRandomPrompt();
});


function startPosition(e) {
    painting = true;
    draw(e);
    intervalId = setInterval(callPredictionAPI, 1500); // Start calling the API every 1.5 seconds
}

function finishedPosition() {
    painting = false;
    clearInterval(intervalId); // Stop calling the API when the user stops drawing
    ctx.beginPath();
    callPredictionAPI(); // Call one last time on finish

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
    // Decode the dataURL
    const byteString = atob(dataURI.split(',')[1]);

    // Get the mime type from the dataURL
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Construct a byte array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // Create and return a blob from the byte array
    return new Blob([ia], { type: mimeString });
}

function extractImage() {
    /*
    This function extracts the image from the canvas, converts it to a Blob, 
    and returns the Blob for uploading.
    */
    const image = canvas.toDataURL('image/png');
    const imageBlob = dataURItoBlob(image);
    return imageBlob;
}

function callPredictionAPI() {
    const imageBlob = extractImage(); // Get the Blob from the canvas
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
