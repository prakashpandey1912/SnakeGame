var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;
var animationTime = 120;
var animationSpeed = 3;
var score = 00;
let hightestScore;
var timeoutId = null;
var directions = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var drawBorder = function () {
	ctx.fillStyle = 'Gray';
	ctx.fillRect(0, 0, width, blockSize);
	ctx.fillRect(0, height - blockSize, width, blockSize);
	ctx.fillRect(0, 0, blockSize, height);
	ctx.fillRect(width - blockSize, 0, blockSize, height);
};
var drawScore = function () {
	ctx.font = '20px Courier';
	ctx.fillStyle = 'Black';
	ctx.textAlign = 'left';
	ctx.textBaseline = 'top';
	ctx.fillText('Score:' +score, width-blockSize-10*10, blockSize);
	
};
var circle = function (x, y, radius) {
	ctx.beginPath();
	ctx.arc(x,y,radius, 0, 2 * Math.PI);
	ctx.fill(); 
};

var Block = function (col, row) {
	this.col = col;
	this.row = row;
};
Block.prototype.drawCircle = function (color) {
	var centerX = this.col * blockSize + blockSize / 2;
	var centerY = this.row * blockSize + blockSize / 2;
	ctx.fillStyle = color;
	circle(centerX, centerY, blockSize / 2);
};
Block.prototype.equal = function (otherBlock) {
return this.col === otherBlock.col && this.row === otherBlock.row;
};



var Snake = function () {
	this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
	this.direction = 'right';
	this.nextDirection = 'right';
};
Snake.prototype.draw = function () {
	this.segments[0].drawCircle('Red');
	for (var i = 1; i < this.segments.length; i++) {
		this.segments[i].drawCircle('Black');
		if (i % 2) {
			this.segments[i].drawCircle('Black');
		}
	}
};
Snake.prototype.move = function () {
	var head = this.segments[0];
	var newHead = null;
	this.direction = this.nextDirection;

	if (this.direction === 'right') {
		newHead = new Block(head.col + 1, head.row);
	} else if (this.direction === 'down') {
		newHead = new Block(head.col, head.row + 1);
	} else if (this.direction === 'left') {
		newHead = new Block(head.col - 1, head.row);
	} else if (this.direction === 'up') {
		newHead = new Block(head.col, head.row - 1);
	}

	if (this.checkCollision(newHead)) {
		gameOver();
		return;
	}

	this.segments.unshift(newHead);

	if (newHead.equal(food.position)) {
		score++;
		food.move();
		animationTime -= animationSpeed;
		console.log(animationTime);
	} else {
		this.segments.pop();
	}
};
Snake.prototype.checkCollision = function (head) {
	var leftCollision = (head.col === 0);
	var topCollision = (head.row === 0);
	var rightCollision = (head.col === widthInBlocks - 1);
	var bottomCollision = (head.row === heightInBlocks - 1);

	var wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
	var selfCollision = false;

	for (var i = 0; i < this.segments.length; i++) {
		if (head.equal(this.segments[i])) {
			selfCollision = true;
		}
	}

	return wallCollision || selfCollision;
};
Snake.prototype.setDirection = function (newDirection) {

	if (this.direction === 'up' && newDirection === 'down') {
		return;
	} else if (this.direction === 'right' && newDirection === 'left') {
		return;
	}
	 else if (this.direction === 'down' && newDirection === 'up') {
		return;
	} else if (this.direction === 'left' && newDirection === 'right') {
		return;
	}
	this.nextDirection = newDirection;
};

var Food = function () {
	this.position = new Block(30, 30);
};
Food.prototype.draw = function () {
	this.position.drawCircle('Red');
};
Food.prototype.move = function () {
	for (var i = 0; i < snake.segments.length; i++) {
		while (this.position.equal(snake.segments[i])) {
			var randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
			var randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
			this.position = new Block(randomCol, randomRow);
		}
	}
};

var snake = new Snake();
var food = new Food();


var gameLoop = function () {
	ctx.clearRect(0,0, width, height);
	snake.move();
	snake.draw();
	food.draw();
	drawScore();
	drawBorder();
	timeoutId = setTimeout(gameLoop, animationTime);
};

gameLoop();

var gameOver = function () {
	ctx.font = '30px Courier';
	ctx.strokStyle = 'Black';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText('Game Over', width / 2, (height / 2)-30);
	ctx.fillText('Score:'+ score,width / 2, (height / 2)+10);
	ctx.fillText('Thank You',width / 2, (height / 2) + 60);
	ctx.fillText('Play Again',width / 2, (height / 2) + 90);
	ctx.fillText('Created by:-Prakash',width / 2, (height / 2) + 140);
	ctx.fillText('Pandey',(width / 2)+100, (height / 2) + 170);
	
	$('body').off('keydown');

	};

$('body').keydown(function (event) 
{
var newDirection = directions[event.keyCode];
if (newDirection !== undefined) 
{
snake.setDirection(newDirection);
}
});