const { CreateLineReader } = require("../_util/LineReader");

const theMatrix = [];
let maxLength = 0;

const isVisible = (x, y, height) => {
  // west
  let cX = x;
  while (true) {
    cX--;
    if (cX < 0) {
      return true; // visible
    }
    if (theMatrix[cX][y] >= height) {
      // not visible
      break;
    }
    // still visible
  }

  // east
  cX = x;
  while (true) {
    cX++;
    if (cX > maxLength) {
      return true; // visible
    }
    if (theMatrix[cX][y] >= height) {
      // not visible
      break;
    }
    // still visible
  }

  // south
  let cY = y;
  while (true) {
    cY++;
    if (cY > maxLength) {
      return true; // visible
    }
    if (theMatrix[x][cY] >= height) {
      // not visible
      break;
    }
    // still visible
  }
  // north
  cY = y;
  while (true) {
    cY--;
    if (cY < 0) {
      return true; // visible
    }
    if (theMatrix[x][cY] >= height) {
      // not visible
      break;
    }
    // still visible
  }
  return false;
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  let visibleTrees = 0;
  for await (const line of lr) {
    theMatrix.push(line.split(""));
  }
  maxLength = theMatrix.length - 1;

  theMatrix.forEach((row, x) => {
    row.forEach((height, y) => {
      if (isVisible(x, y, height)) {
        console.log("isVisible");
        visibleTrees++;
      }
    });
  });
  console.log("sum", visibleTrees);
};

doStuff();
