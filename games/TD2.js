'use strict'; 

/* eslint-env node */

const RLBuffer = require("../displays/RLBuffer");
const ulrd = require('../controls/UDLR');

class TerminalDuck {
  constructor() {
    this.Screen = new RLBuffer();
    this.runTD2 = this.runTD2.bind(this);
  }

  runTD2() {
    ulrd();
    this.Screen.initialize();
  }

}

// const newTD2 = new TerminalDuck();
// newTD2.runTD2();

module.exports = TerminalDuck;