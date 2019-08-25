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

let DUCK_POS = 7;
let PREV_DUCK_POS = 7;

let GAME_FRAME = [
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*',' ','*','*'],
  ['@','@','@','@','@','@','@','@','@','@','@','@','@',' ',' ','@'],
  ['1','2','3','4','5','6','7','8','9','0','1','2',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ','🦆',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' '],
  ['1','2','3','4',' ','6','7','8','9','0',' ','2',' ','4',' ','6'],
  ['@','@','@','@','@','@','@','@','@','@','@','@',' ','@','@','@'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*'],
  ['*','*','*','*','*','*','*','*','*','*','*','*','*','*','*','*']
];
let FRAME_Q = [GAME_FRAME];

process.stdin.setRawMode(true);

rl.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (str, key) => {
  switch(key.name) {
    case 'q': process.exit(0);
    case 'up': flyDuck();
    default: return;
  }
});

const flyDuck = () => {
  PREV_DUCK_POS = DUCK_POS;
  if (DUCK_POS - 1 < 0) {
    DUCK_POS = 0;
  } else {
    PREV_DUCK_POS = DUCK_POS;
    DUCK_POS--;
  }
  hidePrevDuck();
  placeNextDuck();
}

const crashDuck = () => {
  PREV_DUCK_POS = DUCK_POS;
  if (DUCK_POS + 1 > 13) {
    DUCK_POS = 13;
  } else {
    PREV_DUCK_POS = DUCK_POS;
    DUCK_POS++;
  }
  hidePrevDuck();
  placeNextDuck();
}

const newColumn = () => {
  const opts = [
    ['*','*','*','*','*','*',' '],
    ['*','*','*','*',' ',' ',' '],
    ['*','*','*',' ',' ',' ',' '],
    ['*','*',' ',' ',' ',' ',' '],
    ['*',' ',' ',' ',' ',' ',' '],
    ['*',' ',' ',' ',' ',' ',' '],
  ]
  let colOpt = Math.round(Math.random() * 5);
  return opts[colOpt];
}

const placeNextDuck = () => {
  GAME_FRAME[DUCK_POS][1] = '🦆';
  printNewDuckFrame();
}

const hidePrevDuck = () => {
  GAME_FRAME[PREV_DUCK_POS][1] = ' ';
}

const printNewDuckFrame = () => {
  clear();
  GAME_FRAME.forEach((line) => {
    console.log(...line);
  });
}

const incrementGameFrame = () => {
  let GAME_FRAME = FRAME_Q.shift();
  GAME_FRAME.forEach((line) => {
    console.log(...line);
  });
}

const buildNextFrame = () => {
  let nextTop = newColumn();
  let nextBottom = newColumn();
  clear();
  let nextFrame = GAME_FRAME.map((row, index) => {
    if (index === 7) {
      return row;
    } else {
      row.shift();
      if (index < 7) {
        return row.push(nextTop.shift()); 
      } else {
        return row.push(nextBottom.pop());
      }
    }
  });
  FRAME_Q.push(nextFrame);
  console.log('DEBUG: ', nextFrame);
}

setInterval(incrementGameFrame, 250);
setInterval(buildNextFrame, 100);
setInterval(crashDuck, 500);
// setInterval(clearFrame, 999)