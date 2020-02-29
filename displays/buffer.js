'use strict'; 

/* eslint-env node */


const _ = require('lodash');
const term = require('terminal-kit').terminal;
const ScreenBuffer = require('terminal-kit').ScreenBuffer;

class LRBuffer {
  constructor(props) {
    this.sHeight = 15;
    this.sWidth = 50;

    this.screen = new ScreenBuffer({height: this.sHeight, width: this.sWidth, dst: term});

    this.values = [];
    this.spaceStartIndex = 1;
    this.spaceHeight = this.sHeight - 2;
    this.top = 1;
    this.bottom = 1;
    this.initialSetup();
  };

// setup initial env
initialSetup() {
  for (let i=0; i<this.sHeight; i++) {
    for (let j=0; j<this.sWidth; j++) {
      if (i === 0 || i === this.sHeight - 1) {
        this.values.push({x:j, y:i, char: '*'});
      } else {
        this.values.push({x:j, y:i, char: ' '});
      }
    }
  }
  this.values.forEach((value) => {
    this.screen.put({x: value.x, y:value.y}, value.char);
  });
}




getChangeValue() {
  let flip = Math.ceil(Math.random() * 3);
  switch (flip) {
    case 1: return 1;
    case 2: return -1;
    case 3: return 0;
    default: break;
  }
}

changeSpaceStartIndex(curr, change) {
  let nextStartIndex = curr + change;
  nextStartIndex = nextStartIndex < 1 ? 1 : nextStartIndex;
  nextStartIndex = nextStartIndex > this.sHeight - 6 ? this.sHeight - 6 : nextStartIndex;
  return nextStartIndex;
}

changeSpaceHeight(curr, change) {
  let nextHeight = curr + change;
  nextHeight = nextHeight > this.sHeight + this.spaceHeight - 2 ? this.sHeight + this.spaceHeight - 2 : nextHeight;
  nextHeight = nextHeight < 4 ? 4 : nextHeight;
  return nextHeight;
}

setSpaceHeight() {
  this.spaceHeight = this.changeSpaceHeight(this.spaceHeight, this.getChangeValue());
}

setSpaceStartIndex() {
  this.spaceStartIndex = this.changeSpaceStartIndex(this.spaceStartIndex, this.getChangeValue());
}

// The randomizer needs to set the space height and starting point
// and not exceed the bounds of the screen height, top and bottom are then filled accordingly

randomizeNewEnv() {
  let nextEnv = [];
  this.setSpaceHeight(); //must come first
  this.setSpaceStartIndex();
  if (this.spaceHeight + this.spaceStartIndex >= this.sHeight -1) {
    this.spaceHeight--;
  }
  for (let i=0; i < this.sHeight; i++) {
    if (i < this.spaceStartIndex) {
      nextEnv.push({x: this.sWidth-1, y: i, char: '&'})
    }
    else if (i >= this.spaceStartIndex + this.spaceHeight) {
      nextEnv.push({x: this.sWidth-1, y: i, char: '$'})
    } else {
      nextEnv.push({x: this.sWidth-1, y: i, char: ' '});
    }
  }
  return nextEnv;
}

updateCoords(arr) {
  let nextValues = [];
  let nextEnv = this.randomizeNewEnv();
  arr.forEach((el) => {
    let nextX = el.x - 1;
    if (nextX < 0) {
      return;
    }
    else if (el.x === this.sWidth - 1) {
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

diff(arr1, arr2) {
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

same(arr1, arr2) {
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

putNewValues(arr) {
  arr.forEach((el) => {
    this.screen.put({x: el.x, y:el.y}, el.char);
  });
}

run() {
  term.clear();
  setInterval(() => {
    let nextEnv = this.updateCoords(this.values);
    let diffValues = this.diff(this.values, nextEnv);
    diffValues.forEach((el) => {
      this.screen.put({x: el.x, y:el.y}, el.char);
    });
    this.values = this.same(this.values, diffValues);
    this.screen.draw();
    }, 500)
  }

}

const gameBuffer = new LRBuffer();
gameBuffer.run();
