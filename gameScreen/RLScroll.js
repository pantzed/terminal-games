'use strict'; 

/* eslint-env node */


const _ = require('lodash');
const term = require('terminal-kit').terminal;
const ScreenBuffer = require('terminal-kit').ScreenBuffer;

class RLScroll {
  constructor(options) {
    this.frameHeight = options.height || 15;
    this.frameWidth = options.width || 50;
    this.frameRate = options.frameRate || 500;
    //
    this._term = term;
    this._frame = [];
    this._buffer = new ScreenBuffer({height: this.height, width: this.width, dst: this.term});
    //
    this.updateCoords = this.updateCoords.bind(this);

  }
  
  updateCoords(arr, next) {
    let nextCoords = [];
    let nextEnv = next();
    arr.forEach((el) => {
      let nextX = el.x - 1;
      if (nextX < 0) {
        return;
      }
      else if (el.x === sWidth - 1) {
        nextCoords.push({x: nextX, y: el.y, char: el.char});
        nextCoords.push(nextEnv.shift());
      }
      else if (el.x !== 0) {
        nextCoords.push({x: nextX, y: el.y, char: el.char});
      } else {
        nextCoords.push(el);
      }
    });
    return nextCoords;
  }
  
  exclusion(arr1, arr2) {
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
  
  intersectUpdate(arr1, arr2) {
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
      this._buffer.put({x: el.x, y:el.y}, el.char);
    });
  }
  
  update() {
    let nextEnv = updateCoords(this.frame);
    let diffValues = exclusion(this.frame, nextEnv);
    this.putNewValues(diffValues);
    this.frame = intersectUpdate(this.frame, diffValues);
    this._buffer.draw();
  }

  run() {
    setInterval(this.update(), this.frameRate);
  }

}

export default RLScroll;