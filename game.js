const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", handleKeyPress);

const boat = {
    x: 100,
    y: canvas.height / 2,
    width: 50,
    height: 20,
    speed: 0,
    maxSpeed: 5,
    acceleration: 0.5,
    friction: 0.05
};

const game = {
    timeLeft: 30, // 30 seconds to finish
    distance: 1000, // Distance to row
    progress: 0,
    isGameOver: false
};

let lastKey = null;

function handleKeyPress(event) {
    if (game.isGameOver) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (lastKey !== event.key) {
            boat.speed += boat.acceleration;
            if (boat.speed > boat.maxSpeed) boat.speed = boat.maxSpeed;
            lastKey = event.key;
        }
    }
}

function updateGame() {
    if (game.isGameOver) return;

    // Move the boat
    game.progress += boat.speed;
    boat.speed -= boat.friction;
    if (boat.speed < 0) boat.speed = 0;

    // Update timer
    game.timeLeft -= 0.016;
    if (game.timeLeft <= 0 || game.progress >= game.distance) {
        game.isGameOver = true;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw river
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw boat
    ctx.fillStyle = "#8B0000";
    ctx.fillRect(boat.x, boat.y, boat.width, boat.height);

    // Draw progress bar
    ctx.fillStyle = "gray";
    ctx.fillRect(50, 20, 300, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(50, 20, (game.progress / game.distance) * 300, 10);

    // Draw timer
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Time Left: ${Math.max(0, game.timeLeft.toFixed(1))}s`, 400, 30);

    // Draw game over text
    if (game.isGameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(game.progress >= game.distance ? "You Win!" : "Game Over!", canvas.width / 2 - 50, canvas.height / 2);
    }
}

function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
