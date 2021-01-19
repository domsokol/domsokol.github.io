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
        tryToMove("left");
      } // if
      break;
    case 38: // up arrow
      if (currentLocationOfHorse - widthOfBoard >= 0) {
        tryToMove("up");
      } // if
      break;
    case 39: // right arrow
      if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
        tryToMove("right");
      } // if
      break;
    case 40: // down arrow
      if (currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard) {
        tryToMove("down");
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
  
  let newClass = ""; // new class to switch to if move successful
  
  switch (direction) {
    case "left":
      nextLocation = currentLocationOfHorse - 1;
      break;
    case "right":
      nextLocation = currentLocationOfHorse + 1;
      break;
    case "up":
      nextLocation = currentLocationOfHorse - widthOfBoard;
      break;
    case "down":
      nextLocation = currentLocationOfHorse + widthOfBoard;
      break;
  } // switch
  
  nextClass = gridBoxes[nextLocation].className;
  
  // if the obstacle is not passable, don't move
  if (noPassObstacles.includes(nextClass)) { return; }
  
  // if it's a fence, and there is no rider, don't move
  if (!riderOn && nextClass.includes("fence")) { return; }
  
  // if there is a fence, move two spaces with animation
  
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
    console.log("Game Lost");
    return;
  }
  
  // move up to next level if needed
  
} // tryToMove

// load levels 0 - maxLevel
function loadLevel() {
  let levelMap = levels[currentLevel];
  let animateBoxes;
  riderOn = false;
  
  // load board
  for (i = 0; i < gridBoxes.length; i++) {
    gridBoxes[i].className = levelMap[i];
    if (levelMap[i].includes("horse")) currentLocationOfHorse = i
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