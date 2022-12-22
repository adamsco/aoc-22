const { CreateLineReader } = require("../_util/LineReader");

const map = [];
const directions = [];
let mapWidth = 0;
let mapHeight = 0;

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  let isMap = true;
  let tempString = "";
  for await (const line of lr) {
    if (!line) {
      isMap = false;
    }
    if (isMap) {
      const newRow = line.split("");
      mapWidth = Math.max(newRow.length, mapWidth);
      map.push(newRow);
    } else {
      tempString = line;
    }
  }
  mapHeight = map.length;
  // fillmap
  map.forEach((row) => {
    while (row.length < mapWidth) {
      row.push("");
    }
  });
  // printMap();
  // parseLine..
  let ongoing = "";
  tempString.split("").forEach((char) => {
    if (["R", "L"].some((l) => l === char)) {
      directions.push({ steps: parseInt(ongoing), turn: char });
      ongoing = "";
    } else {
      ongoing += char;
    }
  });
  if (ongoing) {
    directions.push({ steps: parseInt(ongoing), turn: "Z" });
  }

  // console.log("complete directions", directions);
};

let currentPosition = {
  x: 0,
  y: 0,
  face: "E", // N E S W
};

const setNextFace = (turn) => {
  const right = { N: "E", E: "S", S: "W", W: "N" };
  const left = { N: "W", W: "S", S: "E", E: "N" };
  if (turn === "L") {
    currentPosition.face = left[currentPosition.face];
  } else if (turn === "R") {
    currentPosition.face = right[currentPosition.face];
  } else if (turn === "Z") {
    // sleep
  } else {
    console.log("BROKEN");
  }
};

const setStartingPos = () => {
  let pos = undefined;
  map.forEach((row, y) => {
    if (!pos) {
      row.forEach((c, x) => {
        if (!pos) {
          if (c === ".") {
            pos = { x, y };
          }
        }
      });
    }
  });
  currentPosition = { x: pos.x, y: pos.y, face: "E" };
};

const printMap = () => {
  map.forEach((row) => {
    console.log(row.join(""));
  });
};

const canGoHere = (x, y) => {
  return map[y][x] === ".";
};
const isWall = (x, y) => {
  return map[y][x] === "#";
};

const findNextHorizontalSpace = (dir) => {
  let x = currentPosition.x + dir;
  while (true) {
    if (x < 0) {
      x = mapWidth - 1;
    }
    if (x === mapWidth) {
      x = 0;
    }
    if (isWall(x, currentPosition.y)) {
      return currentPosition.x;
    }
    if (canGoHere(x, currentPosition.y)) {
      return x;
    }
    x += dir;
  }
};

const findNextVerticalSpace = (dir) => {
  let y = currentPosition.y + dir;
  while (true) {
    if (y < 0) {
      y = mapHeight - 1;
    }
    if (y === mapHeight) {
      y = 0;
    }
    if (isWall(currentPosition.x, y)) {
      return currentPosition.y;
    }
    if (canGoHere(currentPosition.x, y)) {
      return y;
    }
    y += dir;
  }
};

const getNextSpace = () => {
  if (currentPosition.face === "E") {
    return { x: findNextHorizontalSpace(1), y: currentPosition.y };
  }
  if (currentPosition.face === "W") {
    return { x: findNextHorizontalSpace(-1), y: currentPosition.y };
  }
  if (currentPosition.face === "S") {
    return { x: currentPosition.x, y: findNextVerticalSpace(1) };
  }
  if (currentPosition.face === "N") {
    return { x: currentPosition.x, y: findNextVerticalSpace(-1) };
  }
  console.log("BROKEEEE");
};

const moveSteps = (steps) => {
  for (let i = 0; i < steps; i++) {
    const { x, y } = getNextSpace();
    currentPosition.x = x;
    currentPosition.y = y;
  }
};

const mapRun = () => {
  setStartingPos();
  directions.forEach((dir) => {
    moveSteps(dir.steps);
    setNextFace(dir.turn);
  });
};

const markAndPrint = () => {
  map[currentPosition.y][currentPosition.x] = "@";
  printMap();
  console.log("currentPos", currentPosition);
};

const getFaceScore = () => {
  const sm = {
    N: 3,
    E: 0,
    S: 1,
    W: 2,
  };
  return sm[currentPosition.face];
};

const printAnswer = () => {
  const rowScore = (currentPosition.y + 1) * 1000;
  const columnScore = (currentPosition.x + 1) * 4;
  const faceScore = getFaceScore();
  const sum = rowScore + columnScore + faceScore;
  console.log("answer for 1", { sum, rowScore, columnScore, faceScore });
};

const doStuff = async () => {
  await parse();

  mapRun();
  markAndPrint();
  printAnswer();
};

doStuff();

// 159046 - high
