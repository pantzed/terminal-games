'use strict'; 

/* eslint-env node */

const RLBuffer = require("../displays/RLBuffer");
const ulrd = require('../controls/UDLR');

class TerminalDuck {
  constructor() {
    this.Screen = new RLBuffer();
    this.runTD2 = this.runTD2.bind(this);
    this.controls = ulrd;
    this.currPos = {x: 7, y: 7};
    this.playerChar = '🦆';
    this.crashChar = '💥';
    this.fallAcceleration = -0.98;
    this.fallAcceleration = 1;
    this.fallRate = 1000;
    this.frameRate = 500; // ms
    this.upAction = this.upAction.bind(this);
    this.downAction = this.downAction.bind(this);
    this.leftAction = this.leftAction.bind(this);
    this.rightAction = this.rightAction.bind(this);
    this.checkForCollision = this.checkForCollision.bind(this);
    this.fallTimeouts = [];
  }

  // Create a series of setTimeouts that call downAction with an every increasing rate
  gravityAction() {
    let decay = 1000;
    for (let i=1; i<(this.Screen.sHeight - (this.currPos.y + 1)); i++) {
      this.fallTimeouts.push( setTimeout(this.downAction, (1000 + decay)) );
      decay = decay / 1.1 + 1000;
    }
  }

  // On upAction, clear existing timeouts and call gravityAction to reset them
  clearAllTimeouts() {
    for (var i = 0; i < this.fallTimeouts.length; i++) {
      clearTimeout(this.fallTimeouts[i]);
    }
    this.gravityAction();
  }

  // should check current plus up, down, and right
  // for potential collisions, change rate, not time
  checkForCollision() {
    let charInNextPos = this.Screen.screen.get(this.currPos).char;
    if (charInNextPos !== ' ') {
      this.Screen.screen.put(this.currPos, this.crashChar);
      this.Screen.screen.draw();
      process.stdout.clearLine();
      process.exit(0)
    }
  }

  // During actions, need to take a diff between current screen and next, then re-draw
  // So, update current with blank, update player position, check diff, re-draw
  // Use   // Find environment differences and put to screen
  // let diffValues = this.diff(this.values, nextEnv);

  // Problem: During an up and down action, the environment is pushed one xCoord right
  // I think I have to map the Screen values with the change and then re-draw

  upAction(){
    this.Screen.screen.put(this.currPos, ' ');
    this.currPos.y--;
    this.checkForCollision();
    this.Screen.screen.put(this.currPos, this.playerChar);
    this.Screen.screen.draw();
    this.clearAllTimeouts();
  }

  downAction() {
    this.Screen.screen.put(this.currPos, ' ');
    this.currPos.y++;
    this.checkForCollision();
    this.Screen.screen.put(this.currPos, this.playerChar);
    this.Screen.screen.draw();
  }

  leftAction() {
    this.Screen.screen.put(this.currPos, ' ');
    this.currPos.x--;
    this.checkForCollision();
    this.Screen.screen.put(this.currPos, this.playerChar);
    this.Screen.screen.draw();
  }

  rightAction() {
    this.Screen.screen.put(this.currPos, ' ');
    this.currPos.x++;
    this.checkForCollision();
    this.Screen.screen.put(this.currPos, this.playerChar);
    this.Screen.screen.draw();
  }

  runTD2() {
    this.controls(this.upAction, this.downAction, this.leftAction, this.rightAction);
    this.Screen.playerChar = this.playerChar;
    this.Screen.initialize(this.placePlayerChar);
    this.gravityAction();
  }

}

module.exports = TerminalDuck;