document.getElementById('playTime').addEventListener('click', () => {
    window.location.href = 'game.html?mode=time';
});

document.getElementById('playAI').addEventListener('click', () => {
    window.location.href = 'game.html?mode=ai';
});
