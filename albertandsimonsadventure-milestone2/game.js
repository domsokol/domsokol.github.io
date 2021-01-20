const levels =  [ 
 
    // level 0
    ["flag", "rock", "", "", "",
    "fenceSide", "rock", "", "", "rider",
    "", "tree", "animate", "animate", "animate",
    "", "water", "", "", "",
    "", "fence", "", "horseUp", ""], 
    
    // level 1
    ["flag", "water", "", "", "",
    "fenceSide", "water", "", "", "rider",
    "animate", "bridge animate", "animate", "animate", "animate",
    "", "water", "", "", "",
    "", "water", "horseUp", "", ""], 
    
    // level 2
    ["tree", "tree", "flag", "tree", "tree",
    "animate", "animate", "animate", "animate", "animate",
    "water", "bridge", "water", "water", "water",
    "", "", "", "fence", "",
    "rider", "rock", "", "", "horseUp"]
    
]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["rock", "tree", "water"];

var currentLevel = 0; // starting level
var riderOn = false; // is the rider on?
var currentLocationOfHorse = 0;
var currentAnimation; // allows 1 animation per level
var widthOfBoard = 5;

// start game
window.addEventListener("load", function() {
  loadLevel();
});

// move horse
document.addEventListener("keydown", function(e) {
  switch (e.keyCode) {
    case 37: // left arrow
      if (currentLocationOfHorse % widthOfBoard !== 0) {
        tryToMove("Left");
      } // if
      break;
    case 38: // up arrow
      if (currentLocationOfHorse - widthOfBoard >= 0) {
        tryToMove("Up");
      } // if
      break;
    case 39: // right arrow
      if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
        tryToMove("Right");
      } // if
      break;
    case 40: // down arrow
      if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard) {
        tryToMove("Down");
      } // if
      break;
  } // swtch
}); // key event listener

// try to move horse
function tryToMove(direction) {
  
  // location nefore move 
  let oldLocation = currentLocationOfHorse;
  
  // class of location before move
  let oldClassName = gridBoxes[oldLocation].className;
  
  let nextLocation = 0; // location we wish to move to
  let nextClass = ""; // class of location we wish to move to
  
  let nextLocation2 = 0;
  let nextClass2 = "";
  
  let newClass = ""; // new class to switch to if move successful
  
  switch (direction) {
    case "Left":
      nextLocation = currentLocationOfHorse - 1;
      break;
    case "Right":
      nextLocation = currentLocationOfHorse + 1;
      break;
    case "Up":
      nextLocation = currentLocationOfHorse - widthOfBoard;
      break;
    case "Down":
      nextLocation = currentLocationOfHorse + widthOfBoard;
      break;
  } // switch
  
  nextClass = gridBoxes[nextLocation].className;
  
  // if the obstacle is not passable, don't move
  if (noPassObstacles.includes(nextClass)) { return; }
  
  // if it's a fence, and there is no rider, don't move
  if (!riderOn && nextClass.includes("fence")) { return; }
  
  // if there is a fence, move two spaces with animation
  if (nextClass.includes("fence")) {
    
    // rider must be on to jump
    if (riderOn) {
      gridBoxes[currentLocationOfHorse].className = "";
      oldClassName = gridBoxes[nextLocation].className;
      
      // set values according to direction
      if (direction == "Left") {
        nextClass = "jumpLeft";
        nextClass2 = "horseRideLeft"
        nextLocation2 = nextLocation - 1;
      } else if(direction == "Right") {
        nextClass = "jumpRight";
        nextClass2 = "horseRideRight"
        nextLocation2 = nextLocation + 1;
      } else if(direction == "Up") {
        nextClass = "jumpUp";
        nextClass2 = "horseRideUp"
        nextLocation2 = nextLocation - widthOfBoard;
      } else if(direction == "Down") {
        nextClass = "jumpDown";
        nextClass2 = "horseRideDown"
        nextLocation2 = nextLocation + widthOfBoard;
      }
      
      // show horse jumping
      gridBoxes[nextLocation].className = nextClass;
      setTimeout(function() {
        
        // set jump back to a fence
        gridBoxes[nextLocation].className = oldClassName;
        
        // update current location of horse to be 2 spaces past take off
        currentLocationOfHorse = nextLocation2;
        
        // get class of box after jump
        nextClass = gridBoxes[currentLocationOfHorse].className;
        
        // show horse and rider after landing
        gridBoxes[currentLocationOfHorse].className = nextClass2;
        
        // if next box is a flag, go up a level
        levelUp(nextClass);
      }, 350);
      return;
    } // if riderOn
    
  } // if class has fence
  
  // if there is a rider, add rider
  if (nextClass == "rider") {
    riderOn = true;
  } // if
  
  // if there is a bridge in the old location, keep it
  if (oldClassName.includes("bridge")) {
    gridBoxes[oldLocation].className = "bridge";
  } else {
    gridBoxes[oldLocation].className = "";
  } // else
  
  // build name of new class
  newClass = (riderOn) ? "horseRide" : "horse";
  newClass += direction;
  
  // if there is a bridge in the next location, keep it
  if (gridBoxes[nextLocation].classList.contains("bridge")) {
    newClass += " bridge";
  } // if

  // move 1 space
  currentLocationOfHorse = nextLocation;
  gridBoxes[currentLocationOfHorse].className = newClass;
  
  // if it is an enemy
  if (nextClass.includes("enemy")) {
    document.getElementById("lose").style.display = "block";
    return;
  }
  
  // move up to next level if needed
  levelUp(nextClass);
  
} // tryToMove

// move up a level
function levelUp(nextClass) {
  if (nextClass == "flag" && riderOn) {
    if (currentLevel == levels.length - 1) {
      document.getElementById("gameover").style.display = "block";
      return;
    }
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
  riderOn = false;
  
  // load board
  for (i = 0; i < gridBoxes.length; i++) {
    gridBoxes[i].className = levelMap[i];
    if (levelMap[i].includes("horse")) { currentLocationOfHorse = i; }
  } // for
  
  animateBoxes = document.querySelectorAll(".animate");
  
  animateEnemy(animateBoxes, 0, "right");
  
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