const levels =  [ 
 
    // level 0
    ["flag", "wallVertical", "", "", "money",
    "doorHorizontal", "wallVertical", "", "wallHorizontal", "wallHorizontal",
    "", "wallVertical", "animate", "animate", "animate",
    "", "wallVertical", "", "wallHorizontal", "",
    "", "doorVertical", "", "playerUp", ""], 
    
    // level 1
    ["flag", "wallVertical", "money", "", "",
    "doorHorizontal", "wallVertical", "wallHorizontal", "wallHorizontal", "",
    "animate", "doorVertical animate", "animate", "animate", "animate",
    "", "wallVertical", "", "", "",
    "", "wallVertical", "playerUp", "", ""], 
    
    // level 2
    ["wallHorizontal", "wallHorizontal", "flag", "wallHorizontal", "wallHorizontal",
    "animate", "animate", "animate", "animate", "animate",
    "wallHorizontal", "doorHorizontal", "wallHorizontal", "wallHorizontal", "wallHorizontal",
    "", "", "", "", "",
    "money", "wallVertical", "", "", "playerUp"], 
    
    // level 3
    ["", "wallVertical", "money", "", "",
    "", "wallVertical", "wallHorizontal", "wallHorizontal", "",
    "animate", "animate", "animate", "animate", "animate",
    "", "wallVertical", "", "wallHorizontal", "wallHorizontal",
    "playerUp", "wallVertical", "", "doorVertical", "flag"],
    
    // level 4
    ["", "", "", "", "money",
    "", "wallHorizontal", "wallHorizontal", "wallHorizontal", "wallHorizontal",
    "animate", "animate", "animate", "animate", "",
    "", "wallVertical", "", "wallVertical", "doorHorizontal",
    "playerUp", "wallVertical", "", "wallVertical", "flag"]
    
]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["wallVertical", "wallHorizontal"];

var lives = 1; // number of lives that the user has
var currentLevel = 0; // starting level
var hasMoney = false; // is the rider on?
var currentLocationOfPlayer = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;
var menuCounter = 1; // keeps track of which menu is showing

// start game
window.addEventListener("load", function() {
  menu1();
});

// move horse
document.addEventListener("keydown", function(e) {
  switch (e.keyCode) {
    case 37: // left arrow
      if (currentLocationOfPlayer % widthOfBoard !== 0) {
        tryToMove("Left");
      } // if
      break;
    case 38: // up arrow
      if (currentLocationOfPlayer - widthOfBoard >= 0) {
        tryToMove("Up");
      } // if
      break;
    case 39: // right arrow
      if (currentLocationOfPlayer % widthOfBoard < widthOfBoard - 1) {
        tryToMove("Right");
      } // if
      break;
    case 40: // down arrow
      if (currentLocationOfPlayer + widthOfBoard < widthOfBoard * widthOfBoard) {
        tryToMove("Down");
      } // if
      break;
  } // swtch
}); // key event listener

// try to move horse
function tryToMove(direction) {
  
  // location nefore move 
  let oldLocation = currentLocationOfPlayer;
  
  // class of location before move
  let oldClassName = gridBoxes[oldLocation].className;
  
  let nextLocation = 0; // location we wish to move to
  let nextClass = ""; // class of location we wish to move to
  
  let nextLocation2 = 0;
  let nextClass2 = "";
  
  let newClass = ""; // new class to switch to if move successful
  
  switch (direction) {
    case "Left":
      nextLocation = currentLocationOfPlayer - 1;
      break;
    case "Right":
      nextLocation = currentLocationOfPlayer + 1;
      break;
    case "Up":
      nextLocation = currentLocationOfPlayer - widthOfBoard;
      break;
    case "Down":
      nextLocation = currentLocationOfPlayer + widthOfBoard;
      break;
  } // switch
  
  nextClass = gridBoxes[nextLocation].className;
  
  // if the obstacle is not passable, don't move
  if (noPassObstacles.includes(nextClass)) { return; }
  
  // if it's a fence, and there is no rider, don't move
  if (!hasMoney && nextClass.includes("door")) { return; }
  
  // if there is a fence, move two spaces with animation
  if (nextClass.includes("door")) {
    
    // player must have money to leave
    if (hasMoney) {
      gridBoxes[currentLocationOfPlayer].className = "";
      oldClassName = gridBoxes[nextLocation].className;
      
      // set values according to direction
      if (direction == "Left") {
        nextClass = "doorVerticalLeft";
        nextClass2 = "playerMoneyLeft"
        nextLocation2 = nextLocation - 1;
      } else if(direction == "Right") {
        nextClass = "doorVerticalRight";
        nextClass2 = "playerMoneyRight"
        nextLocation2 = nextLocation + 1;
      } else if(direction == "Up") {
        nextClass = "doorHorizontalLeft";
        nextClass2 = "playerMoneyLeft"
        nextLocation2 = nextLocation - widthOfBoard;
      } else if(direction == "Down") {
        nextClass = "doorHorizontalRight";
        nextClass2 = "playerMoneyRight"
        nextLocation2 = nextLocation + widthOfBoard;
      }
      
      // player go through door animation
      gridBoxes[nextLocation].className = nextClass;
      setTimeout(function() {
        
        // set jump back to a fence
        gridBoxes[nextLocation].className = oldClassName;
        
        // update current location of horse to be 2 spaces past take off
        currentLocationOfPlayer = nextLocation2;
        
        // get class of box after jump
        nextClass = gridBoxes[currentLocationOfPlayer].className;
        
        // show horse and rider after landing
        gridBoxes[currentLocationOfPlayer].className = nextClass2;
        
        // if next box is a flag, go up a level
        levelUp(nextClass);
      },300);
      return;
    } // if hasMoney
    
  } // if class has fence
  
  // if there is a rider, add rider
  if (nextClass == "money") {
    hasMoney = true;
  } // if
  
  // if there is a bridge in the old location, keep it
  if (oldClassName.includes("bridge")) {
    gridBoxes[oldLocation].className = "bridge";
  } else {
    gridBoxes[oldLocation].className = "";
  } // else
  
  // build name of new class
  newClass = (hasMoney) ? "playerMoney" : "player";
  newClass += direction;

  // move 1 space
  currentLocationOfPlayer = nextLocation;
  gridBoxes[currentLocationOfPlayer].className = newClass;
  
  // if it is an enemy
  if (nextClass.includes("enemy")) {
    
    if (lives > 1) {
      menuCounter = 1;
      lives--;
      clearTimeout(currentAnimation);
      document.getElementById("button").innerHTML = "Restart Level";
      document.getElementById("button").onclick = function() {
        menuCounter = 2;
        changeVisibility("lightbox");
        changeVisibility("boundaryMessage");
        loadLevel()
      };
      showLightBox("You got caught!", "Use one of your lives.");
      return;
    } else if (lives == 1) {
      menuCounter = 1;
      clearTimeout(currentAnimation);
      document.getElementById("button").innerHTML = "Restart Game";
      document.getElementById("button").onclick = function() {startGame()};
      showLightBox("Game Over", "You got caught.");
      return;
    } // if
    
  } // if
  
  // move up to next level if needed
  levelUp(nextClass);
  
} // tryToMove

// move up a level
function levelUp(nextClass) {
  if (nextClass == "flag" && hasMoney) {
    if (currentLevel == levels.length - 1) {
      menuCounter = 1;
      document.getElementById("button").innerHTML = "Play Again!";
      document.getElementById("button").onclick = function() {startGame()};
      showLightBox("Game Over", "You have finish the game.");
      return;
    } // if
    lives++;
    document.getElementById("livesLeft").innerHTML = "Lives Left: " + lives;
    document.getElementById("levelup").innerHTML = "Level " + (currentLevel + 2);
    document.getElementById("levelup").style.display = "block";
    clearTimeout(currentAnimation);
    setTimeout(function() {
      document.getElementById("levelup").style.display = "none";
      if (currentLevel < levels.length - 1) {
        currentLevel++;
      } // if
      loadLevel();
    }, 1000);
  } // if
} // levelUp

// load levels 0 - maxLevel
function loadLevel() {
  let levelMap = levels[currentLevel];
  let animateBoxes;
  hasMoney = false;
  
  // load board
  for (i = 0; i < gridBoxes.length; i++) {
    gridBoxes[i].className = levelMap[i];
    if (levelMap[i].includes("player")) { currentLocationOfPlayer = i; }
  } // for
  
  animateBoxes = document.querySelectorAll(".animate");
  
  animateEnemy(animateBoxes, 0, "right");
  
  document.getElementById("livesLeft").innerHTML = "Lives Left: " + lives;

  
} // loadLevel

// animate enemy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - current location of animation
// direction - current direction of animation
function animateEnemy(boxes, index, direction) {
  
  // exit function if no animation
  if (boxes.length <= 0) { 
    return; 
  }
  
  // update images
  if (direction == "right") {
    boxes[index].classList.add("enemyRight");
  } else {
    boxes[index].classList.add("enemyLeft");
  } // else
  
  
  // remove images from other boxes
  for (i = 0; i < boxes.length; i++) {
    if (i != index) {
      boxes[i].classList.remove("enemyRight");
      boxes[i].classList.remove("enemyLeft");
      
    } // if
  } // for
  
  // if enemy hits player
  if (boxes[index].className.includes("player")) {
    if (lives > 1) {
      menuCounter = 1;
      lives--;
      clearTimeout(currentAnimation);
      document.getElementById("button").innerHTML = "Restart Level";
      document.getElementById("button").onclick = function() {
        menuCounter = 2;
        changeVisibility("lightbox");
        changeVisibility("boundaryMessage");
        loadLevel()
      };
      showLightBox("You got caught!", "Use one of your lives.");
      return;
    } else if (lives == 1) {
      menuCounter = 1;
      clearTimeout(currentAnimation);
      document.getElementById("button").innerHTML = "Restart Game";
      document.getElementById("button").onclick = function() {startGame()};
      showLightBox("Game Over", "You got caught.");
      return;
    } // if
    
  } // if
  
  // moving right
  if (direction == "right") {
    
    // turn around if hit right side
    if (index == boxes.length - 1) {
      index--;
      direction = "left";
    } else {
      index++;
    }
    
  // moving left
  } else {
    
    // turn around if hit left side
    if (index == 0) {
      index++;
      direction = "right";
    } else {
      index--;
    } // else
     
  } // else
  currentAnimation = setTimeout(function() {
    animateEnemy(boxes, index, direction);
  }, 750);
} // animateEnemy

/***** Lightbox Code *****/

// change the visibility of ID
function changeVisibility(divId) {
	let elem = document.getElementById(divId);
	
	// if element exists, it is considered true
  
    if (menuCounter == 1) {
      elem.className = 'unhidden';
    } else if (menuCounter == 2) {
      elem.className = 'hidden';
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
function startGame() {
  menuCounter = 2;
  changeVisibility("lightbox");
  changeVisibility("boundaryMessage");

  // reset variables
  currentLevel = 0; 
  hasMoney = false; 
  currentLocationOfPlayer = 0;
  lives = 1;
  clearTimeout(currentAnimation);
  
  loadLevel();
} // continueGame

/***** End Lightbox Code *****/

function menu1(message, message2) {
  message = "Welcome to 'The Hunt for Robbers!'";
  message2 = "You, the player, will play as the robber that is trying to evade security.";
  showLightBox(message, message2);
} // menu1
function menu2(message, message2) {
  message = "Instructions.";
  message2 = "You will use the arrow keys to move the robber. Your goal is to get the money bag and then head for the flag with a door in front. You can only get through the door only if you have the money bag. Each level you progress gives you another life. If you get caught, you must use a life and it will allow you to restart the level you are on.";
  document.getElementById("button").innerHTML = "Start Game!";
  document.getElementById("button").onclick = function() {startGame()};
  showLightBox(message, message2);
  menuCounter = 2;
} // menu2
