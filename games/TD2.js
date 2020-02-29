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
    this.upAction = this.upAction.bind(this);
    this.downAction = this.downAction.bind(this);
    this.leftAction = this.leftAction.bind(this);
    this.rightAction = this.rightAction.bind(this);
    this.checkForCollision = this.checkForCollision.bind(this);
  }

  checkForCollision() {
    let charInNextPos = this.Screen.screen.get(this.currPos).char;
    if (charInNextPos !== ' ') {
      this.Screen.term.clear();
      console.log('You Crashed!');
      process.exit(0)
    }
  }

  upAction(){
    this.Screen.screen.put(this.currPos, ' ');
    this.currPos.y--;
    this.checkForCollision();
    this.Screen.screen.put(this.currPos, this.playerChar);
    this.Screen.screen.draw();
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
    this.Screen.initialize(this.placePlayerChar);
  }

}

module.exports = TerminalDuck;