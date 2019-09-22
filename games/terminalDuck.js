'use strict'; 

/* eslint-env node */

const clear = require('clear');
const gameConfig = require('../config.json');
const rl = require('readline');

class TerminalDuck {
  constructor() {

    this.DUCK = gameConfig.environment.duck;
    this.SKY = gameConfig.environment.sky;
    this.GROUND = gameConfig.environment.ground;
    this.X = gameConfig.game.start.position.x;
    this.PREV_X= gameConfig.game.start.position.x;
    this.Y = gameConfig.game.start.position.y;
    this.FRAME_HEIGHT = gameConfig.environment.frameHeight;
    this.FRAME_LENGTH = gameConfig.environment.frameLength;

    this.PREV_BLANK_MAX = gameConfig.environment.initialSpace.maxIndex || this.FRAME_HEIGHT - 1;
    this.PREV_BLANK_MIN = gameConfig.environment.initialSpace.minIndex || 1;

    this.GAME_DIFFICULTY = 'medium';
    this.GAME_SPEED = gameConfig.game.difficulty[this.GAME_DIFFICULTY].frameRate;
    this.FALL_SPEED = gameConfig.game.difficulty[this.GAME_DIFFICULTY].fallSpeed;

    this.SCORE = 0;

    this.FRAME = this.createInitialFrame(this.FRAME_HEIGHT, this.FRAME_LENGTH);
  }

  createInitialFrame(height, width) {
    let initialFrame = [];
    for(let i=0; i<=height; i++) {
      let row = [];
      let el = ' ';
      if (i === 0) {
        el = this.SKY;
      } else if (i === height) {
        el = this.GROUND;
      }
      for (let j=0; j<width; j++) {
        if (i === this.Y && j === this.X) {
          row.push(this.DUCK);
        } else {
          row.push(el);
        }
      }
      initialFrame.push(row);
    }
    return initialFrame;
  }

  blankHeightPos() {
    let nextBlankMin = this.getRandom() + this.PREV_BLANK_MIN;
    if (nextBlankMin <= 1) {
      nextBlankMin = 1;
    }
    if (nextBlankMin > this.FRAME_HEIGHT - 5) {
      nextBlankMin = this.FRAME_HEIGHT - 5;
    }
    let nextBlankMax = this.getRandom() + this.PREV_BLANK_MAX;
    //check that max is greater than min by at least 3
    if (nextBlankMin + 3 >= nextBlankMax){
      nextBlankMax = nextBlankMin + 3;
    }
    // check that max is never equal or greater to this.FRAME_HEIGHT
    if (nextBlankMax >= this.FRAME_HEIGHT - 2) {
      nextBlankMax = this.FRAME_HEIGHT - 2;
      if (nextBlankMin + 3 >= nextBlankMax){
        nextBlankMin--;
      }
    }
    this.PREV_BLANK_MIN = nextBlankMin;
    this.PREV_BLANK_MAX = nextBlankMax;
    return [nextBlankMin, nextBlankMax];
  }

  collision() {
    if (this.FRAME[this.Y][this.X+1] !== ' ' && this.FRAME[this.Y][this.X+1] !== '🦆'){
      this.FRAME[this.Y][this.X] = '💥';
      clear();
      console.log('');
      this.FRAME.forEach((line) => {
        console.log(line.join(''));
      });
      console.log('Murderer.');
      console.log('Final score:', this.SCORE);
      process.exit(1);
    }
  }

  moveUp() {
    let prevY = this.Y;
    if (this.Y - 1 >= 0){
      this.Y--;
    } else {
      return;
    }
    this.FRAME[this.Y][this.X] = '🦆';
    this.FRAME[prevY][this.X] = ' ';
    this.printFrame('up');
  }

  moveDown() {
    let prevY = this.Y;
    if (this.Y < this.FRAME_HEIGHT) {
      this.Y++;
    } else {
      return;
    }
    this.FRAME[this.Y][this.X] = '🦆';
    this.FRAME[prevY][this.X] = ' ';
    this.printFrame('down');
  }

  getRandom() {
    let flip = Math.ceil(Math.random() * 3);
    switch (flip) {
      case 1: return 1;
      case 2: return -1;
      case 3: return 0;
      default: break;
    }
  }

  run(env) {
    let nextEnv = env;
    let min = nextEnv[0];
    let max = nextEnv[1];
    let nextFrame = this.FRAME.map((el, index) => {
      if (index === this.Y) {
        if (index >= 0 && index <= min) {
          el.splice(this.X, 1);
          el.shift();
          el.push('☁️');
          el.splice(this.X, 0, '🦆');
        }
        if (index > min && index <= max) {
          el.splice(this.X, 1);
          el.shift();
          el.push(' ');
          el.splice(this.X, 0, '🦆');
        }
        if (index > max && index < this.FRAME_HEIGHT) {
          el.splice(this.X, 1);
          el.shift();
          el.push('⛰️');
          el.splice(this.X, 0, '🦆');
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
          if (index > max && index < this.FRAME_HEIGHT) {
            el.shift();
            el.push('⛰️');
          }
      }
      return el;
    });
    this.collision();
    this.FRAME = nextFrame;
    this.printFrame();
    this.SCORE++;
    // accelerateFR();
  }

  swapRight() {
    this.PREV_X= this.FRAME[this.Y][this.X + 1];
    this.FRAME[this.Y][this.X + 1] = '🦆';
    this.FRAME[this.Y][this.X] = this.PREV_X;
    this.printFrame();
    this.X++
  }

  swapLeft() {
    this.PREV_X= this.FRAME[this.Y][this.X - 1];
    this.FRAME[this.Y][this.X - 1] = '🦆';
    this.FRAME[this.Y][this.X] = this.PREV_X;
    this.printFrame();
    this.X--;
  }

  printFrame() {
    let strFrame = '';
    this.FRAME.forEach((line) => {
      strFrame += line.join('');
      strFrame += '\n';
    });
    clear();
    console.log('');
    console.log(strFrame);
    this.collision();
    console.log('score: ' + this.SCORE);
  }

  initialize() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    rl.emitKeypressEvents(process.stdin);
    process.stdin.on('keypress', (str, key) => {
      switch(key.name) {
        case 'q': process.exit(0); break;
        case 'right': this.swapRight(); break;
        case 'left': this.swapLeft(); break;
        case 'up': this.moveUp(); break;
        case 'down': this.moveDown(); break;
        default: break;
      }
    });
    setInterval(() => {
      let nextEnv = this.blankHeightPos();
      this.run(nextEnv);
    }, this.GAME_SPEED);
    setInterval(() => {
      this.moveDown();
     }, this.FALL_SPEED);
  }
}

module.exports = TerminalDuck;