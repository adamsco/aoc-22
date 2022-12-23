const { CreateLineReader } = require("../_util/LineReader");

const map = [];
const directions = [];
let mapWidth = 0;
let mapHeight = 0;

const Zones = [];
const ZoneMap = {};
// A = 1, B = 2, c = 3, D = 5, E = 6, F = 4

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
      row.push(" ");
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
  findZones();
};

const findZones = () => {
  // y has 4, x has 3
  const xTests = [0, Math.round(mapWidth / 2), mapWidth - 1];
  const yTests = [0, 57, 134, 186];
  const xRes = [];
  const yRes = [];

  xTests.forEach((xPos) => {
    let ongoing = { start: undefined, end: undefined };
    map.forEach((row, i) => {
      const val = row[xPos];
      if ([".", "#"].some((v) => v === val)) {
        if (ongoing.start === undefined) {
          ongoing.start = i;
        }
        ongoing.end = i;
      }
    });
    xRes.push(ongoing);
  });

  yTests.forEach((yPos) => {
    let ongoing = { start: undefined, end: undefined };
    map[yPos].forEach((cell, i) => {
      if ([".", "#"].some((v) => v === cell)) {
        if (ongoing.start === undefined) {
          ongoing.start = i;
        }
        ongoing.end = i;
      }
    });
    yRes.push(ongoing);
  });

  const tempX = [];
  yRes.forEach((xV) => {
    tempX.push(xV.start);
    tempX.push(xV.end + 1);
  });
  const tempY = [];
  xRes.forEach((xV) => {
    tempY.push(xV.start);
    tempY.push(xV.end + 1);
  });
  const xSplits = [...new Set(tempX)];
  const ySplits = [...new Set(tempY)];
  xSplits.sort((a, b) => a - b);
  ySplits.sort((a, b) => a - b);
  const potentialZones = [];
  xSplits.forEach((x, i) => {
    if (i === xSplits.length - 1) {
      // do nothing
    } else {
      ySplits.forEach((y, j) => {
        if (j === ySplits.length - 1) {
          // do nothing
        } else {
          potentialZones.push({
            xMin: x,
            xMax: xSplits[i + 1] - 1,
            yMin: y,
            yMax: ySplits[j + 1] - 1,
          });
        }
      });
    }
  });
  const zones = potentialZones.filter(
    (z) =>
      map[z.yMin + 2][z.xMin + 2] === "." || map[z.yMin + 2][z.xMin + 2] === "#"
  );

  zones.sort((a, b) => {
    const t1 = a.yMin - b.yMin;
    if (t1 !== 0) {
      return t1;
    }
    return a.xMin - b.xMin;
  });
  const letters = ["A", "B", "C", "D", "E", "F"];
  zones.forEach((z, i) => {
    ZoneMap[letters[i]] = z;
    Zones.push(z);
  });
  console.log("ZONE", ZoneMap);
};

// end parse

let currentPosition = {
  x: 0,
  y: 0,
  face: "E", // N E S W
};

const getZoneForPosition = (x, y) => {
  const zone = Object.entries(ZoneMap).filter((entry) => {
    const [key, z] = entry;
    if (x >= z.xMin && x <= z.xMax && y >= z.yMin && y <= z.yMax) {
      return true;
    }
    return false;
  });
  // console.log("getZone", { x, y, zone }, currentPosition);
  return zone[0][0];
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

// flipY, flipX - invert that value
// switch - switch places on what x & y means (after flip)
// approach - direction approaching from

const zoneLength = 50;
const normalize = (v) => v % zoneLength;
const invert = (v) => zoneLength - 1 - normalize(v);

let transferMap = {};
const generateTransferMap = () => {
  transferMap = {
    // A - ?
    A: {
      //
      W: {
        to: "D",
        turn: ["L", "L"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["D"].xMin,
            y: ZoneMap["D"].yMin + invert(prevPosition.y),
          };
        },
      },

      N: {
        to: "F",
        turn: ["R"],
        nextPosition: (prevPosition) => {
          return { x: 0, y: ZoneMap["F"].yMin + normalize(prevPosition.x) };
        },
      },
    },
    // B -?
    B: {
      E: {
        to: "E",
        turn: ["R", "R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["E"].xMax,
            y: ZoneMap["E"].yMin + invert(prevPosition.y),
          };
        },
      },
      N: {
        to: "F",
        turn: [],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["F"].xMin + normalize(prevPosition.x),
            y: ZoneMap["F"].yMax,
          };
        },
      },
      S: {
        to: "C",
        turn: ["R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["C"].xMax,
            y: ZoneMap["C"].yMin + normalize(prevPosition.x),
          };
        },
      },
    },
    // C -?
    C: {
      W: {
        // ok
        to: "D",
        turn: ["L"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["D"].xMin + normalize(prevPosition.y),
            y: ZoneMap["D"].yMin,
          };
        },
      },
      E: {
        // ok
        to: "B",
        turn: ["L"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["B"].xMin + normalize(prevPosition.y), // dblcheck
            y: ZoneMap["B"].yMax,
          };
        },
      },
    },
    // D -?
    D: {
      W: {
        to: "A",
        turn: ["R", "R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["A"].xMin,
            y: invert(prevPosition.y),
          };
        },
      },

      N: {
        to: "C",
        turn: ["R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["C"].xMin,
            y: ZoneMap["C"].yMin + normalize(prevPosition.x),
          };
        },
      },
    },
    // E - ok
    E: {
      E: {
        // ok
        to: "B",
        turn: ["R", "R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["B"].xMax,
            y: invert(prevPosition.y),
          };
        },
      },

      S: {
        // ok
        to: "F",
        turn: ["R"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["F"].xMax,
            y: ZoneMap["F"].yMin + normalize(prevPosition.x),
          };
        },
      },
    },
    // F - ook
    F: {
      W: {
        // ok
        to: "A",
        turn: ["L"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["A"].xMin + normalize(prevPosition.y),
            y: ZoneMap["A"].yMin,
          };
        },
      },

      E: {
        // ok
        to: "E",
        turn: ["L"],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["E"].xMin + normalize(prevPosition.y),
            y: ZoneMap["E"].yMax,
          };
        },
      },

      S: {
        // ok
        to: "B",
        turn: [],
        nextPosition: (prevPosition) => {
          return {
            x: ZoneMap["B"].xMin + normalize(prevPosition.x),
            y: ZoneMap["B"].yMin,
          };
        },
      },
    },
  };
};

const performHelp = (help) => {
  const prevPos = { ...currentPosition };
  const np = help.nextPosition(currentPosition);
  if (!isWall(np.x, np.y)) {
    if (np.x === 49 && np.y === 29) {
      console.log("OUTOFBOUNDS", prevPos);
      // failed = true;
    }
    currentPosition.x = np.x;
    currentPosition.y = np.y;
    help.turn.forEach((t) => setNextFace(t));
  } else {
    // console.log("wall");
  }
};
const getCurrentZone = () => {
  return getZoneForPosition(currentPosition.x, currentPosition.y);
};
const findNextHorizontalSpace = (dir) => {
  let x = currentPosition.x + dir;
  const curZone = getCurrentZone();
  // console.log("curZone", curZone);
  const compass = dir === 1 ? "E" : "W";
  const prevPos = { ...currentPosition };
  if (x < 0) {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });
    return;
  }
  if (x === mapWidth) {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });

    return;
  }
  if (isWall(x, currentPosition.y)) {
    return;
  }
  if (canGoHere(x, currentPosition.y)) {
    currentPosition.x = x;
    return;
  } else {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });
  }
};

const findNextVerticalSpace = (dir) => {
  let y = currentPosition.y + dir;
  const curZone = getZoneForPosition(currentPosition.x, currentPosition.y);
  const compass = dir === 1 ? "S" : "N";
  const prevPos = { ...currentPosition };
  if (prevPos.x === 79 && prevPos.y === 149) {
    console.log("here", { curZone, currentPosition });
  }
  if (y < 0) {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });

    return;
  }
  if (y === mapHeight) {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });

    return;
  }
  if (isWall(currentPosition.x, y)) {
    // return currentPosition.y;
    return;
  }
  if (canGoHere(currentPosition.x, y)) {
    currentPosition.y = y;
  } else {
    const help = transferMap[curZone][compass];
    performHelp(help);
    // console.log("Transfer", {
    //   curZone,
    //   nextZone: getCurrentZone(),
    //   compass,
    //   currentPosition,
    //   prevPos,
    // });
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

let failed = false;
let count = 0;
const moveSteps = (steps, dir) => {
  if (failed) {
    console.log("f");
    return;
  }
  console.log("performing instr", { dir, currentPosition });
  count++;
  for (let i = 0; i < steps; i++) {
    getNextSpace(); // will perform move as well
    if (
      ![".", "#"].some((v) => map[currentPosition.y][currentPosition.x] === v)
    ) {
      console.log("FAIL", { currentPosition, dir, count, i });
      failed = true;
      break;
    }
  }
};

const mapRun = () => {
  setStartingPos();
  directions.forEach((dir) => {
    // console.log("direction start", dir, currentPosition);
    moveSteps(dir.steps, dir);
    setNextFace(dir.turn);
  });
};

const markAndPrint = () => {
  map[currentPosition.y][currentPosition.x] = "@";
  printMap();
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
  console.log("answer for 2", { sum, rowScore, columnScore, faceScore });
};

const doStuff = async () => {
  await parse();
  generateTransferMap();

  mapRun();
  markAndPrint();
  printAnswer();
};

doStuff();
