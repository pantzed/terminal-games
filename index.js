'use strict'; 

/* eslint-env node */

/* Things to keep in mind...
*   - Need to set failure bounds based on gameFrame height and elements
*   - Observables might be a good way to update the gameframe with bird position
*   - Rendomization of frame must happen before bird placement
*   - Difficulty can be determined by interval rate and randomization
*   - Columns should be created with decreasing likelihood of generating a solid
*   - !!! Improve choppiness by queueing frames between updates
*/

const rl = require('readline');
const clear = require('clear');
const fs = require('fs');

let frame = [
  ['☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  ['☁️', '☁️', '☁️', '☁️', '☁️', ' ', ' ', '☁️', '☁️', '☁️', '☁️', '☁️', ' ', '☁️', '☁️','☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  ['☁️', '☁️', '☁️', ' ', ' ', ' ', ' ', ' ', '☁️', '☁️', ' ', ' ', ' ', ' ', ' ',' ', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', '🦆', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', ' ', '⛰️', ' ', '⛰️', ' ', ' ', ' ', '⛰️', '⛰️','⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', ' ', '⛰️', '⛰️', '⛰️', ' ', ' ', '⛰️', '⛰️', '⛰️','⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
];

let frameQ = [frame];

let currX = 3;
let prevX = 3;
let currY = 7;
let frameHeight = 15;
let frameLength = 30;
let SCORE = 0;
let PREV_BLANK_MAX = 12;
let PREV_BLANK_MIN = 1;
let GAME_SPEED = 100;
let GAME_DIFFICULTY = {
  easy: 300,
  medium: 100,
  hard: 50
}

const accelerateFR = async() => {
  if (SCORE >= 50) {
    
  }
}

const collision =() => {
  if (frame[(currY)][currX+1] !== ' ' && frame[(currY)][currX+1] !== '🦆'){
    frame[currY][currX] = '💥';
    clear();
    console.log('');
    frame.forEach((line) => {
      console.log(line.join(''));
    });
    console.log('Murderer.');
    console.log('Final score: ', SCORE);
    process.exit(1);
  }
}

const moveUp = () => {
  let prevY = currY;
  if (currY - 1 >= 0){
    currY--;
  } else {
    return;
  }
  frame[currY][currX] = '🦆';
  frame[prevY][currX] = ' ';
  printFrame('up');
}

const moveDown = () => {
  let prevY = currY;
  if (currY < frameHeight) {
    currY++;
  } else {
    return;
  }
  frame[currY][currX] = '🦆';
  frame[prevY][currX] = ' ';
  printFrame('down');
}

const getRandom = () => {
  let flip = Math.ceil(Math.random() * 3);
  switch (flip) {
    case 1: return 1;
    case 2: return -1;
    case 3: return 0;
    default: break;
  }
}

// const nextEnv = () => {
//   let total = frameHeight;
//   let nextTop = (coinFlip() === 1 ? 1 : -1) + PREV_TOP;
//   if (nextTop >= total - 6) {
//     nextTop = total - 6;
//   }
//   PREV_TOP = nextTop;
//   let nextBlank = (coinFlip() === 1 ? 1 : -1) + PREV_BLANK;
//   if ((nextBlank + nextTop) >= total - 3) {
//     nextBlank = total - 3;
//   }
//   else if (nextBlank <= 5) {
//     nextBlank = 5;
//   }
//   PREV_BLANK = nextBlank; 
//   let nextBottom = total - (nextTop + nextBlank);
//   if (nextBottom >= total) {
//     nextBottom = total - 1;
//   }
//   let env = [nextTop, nextBlank, nextBottom];
//   return env;
// }

// Blank space can grow in high 
// Midpoint of blank space can move +/-1 or zero
const blankHeightPos = () => {

  let nextBlankMin = getRandom() + PREV_BLANK_MIN;
  if (nextBlankMin < 1) {
    nextBlankMin = 1;
  }
  if (nextBlankMin > frameHeight - 5) {
    nextBlankMin = frameHeight - 5;
  }

  let nextBlankMax = getRandom() + PREV_BLANK_MAX;

  //check that max is greater than min by at least 3
  if (nextBlankMin + 3 >= nextBlankMax){
    nextBlankMax = nextBlankMin + 3;
  }

  // check that max is never equal or greater to frameheight
  if (nextBlankMax >= frameHeight - 2) {
    nextBlankMax = frameHeight - 2;
    if (nextBlankMin + 3 >= nextBlankMax){
      nextBlankMin--;
    }
  }


  PREV_BLANK_MIN = nextBlankMin;
  PREV_BLANK_MAX = nextBlankMax;
  
  return [nextBlankMin, nextBlankMax];
}

const run = () => {
  let nextEnv = blankHeightPos();
  let min = nextEnv[0];
  let max = nextEnv[1];
  let nextFrame = frame.map((el, index) => {
    if (index === currY) {
      if (index >= 0 && index <= min) {
        el.splice(currX, 1);
        el.shift();
        el.push('☁️');
        el.splice(currX, 0, '🦆');
      }
      if (index > min && index <= max) {
        el.splice(currX, 1);
        el.shift();
        el.push(' ');
        el.splice(currX, 0, '🦆');
      }
      if (index > max && index < frameHeight) {
        el.splice(currX, 1);
        el.shift();
        el.push('⛰️');
        el.splice(currX, 0, '🦆');
        }
      } else {
        if (index >= 0 && index <= min) {
          el.shift();
          el.push('☁️');
        }
        if (index > min && index <= max) {
            el.shift();
            el.push(' ');
        } 
        if (index > max && index < frameHeight) {
          el.shift();
          el.push('⛰️');
        }
    }
    return el;
  });
  collision();
  frame = nextFrame;
  printFrame();
  SCORE++;
  // accelerateFR();
}

const swapRight = () => {
  prevX = frame[currY][currX + 1];
  frame[currY][currX + 1] = '🦆';
  frame[currY][currX] = prevX;
  printFrame();
}

const swapLeft = () => {
  prevX = frame[currY][currX - 1];
  frame[currY][currX - 1] = '🦆';
  frame[currY][currX] = prevX;
  printFrame();
}

const printFrame = () => {
  clear();
  console.log('');
  frame.forEach((line) => {
    console.log(line.join(''));
  });
  collision();
  console.log('score: ' + SCORE);
}

setInterval(run, GAME_SPEED);
setInterval(moveDown, 300);

process.stdin.setRawMode(true);

rl.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (str, key) => {
  switch(key.name) {
    case 'q': process.exit(0); break;
    case 'right': swapRight(); currX++; break;
    case 'left': swapLeft(); currX--; break;
    case 'up': moveUp(); break;
    case 'down': moveDown(); break;
    default: break;
  }
});
