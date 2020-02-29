'use strict'; 

/* eslint-env node */


const _ = require('lodash');
const term = require('terminal-kit').terminal;
const ScreenBuffer = require('terminal-kit').ScreenBuffer;

const sHeight = 15;
const sWidth = 50;

let screen = new ScreenBuffer({height: sHeight, width: sWidth, dst: term});

let values = [];
let spaceStartIndex = 1;
let spaceHeight = sHeight - 2;
let top = 1;
let bottom = 1;

//setup
for (let i=0; i<sHeight; i++) {
  for (let j=0; j<sWidth; j++) {
    if (i === 0 || i === sHeight - 1) {
      values.push({x:j, y:i, char: '*'});
    } else {
      values.push({x:j, y:i, char: ' '});
    }
  }
}

values.forEach((value) => {
  screen.put({x: value.x, y:value.y}, value.char);
});

function getChangeValue() {
  let flip = Math.ceil(Math.random() * 3);
  switch (flip) {
    case 1: return 1;
    case 2: return -1;
    case 3: return 0;
    default: break;
  }
}

function doMathForHeight(env, change) {
  let maxHeight = Math.round(sHeight/2) - 2;
  let nextHeight = env + change;
  nextHeight = nextHeight < 1 ? 1 : nextHeight;
  nextHeight = nextHeight >= maxHeight ? maxHeight : nextHeight;
  return nextHeight;
}

function changeSpaceStartIndex(curr, change) {
  let nextStartIndex = curr + change;
  nextStartIndex = nextStartIndex < 1 ? 1 : nextStartIndex;
  nextStartIndex = nextStartIndex > sHeight - 6 ? sHeight - 6 : nextStartIndex;
  return nextStartIndex;
}

function changeSpaceHeight(curr, change) {
  let nextHeight = curr + change;
  nextHeight = nextHeight > sHeight + spaceHeight - 2 ? sHeight + spaceHeight - 2 : nextHeight;
  nextHeight = nextHeight < 4 ? 4 : nextHeight;
  return nextHeight;
}

function setSpaceHeight() {
  spaceHeight = changeSpaceHeight(spaceHeight, getChangeValue());
}

function setSpaceStartIndex() {
  spaceStartIndex = changeSpaceStartIndex(spaceStartIndex, getChangeValue());
}

// The randomizer needs to set the space height and starting point
// and not exceed the bounds of the screen height, top and bottom are then filled accordingly

function randomizeNewEnv() {
  let nextEnv = [];
  setSpaceHeight(); //must come first
  setSpaceStartIndex();
  if (spaceHeight + spaceStartIndex >= sHeight -1) {
    spaceHeight--;
  }
  for (let i=0; i < sHeight; i++) {
    if (i < spaceStartIndex) {
      nextEnv.push({x: sWidth-1, y: i, char: '&'})
    }
    else if (i >= spaceStartIndex + spaceHeight) {
      nextEnv.push({x: sWidth-1, y: i, char: '$'})
    } else {
      nextEnv.push({x: sWidth-1, y: i, char: ' '});
    }
  }
  return nextEnv;
}

function updateCoords(arr) {
  let nextValues = [];
  let nextEnv = randomizeNewEnv();
  arr.forEach((el) => {
    let nextX = el.x - 1;
    if (nextX < 0) {
      return;
    }
    else if (el.x === sWidth - 1) {
      nextValues.push({x: nextX, y: el.y, char: el.char});
      nextValues.push(nextEnv.shift());
    }
    else if (el.x !== 0) {
      nextValues.push({x: nextX, y: el.y, char: el.char});
    } else {
      nextValues.push(el);
    }
  });
  return nextValues;
}

function diff(arr1, arr2) {
  let difference = [];
  for(let i=0; i<arr1.length; i++) {
    let a = arr1[i];
    for(let j=0; j<arr2.length; j++) {
      let b = arr2[j];
      if (a.x === b.x && a.y === b.y && a.char !== b.char) {
        difference.push(arr2[j]);
        break;
      }
    }
  }
  return difference;
}

function same(arr1, arr2) {
  let combined = [...arr1];
  for (let i=0; i<combined.length; i++) {
    let a = combined[i];
    for (let j=0; j<arr2.length; j++) {
      let b = arr2[j];
      if (a.x === b.x && a.y === b.y) {
        combined[i].char = b.char;
      }
    }
  }
  return combined;
}

function putNewValues(arr) {
  arr.forEach((el) => {
    screen.put({x: el.x, y:el.y}, el.char);
  });
}

function run() {
  let nextEnv = updateCoords(values);
  let diffValues = diff(values, nextEnv);
  diffValues.forEach((el) => {
    screen.put({x: el.x, y:el.y}, el.char);
  });
  values = same(values, diffValues);
  screen.draw();
}

term.clear();
setInterval(run, 500);
// run();


