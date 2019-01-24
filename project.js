// <!--Student name: Ayiqiaolipan Kadierding(Abby) -->
// <!--Student number: 100248881 -->
// <!--AK-Final Project -->

let WIDTH = window.innerWidth - 20;
let HEIGHT = window.innerHeight - 30;
let SHIP_SIZE = WIDTH / 40;
let ASTEROID_SIZE = 100;
let ASTEROID_NUM = 10;
let ASTEROID_VERT = 15;
let ASTEROID_XVMAX = 1;
let isGameOver = false;
let level = 1;
let userX = 0;
let userY = 0;

function getPosition(event){
	userX = event.offsetX;
	userY = event.offsetY;
	if (isGameOver && userX >= (2 * WIDTH / 3 - 50) && userX <= (2 * WIDTH / 3 + 50) 
		&& userY >= (3 * HEIGHT / 4 - 20) && userY <= (3 * HEIGHT / 4 + 10)){
		location.reload();
	}
}


//SpaceShip object here
function SpaceShip() {
	this.x = WIDTH / 30;
	this.y = HEIGHT / 2;
	this.r = Math.floor(SHIP_SIZE / 2);

	this.render = function(ctx) {
		// Ship render/drawing goes here
		ctx.lineWidth = SHIP_SIZE / 10;
		ctx.beginPath();
		ctx.strokeStyle = "white";
		ctx.moveTo(this.x - this.r, this.y - this.r);
		ctx.lineTo(this.x + this.r, this.y);
		ctx.lineTo(this.x - this.r, this.y + this.r);
		ctx.closePath();
		ctx.stroke();
	}
	this.move = function(x, y) {
		// Ship movement goes here
		this.x += x;
		this.y += y;
	}
}

function getRand(min, max){
	return  Math.random() * (max - min) + min;
}
//Asteroids objects here
function Asteroid(){

	this.r = getRand(5, ASTEROID_SIZE / 2);
	this.x = WIDTH;
	this.y = getRand(0, HEIGHT) - this.r;
	this.xv = getRand(0.5, ASTEROID_XVMAX);
	this.yv = getRand(-0.5,0.5);
	this.a = Math.random() * Math.PI * 2;
	this.vert = Math.floor(getRand(3,ASTEROID_VERT));

	this.render = function(ctx) {
		ctx.strokeStyle = "red";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(
			this.x + this.r * Math.cos(this.a),
			this.y + this.r * Math.sin(this.a)
		);
		for (let j = 1; j <= this.vert; j++){
			ctx.lineTo(
				this.x + this.r * Math.cos(this.a + j * Math.PI * 2 / this.vert),
				this.y + this.r * Math.sin(this.a + j * Math.PI * 2 / this.vert)
			);
		}

		ctx.stroke();
		ctx.closePath();

	}

	this.move = function(){
		this.y += this.yv;
		this.x -= this.xv;
	}

}
//Cannons objects here
function Cannon(x, y) {
	this.x = x;
	this.y = y;
	this.r = SHIP_SIZE / 9;

	this.render = function(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#99ff33";
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	this.move = function(){
		this.x += 5;
	}

}
window.onload = function(){
	// Create canvas and ctx
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	let score = 0;
	var keys = (keys || []);
	let SHIP_SPD = 5;

	//Create a new spaceship
	let spaceShip = new SpaceShip();

	//Create an array of asteroid
	let asteroids = [];
	while (asteroids.length < ASTEROID_NUM){
		asteroids.push(new Asteroid());
	}
	let cannons = [];

	main();
	function main(){
		startGame();
	}

	function startGame(){
		updateGame();
		window.requestAnimationFrame(drawGame);
	}

	function updateGame() {
		if(score >= level * 200){
			ASTEROID_NUM += 10;
			console.log(ASTEROID_NUM);
			level++;
			if(level % 2 == 0){
				ASTEROID_XVMAX += 0.3;
			}
		}

		// Ship and asteroids Movement goes here
		// Up arrow key pressed - moves the spaceship
		if(keys && keys[38]) {
			if (spaceShip.y - spaceShip.r >= 5) {
				spaceShip.move(0, -SHIP_SPD);
			}
		}
		// Down arrow key pressed
		if(keys && keys[40]) {
			if((spaceShip.y + 5) < (canvas.height - canvas.height/30)) {
				spaceShip.move(0, SHIP_SPD);
			}
		}
		// Left arrow key pressed
		if(keys && keys[37]) {
			if (spaceShip.x - spaceShip.r >= 7) {
				spaceShip.move(-SHIP_SPD, 0);
			}
		}
		// Right arrow key pressed
		if(keys && keys[39]) {
			if (spaceShip.x + 5 < (canvas.width - (canvas.width/50))) {
				spaceShip.move(SHIP_SPD, 0);
			}
		}


		for(let i = 0; i < asteroids.length; i++){
				asteroids[i].move();
		}
		for(let i = 0; i< cannons.length; i++){
			cannons[i].move();
		}

			window.setTimeout(updateGame, 10);
	}

	function drawGame(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			//draw background
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			showScore();
			showLever();


			// render Ship object
			if(!isGameOver){
				spaceShip.render(ctx);
			} else {
				ctx.font = "50px Comic Sans MS";
				ctx.fillStyle = "yellow";
				ctx.textAlign = "center";
				ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2); 
				ctx.font = "30px Comic Sans MS";
				ctx.fillText("Your final score is: " + score, WIDTH / 2, HEIGHT / 2 + 50);
				ctx.font = "20px Comic Sans MS";
				ctx.fillText("Try again!", 2 * WIDTH / 3, 3 * HEIGHT / 4 ); 
			}

			// render all asteroids
			for(let i = 0; i < asteroids.length; i++){
				let a = asteroids[i];
				if(a.x + a.r > 0 && a.y + a.r > 0 && a.y - a.r < HEIGHT ){
					a.render(ctx);
				} else {
					asteroids[i] = new Asteroid();
					asteroids[i].render(ctx);
				}
				if(!isGameOver){
					isGameOver = (checkCollition(spaceShip.x + spaceShip.r, spaceShip.y + spaceShip.r,a) ||
								checkCollition(spaceShip.x + spaceShip.r, spaceShip.y - spaceShip.r, a) || 
								checkCollition(spaceShip.x - spaceShip.r, spaceShip.y + spaceShip.r, a) || 
								checkCollition(spaceShip.x - spaceShip.r, spaceShip.y - spaceShip.r, a))
				}

			}

			for(let i = 0; !isGameOver && i < cannons.length; i++){
				let isAHit = false;
				let c = cannons[i];
				for(let j = 0; j < asteroids.length; j++){
					if (checkCollition(c.x + c.r, c.y + c.r, asteroids[j])){
						isAHit = true;
						asteroids[j] = new Asteroid();
						cannons.splice(i, 1);
						score += 10;
					}
				}
				if(!isAHit){
					cannons[i].render(ctx);
				} else {
					i--;
				}
				
			}
			window.requestAnimationFrame(drawGame);
	}

	function checkCollition(x1, y1, ast){
			if ((x1 >= ast.x - ast.r) && (x1 <= ast.x + ast.r)){
				if((y1 >= ast.y - ast.r) && (y1 <= ast.y + ast.r)){
					return true;
				}
			}
			return false;
	}
	function showScore(){
		ctx.font = "20px Comic Sans MS";
		ctx.fillStyle = "green";
		ctx.textAlign = "center";
		ctx.fillText("Your score is: " + score, 100, HEIGHT - 20); 
	}
	function showLever(){
		ctx.font = "20px Comic Sans MS";
		ctx.fillStyle = "green";
		ctx.textAlign = "center";
		ctx.fillText("Your level is: " + level, 80, 30);
	}

	// Dected whether the arrow keys is pressed
	document.addEventListener("keydown", function(e){
			keys[e.keyCode] = (e.type == "keydown");
	});

	document.addEventListener('keyup', function (e) {
		if(e.keyCode == 32){
			cannons.push(new Cannon(spaceShip.x, spaceShip.y));
		} else {
			keys[e.keyCode] = (e.type == "keydown");
		}
	})
}

