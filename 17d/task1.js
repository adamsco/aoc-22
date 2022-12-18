const { CreateLineReader } = require("../_util/LineReader");

const amountOfRocks = 2022;
const shouldPrint = false;
const printHeight = 40;
const isTesting = false;
const input = isTesting ? "./input2.txt" : "./input.txt";
let totalSeq = 0;

const shape1 = { low: [0, 0, 0, 0], high: [0, 0, 0, 0] };
const shape2 = { low: [1, 0, 1], high: [1, 2, 1] };
const shape3 = { low: [0, 0, 0], high: [0, 0, 2] };
const shape4 = { low: [0], high: [3] };
const shape5 = { low: [0, 0], high: [1, 1] };
const shapes = [shape1, shape2, shape3, shape4, shape5];

const rockSymbol = ["-", "+", "J", "I", "#"];

let topFloor = -1;
let count = 0;

const theMatrix = Array.from({ length: 7 }, () => {
  return Array.from({ length: 4000 }, () => ".");
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

const updateSequencePointer = () => {
  totalSeq++;
  sequencePointer = (sequencePointer + 1) % inputSequence.length;
  // console.log(sequencePointer);
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
      });
      addRockToMatrix();

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

const runSimulation = (rockCount) => {
  topFloor = -1;
  while (true) {
    rockPointer = count % shapes.length;
    currentRockPosition = { x: 2, y: topFloor + 4 };
    simulateRock();
    count++;
    if (count >= rockCount) {
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
  const answer = getTopFloor() + 1; // indexing
  console.log("current height:", { answer, totalSeq });
};

doStuff();

// 3150 - 2 low

// 3232
