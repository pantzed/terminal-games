#!/usr/bin/env node
'use strict'; 

const cli = require('./interface/index');
const udlr = require('./controls/UDLR');
const RLBuffer = require('./displays/RLBuffer');
const TerminalDuck = require('./games/TD2.js');
const commander = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

/** 
 * Runs the cli when package is initialized
 */
cli();

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
module.exports = {
  cli,
  udlr,
  RLBuffer,
  TerminalDuck
};