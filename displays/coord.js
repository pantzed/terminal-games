'use strict'; 

/* eslint-env node */

const clear = require('clear');
const readline = require('readline');
const {ScreenBuffer} = require('terminal-kit');
var term = require( 'terminal-kit' ).terminal ;

clear();

term.on('key', (name, matches, data) => {
  console.log(name, matches, data);
})

var screen = new ScreenBuffer( { dst: term, height: 25, width: 50} );

function rand () {
  return Math.floor(Math.random() * 10);
}

let queue = [];

for (let i=0; i<30; i++) {
  let rx = rand();
  let ry = rand();
  queue.push([{x: rx, y: ry}, '*']);
}

function createInitialFrame(height, width) {
  let initialFrame = [];
  for(let i=0; i<=width; i++) {
    for (let j=0; j<=height; j++) {
      let xc = i;
      let yc = j;
      let char;
      if (yc === 0) {
        char = '*';
      } else if (xc === 24) {
        char = '^';
      } else {
        char = ' ';
      }
      initialFrame.push([{x:xc, y:yc}, char])
    }
  } 
  return initialFrame;
}

function runStart() {
  let init = createInitialFrame(25, 50);
  init.forEach((el) => {
    let coords = el[0];
    let char = el[1];
    screen.put(coords, char);
  });
  screen.draw();
}

function any() {
  let shift = queue.shift();
  let coords = shift[0];
  let str = shift[1];
  
  screen.draw();
}

setInterval(runStart, 1000);

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// for(let i=0; i<10; i++) {
//   let random = Math.floor(Math.random() * 10);
//   readline.cursorTo('*', random, i);
//   process.stdout.write('*');
// }

// process.stdin.write(sb);



