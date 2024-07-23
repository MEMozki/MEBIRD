const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 1.5,
    lift: -25,
    velocity: 0
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 100;
let frame = 0;
let score = 0;
let balance = parseInt(localStorage.getItem('balance')) || 0;

document.getElementById('balance').innerText = `Balance: ${balance}`;
document.addEventListener('keydown', () => bird.velocity = bird.lift);

function drawBird() {
    context.fillStyle = '#ff69b4';
    context.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        context.fillStyle = '#ff69b4';
        context.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        context.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
        pipe.x -= 2;

        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
            balance++;
            localStorage.setItem('balance', balance);
            document.getElementById('score').innerText = `Score: ${score}`;
            document.getElementById('balance').innerText = `Balance: ${balance}`;
        }
    });

    if (frame % 90 === 0) {
        const top = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, top });
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        resetGame();
    }
}

function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];

        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.top + pipeGap)) {
            resetGame();
        }
    }
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    document.getElementById('score').innerText = `Score: ${score}`;
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    checkCollision();
    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
