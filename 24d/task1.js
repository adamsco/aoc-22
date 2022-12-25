const { CreateLineReader } = require("../_util/LineReader");

let maxX = 0;
let maxY = 0;
let target = { x: 0, y: 0 };

let startPosition = { x: 0, y: -1 };

const intialWinds = [];

const dirMap = {
  ">": { x: 1, y: 0 },
  "<": { x: -1, y: 0 },
  v: { x: 0, y: 1 },
  "^": { x: 0, y: -1 },
};

const parse = async () => {
  const lr = CreateLineReader("./input.txt");

  let allLines = [];
  for await (const line of lr) {
    allLines.push(line.substring(1, line.length - 1).split(""));
  }
  // remove first and last to get rid of "frame"
  allLines.splice(0, 1);
  allLines.pop();
  maxY = allLines.length - 1;
  maxX = allLines[0].length - 1;
  target = { x: maxX, y: maxY + 1 };

  allLines.forEach((rows, y) => {
    rows.forEach((cell, x) => {
      const direction = dirMap[cell];
      if (direction) {
        intialWinds.push({ direction, position: { x, y }, char: cell });
      }
    });
  });
};

const moveWinds = (winds) => {
  const newWinds = [
    ...winds.map((w) => {
      return {
        direction: { ...w.direction },
        position: { ...w.position },
        char: w.char,
      };
    }),
  ];
  newWinds.forEach((w) => {
    w.position.x += w.direction.x;
    w.position.y += w.direction.y;
    if (w.position.x < 0) {
      w.position.x = maxX;
    }
    if (w.position.y < 0) {
      w.position.y = maxY;
    }
    if (w.position.x > maxX) {
      w.position.x = 0;
    }
    if (w.position.y > maxY) {
      w.position.y = 0;
    }
  });
  // console.log("made new wind", allWinds.length);
  return newWinds;
};

let shortestPath = 999;

const canMakeItInTime = (turn, position) => {
  const shortest = target.x - position.x + target.y - position.y;
  return shortest + turn < shortestPath;
};

let allWinds = [];

const canGoToSpace = (position, turn) => {
  const winds = allWinds[turn];

  if (
    position.x < 0 ||
    position.x > maxX ||
    position.y < 0 ||
    position.y > maxY
  ) {
    if (position.x === startPosition.x && position.y === startPosition.y) {
      // isok
    } else {
      return false;
    }
  }

  const res = !winds.some(
    (w) => w.position.x === position.x && w.position.y === position.y
  );
  if (!res) {
    return false;
  }

  return canMakeItInTime(turn, position);
};

const getNextPositions = (position) => {
  return {
    down: { x: position.x, y: position.y + 1 },
    up: { x: position.x, y: position.y - 1 },
    right: { x: position.x + 1, y: position.y },
    left: { x: position.x - 1, y: position.y },
  };
};

const tried = {};

const ptToString = (pos, turn) => {
  return `x${pos.x}y${pos.y}t${turn}`;
};

let count = 0;
let totalTime = 0;
let startTime = Date.now();
const travel = (position, turn, waitcount) => {
  count++;
  if (count % 100000 === 0) {
    const timeDiff = Date.now() - startTime;
    startTime = Date.now();
    totalTime += timeDiff;
    console.log("testing", { timeDiff, totalTime, count, turn });
  }
  if (tried[ptToString(position, turn)]) {
    return;
  }
  if (!canMakeItInTime(turn, position)) {
    return;
  }
  const nextTurn = turn + 1;
  if (allWinds.length < nextTurn + 1) {
    allWinds.push(moveWinds(allWinds[allWinds.length - 1]));
  }

  if (position.x === maxX && position.y === maxY) {
    // finished
    if (nextTurn < shortestPath) {
      shortestPath = nextTurn;
      console.log("____new shortestPath", {
        shortestPath,
      });
    }
    return;
  }

  const doTravel = (nextPos) => {
    travel(nextPos, nextTurn, 0);
  };

  const { down, up, right, left } = getNextPositions(position);

  if (canGoToSpace(right, nextTurn)) {
    doTravel(right);
  }

  if (canGoToSpace(down, nextTurn)) {
    doTravel(down);
  }

  if (canGoToSpace(position, nextTurn)) {
    // doTravel(position);
    if (waitcount < 5) {
      travel(position, nextTurn, waitcount + 1);
    }
  }
  if (canGoToSpace(up, nextTurn)) {
    doTravel(up);
  }
  if (canGoToSpace(left, nextTurn)) {
    doTravel(left);
  }
  tried[ptToString(position, turn)] = true;
};

const start = () => {
  allWinds.push(intialWinds);
  travel(startPosition, 0, 0);
};

const doStuff = async () => {
  await parse();
  start();
  console.log("complete?", shortestPath);
};

doStuff();

// 849 - high
// 590 - high
