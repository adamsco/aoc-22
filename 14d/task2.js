const { CreateLineReader } = require("../_util/LineReader");

const width = 1500;
const xOffset = 250;
const height = 200;

const matrix = Array.from({ length: width }, () => {
  return Array.from({ length: height }, () => "");
});

const vMatrix = Array.from({ length: height }, () => {
  return Array.from({ length: width }, () => "");
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
    const poses = pos.split(",").map((v) => parseInt(v));
    const x = poses[0] + xOffset;
    const y = poses[1];

    if (prev) {
      fillInRockGap([x, y], prev);
    }
    prev = [x, y];
  });
};

// simulate sand
const sandSpawnsAt = [500 + xOffset, 0];
let fallingPosition = [500 + xOffset, 0];
let restingSands = 0;
let restingAtStart = false;

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

    if ((x === sandSpawnsAt[0]) & (y === sandSpawnsAt[1])) {
      restingAtStart = true;
    }
    fallingPosition = sandSpawnsAt;
  }
};

const startSandSpawn = () => {
  while (true) {
    moveNext();
    if (restingAtStart) {
      console.log("finished");
      break;
    }

    if (
      fallingPosition[0] < 2 ||
      fallingPosition[0] > width - 1 ||
      fallingPosition[1] > height
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

const addBottom = (bottom) => {
  matrix.forEach((column) => {
    column[bottom] = "#";
  });
};

const createBottom = () => {
  let lowest = 0;
  matrix.forEach((column) =>
    column.forEach((c, i) => {
      if (c && i > lowest) {
        lowest = i;
      }
    })
  );
  addBottom(lowest + 2);
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  let i = 0;
  for await (const line of lr) {
    const positions = line.split(" ").filter((s) => s && s !== "->");
    addRockFormation(positions);
  }
  createBottom();

  startSandSpawn();
  // visualize();

  console.log("restingSands", restingSands);
};

doStuff();
