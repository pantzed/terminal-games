#!/usr/bin/env node
'use strict'; 


const TerminalDuck = require('./games/terminalDuck');
const commander = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');


const program = commander;
program.version('0.0.1');
program.arguments('<cmd>');

program.command('terminal-duck').action(() => { 
  inquirer.prompt([
      {
        name: 'play',
        type: 'confirm',
        message: chalk.cyan('Would you like to play Terminal Duck?')
      }
    ]).then((response) => {
      if (response.play) {
        let duck = new TerminalDuck;
        duck.initialize();
      }
    });
});

program.parse(process.argv);

module.exports = program;