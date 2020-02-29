'use strict'; 

/* eslint-env node */

/**
 * TODO:
 * - Improve collision method
 * - Pass config to constructor?
 * - Save scores
 * - make initislize promise based
 * - queue frames?
 * - Create virtual frame to be printed using an array of coordinates
 * 
 */

const clear = require('clear');
const gameConfig = require('../config.json');
const rl = require('readline');
const GameScreen = require('../gameScreen/RLScroll');

class TerminalDuck {
  constructor() {
    this.DUCK = gameConfig.environment.duck;
    this.SKY = gameConfig.environment.sky;
    this.GROUND = gameConfig.environment.ground;
    this.X = gameConfig.game.start.position.x;
    this.PREV_X= gameConfig.game.start.position.x;
    this.Y = gameConfig.game.start.position.y;

    this.PREV_BLANK_MAX = gameConfig.environment.initialSpace.maxIndex || this.frameHeight - 1;
    this.PREV_BLANK_MIN = gameConfig.environment.initialSpace.minIndex || 1;

    this.GAME_DIFFICULTY = 'medium';
    this.GAME_SPEED = gameConfig.game.difficulty[this.GAME_DIFFICULTY].frameRate;
    this.FALL_SPEED = gameConfig.game.difficulty[this.GAME_DIFFICULTY].fallSpeed;

    this.SCORE = 0;

    this.FRAME = this.createInitialFrame(this.frameHeight, this.frameWidth);
    this.COORDS = []; //el {x: int, y: int, val: 'str'}
    //
    this.frameHeight = gameConfig.environment.frameHeight;
    this.frameWidth = gameConfig.environment.frameLength;
    this.screen = new GameScreen({height: this.frameHeight, width: this.frameWidth, frameRate: 500});
    this.frame = screen.frame;
  }

  // Needs:
  // randomizer -> passed to this.screen.update(this.frame, this.randomizer)
  // duck placer
  // 

  initializeFrame() {
      let startFrame = [];
      for (let j=0; j<this.frameWidth; j++) {
        let top = 0;
        let bottom = this.frameHeight;
        startFrame.push({x:top, y:i, char: '*'});
        startFrame.push({x:bottom, y:i, char: '*'});
      }
      
  }

  run() {
    setInterval(this.screen.update, this.screen.frameRate);
  }


  // -------------------------//

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
    if (nextBlankMin > this.frameHeight - 5) {
      nextBlankMin = this.frameHeight - 5;
    }
    let nextBlankMax = this.getRandom() + this.PREV_BLANK_MAX;
    //check that max is greater than min by at least 3
    if (nextBlankMin + 3 >= nextBlankMax){
      nextBlankMax = nextBlankMin + 3;
    }
    // check that max is never equal or greater to this.frameHeight
    if (nextBlankMax >= this.frameHeight - 2) {
      nextBlankMax = this.frameHeight - 2;
      if (nextBlankMin + 3 >= nextBlankMax){
        nextBlankMin--;
      }
    }
    this.PREV_BLANK_MIN = nextBlankMin;
    this.PREV_BLANK_MAX = nextBlankMax;
    return [nextBlankMin, nextBlankMax];
  }

  moveUp() {
    this.crashY(this.Y-1);
    let prevY = this.Y;
    if (this.Y - 1 >= 0){
      this.Y--;
    } else {
      return;
    }
    this.FRAME[this.Y].splice(this.X, 1, '🦆');
    this.FRAME[prevY][this.X] = ' ';
    this.printFrame();
  }

  moveDown() {
    this.crashY(this.Y+1);
    let prevY = this.Y;
    if (this.Y < this.frameHeight) {
      this.Y++;
    } else {
      return;
    }
    this.FRAME[this.Y].splice(this.X, 1, '🦆');
    this.FRAME[prevY][this.X] = ' ';
    this.printFrame();
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

  crashX(next) {
    if (this.FRAME[this.Y][next] !== ' ') {
      this.FRAME[this.Y][this.X] = '💥';
      clear();
      console.log('');
      this.FRAME.forEach((line) => {
        console.log(line.join(''));
      });
      console.log('Murderer.');
      console.log('Final score:', this.SCORE);
      process.exit(0);
    }
  }

  crashY(next) {
    if (this.FRAME[next][this.X] !== ' ') {
      this.FRAME[next][this.X] = '💥';
      this.FRAME[this.Y][this.X] = ' ';
      clear();
      console.log('');
      this.FRAME.forEach((line) => {
        console.log(line.join(''));
      });
      console.log('Murderer.');
      console.log('Final score:', this.SCORE);
      process.exit(0);
    }
  }

  run(env) {
    let nextEnv = env;
    let min = nextEnv[0];
    let max = nextEnv[1];
    let nextFrame = this.FRAME.map((el, index) => {
      if (index === this.Y) {
        if (index >= 0 && index <= min) {
          this.crashX(this.X+1);
          el.splice(this.X, 1);
          el.shift();
          el.push('☁️');
          el.splice(this.X, 0, '🦆');
        }
        if (index > min && index <= max) {
          this.crashX(this.X+1);
          el.splice(this.X, 1);
          el.shift();
          el.push(' ');
          el.splice(this.X, 0, '🦆');
        }
        if (index > max && index < this.frameHeight) {
          this.crashX(this.X+1);
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
          if (index > max && index < this.frameHeight) {
            el.shift();
            el.push('⛰️');
          }
      }
      return el;
    });
    // this.collision(min, max);
    this.FRAME = nextFrame;
    this.printFrame();
    this.SCORE++;
    // accelerateFR();
  }

  swapRight() {
    this.crashX(this.X+1);
    this.PREV_X= this.FRAME[this.Y][this.X + 1];
    this.FRAME[this.Y][this.X + 1] = '🦆';
    this.FRAME[this.Y][this.X] = this.PREV_X;
    this.printFrame();
    this.X++
  }

  swapLeft() {
    this.crashX(this.X-1);
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
    rl.cursorTo(process.stdout, 0, 0);
    rl.clearScreenDown(process.stdout);
    console.log('');
    console.log(strFrame);
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