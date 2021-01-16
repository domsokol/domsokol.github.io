// global variables
var speedOfPaddle1 = 0;
const startPositionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var positionOfPaddle1 = document.getElementById("paddle1").offsetTop;
var speedOfPaddle2 = 0;
const startPositionOfPaddle2 = document.getElementById("paddle2").offsetTop;
var positionOfPaddle2 = document.getElementById("paddle2").offsetTop;

var score1 = 0;
var score2 = 0;

var message1 = "Tie Game";
var message2 = "Close to continue.";

const paddleHeight = document.getElementById("paddle1").offsetHeight;
const paddleWidth = document.getElementById("paddle1").offsetWidth;

const gameboardHeight = document.getElementById("gameBoard").offsetHeight;
const gameboardWidth = document.getElementById("gameBoard").offsetWidth;

const ballHeight = document.getElementById("ball").offsetHeight;

const startTopPositionOfBall = document.getElementById("ball").offsetTop;
const startLeftPositionOfBall = document.getElementById("ball").offsetLeft;

var topPositionOfBall = startTopPositionOfBall;
var leftPositionOfBall = startLeftPositionOfBall;
var topSpeedOfBall = 0;
var leftSpeedOfBall = 0;

var bounce = new sound("jump.mp3");
var ballOutOfBounds = new sound("buzzer.mp3");

// used to control game start/stop
var controlPlay;

// start ball motion
/*window.addEventListener('load', function() {
  startBall();
});*/

// Move paddles
document.addEventListener('keydown', function(e) {
  //console.log("key down" + e.keyCode);
  if (e.keyCode == 87 || e.which == 87) { // W key
    speedOfPaddle1 = -10;
  } // if
  if (e.keyCode == 83 || e.which == 83) { // S key
    speedOfPaddle1 = 10;
  } // if
  if (e.keyCode == 38 || e.which == 38) { // up arrow
    speedOfPaddle2 = -10;
  } // if
  if (e.keyCode == 40 || e.which == 40) { // down arrow
    speedOfPaddle2 = 10;
  } // if
});

// Stop paddles
document.addEventListener('keyup', function(e) {
  //console.log("key up" + e.keyCode);
  if (e.keyCode == 87 || e.which == 87) { // W key
    speedOfPaddle1 = 0;
  } // if
  if (e.keyCode == 83 || e.which == 83) { // S key
    speedOfPaddle1 = 0;
  } // if
  if (e.keyCode == 38 || e.which == 38) { // up arrow
    speedOfPaddle2 = 0;
  } // if
  if (e.keyCode == 40 || e.which == 40) { // down arrow
    speedOfPaddle2 = 0;
  } // if
});

// object constructor to play sounds
// https://www.w3schools.com/graphics/game_sound.asp
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
} // sound

// start the ball movement
function startBall() {
  let directionX = 1;
  let directionY = 1;
  topPositionOfBall = startTopPositionOfBall;
  leftPositionOfBall = startLeftPositionOfBall;
  
  // 50% chance of starting either direction (right or left)
  if (Math.random() < 0.5) {
    directionY = 1;
  } else {
    directionY = -1;
  } // else
  if (Math.random() < 0.5) {
    directionX = 1;
  } else {
    directionX = -1;
  } // else
  
  topSpeedOfBall = directionX * (Math.random() * 2 + 3); // 3-4.999
  leftSpeedOfBall = directionY * (Math.random() * 2 + 3);
} // startBall

// update locations of paddles and ball
function show() {
    
  // update positions of elements
  positionOfPaddle1 += speedOfPaddle1;
  positionOfPaddle2 += speedOfPaddle2;
  topPositionOfBall += topSpeedOfBall;
  leftPositionOfBall += leftSpeedOfBall;
  
  // stop paddle from leaving top of gameboard
  if (positionOfPaddle1 <= 0) {
    positionOfPaddle1 = 0;
  } // if
  if (positionOfPaddle2 <= 0) {
    positionOfPaddle2 = 0;
  } // if
  
  // stop the paddle from leaving bottom of gameboard
  if (positionOfPaddle1 >= gameboardHeight - paddleHeight) {
    positionOfPaddle1 = gameboardHeight - paddleHeight;
  } // if
  if (positionOfPaddle2 >= gameboardHeight - paddleHeight) {
    positionOfPaddle2 = gameboardHeight - paddleHeight;
  } // if
  
  // if ball hits top or bottom of gameboard, change direction
  if (topPositionOfBall <= 0 || topPositionOfBall >= gameboardHeight - ballHeight) {
    topSpeedOfBall *= -1;
  } // if
  
  // ball of left edge of gameboard
  if (leftPositionOfBall <= paddleWidth) {
    
    // if ball hits left paddle, change direction
    if (topPositionOfBall > positionOfPaddle1 && topPositionOfBall < positionOfPaddle1 + paddleHeight) {
      bounce.play();
      leftSpeedOfBall *= -1;
    } else {
      ballOutOfBounds.play();
      score2++;
      document.getElementById("score2").innerHTML = score2;
      startBall();
    } // else
  } // if
  
  // ball of right edge of gameboard
  if (leftPositionOfBall >= gameboardWidth - paddleWidth - ballHeight) {
    
    // if ball hits right paddle, change direction
    if (topPositionOfBall > positionOfPaddle2 && topPositionOfBall < positionOfPaddle2 + paddleHeight) {
      bounce.play();
      leftSpeedOfBall *= -1;
    } else {
      ballOutOfBounds.play();
      score1++;
      document.getElementById("score1").innerHTML = score1;
      startBall();
    } // else
  } // if
  
  // stop game if a player reaches 15 points
  if (score1 == 15) {
    window.clearInterval(controlPlay);
    controlPlay = false;
    
    message1 = "Player 1 wins with " + score1 + " points!";
    message2 = "Player 2 had " + score2 + " points!";
    
    showLightBox(message1, message2);
  } else if (score2 == 15) {
    window.clearInterval(controlPlay);
    controlPlay = false;
    
    message1 = "Player 2 wins with " + score2 + " points!";
    message2 = "Player 1 had " + score1 + " points!";
    
    showLightBox(message1, message2);
  } // else
  
  document.getElementById("paddle1").style.top = positionOfPaddle1 + "px";
  document.getElementById("paddle2").style.top = positionOfPaddle2 + "px";
  document.getElementById("ball").style.top = topPositionOfBall + "px";
  document.getElementById("ball").style.left = leftPositionOfBall + "px";
  
} // show

//resume game play
function resumeGame() {
  if (!controlPlay) {
    controlPlay = window.setInterval(show, 1000/60);
  } // if
} // resumeGame

// pause game play
function pauseGame() {
  window.clearInterval(controlPlay);
  controlPlay = false;
} // pauseGame

//start game play
function startGame() {
  
  // reset scores, ball and paddle positions
  score1 = 0;
  score2 = 0;
  document.getElementById("score1").innerHTML = score1;
  document.getElementById("score2").innerHTML = score2;
  positionOfPaddle1 = startPositionOfPaddle1;
  positionOfPaddle2 = startPositionOfPaddle2;
  
  startBall();
  
  if (!controlPlay) {
    controlPlay = window.setInterval(show, 1000/60);
  } // if
} // startGame

// stop game play
function stopGame() {
  window.clearInterval(controlPlay);
  controlPlay = false;

  if (score2 > score1) {
    message1 = "Player 2 wins with " + score2 + " points!";
    message2 = "Player 1 had " + score1 + " points!";
  } else if (score1 > score2) {
    message1 = "Player 1 wins with " + score1 + " points!";
    message2 = "Player 2 had " + score2 + " points!";
  } // else
  
  showLightBox(message1, message2);
} // stopGame

/***** Lightbox Code *****/

// change the visibility of ID
function changeVisibility(divId) {
	let elem = document.getElementById(divId);
	
	// if element exists, it is considered true
	if (elem) {
		elem.className = (elem.className == 'hidden') ? 'unhidden' : 'hidden';
	} // if
	
} //changeVisibility

// display message in lightbox
function showLightBox(message, message2) {
  
  // set messages
  document.getElementById("message").innerHTML = message;
  document.getElementById("message2").innerHTML = message2;
  
  // show lightbox
  changeVisibility("lightbox");
  changeVisibility("boundaryMessage");
} // showLightBox

// close lightbox
function continueGame() {
  changeVisibility("lightbox");
  changeVisibility("boundaryMessage");
} // continueGame

/***** End Lightbox Code *****/