const { CreateLineReader } = require("../_util/LineReader");

const cycles = 10;

const elves = [];
const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  const charMatrix = [];
  for await (const line of lr) {
    const chars = line.split("");
    charMatrix.push(chars);
  }

  let id = 0;
  charMatrix.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char === "#") {
        elves.push({ x, y, id });
        id++;
      }
    });
  });
};

let MoveOrder = ["N", "S", "W", "E"];

const getNextAndAdjPosition = (currentPos, direction) => {
  if (direction === "N") {
    return [
      { x: currentPos.x, y: currentPos.y - 1 },
      { x: currentPos.x - 1, y: currentPos.y - 1 },
      { x: currentPos.x + 1, y: currentPos.y - 1 },
    ];
  }
  if (direction === "S") {
    return [
      { x: currentPos.x, y: currentPos.y + 1 },
      { x: currentPos.x - 1, y: currentPos.y + 1 },
      { x: currentPos.x + 1, y: currentPos.y + 1 },
    ];
  }
  if (direction === "W") {
    return [
      { y: currentPos.y, x: currentPos.x - 1 },
      { y: currentPos.y - 1, x: currentPos.x - 1 },
      { y: currentPos.y + 1, x: currentPos.x - 1 },
    ];
  }
  if (direction === "E") {
    return [
      { y: currentPos.y, x: currentPos.x + 1 },
      { y: currentPos.y - 1, x: currentPos.x + 1 },
      { y: currentPos.y + 1, x: currentPos.x + 1 },
    ];
  }
  console.log("Not supported direction", direction);
};

const containsElf = (pos) => {
  return elves.some((elf) => elf.x === pos.x && elf.y === pos.y);
};

const findNextElfPosition = (elf) => {
  let np = undefined;
  MoveOrder.forEach((dir) => {
    const positions = getNextAndAdjPosition(elf, dir);
    if (!np) {
      if (!positions.some((pos) => containsElf(pos)))
        np = { ...positions[0], id: elf.id };
    }
  });
  return np;
};
const shouldMove = (elf) => {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) {
        // my pos
      } else {
        if (containsElf({ x: x + elf.x, y: y + elf.y })) return true;
      }
    }
  }
  return false;
};

const proposeMoves = () => {
  let moves = [];
  elves.forEach((elf) => {
    if (shouldMove(elf)) {
      const nextPos = findNextElfPosition(elf);
      if (nextPos) {
        const filtered = moves.filter(
          (m) => m.x !== nextPos.x || m.y !== nextPos.y
        );
        if (filtered.length === moves.length) {
          moves.push(nextPos);
        } else {
          moves = filtered;
        }
      }
    }
  });
  return moves;
};

const performMoves = (moves) => {
  elves.forEach((elf) => {
    const nextPos = moves.find((m) => m.id === elf.id);
    if (nextPos) {
      elf.x = nextPos.x;
      elf.y = nextPos.y;
    }
  });
};

const shiftOrder = () => {
  const ord = MoveOrder.splice(0, 1);
  MoveOrder.push(ord[0]);
};

let finished = false;
const performCycle = (count) => {
  const proposedMoves = proposeMoves();
  if (proposedMoves.length === 0) {
    console.log("found break", count);
    finished = true;
  }
  // console.log("performing moves", proposedMoves.length, proposedMoves);
  performMoves(proposedMoves);
  // if (
  //   elves.some(
  //     (e, i) => i !== elves.findIndex((v) => v.x === e.x && v.y === e.y)
  //   )
  // ) {
  //   console.log("we have crash");
  // }
  shiftOrder();
};

const calculateBoundary = () => {
  const yVals = elves.map((e) => e.y);
  const xVals = elves.map((e) => e.x);

  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);

  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  console.log("Extra", { minX, maxX, minY, maxY });
  console.log("Box", {
    area: width * height,
    width,
    height,
    elves: elves.length,
    sum: width * height - elves.length,
  });
};

const printElves = (count) => {
  const yVals = elves.map((e) => e.y);
  const xVals = elves.map((e) => e.x);

  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);

  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);

  console.log(count);
  console.log("will move", MoveOrder[0]);

  for (let y = minY; y <= maxY; y++) {
    let row = "";
    for (let x = minX; x <= maxX; x++) {
      // elves.find((e) => e.x === x && e.y === y).id
      row += containsElf({ x, y }) ? "#" : ".";
    }
    console.log(row);
  }
  console.log();
  console.log("----------------");
  console.log();
};

const Task1 = () => {
  let count = 0;
  calculateBoundary();

  // for (let i = 0; i < count; i++) {
  for (let i = 0; i < 999999999; i++) {
    // console.log("cyclee", MoveOrder);
    if (finished) {
      break;
    }
    if (count % 100 === 0) {
      console.log("count", count);
    }
    count++;
    performCycle(count);
  }
  // printElves(count);

  calculateBoundary();
};

const doStuff = async () => {
  await parse();
  Task1();
};

doStuff();

// 6084 high

// 5041
