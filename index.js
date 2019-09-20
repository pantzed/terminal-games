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

let frame = [
  ['☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  ['☁️', '☁️', '☁️', '☁️', '☁️', ' ', ' ', '☁️', '☁️', '☁️', '☁️', '☁️', ' ', '☁️', '☁️','☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  ['☁️', '☁️', '☁️', ' ', ' ', ' ', ' ', ' ', '☁️', '☁️', ' ', ' ', ' ', ' ', ' ',' ', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️', '☁️'],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', '*', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', ' ', '⛰️', ' ', '⛰️', ' ', ' ', ' ', '⛰️', '⛰️','⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', ' ', '⛰️', '⛰️', '⛰️', ' ', ' ', '⛰️', '⛰️', '⛰️','⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
  ['⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️'],
];

let currX = 3;
let prevX = 3;
let currY = 4;
let prevY = 4;

const collision =() => {
  if (frame[(currY)][currX+1] !== ' '){
    console.log('Fail!');
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
  frame[currY][currX] = '*';
  frame[prevY][currX] = ' ';
  printFrame();
}

const moveDown = () => {
  let prevY = currY;
  if (currY < 8) {
    currY++;
  } else {
    return;
  }
  frame[currY][currX] = '*';
  frame[prevY][currX] = ' ';
  printFrame();
}

const run = () => {
  let nextFrame = frame.map((el, index) => {
    if (index === currY) {
      el.splice(currX, 1);
      el.push(el.shift());
      el.splice(currX, 0, '*');
      return el;
    } else {
      el.push(el.shift());
      return el;
    }
  });
  collision();
  frame = nextFrame;
  printFrame();
}

const swapRight = () => {
  prevX = frame[currY][currX + 1];
  frame[currY][currX + 1] = '*';
  frame[currY][currX] = prevX;
  printFrame();
}

const swapLeft = () => {
  prevX = frame[currY][currX - 1];
  frame[currY][currX - 1] = '*';
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
  console.log('current X ' + currX);
  console.log('current Y ' + currY);
  console.log('hold Y ' + prevY);
}

setInterval(run, 250);

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


