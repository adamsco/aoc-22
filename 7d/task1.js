const { CreateLineReader } = require("../_util/LineReader");

const curDirectory = [];
const mapDirectory = { "/": {} };
const mapdirFileSize = { "/": 0 };

const parseCommand = (two, three) => {
  if (two === "cd") {
    if (three === "..") {
      curDirectory.pop();
    } else {
      curDirectory.push(three);
    }
  }
  if (two === "ls") {
    // nada
  }
};

const parseDir = (dir) => {
  allDirs.push(dir);
  const getNestedObject = (nestedObj, pathArr) => {
    return pathArr.reduce(
      (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
      nestedObj
    );
  };

  const parent = getNestedObject(mapDirectory, curDirectory);
  parent[dir] = {};
  mapdirFileSize[curDirectory.join("") + dir] = 0;
};

const parseFile = (size, name) => {
  mapdirFileSize[curDirectory.join("")] += parseInt(size);
};

const calculateDirSize = (dir) => {
  mapdirFileSize[dir];

  const subDirNames = Object.keys(mapdirFileSize).filter((key) =>
    key.startsWith(dir)
  );

  const allSizes = subDirNames.map((key) => mapdirFileSize[key]);

  let sum = 0;
  allSizes.forEach((size) => {
    sum += size;
  });
  return sum;
};

const howManyEmpty = () => {
  const allempty = Object.keys(mapdirFileSize)
    .map((k) => calculateDirSize(k))
    .filter((v) => v === 0).length;
  console.log("emptty", allempty);
  console.log("alldris", Object.keys(mapdirFileSize).length);
  const test = Object.keys(mapdirFileSize);
  const settedList = [...new Set(allDirs)];
  console.log(settedList);
  console.log(settedList.length);
};

const maxSize = 100000;

const getAnswerForT1 = () => {
  let sum = 0;
  const allDirs = Object.keys(mapdirFileSize);
  allDirs.forEach((dir) => {
    const size = calculateDirSize(dir);
    if (size < maxSize) {
      sum += size;
    }
  });
  console.log("SUM", sum);
};

const totalSize = 70000000;
const neededSize = 30000000;

const bestMatch = { dir: "noone", size: 99999999999999 };
let recommendedToDelete = 0;

const shouldDelete = (dir, size) => {
  if (size > recommendedToDelete && size < bestMatch.size) {
    bestMatch.dir = dir;
    bestMatch.size = size;
  }
};

const getAnswerForT2 = () => {
  const occupiedSize = calculateDirSize("/");
  console.log("os", occupiedSize);
  recommendedToDelete = neededSize - (totalSize - occupiedSize);

  const allDirs = Object.keys(mapdirFileSize);
  allDirs.forEach((dir) => {
    const size = calculateDirSize(dir);
    shouldDelete(dir, size);
  });
  console.log("match", bestMatch);
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [one, two, three] = line.split(" ");
    if (one === "$") {
      parseCommand(two, three);
    } else if (one === "dir") {
      parseDir(two);
    } else {
      parseFile(one, two);
    }
  }

  // getAnswerForT1();
  // getAnswerForT2();
  howManyEmpty();
};

doStuff();
