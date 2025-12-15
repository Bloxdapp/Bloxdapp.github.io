const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Player
let player = { x: 100, y: 100, size: 30, color: "yellow", speed: 4, inBoat: false };

// Boat
let boat = null;

// Islands
const islands = [
    { x: 150, y: 400, width: 200, height: 80, color: "green" },
    { x: 500, y: 150, width: 200, height: 100, color: "darkgreen" }
];

// Fishing
let fishing = false;
let fishingStart = 0;
let clicks = 0;

// Input
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
canvas.addEventListener("mousedown", handleClick);

// Message display
const messageDiv = document.getElementById("message");

function handleClick() {
    if (fishing) clicks++;
}

function draw() {
    // Clear
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw islands
    islands.forEach(isle => {
        ctx.fillStyle = isle.color;
        ctx.fillRect(isle.x, isle.y, isle.width, isle.height);
        // Decorations: some trees
        ctx.fillStyle = "darkolivegreen";
        for(let i=0; i<5; i++){
            ctx.beginPath();
            ctx.arc(isle.x + 20 + i*30, isle.y + 10, 10, 0, Math.PI*2);
            ctx.fill();
        }
    });

    // Draw boat
    if (boat) {
        ctx.fillStyle = "brown";
        ctx.fillRect(boat.x, boat.y, 60, 30);
    }

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

function update() {
    // Player movement
    let speed = player.inBoat && boat ? 3 : player.speed;
    if (keys["ArrowLeft"]) player.x -= speed;
    if (keys["ArrowRight"]) player.x += speed;
    if (keys["ArrowUp"]) player.y -= speed;
    if (keys["ArrowDown"]) player.y += speed;

    // Boat movement
    if (player.inBoat && boat) {
        boat.x = player.x - 15;
        boat.y = player.y - 5;
    }

    // Check water (not on island)
    let onIsland = islands.some(isle => player.x + player.size > isle.x && player.x < isle.x + isle.width && player.y + player.size > isle.y && player.y < isle.y + isle.height);
    let inWater = !onIsland;

    // Spawn boat if touching water and no boat yet
    if (inWater && !boat) {
        boat = { x: player.x - 15, y: player.y - 5 };
        player.inBoat = true;
    }

    // Fishing
    if (keys["f"] && inWater && !fishing) {
        fishing = true;
        clicks = 0;
        messageDiv.style.display = "none";
        setTimeout(() => {
            messageDiv.innerText = "You caught a fish! Click 10 times in 5 seconds!";
            messageDiv.style.display = "block";
            fishingStart = Date.now();
            // End fishing after 5 sec
            setTimeout(() => {
                if (clicks >= 10) {
                    messageDiv.innerText = "Fish successfully caught!";
                } else {
                    messageDiv.innerText = "Fish escaped!";
                }
                setTimeout(() => { messageDiv.style.display = "none"; fishing=false; }, 2000);
            }, 5000);
        }, 5000); // wait 5 sec before showing message
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
