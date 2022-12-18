const { CreateLineReader } = require("../_util/LineReader");

const rawCubes = [];
const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [x, y, z] = line.split(",").map((l) => parseInt(l));
    rawCubes.push({ x, y, z });
  }
};

const getAllAdjacent = (cube) => {
  const dict = ["x", "y", "z"];
  const allAdjacent = [];
  for (let dir = 0; dir < 3; dir++) {
    for (let offset = -1; offset <= 1; offset += 2) {
      const ltr = dict[dir];
      allAdjacent.push({ ...cube, [ltr]: cube[ltr] + offset });
    }
  }
  return allAdjacent;
};

const checkSurfaceVsOkList = (cube) => {
  let openSurfaces = 0;
  const adjacent = getAllAdjacent(cube);
  adjacent.forEach((pos) => {
    if (goodEmpties.some((p2) => isMatch(pos, p2))) {
      openSurfaces++;
    }
  });
  return openSurfaces;
};

let xe = [9999999, -9999999];
let ye = [9999999, -9999999];
let ze = [9999999, -9999999];
const calculateExtremes = () => {
  rawCubes.forEach((cube) => {
    if (cube.x < xe[0]) {
      xe[0] = cube.x;
    }
    if (cube.x > xe[1]) {
      xe[1] = cube.x;
    }
    if (cube.y < ye[0]) {
      ye[0] = cube.y;
    }
    if (cube.y > ye[1]) {
      ye[1] = cube.y;
    }
    if (cube.z < ze[0]) {
      ze[0] = cube.z;
    }
    if (cube.z > ze[1]) {
      ze[1] = cube.z;
    }
  });
};

const rawEmpty = [];

const createRawEmpy = () => {
  console.log("in cre");
  for (let x = xe[0] - 1; x <= xe[1] + 1; x++) {
    for (let y = ye[0] - 1; y <= ye[1] + 1; y++) {
      for (let z = ze[0] - 1; z <= ze[1] + 1; z++) {
        if (!rawCubes.some((c2) => c2.x === x && c2.y === y && c2.z === z)) {
          rawEmpty.push({ x, y, z });
        }
      }
    }
  }
};

const isMatch = (p1, p2) => p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;

let visited = [];
const canReachOut = (pos) => {
  if (successFulVisits.some((p2) => isMatch(p2, pos))) {
    return true;
  }
  visited = [...visited, pos];
  if (pos) {
    if (
      pos.x === xe[0] - 1 ||
      pos.x === xe[1] + 1 ||
      pos.y === ye[0] - 1 ||
      pos.y === ye[1] + 1 ||
      pos.z === ze[0] - 1 ||
      pos.z === ze[1] + 1
    ) {
      return true;
    }
  }
  const adjacent = getAllAdjacent(pos);

  const filteredAdj = adjacent
    .filter((p1) => !visited.some((p2) => isMatch(p1, p2)))
    .filter((p1) => goodEmpties.some((p2) => isMatch(p1, p2)));

  return filteredAdj.some((nextPos) => canReachOut(nextPos));
};

let goodEmpties = [];

let successFulVisits = [];

const removeFromGoodEmpties = (pos) => {
  const index = goodEmpties.findIndex((p2) => isMatch(pos, p2));
  if (index >= 0) {
    goodEmpties.splice(index, 1);
  }
};
// remove all rawEmpty that cant reach out
const filterRawEmpty = () => {
  goodEmpties = rawEmpty;
  rawEmpty.forEach((pos, i) => {
    console.log("at index", i, goodEmpties.length, successFulVisits.length);
    visited = [];
    if (!canReachOut(pos)) {
      visited.forEach((vp) => removeFromGoodEmpties(vp));
    } else {
      successFulVisits = [...successFulVisits, ...visited];
    }
  });
  goodEmpties = rawEmpty.filter((pos) => canReachOut(pos, []));
};

const doStuff = async () => {
  await parse();
  let sum = 0;

  calculateExtremes();
  console.log("extremes", { xe, ye, ze });
  createRawEmpy();

  console.log("re", rawEmpty.length);

  filterRawEmpty();
  console.log("goodEmpties", goodEmpties.length);
  rawCubes.forEach((cube) => {
    sum += checkSurfaceVsOkList(cube);
  });
  if (sum !== 58) {
    console.log("Failed, sum should be 58 in test");
  }
  console.log("sum", sum);
};

doStuff();
