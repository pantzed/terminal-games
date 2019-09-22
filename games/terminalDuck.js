'use strict'; 

/* eslint-env node */

const clear = require('clear');
const gameConfig = require('../config.json');
const rl = require('readline');

const terminalDuck = () => {
  
  process.stdin.setRawMode(true);
  process.stdin.resume();
  rl.emitKeypressEvents(process.stdin);
  process.stdin.on('keypress', (str, key) => {
    switch(key.name) {
      case 'q': process.exit(0); break;
      case 'right': swapRight(); break;
      case 'left': swapLeft(); break;
      case 'up': moveUp(); break;
      case 'down': moveDown(); break;
      default: break;
    }
  });

  let DUCK = gameConfig.environment.duck;
  let SKY = gameConfig.environment.sky;
  let GROUND = gameConfig.environment.ground;
  let X = gameConfig.game.start.position.x;
  let PREV_X = gameConfig.game.start.position.x;
  let Y = gameConfig.game.start.position.y;
  let FRAME_HEIGHT = gameConfig.environment.frameHeight;
  let FRAME_LENGTH = gameConfig.environment.frameLength;
  let SCORE = 0;
  let PREV_BLANK_MAX = gameConfig.environment.initialSpace.maxIndex || FRAME_HEIGHT - 1;
  let PREV_BLANK_MIN = gameConfig.environment.initialSpace.minIndex || 1;

  let GAME_DIFFICULTY = 'medium';
  let GAME_SPEED = gameConfig.game.difficulty[GAME_DIFFICULTY].frameRate;
  let FALL_SPEED = gameConfig.game.difficulty[GAME_DIFFICULTY].fallSpeed;

  const createInitialFrame = (height, width) => {
    let initialFrame = [];
    for(let i=0; i<=height; i++) {
      let row = [];
      let el = ' ';
      if (i === 0) {
        el = SKY;
      } else if (i === height) {
        el = GROUND;
      }
      for (let j=0; j<width; j++) {
        if (i === Y && j === X) {
          row.push(DUCK);
        } else {
          row.push(el);
        }
      }
      initialFrame.push(row);
    }
    return initialFrame;
  }

  let frame = createInitialFrame(FRAME_HEIGHT, FRAME_LENGTH);

  const collision = () => {
    if (frame[Y][X+1] !== ' ' && frame[Y][X+1] !== '🦆'){
      frame[Y][X] = '💥';
      clear();
      console.log('');
      frame.forEach((line) => {
        console.log(line.join(''));
      });
      console.log('Murderer.');
      console.log('Final score:', SCORE);
      process.exit(1);
    }
  }

  const moveUp = () => {
    let prevY = Y;
    if (Y - 1 >= 0){
      Y--;
    } else {
      return;
    }
    frame[Y][X] = '🦆';
    frame[prevY][X] = ' ';
    printFrame('up');
  }

  const moveDown = () => {
    let prevY = Y;
    if (Y < FRAME_HEIGHT) {
      Y++;
    } else {
      return;
    }
    frame[Y][X] = '🦆';
    frame[prevY][X] = ' ';
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

  const blankHeightPos = () => {

    let nextBlankMin = getRandom() + PREV_BLANK_MIN;
    if (nextBlankMin <= 1) {
      nextBlankMin = 1;
    }
    if (nextBlankMin > FRAME_HEIGHT - 5) {
      nextBlankMin = FRAME_HEIGHT - 5;
    }

    let nextBlankMax = getRandom() + PREV_BLANK_MAX;

    //check that max is greater than min by at least 3
    if (nextBlankMin + 3 >= nextBlankMax){
      nextBlankMax = nextBlankMin + 3;
    }

    // check that max is never equal or greater to FRAME_HEIGHT
    if (nextBlankMax >= FRAME_HEIGHT - 2) {
      nextBlankMax = FRAME_HEIGHT - 2;
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
      if (index === Y) {
        if (index >= 0 && index <= min) {
          el.splice(X, 1);
          el.shift();
          el.push('☁️');
          el.splice(X, 0, '🦆');
        }
        if (index > min && index <= max) {
          el.splice(X, 1);
          el.shift();
          el.push(' ');
          el.splice(X, 0, '🦆');
        }
        if (index > max && index < FRAME_HEIGHT) {
          el.splice(X, 1);
          el.shift();
          el.push('⛰️');
          el.splice(X, 0, '🦆');
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
          if (index > max && index < FRAME_HEIGHT) {
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
    PREV_X = frame[Y][X + 1];
    frame[Y][X + 1] = '🦆';
    frame[Y][X] = PREV_X;
    printFrame();
    X++
  }

  const swapLeft = () => {
    PREV_X = frame[Y][X - 1];
    frame[Y][X - 1] = '🦆';
    frame[Y][X] = PREV_X;
    printFrame();
    X--;
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
  setInterval(moveDown, FALL_SPEED);
}

module.exports = terminalDuck;

