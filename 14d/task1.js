const { CreateLineReader } = require("../_util/LineReader");

const matrix = Array.from({ length: 700 }, () => {
  return Array.from({ length: 200 }, () => "");
});

const vMatrix = Array.from({ length: 200 }, () => {
  return Array.from({ length: 700 }, () => "");
});

const fillInRockGap = (position, previous) => {
  const [x, y] = position;
  const [px, py] = previous;

  let xIsDiff = false;
  if (x !== px && y !== py) {
    console.log("FAIL");
  }
  if (x !== px) {
    xIsDiff = true;
  }

  let val = xIsDiff ? Math.min(x, px) : Math.min(y, py);
  const endVal = xIsDiff ? Math.max(x, px) : Math.max(y, py);
  while (true) {
    if (xIsDiff) {
      matrix[val][y] = "#";
    } else {
      matrix[x][val] = "#";
    }
    if (val === endVal) {
      break;
    }
    if (val > endVal) {
      console.log("failure to calculate better");
    }
    val++;
  }
};

const addRockFormation = (positions) => {
  let prev = undefined;
  positions.forEach((pos) => {
    const [x, y] = pos.split(",").map((v) => parseInt(v));

    if (prev) {
      fillInRockGap([x, y], prev);
    } else {
      // matrix[x][y] = "#";
      // prev = [x, y];
    }
    prev = [x, y];
  });
};

// simulate sand
const sandSpawnsAt = [500, 0];
let fallingPosition = [500, 0];
let restingSands = 0;

const moveNext = () => {
  const [x, y] = fallingPosition;
  if (!matrix[x][y + 1]) {
    fallingPosition = [x, y + 1];
  } else if (!matrix[x - 1][y + 1]) {
    fallingPosition = [x - 1, y + 1];
  } else if (!matrix[x + 1][y + 1]) {
    fallingPosition = [x + 1, y + 1];
  } else {
    // resting
    restingSands += 1;
    matrix[x][y] = "o";
    console.log("one resting", { restingSands, x, y });
    fallingPosition = sandSpawnsAt;
  }
};

const startSandSpawn = () => {
  while (true) {
    moveNext();

    if (
      fallingPosition[0] < 2 ||
      fallingPosition[0] > 698 ||
      fallingPosition[1] > 190
    ) {
      console.log("broke", fallingPosition);
      // out
      break;
    }
  }
};

// end simulation

const visualize = () => {
  matrix.forEach((column, i) => {
    column.forEach((c, j) => {
      vMatrix[j][i] = c;
    });
  });

  vMatrix.forEach((row) => {
    console.log(
      row
        .slice(350, 600)
        .map((v) => (v ? v : ","))
        .join("")
    );
  });
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  let i = 0;
  for await (const line of lr) {
    const positions = line.split(" ").filter((s) => s && s !== "->");
    addRockFormation(positions);
  }

  startSandSpawn();
  // visualize();

  console.log("restingSands", restingSands);
};

doStuff();
