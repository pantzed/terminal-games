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

const q = [1, 2, 3, '*', 4, 5, 6 , 7, 8, 9];
let queue = [
  [1, 2, 3, '@', 4, 5, 6 , 7, 8, 9],
  [1, 2, 3, '@', 4, 5, 6 , 7, 8, 9],
  [1, 2, 3, '*', 4, 5, 6 , 7, 8, 9],
  [1, 2, 3, '@', 4, 5, 6 , 7, 8, 9],
  [1, 2, 3, '@', 4, 5, 6 , 7, 8, 9],
]

let currPos = 3;
let prevPos = 3;
let hold = 4;

const run = () => {
  q.splice(currPos, 1);
  q.push(q.shift());
  q.splice(currPos, 0, '*');
  printFrame();
}

const swapRight = () => {
  hold = q[currPos + 1];
  q[currPos + 1] = '*';
  q[currPos] = hold;
  printFrame();
}

const swapLeft = () => {
  hold = q[currPos - 1];
  q[currPos - 1] = '*';
  q[currPos] = hold;
  printFrame();
}

const printFrame = () => {
  clear();
  console.log('');
  console.log(q.join(''));
  console.log('current ' + currPos);
}

setInterval(run, 250);

process.stdin.setRawMode(true);

rl.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (str, key) => {
  switch(key.name) {
    case 'q': process.exit(0); return;
    // case 'up': flyDuck(); return;
    // case 'down': crashDuck(); return;
      case 'right': swapRight(); currPos++; return;
      case 'left': swapLeft(); currPos--; return;
    default: return;
  }
});

// let DUCK_POS = 7;
// let PREV_DUCK_POS = 7;

// let GAME_FRAME = [
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*',' ','*','*'],
//   ['@','@','@','@','@','@','@','@','@','@','@','@','@',' ',' ','@'],
//   ['1','2','3','4','5','6','7','8','9','0','1','2',' ',' ',' ',' '],
//   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
//   [' ',' ',' ','🦆',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
//   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
//   ['1','2','3','4',' ','6','7','8','9','0',' ','2',' ','4',' ','6'],
//   ['@','@','@','@','@','@','@','@','@','@','@','@',' ','@','@','@'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
//   ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*']
// ];

// let FRAME_Q = new Array;
// FRAME_Q.push(GAME_FRAME);

// const flyDuck = () => {
//   PREV_DUCK_POS = DUCK_POS;
//   if (DUCK_POS - 1 < 1) {
//     DUCK_POS = 1;
//   } else {
//     DUCK_POS--;
//   }
//   printFrame();
// }

// const crashDuck = () => {
//   PREV_DUCK_POS = DUCK_POS;
//   if (DUCK_POS + 1 > 13) {
//     DUCK_POS = 13;
//   } else {
//     PREV_DUCK_POS = DUCK_POS;
//     DUCK_POS++;
//   }
//   printFrame();
// }

// const newColumn = () => {
//   let opts = [
//     ['*','*','*','*','*','*',' '],
//     ['*','*','*','*',' ',' ',' '],
//     ['*','*','*',' ',' ',' ',' '],
//     ['*','*',' ',' ',' ',' ',' '],
//     ['*',' ',' ',' ',' ',' ',' '],
//     ['*',' ',' ',' ',' ',' ',' '],
//   ]
//   let colOpt = opts[Math.round(Math.random() * 5)];
//   return colOpt;
// }

// const placeNextDuck = () => {
//   FRAME_Q[0][DUCK_POS][4] = '🦆';
// }

// const hidePrevDuck = () => {
//   FRAME_Q[0][PREV_DUCK_POS][4] = ' ';
// }

// const buildNextFrame = () => {
//   let newTopCol = newColumn();
//   let newBottomCol = newColumn();
//   let frame = Array.from(FRAME_Q[FRAME_Q.length-1]);
//   frame.forEach((line, index) => {
//     line.shift();
//     if (index <= 6) {
//       line.push(newTopCol.shift());
//     } else if (index === 7) {
//       line.push(' ');
//     } else {
//       line.push(newBottomCol.pop());
//     }
//   });
//   FRAME_Q.push(frame);
// }

// const printFrame = () => {
//   hidePrevDuck();
//   placeNextDuck();
//   let frameToPrint = FRAME_Q[0];
//   clear();
//   frameToPrint.forEach((line) => {
//     console.log(...line);
//   });
// }

// const clearFrame = () => {
//   FRAME_Q.shift();
//   printFrame();
// }

// setInterval(buildNextFrame, 50);
// setInterval(clearFrame, 500);

