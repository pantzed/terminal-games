'use strict'; 

/* eslint-env node */

const rl = require('readline');

function udlr(up, down, left, right) {
  process.stdin.setRawMode(true);
  process.stdin.resume();
  rl.emitKeypressEvents(process.stdin);
  process.stdin.on('keypress', (str, key) => {
    switch(key.name) {
      case 'q': process.exit(0); break;
      case 'right': right; break;
      case 'left': left; break;
      case 'up': up; break;
      case 'down': down; break;
      default: break;
    }
  });
}

module.exports = udlr;