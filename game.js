const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.addEventListener("keydown", handleKeyPress);

const BOAT_WIDTH = 80;
const BOAT_HEIGHT = 30;
const OAR_LENGTH = 40;
const TOTAL_DISTANCE = 2000;
const NUM_AI_BOATS = 6;

const boats = [
    { x: 100, y: 100, speed: 0, color: "red", progress: 0 }, // Player
    { x: 100, y: 150, speed: Math.random() * 3 + 2, color: "blue", progress: 0 }
];

for (let i = 0; i < NUM_AI_BOATS; i++) {
    boats.push({ x: 100, y: 200 + i * 50, speed: Math.random() * 3 + 2, color: "gray", progress: 0 });
}

const player = boats[0];
const game = { timeLeft: 30, isGameOver: false };
let lastKey = null;

function handleKeyPress(event) {
    if (game.isGameOver) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (lastKey !== event.key) {
            player.speed = Math.min(player.speed + 0.5, 5);
            lastKey = event.key;
        }
    }
}

function updateGame() {
    if (game.isGameOver) return;
    
    // Move boats
    for (let boat of boats) {
        boat.progress += boat.speed;
        if (boat.progress >= TOTAL_DISTANCE) {
            game.isGameOver = true;
        }
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw water
    ctx.fillStyle = "#87CEEB";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw finish line
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width - 50, 0, 10, canvas.height);
    
    // Draw boats and oars
    boats.forEach((boat) => {
        ctx.fillStyle = boat.color;
        ctx.fillRect(boat.x, boat.y, BOAT_WIDTH, BOAT_HEIGHT);
        
        // Draw oars
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(boat.x + BOAT_WIDTH / 2, boat.y);
        ctx.lineTo(boat.x + BOAT_WIDTH / 2 + OAR_LENGTH * Math.sin(Date.now() / 200), boat.y - OAR_LENGTH * Math.cos(Date.now() / 200));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(boat.x + BOAT_WIDTH / 2, boat.y + BOAT_HEIGHT);
        ctx.lineTo(boat.x + BOAT_WIDTH / 2 - OAR_LENGTH * Math.sin(Date.now() / 200), boat.y + BOAT_HEIGHT + OAR_LENGTH * Math.cos(Date.now() / 200));
        ctx.stroke();
    });
    
    // Draw progress bar
    ctx.fillStyle = "gray";
    ctx.fillRect(50, 20, 300, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(50, 20, (player.progress / TOTAL_DISTANCE) * 300, 10);
    
    // Draw speed tracker
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Speed: ${player.speed.toFixed(2)} m/s`, 400, 50);
    ctx.fillText(`Distance: ${player.progress.toFixed(0)} / ${TOTAL_DISTANCE} m`, 400, 80);
    
    // Check for winner
    if (game.isGameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(player.progress >= TOTAL_DISTANCE ? "You Win!" : "Game Over!", canvas.width / 2 - 50, canvas.height / 2);
    }
}

function gameLoop() {
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

gameLoop();
