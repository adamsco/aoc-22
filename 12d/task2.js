const { CreateLineReader } = require("../_util/LineReader");
// map is accessed by y > x
const map = [];

const parseData = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const squares = line.split("").filter((c) => c);
    map.push(squares);
  }
};

const getHeightAt = (position) => {
  const char = map[position.y][position.x];
  if (char === "E") {
    return "z".charCodeAt(0);
  }
  if (char === "S") {
    return "a".charCodeAt(0);
  }

  return char.charCodeAt(0); // verify
};

const isGoal = (position) => {
  const char = map[position.y][position.x];
  if (char === "E") {
    return true;
  }
  return false;
};

const canTraverseTo = (position, destination, visited) => {
  if (destination.y < 0 || destination.x < 0) {
    return false;
  }
  if (destination.y > map.length - 1 || destination.x > map[0].length - 1) {
    return false;
  }

  const bestPathForDestination =
    fromToPaths[getDestinationAsString(destination)];
  const betterPath =
    bestPathForDestination === undefined ||
    visited.length < bestPathForDestination;

  if (!betterPath) {
    return false;
  }

  const currentHeight = getHeightAt(position);
  const destinationHeight = getHeightAt(destination);

  if (destinationHeight - currentHeight <= 1) {
    // can go!
    return true;
  }
  return false;
};

const fromToPaths = {};

const getDestinationAsString = (destination) => {
  return `${destination.x}-${destination.y}`;
};

const mapVisitedToString = (visited) => {
  let str = "";
  visited.forEach((vec) => {
    str += map[vec.y][vec.x];
  });
  return str;
};

let bestPath = 99999999999;

let deepestPath = 0;
let bestPathRaw = [];
const traverseMap = (position, visited) => {
  if (isGoal(position)) {
    // stop;

    if (visited.length < bestPath) {
      console.log("GOAL:", visited.length, position);

      console.log("visited2:", mapVisitedToString(visited));
      bestPathRaw = visited;
      bestPath = visited.length;
    }
  }
  if (visited.length > bestPath) {
    return;
  }

  if (visited.length > deepestPath) {
    deepestPath = visited.length; // debug only
  }

  for (let i = 0; i < 4; i++) {
    let destination = { x: position.x, y: position.y };
    if (i === 0) {
      destination.x -= 1;
    }
    if (i === 1) {
      destination.y -= 1;
    }
    if (i === 2) {
      destination.x += 1;
    }
    if (i === 3) {
      destination.y += 1;
    }
    if (canTraverseTo(position, destination, visited)) {
      const newVisited = [...visited, destination];
      fromToPaths[getDestinationAsString(destination)] = visited.length;
      traverseMap(destination, newVisited);
    } else {
      // console.log("end");
    }
    // do all dirs
  }
};

const visualize = () => {
  const rawMap = Array.from({ length: map.length }, () =>
    Array.from({ length: map[0].length }, () => "_")
  );
  bestPathRaw.forEach(({ x, y }) => {
    rawMap[y][x] = "X";
  });
  rawMap.forEach((line) => console.log(line.join("")));
};

const findAllStartingPositions = () => {
  const pos = [];
  map.forEach((yrow, i) => {
    yrow.forEach((cell, j) => {
      if (cell === "a") {
        pos.push({ x: j, y: i });
      }
    });
  });
  return pos;
};

const doStuff = async () => {
  await parseData();

  const startingPositions = findAllStartingPositions();

  startingPositions.forEach(({ x, y }) => {
    const visited = [{ x, y }];
    traverseMap({ x, y }, visited);
  });

  // remove starting path
  const actualLength = bestPath - 1;
  visualize();

  console.log("BESTPATH", actualLength);
};

doStuff();
