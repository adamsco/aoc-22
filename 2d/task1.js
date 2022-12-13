const { CreateLineReader } = require("../_util/LineReader");

const pointMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

const outcomeMap = {
  X: {
    A: 3,
    B: 0,
    C: 6,
  },
  Y: {
    A: 6,
    B: 3,
    C: 0,
  },
  Z: {
    A: 0,
    B: 6,
    C: 3,
  },
};

const getPointForTrying = (your, theirs) => {
  return pointMap[your] + outcomeMap[your][theirs];
};

const doThing = async () => {
  const lr = CreateLineReader("./input2.txt");

  const allLines = [];

  let points = 0;

  for await (const line of lr) {
    const pair = line.split(" ");
    allLines.push(pair);
    points += getPointForTrying(pair[1], pair[0]);
  }
  console.log("points: ", points);
};

doThing();
