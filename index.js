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
let score = 0;
let prevBottom = 2;
let FLOAT = true;

const collision =() => {
  if (frame[(currY)][currX+1] !== ' ' && frame[(currY)][currX+1] !== '🦆'){
    frame[currY][currX] = '💥';
    clear();
    console.log('');
    frame.forEach((line) => {
      console.log(line.join(''));
    });
    console.log('Murderer.');
    console.log('Final Score: ', score);
    process.exit(1);
  }
}

const moveUp = () => {
  FLOAT = true
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

const coinFlip = () => {
  return Math.round(Math.random()) === 0 ? true : false;
}

const randomBottom = () => {
  let min = 1;
  let max = Math.floor(frameHeight/2) - 1;
  let count = prevBottom;
  let nextCount = coinFlip() === true ? count + 1 : count - 1;
  if (nextCount <= min) {
    nextCount = min;
  }
  else if (nextCount >= max) {
    nextCount = max;
  }
  prevBottom = nextCount;
  return nextCount;
}

const randomTop = () => {
  let min = 1;
  let max = Math.floor(frameHeight/2) - 1;
  let count = prevBottom;
  let nextCount = coinFlip() === true ? count + 1 : count - 1;
  if (nextCount <= min) {
    nextCount = min;
  }
  else if (nextCount >= max) {
    nextCount = max;
  }
  prevBottom = nextCount;
  return nextCount;
}

const run = () => {
  let bottom = randomBottom();
  let top = randomTop();
  let nextFrame = frame.map((el, index) => {
    if (index === currY) {
      el.splice(currX, 1);
      el.shift();
      el.splice(currX, 0, '🦆');
      el.push(' ');
    } else if (index < frameHeight - 1 && index >= frameHeight - bottom) {
      el.shift();
      el.push('⛰️');
    } else if (index >= 0 && index <= top) {
      el.shift();
      el.push('☁️');
    } else {
      el.shift();
      el.push(' ');
    }
    return el;
  });
  collision();
  frame = nextFrame;
  printFrame();
  score++;
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
  console.log('Score: ' + score);
}

setInterval(run, 100);
setInterval(moveDown, 500);

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


