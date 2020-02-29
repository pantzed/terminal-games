#!/usr/bin/env node
'use strict'; 

const cli = require('./interface/index');
const udlr = require('./controls/UDLR');
const RLBuffer = require('./displays/RLBuffer');
const TerminalDuck = require('./games/TD2.js');

class TerminalGames {
  constructor() {
    this.controllers = { udlr: udlr };
    this.displays = { RLBuffer: RLBuffer };
    this.games = { TerminalDuck: TerminalDuck };
    this.interfaces = {cli: cli};
  }
}

const RunTerminalGames = new TerminalGames();
RunTerminalGames.interfaces.cli();

/** 
 * Named Exports
 */
exports = {
  cli: cli,
  udlrControls: udlr,
  RLBuffer: RLBuffer,
  TerminalDuck: TerminalDuck,
}

/** 
 * Default export
 */
module.exports = TerminalGames;