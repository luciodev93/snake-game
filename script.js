const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let boxSize = 20;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
let food = {};
let direction = null;
let isPaused = false;
let isGameOver = false;
let game;

function openFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
}

function resizeCanvas() {
    const maxWidth = Math.floor((window.innerWidth - 10) / boxSize) * boxSize;
    const maxHeight = Math.floor((window.innerHeight - 85) / boxSize) * boxSize; // space for header and footer margins
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    canvas.style.margin = "5px";
    placeFood();
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById("score");
    scoreDisplay.innerHTML = `Pontos: <span style="color: lime;">${score}</span> | Maior Pontuação: <span style="color: red;">${highScore}</span>`;
}

document.addEventListener("keydown", handleKeyPress);
window.addEventListener("resize", resizeCanvas);

function handleKeyPress(event) {
    if (event.key === "Enter") {
        if (isGameOver) {
            resetGame();
        } else {
            togglePause();
        }
    } else {
        changeDirection(event);
    }
}

function togglePause() {
    if (isGameOver) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(game);
        displayMessage("Pause", "Tecle ENTER para voltar ao jogo");
    } else {
        clearMessage();
        game = setInterval(drawGame, 100);
    }
}

function displayMessage(title, subtitle) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 20);
}

function clearMessage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / boxSize) * boxSize,
        y: Math.floor(Math.random() * canvas.height / boxSize) * boxSize
    };
}

function drawGame() {
    if (isPaused || isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#00FF00" : "#008000";
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= boxSize;
    if (direction === "UP") snakeY -= boxSize;
    if (direction === "RIGHT") snakeX += boxSize;
    if (direction === "DOWN") snakeY += boxSize;

    if (snakeX === food.x && snakeY === food.y) {
        score += 100;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
        updateScoreDisplay();
        placeFood();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };
    if (isCollision(newHead, snake) || snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        endGame();
        return;
    }

    snake.unshift(newHead);
}

function isCollision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function endGame() {
    clearInterval(game);
    isGameOver = true;
    displayMessage("Game Over", "Tecle ENTER para começar um novo jogo");
}

function resetGame() {
    snake = [{ x: 9 * boxSize, y: 9 * boxSize }];
    score = 0;
    direction = null;
    isPaused = false;
    isGameOver = false;
    updateScoreDisplay();
    placeFood();
    game = setInterval(drawGame, 100);
}

resizeCanvas();
placeFood();
updateScoreDisplay();
game = setInterval(drawGame, 100);
