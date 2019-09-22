#!/usr/bin/env node
'use strict'; 


const terminalDuck = require('./games/terminalDuck');
const commander = require('commander');
const inquirer = require('inquirer');


const program = commander;
program.version('0.0.1');
program.arguments('<cmd>');

program.command('terminal-duck').action(() => { 
  inquirer.prompt([
      {
        name: 'play',
        type: 'confirm',
        message: 'Would you like to play Terminal Duck'
      }
    ]).then((response) => {
      if (response.play) {
        terminalDuck();
      }
    });
});

program.parse(process.argv);

module.exports = program;