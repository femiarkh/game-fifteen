import utils from '../utils/utils';

export default class Model {
  constructor(size) {
    this.size = size;
    this.tiles = [];
    this.savedGames = JSON.parse(localStorage.getItem('gem-puzzle-saves')) || [];
    this.time = 0;
    this.moves = 0;
    this.isPaused = false;
    this.bestRecords = JSON.parse(localStorage.getItem('gem-puzzle-best')) || [];
    this.style = 0;
  }

  createFrame() {
    const tilesNumber = this.size * this.size;
    for (let i = 0; i < tilesNumber; i += 1) {
      this.tiles.push(i);
    }
    this.tiles = utils.shuffle(this.tiles);
    // Check if puzzle is solvable
    let zeroRow = 0;
    let inversions = 0;
    for (let i = 0; i < tilesNumber; i += 1) {
      if (this.tiles[i] === 0) {
        zeroRow = Math.floor(i / this.size) + 1;
      } else {
        for (let j = i + 1; j < tilesNumber; j += 1) {
          if (this.tiles[j] < this.tiles[i] && this.tiles[j] !== 0) {
            inversions += 1;
          }
        }
      }
    }
    const checkSum = inversions + zeroRow;
    // If not, create a new one
    if (this.size % 2 !== 0) {
      if (inversions % 2 !== 0) {
        this.tiles = [];
        this.createFrame();
      }
    } else if (checkSum % 2 !== 0) {
      this.tiles = [];
      this.createFrame();
    }
    this.sortedTiles = this.tiles.slice().sort((a, b) => a - b).slice(1);
    this.sortedTiles.push(0);
  }

  updateFrame(swapIndex) {
    const zeroIndex = this.tiles.indexOf(0);
    [this.tiles[zeroIndex], this.tiles[swapIndex]] = [this.tiles[swapIndex], this.tiles[zeroIndex]];
    this.moves += 1;
    this.onTilesSwap(this.tiles, this.moves);
    if (this.tiles.toString() === this.sortedTiles.toString()) {
      this.onWin(this.time, this.moves);
      if (this.isAuto) {
        this.isAuto = false;
        clearInterval(this.timer);
        return;
      }
      const newWin = {
        size: this.size,
        time: this.time,
        moves: this.moves,
        style: this.style,
      };
      const thisSizeRecords = this.bestRecords.find((array) => {
        const isSameSize = array[0].size === this.size;
        const isSameStyle = array[0].style === this.style;
        return isSameSize && isSameStyle;
      });
      if (thisSizeRecords) {
        thisSizeRecords.push(newWin);
        // Sort best results on the basis of two criteria
        thisSizeRecords.sort((a, b) => {
          const maxMov = thisSizeRecords.reduce((max, current) => Math.max(max, current.moves), 0);
          const minMov = thisSizeRecords.reduce((min, current) => Math.min(min, current.moves), 0);
          const maxTime = thisSizeRecords.reduce((max, current) => Math.max(max, current.time), 0);
          const minTime = thisSizeRecords.reduce((min, current) => Math.min(min, current.time), 0);
          const aMovScore = (maxMov - a.moves) / (maxMov - minMov);
          const aTimeScore = (maxTime - a.time) / (maxTime - minTime);
          const aScore = aMovScore + aTimeScore;
          const bMovScore = (maxMov - b.moves) / (maxMov - minMov);
          const bTimeScore = (maxTime - b.time) / (maxTime - minTime);
          const bScore = bMovScore + bTimeScore;
          return bScore - aScore;
        });
        if (thisSizeRecords.length > 10) {
          thisSizeRecords.splice(10);
        }
      } else {
        this.bestRecords.push([newWin]);
      }
      localStorage.setItem('gem-puzzle-best', JSON.stringify(this.bestRecords));
      clearInterval(this.timer);
    }
  }

  countTime() {
    if (this.isPaused) {
      clearInterval(this.timer);
      this.onPause();
      return;
    }
    this.timer = setInterval(() => {
      this.time += 1;
      this.onTimeChange(this.time);
    }, 1000);
  }

  save() {
    const newSave = {
      size: this.size,
      time: this.time,
      moves: this.moves,
      date: JSON.parse(JSON.stringify(new Date())),
      frame: this.tiles.slice(),
      style: this.style,
    };
    this.savedGames.unshift(newSave);
    localStorage.setItem('gem-puzzle-saves', JSON.stringify(this.savedGames));
    this.onSave();
  }

  loadData(save) {
    this.size = save.size;
    this.time = save.time;
    this.moves = save.moves;
    this.tiles = save.frame.slice();
    this.style = save.style;
    this.sortedTiles = this.tiles.slice().sort((a, b) => a - b).slice(1);
    this.sortedTiles.push(0);
    this.isPaused = false;
  }

  bindTilesSwap(callback) {
    this.onTilesSwap = callback;
  }

  bindTimeChange(callback) {
    this.onTimeChange = callback;
  }

  bindPause(callback) {
    this.onPause = callback;
  }

  bindWin(callback) {
    this.onWin = callback;
  }

  bindSave(callback) {
    this.onSave = callback;
  }

  solvePuzzle() {
    function findRowAndColumn(number, frame) {
      const index = frame.indexOf(number);
      const row = Math.floor(index / Math.sqrt(frame.length)) + 1;
      const column = (index % Math.sqrt(frame.length)) + 1;
      return [row, column];
    }

    function calculateDistance(a, b, frame) {
      const aCoords = findRowAndColumn(a, frame);
      const bCoords = findRowAndColumn(b, frame);
      return Math.abs(aCoords[0] - bCoords[0]) + Math.abs(aCoords[1] - bCoords[1]);
    }

    function findPossibleWays(traveler, frame, unmovables) {
      const ways = [];
      const index = frame.indexOf(traveler);
      const coords = findRowAndColumn(traveler, frame);
      const top = frame[index - Math.sqrt(frame.length)];
      const right = frame[index + 1];
      const bottom = frame[index + Math.sqrt(frame.length)];
      const left = frame[index - 1];

      if (top || top === 0) {
        if (!unmovables.includes(top)) {
          ways.push(top);
        }
      }
      if ((right || right === 0) && findRowAndColumn(right, frame)[0] === coords[0]) {
        if (!unmovables.includes(right)) {
          ways.push(right);
        }
      }
      if (bottom || bottom === 0) {
        if (!unmovables.includes(bottom)) {
          ways.push(bottom);
        }
      }
      if ((left || left === 0) && findRowAndColumn(left, frame)[0] === coords[0]) {
        if (!unmovables.includes(left)) {
          ways.push(left);
        }
      }
      return (ways);
    }

    function chooseShortestWay(traveler, goal, frame, unmovables) {
      if (traveler === goal) {
        return frame.indexOf(traveler);
      }
      const options = findPossibleWays(traveler, frame, unmovables);
      const optionDistances = [];
      options.forEach((option) => {
        const optionDistance = calculateDistance(option, goal, frame);
        optionDistances.push(optionDistance);
      });
      const minDistance = Math.min(...optionDistances);
      const minOptionIndex = optionDistances.indexOf(minDistance);
      const minOption = options[minOptionIndex];
      const minIndex = frame.indexOf(minOption);
      return minIndex;
    }

    function swap(frame, a, b) {
      const theFrame = frame;
      [theFrame[a], theFrame[b]] = [theFrame[b], theFrame[a]];
    }

    function goToNumber(number, frame, path, unmovables) {
      const theFrame = frame;
      let distance = calculateDistance(0, number, frame);
      while (distance > 1) {
        const zeroIndex = theFrame.indexOf(0);
        const shortestIndex = chooseShortestWay(0, number, frame, unmovables);
        path.push(shortestIndex);
        swap(frame, zeroIndex, shortestIndex);
        distance = calculateDistance(0, number, frame);
      }
      return path;
    }

    function checkSurroundings(number, frame) {
      const surroundings = [];
      const index = frame.indexOf(number);
      const frameSize = Math.sqrt(frame.length);
      const top = frame[index - frameSize];
      surroundings.push(top);
      const topRight = frame[index - frameSize + 1];
      surroundings.push(topRight);
      const right = frame[index + 1];
      surroundings.push(right);
      const bottomRight = frame[index + frameSize + 1];
      surroundings.push(bottomRight);
      const bottom = frame[index + frameSize];
      surroundings.push(bottom);
      const bottomLeft = frame[index + frameSize - 1];
      surroundings.push(bottomLeft);
      const left = frame[index - 1];
      surroundings.push(left);
      const topLeft = frame[index - frameSize - 1];
      surroundings.push(topLeft);
      const numberCoordinates = findRowAndColumn(number, frame);
      if (numberCoordinates[0] === 1) {
        surroundings[0] = -1;
        surroundings[1] = -1;
        surroundings[7] = -1;
      }
      if (numberCoordinates[0] === frameSize) {
        surroundings[3] = -1;
        surroundings[4] = -1;
        surroundings[5] = -1;
      }
      if (numberCoordinates[1] === 1) {
        surroundings[5] = -1;
        surroundings[6] = -1;
        surroundings[7] = -1;
      }
      if (numberCoordinates[1] === frameSize) {
        surroundings[1] = -1;
        surroundings[2] = -1;
        surroundings[3] = -1;
      }
      return surroundings;
    }

    function goAround(number, goal, frame, unmovables, path) {
      const surroundings = checkSurroundings(number, frame);
      const zeroPosition = surroundings.indexOf(0);
      const goalPosition = surroundings.indexOf(goal);
      let clockwise = [];
      let counterclockwise = [];
      let shortestWay = [];

      if (zeroPosition === goalPosition) {
        return;
      }

      for (let i = zeroPosition + 1; i !== goalPosition; i += 1) {
        if (surroundings[i] !== -1 && (!unmovables.includes(surroundings[i]))) {
          clockwise.push(surroundings[i]);
          if (i === 7) {
            i = -1;
          }
        } else {
          clockwise = false;
          break;
        }
      }
      for (let i = zeroPosition - 1; i !== goalPosition; i -= 1) {
        if (i < 0) {
          i = 7;
        }
        if (surroundings[i] !== -1 && (!unmovables.includes(surroundings[i]))) {
          counterclockwise.push(surroundings[i]);
        } else {
          counterclockwise = false;
          break;
        }
      }
      if (clockwise && counterclockwise) {
        if (clockwise.length < counterclockwise.length) {
          shortestWay = clockwise;
        } else {
          shortestWay = counterclockwise;
        }
      } else if (clockwise) {
        shortestWay = clockwise;
      } else {
        shortestWay = counterclockwise;
      }

      shortestWay.forEach((stepNumber) => {
        const stepIndex = frame.indexOf(stepNumber);
        const zeroIndex = frame.indexOf(0);
        path.push(stepIndex);
        swap(frame, zeroIndex, stepIndex);
      });
      const zeroIndex = frame.indexOf(0);
      const goalIndex = frame.indexOf(goal);
      path.push(goalIndex);
      swap(frame, zeroIndex, goalIndex);
    }

    function moveNumberToPlace(number, destination, frame, unmovables, path) {
      let numberIndex = frame.indexOf(number);
      if (numberIndex === destination) {
        return;
      }
      goToNumber(number, frame, path, unmovables);
      while (numberIndex !== destination) {
        const direction = chooseShortestWay(number, frame[destination], frame, unmovables);
        const directionNumber = frame[direction];
        if (directionNumber === 0) {
          const zeroIndex = frame.indexOf(0);
          path.push(numberIndex);
          swap(frame, zeroIndex, numberIndex);
        } else {
          goAround(number, directionNumber, frame, unmovables, path);
        }
        numberIndex = frame.indexOf(number);
      }
    }

    function forceGo(direction, frame, path) {
      const frameSize = Math.sqrt(frame.length);
      const zeroIndex = frame.indexOf(0);
      if (direction === 'up') {
        path.push(zeroIndex - frameSize);
        swap(frame, zeroIndex, zeroIndex - frameSize);
      }
      if (direction === 'right') {
        path.push(zeroIndex + 1);
        swap(frame, zeroIndex, zeroIndex + 1);
      }
      if (direction === 'down') {
        path.push(zeroIndex + frameSize);
        swap(frame, zeroIndex, zeroIndex + frameSize);
      }
      if (direction === 'left') {
        path.push(zeroIndex - 1);
        swap(frame, zeroIndex, zeroIndex - 1);
      }
    }

    function checkIfSolved(rowNumber, frame, unmovables) {
      const rowSize = Math.sqrt(frame.length);
      const row = frame.slice((rowNumber - 1) * rowSize, rowNumber * rowSize);
      if (row.every((item, index) => item === (rowNumber - 1) * rowSize + index + 1)) {
        row.forEach((item) => {
          if (!unmovables.includes(item)) {
            unmovables.push(item);
          }
        });
        return true;
      }
      return false;
    }

    function solveNormalRow(rowNumber, frame, unmovables, path) {
      const rowSize = Math.sqrt(frame.length);

      if (checkIfSolved(rowNumber, frame, unmovables)) {
        return;
      }

      for (let i = 1; i < rowSize - 1; i += 1) {
        const currentNumber = (rowNumber - 1) * rowSize + i;
        moveNumberToPlace(currentNumber, currentNumber - 1, frame, unmovables, path);

        if (checkIfSolved(rowNumber, frame, unmovables)) {
          return;
        }

        unmovables.push(currentNumber);
      }

      const lastNumber = rowNumber * rowSize;
      moveNumberToPlace(lastNumber, lastNumber - 2, frame, unmovables, path);
      unmovables.push(lastNumber);

      let numberAtEnd = frame[rowNumber * rowSize - 1];
      const penultimateNumber = rowNumber * rowSize - 1;

      if (numberAtEnd === 0) {
        forceGo('down', frame, path);
        numberAtEnd = frame[rowNumber * rowSize - 1];
      }

      if (numberAtEnd === penultimateNumber) {
        const nextRowStartNumber = frame[rowNumber * rowSize];
        goToNumber(nextRowStartNumber, frame, path, unmovables);
        path.push(rowNumber * rowSize);
        swap(frame, rowNumber * rowSize, rowNumber * rowSize + 1);
        forceGo('up', frame, path);
        for (let i = 0; i < rowSize - 1; i += 1) {
          forceGo('right', frame, path);
        }
        forceGo('down', frame, path);
        forceGo('left', frame, path);
        forceGo('up', frame, path);

        for (let i = rowNumber * rowSize - 2; i > (rowNumber - 1) * rowSize; i -= 1) {
          forceGo('left', frame, path);
        }

        forceGo('down', frame, path);
      } else {
        const penultimateDestination = (rowNumber + 1) * rowSize - 2;
        moveNumberToPlace(penultimateNumber, penultimateDestination, frame, unmovables, path);
      }
      unmovables.push(penultimateNumber);
      const lastInRow = frame[rowNumber * rowSize - 1];
      goToNumber(penultimateNumber, frame, path, unmovables);
      goAround(penultimateNumber, lastInRow, frame, unmovables, path);
      forceGo('left', frame, path);
      forceGo('down', frame, path);
    }

    function solveTheRest(frame, unmovables, path, solved) {
      const frameSize = Math.sqrt(frame.length);
      for (let i = 1; i < frameSize - 1; i += 1) {
        const lowerNumber = frameSize * (frameSize - 1) + i;
        const higherNumber = frameSize * (frameSize - 2) + i;

        const isHigherInPlace = frame.indexOf(higherNumber) === higherNumber - 1;
        const isLowerInPlace = frame.indexOf(lowerNumber) === lowerNumber - 1;

        if (isHigherInPlace && isLowerInPlace) {
          unmovables.push(higherNumber);
          unmovables.push(lowerNumber);
        } else {
          moveNumberToPlace(lowerNumber, higherNumber - 1, frame, unmovables, path);
          unmovables.push(lowerNumber);

          if (frame[frame.indexOf(lowerNumber) + frameSize] === 0) {
            forceGo('right', frame, path);
          }

          if (frame.indexOf(higherNumber) + 1 === lowerNumber) {
            goToNumber(higherNumber, frame, path, unmovables);
            forceGo('left', frame, path);
            forceGo('up', frame, path);
            forceGo('right', frame, path);
            forceGo('down', frame, path);
            forceGo('right', frame, path);
            forceGo('up', frame, path);
            forceGo('left', frame, path);
            forceGo('left', frame, path);
            forceGo('down', frame, path);
            forceGo('right', frame, path);
            forceGo('up', frame, path);
            forceGo('right', frame, path);
            forceGo('down', frame, path);
            forceGo('left', frame, path);
            forceGo('left', frame, path);
            forceGo('up', frame, path);
            forceGo('right', frame, path);
            unmovables.push(higherNumber);
          } else {
            moveNumberToPlace(higherNumber, higherNumber, frame, unmovables, path);
            const bottomLeftNumber = frame[frame.indexOf(lowerNumber) + frameSize];
            if (bottomLeftNumber !== 0) {
              goToNumber(bottomLeftNumber, frame, path, unmovables);
              forceGo('left', frame, path);
            }
            forceGo('up', frame, path);
            forceGo('right', frame, path);
            unmovables.push(higherNumber);
          }
        }
      }
      for (let i = 0; i < 4; i += 1) {
        forceGo('down', frame, path);
        if (frame.toString() === solved.toString()) {
          break;
        }
        forceGo('right', frame, path);
        if (frame.toString() === solved.toString()) {
          break;
        }
        forceGo('up', frame, path);
        if (frame.toString() === solved.toString()) {
          break;
        }
        forceGo('left', frame, path);
        if (frame.toString() === solved.toString()) {
          break;
        }
      }
    }

    const frame = this.tiles.slice();
    const solvedFrame = frame.slice().sort((a, b) => a - b).slice(1);
    const size = Math.sqrt(frame.length);
    solvedFrame.push(0);

    const path = [];
    const unmovables = [];
    for (let i = 1; i < size - 1; i += 1) {
      solveNormalRow(i, frame, unmovables, path);
    }
    solveTheRest(frame, unmovables, path, solvedFrame);

    return path;
  }
}
