let canvas = document.getElementById('myCanvas');
let gameOverText = document.querySelector('#gameOverText');
let scoreNumber = document.getElementById('scoreNumber');

let context = canvas.getContext('2d');
context.font = "bold 30px sans-serif";

// camerY - drag the position
let scroll_Counter, camerY, current = 1, mode, xSpeed;
// current -> no. of boxes 
// score = current - 1

let ySpeed = 5;
let height = 50;

let boxes = [];

boxes[0] = {
    x: 300,
    y: 300,
    width: 200
}

let debris = {
    x: 0,
    width: 0,
}

function newBox() {
    boxes[current] = {
        x: 0,
        y: (current + 10) * height,
        width: boxes[current - 1].width
    }
    // current++; // Increment current when a new box is created
    // mode = 'bounce';
}

function gameOver() {
    // show game over text
    mode = 'gameOver';
    gameOverText.style.display = 'block';
}

function animateGame() {
    if (mode != 'gameOver') {
        // bounce or fall
        context.clearRect(0, 0, canvas.width, canvas.height);
        scoreNumber.innerHTML = current - 1;

        for (let n = 0; n < boxes.length; n++) {
            let box = boxes[n];
            context.fillStyle = 'rgb(' + n * 16 + ',' + n * 16 + ',' + n * 16 + ')';
            context.fillRect(box.x, 600 - box.y + camerY, box.width, height);
        }

        context.fillStyle = 'yellow';
        context.fillRect(debris.x, 600 - debris.y + camerY, debris.width, height);

        if (mode == 'bounce' && boxes[current]) {
            boxes[current].x = boxes[current].x + xSpeed;
            if (xSpeed > 0 && boxes[current].x + boxes[current].width > canvas.width) {
                xSpeed = -xSpeed;
            }
            if (xSpeed < 0 && boxes[current].x < 0) {
                xSpeed = -xSpeed;
            }
        }

        if (mode == 'fall' && boxes[current]) {
            // falling of box
            boxes[current].y = boxes[current].y - ySpeed;
            if (boxes[current].y == boxes[current - 1].y + height) {
                mode = 'bounce';

                let difference = boxes[current].x - boxes[current - 1].x;
                if (Math.abs(difference) >= boxes[current].width) {
                    gameOver();
                }

                debris = {
                    y: boxes[current].y,
                    width: difference
                }

                // cut from right side 
                if (boxes[current].x > boxes[current - 1].x) {
                    boxes[current].width = boxes[current].width - difference;
                    debris.x = boxes[current].x + boxes[current].width;
                }

                // cut from left side 
                else{
                    debris.x = boxes[current].x - difference ;
                    boxes[current].width = boxes[current].width + difference;
                    boxes[current].x = boxes[current-1].x ; 
                }

                // INCREASE SPEED OF BOUNCED
                if (xSpeed > 0){
                    xSpeed++;
                }
                // DECREASE SPEED OF BOUNCED
                else{
                    xSpeed--;
                }
                    

                current++;
                scroll_Counter = height;
                newBox();

            }
        }

        debris.y = debris.y - ySpeed ;

        if (scroll_Counter) {
            camerY++;
            scroll_Counter--;
        }
    }
    window.requestAnimationFrame(animateGame);
}

function restartGame() {
    if (gameOverText) {
        gameOverText.style.display = 'none';
    }
    boxes.splice(1, boxes.length - 1); // remove all boxes except the first one
    mode = 'bounce';
    camerY = 0;
    scroll_Counter = 0;
    xSpeed = 2;
    current = 1; // Initialize current to 1
    newBox();
    debris.y = 0;
}

canvas.onpointerdown = function () {
    if (mode == "gameOver") {
        restartGame();
    }
    else {
        if (mode == 'bounce') {
            mode = 'fall';
        }
    }
};

restartGame();
animateGame();