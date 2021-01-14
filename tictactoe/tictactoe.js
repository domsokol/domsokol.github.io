let currentPlayer = "X";
let gameStatus = ""; // "" - continue game, "Tie", "X Wins", "O Wins" 
let numTurns = 0;
let idNames = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

// reser board and all variables
function newGame() {
  
  // reset board
  for (var i = 0; i < idNames.length; i++) {
    document.getElementById(idNames[i]).innerHTML = "";
  } // for
  
  numTurns = 0;
  gameStatus = "";
  currentPlayer = "X";
  
  changeVisibility("controls");
} // newGame

// randomly chooses a free box for computer
function computerTakeTurn() {
  let idName = "";
  
  // choose random boxes until empty box is found
  do {
    let rand = parseInt((Math.random() * 9) + 1); // 1-9
    idName = idNames[rand - 1];
    
    // check if chosen box is empty
    if (document.getElementById(idName).innerHTML == "") {
      document.getElementById(idName).innerHTML = currentPlayer;
      break;
    } // if
  } while(true);
} // computerTakeTurn

// take player turn
function playerTakeTurn(e){
  
  if (e.innerHTML == "") {
    e.innerHTML = currentPlayer;
    checkGameStatus();
    
    // if game not over, computer goes
    if (gameStatus == "") {
      setTimeout(function() {
          computerTakeTurn();
          checkGameStatus();
        }, 500
      );
    } // if
  } else {
    showLightBox("This box is already selected.", "Please try another.");
    console.log("This box is already selected, please try another.");
    return;
  
  } // else
  
  
} // playerTakeTurn

// After each turn, check for a winner, a tie
// or continue playing
function checkGameStatus(){
  numTurns++; // count turn
  
  // check for win
  if (checkWin()) {
    gameStatus = currentPlayer + " wins!";
  } // if
  
  // check for tie
  if (numTurns == 9) {
    gameStatus = "Tie Game";
  } // if

  // switch current player
  currentPlayer = (currentPlayer == "X" ? "O" : "X");
  
  // game is over
  if (gameStatus != "") {
    setTimeout(
      function() {
        showLightBox(gameStatus, "Game Over!");
      }, 500
    );
  } // if
  
} // checkGameStatus

// check for a Win, there are 8 win paths
function checkWin() {
  let cb = []; // current board
  cb[0] = ""; // not going to use
  cb[1] = document.getElementById("one").innerHTML; 
  cb[2] = document.getElementById("two").innerHTML; 
  cb[3] = document.getElementById("three").innerHTML; 
  cb[4] = document.getElementById("four").innerHTML; 
  cb[5] = document.getElementById("five").innerHTML; 
  cb[6] = document.getElementById("six").innerHTML; 
  cb[7] = document.getElementById("seven").innerHTML; 
  cb[8] = document.getElementById("eight").innerHTML; 
  cb[9] = document.getElementById("nine").innerHTML;   
  
  // top row
  if (cb[1] != "" && cb[1] == cb[2] && cb[2] == cb[3]) {
    return true;
  } else if (cb[4] != "" && cb[4] == cb[5] && cb[5] == cb[6]) { // middle row
    return true;
  } else if (cb[7] != "" && cb[7] == cb[8] && cb[8] == cb[9]) { // bottom row
    return true;
  } else if (cb[1] != "" && cb[1] == cb[4] && cb[4] == cb[7]) { // left column
    return true;
  } else if (cb[2] != "" && cb[2] == cb[5] && cb[5] == cb[8]) { // middle column
    return true;
  } else if (cb[3] != "" && cb[3] == cb[6] && cb[6] == cb[9]) { // right column
    return true;
  } else if (cb[1] != "" && cb[1] == cb[5] && cb[5] == cb[9]) { // left to right diagonal
    return true;
  } else if (cb[7] != "" && cb[7] == cb[5] && cb[5] == cb[3]) { // right to left diagonal
    return true;
  } 
} // checkWin

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
  
  // if the game is over, show controls
  if (gameStatus != "") {
    changeVisibility("controls");
  } // if
  
} // continueGame