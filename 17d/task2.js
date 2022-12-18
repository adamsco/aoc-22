const { CreateLineReader } = require("../_util/LineReader");
const serioutsly = 1000000000000;
const amountOfRocks = serioutsly;
const shouldPrint = false;
const printHeight = 40;
const isTesting = false;
const input = isTesting ? "./input2.txt" : "./input.txt";

const shape1 = { low: [0, 0, 0, 0], high: [0, 0, 0, 0] };
const shape2 = { low: [1, 0, 1], high: [1, 2, 1] };
const shape3 = { low: [0, 0, 0], high: [0, 0, 2] };
const shape4 = { low: [0], high: [3] };
const shape5 = { low: [0, 0], high: [1, 1] };
const shapes = [shape1, shape2, shape3, shape4, shape5];

const rockSymbol = ["-", "+", "J", "I", "#"];

let topFloor = -1;
let allTopFloor = [-1, -1, -1, -1, -1, -1, -1];
let count = 0;

const theMatrix = Array.from({ length: 7 }, () => {
  return Array.from({ length: 40000 }, () => ".");
});

let rockPointer = 0;
let sequencePointer = 0;

let inputSequence = "";

// const getTopFloor = () => Math.max(...floorPositions);
const getTopFloor = () => topFloor;

let currentRockPosition = undefined;

const dirIsLeft = () => {
  const char = inputSequence[sequencePointer];
  const test = char === "<" || char === ">";
  if (!test) {
    console.log("FAIIL", char);
  }
  return char === "<";
};

let wasError = false;

let missingTop = 0;
const getRepeatingLength = () => {
  if (topFloor < 200) {
    return -1;
  }

  let l = topFloor - 1;
  let max = l; // Math.floor((theMatrix[0].length / 2) - 5)
  let repeatLength = max;
  for (repeatLength; repeatLength > inputSequence.length / 5; repeatLength--) {
    let noDiff = true;
    // meet in middle
    for (let i = 0; i < repeatLength; i++) {
      if (!noDiff) {
        break;
      }
      for (let x = 0; x < 7; x++) {
        if (theMatrix[x][l - i] !== theMatrix[x][l - (i + repeatLength)]) {
          noDiff = false;
          break;
        }
      }
    }
    if (noDiff) {
      return repeatLength; // length of repeatable sequence
    }
  }
  return -1;
};
const heights = [0];
const heightDiffs = [0];
const matchingCounts = [0];

let smallestDiff = 2;
const isSequenceRepeating = () => {
  const diff = Math.min(
    inputSequence.length - sequencePointer,
    sequencePointer
  );
  if (diff <= smallestDiff) {
    smallestDiff = diff;
    console.log("new diff", { smallestDiff, diff, sequencePointer });
  }
  if (diff <= smallestDiff) {
    const nextValue = topFloor + missingTop - heights[heights.length - 1];
    heights.push(topFloor + missingTop);
    heightDiffs.push(nextValue);
    matchingCounts.push(count);

    const repeatingHeights = heightDiffs.filter(
      (h, i) => heightDiffs.indexOf(h) !== i
    );
    const repeatingHeightsIndices = repeatingHeights.map((rh) =>
      heightDiffs.indexOf(rh)
    );

    console.log("sequencecomplete", {
      heightDiffs,
      repeatingHeights,
      repeatingHeightsIndices,
      matchingCounts,
    });
    repeatingPatternFound = true;
  }
};

const updateSequencePointer = () => {
  totalSeq++;
  sequencePointer = (sequencePointer + 1) % inputSequence.length;
};

const isRockAtPosition = (x, y) => {
  const rockShape = shapes[rockPointer];
  const width = rockShape.low.length;
  // or just slice array
  if (x > currentRockPosition.x || x < currentRockPosition.x + width) {
    const index = x - currentRockPosition.x;
    if (y >= rockShape.low[index] && y <= rockShape.high[index]) {
      return true;
    }
  }
  return false;
};

const isRockAtMatrixPosition = (x, y) => {
  const value = theMatrix[x][y];
  if (!value) {
    console.log("PHAIL");
  }
  return value !== ".";
};

const addRockToMatrix = () => {
  const shape = shapes[rockPointer];
  const height = Math.max(...shape.high) + 1;

  const startY = currentRockPosition.y;
  for (let h = startY; h < startY + height; h++) {
    theMatrix.forEach((column, x) => {
      const curVal = column[h];
      const shouldAdd = isRockAtPosition(x, h - startY);
      const rockExists = curVal !== ".";
      if (rockExists && shouldAdd) {
        console.log("FAILED to addd", rockPointer);
      }
      if (shouldAdd) {
        theMatrix[x][h] = rockSymbol[rockPointer];
      }
    });
  }
};

const canMoveDir = (dir) => {
  const rockShape = shapes[rockPointer];

  const height = Math.max(...rockShape.high) + 1;

  const isBlocked = rockShape.low.some((l, x) => {
    const curLow = rockShape.low[x];
    const curHigh = rockShape.high[x];
    for (let h = 0; h < height; h++) {
      if (h >= curLow && h <= curHigh) {
        const crash = isRockAtMatrixPosition(
          currentRockPosition.x + x + dir,
          currentRockPosition.y + h
        );
        if (crash) {
          return true;
        }
      }
    }
    return false;
  });
  return !isBlocked;
};

const canMoveDown = () => {
  const rockShape = shapes[rockPointer];
  if (currentRockPosition.y === 0) {
    return false;
  }

  const lowPoints = rockShape.low.map((lp) => lp + currentRockPosition.y);

  if (
    lowPoints.some((lp, i) =>
      isRockAtMatrixPosition(currentRockPosition.x + i, lp - 1)
    )
  ) {
    // above top points
    return false;
  }
  return true;
  //check individual pieces
};

const debugCycle = false;
/// if 4, 1 step is possible to right
const simulateRock = () => {
  const andSpecificDebug = count === 133;
  const rockShape = shapes[rockPointer];
  while (true) {
    if (debugCycle && andSpecificDebug) {
      console.log("cycle", rockPointer);
    }
    // console.log("rp", currentRockPosition.y);

    // wind
    if (dirIsLeft()) {
      if (currentRockPosition.x > 0) {
        if (canMoveDir(-1)) {
          if (debugCycle && andSpecificDebug) {
            console.log("push left");
          }
          currentRockPosition.x -= 1;
        } else {
          if (debugCycle && andSpecificDebug) {
            console.log("cant go left");
          }
        }
      }
    } else {
      const width = rockShape.low.length;
      if (currentRockPosition.x + width < 7) {
        if (canMoveDir(1)) {
          if (debugCycle && andSpecificDebug) {
            console.log("push right");
          }
          currentRockPosition.x += 1;
        } else {
          if (debugCycle && andSpecificDebug) {
            // console.log("data", { currentRockPosition, rockShape });
            console.log("cant go right");
          }
        }
      }
    }
    updateSequencePointer();

    // downwards

    if (!canMoveDown()) {
      // we've hit rock bottom
      rockShape.high.forEach((hp, i) => {
        if (hp + currentRockPosition.y > topFloor) {
          topFloor = hp + currentRockPosition.y;
        }
        if (
          hp + currentRockPosition.y >
          allTopFloor[currentRockPosition.x + i]
        ) {
          // console.log("setting topflorr", {
          //   y: currentRockPosition.y + hp,
          //   x: currentRockPosition.x + i,
          //   high: rockShape.high,
          // });
          allTopFloor[currentRockPosition.x + i] = hp + currentRockPosition.y;
        }

        // floorPositions[i + currentRockPosition.x] = hp + currentRockPosition.y;
      });
      addRockToMatrix();
      // console.log("adding", { lowPoints, currentRockPosition, floorPositions });

      break;
    } else {
      currentRockPosition.y -= 1;

      if (debugCycle && andSpecificDebug) {
        console.log("fall");
      }
    }
  }
};

const printRocks = () => {
  if (!shouldPrint) {
    return;
  }

  const base = Math.max(0, getTopFloor() - printHeight);
  const cutMatrix = theMatrix.map((c) =>
    c.slice(base, getTopFloor() + 3).reverse()
  );

  for (let i = 0; i < cutMatrix[0].length; i++) {
    const test = `${cutMatrix[0][i] ?? "."}${cutMatrix[1][i] ?? "."}${
      cutMatrix[2][i] ?? "."
    }${cutMatrix[3][i] ?? "."}${cutMatrix[4][i] ?? "."}${
      cutMatrix[5][i] ?? "."
    }${cutMatrix[6][i] ?? "."}`;
    console.log(test);
  }
};

const verify = () => {
  let top = 0;

  theMatrix.forEach((col, x) => {
    col.forEach((c, y) => {
      if (c !== "." && y > top) {
        top = y;
      }
    });
  });
  console.log("highest is", top + 1);
};

let perc = 0;
// let score1366 = 0;
// let score802 = 0;
// let score283 = 0;
// let scoreX283 = 0;

let sr1 = 0;
let sr2 = 0;
const runSimulation = (rockCount) => {
  topFloor = -1;

  while (true) {
    rockPointer = count % shapes.length;
    currentRockPosition = { x: 2, y: topFloor + 4 };
    simulateRock();

    // cleanup(); // dont need this approach
    count++;
    if (topFloor === 2893) {
      // from previous run, need to save index
      sr1 = count;
    }
    if (count === 3561 + 1099) {
      sr2 = topFloor;
    }
    isSequenceRepeating();
    const repeats = getRepeatingLength();

    if (count >= rockCount) {
      break;
    }
    if (wasError) {
      console.log("abort");
      break;
    }
    if (repeats > 0) {
      console.log("SR2", sr2);
      ///...
      console.log("repeatslength (height repeatable)", { repeats, topFloor });
      console.log("repeats at ", count);

      const endScore = 7395 - topFloor;
      const initialScore = topFloor;

      const howManyRocks = count - sr1;
      const factor = Math.floor((serioutsly - count) / howManyRocks);

      // todo: this is whats left!! remaining rest calc
      const rest = (serioutsly - sr1) % howManyRocks;
      const bestGuess = initialScore + repeats * factor + endScore + 1;

      console.log("result?", {
        bestGuess,
        factor,
        repeats,
        prevScore: topFloor - repeats,
        initialScore,
        endScore,
        rest,
        count,
        howManyRocks,
        sr1,
      });
      break;
    }
  }
  printRocks();
  verify();
};

const doStuff = async () => {
  const lr = CreateLineReader(input);
  for await (const line of lr) {
    inputSequence = line.trim();
  }

  runSimulation(amountOfRocks);
  const answer = getTopFloor() + 1 + missingTop; // indexing
  console.log("current height:", { answer });
};

doStuff();

/**
 *
 * Note
 * - this was hard, it didnt help at all when I tried to make it even hackier and less readable
 * - its not at all optimized, to get correct answer you need to run it three times,
 * first to find where it splits,
 * then to find how much the segment before consists of as well as the rest towards the end
 * Finally you can sum it up.
 *
 * I probably will fix this up so it at least runs in one go eventually..
 */
