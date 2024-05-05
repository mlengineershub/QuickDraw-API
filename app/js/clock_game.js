document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get('difficulty');
    const timeLimit = difficulty === 'hard' ? 20 : 30; 

    initializeTimer(timeLimit);
    initializeCanvas();
    selectRandomPrompt();
});

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

function initializeCanvas() {
    const canvas = document.getElementById('drawCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;

    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
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

    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', finishedPosition);
    canvas.addEventListener('mousemove', draw);
}

document.addEventListener("DOMContentLoaded", function () {
    initializeCanvas();
});

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

function callPredictionAPI() {
    document.getElementById('predictionText').innerText = "Predicting...";
    setTimeout(() => {
        document.getElementById('predictionText').innerText = "Prediction: Example with 95% confidence";
    }, 2000);
}
