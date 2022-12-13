const { CreateLineReader } = require("../_util/LineReader");
const order = Array.from({ length: 9 }, () => []);

const theMatrix = [];
let maxLength = 0;

const checkDir = (getValue, height, startPos, inc) => {
  let c = startPos;
  let counter = 0;
  let blockingHeight = -1;
  while (true) {
    if (inc) {
      c++;
    } else {
      c--;
    }
    if ((!inc && c < 0) || (inc && c > maxLength)) {
      break; // end of sight
    }
    const val = getValue(c);

    if (val >= height) {
      // end of sight
      counter++;
      break;
    }
    if (val >= blockingHeight) {
      counter++;
      blockingHeight = -1;
    }
    // still visible
  }
  return counter;
};

const getScore = (x, y, height) => {
  const wScore = checkDir((c) => theMatrix[x][c], height, y, false);
  const eScore = checkDir((c) => theMatrix[x][c], height, y, true);
  const nScore = checkDir((c) => theMatrix[c][y], height, x, false);
  const sScore = checkDir((c) => theMatrix[c][y], height, x, true);

  // console.log("eh", { nScore, sScore, wScore, eScore });
  const totScore = nScore * wScore * sScore * eScore;
  if (totScore > topScore) {
    console.log("new topScore", {
      totScore,
    });
    topScore = totScore;
  }
  return totScore;
};
let topScore = 0;

const doStuff = async () => {
  const lr = CreateLineReader("./input2.txt");
  for await (const line of lr) {
    theMatrix.push(line.split("").map((item) => parseInt(item)));
  }
  maxLength = theMatrix.length - 1;

  theMatrix.forEach((row, x) => {
    row.forEach((height, y) => {
      getScore(x, y, height);
    });
  });
  getScore(36, 35, 9);
  console.log("topScore", topScore);
};
// 180 -> too low (+)
// 1176 -> 2 low
// 234416 - stupid rules
doStuff();
