const { CreateLineReader } = require("../_util/LineReader");

const outcomeMap2 = {
  X: 0,
  Y: 3,
  Z: 6,
};

// x = loose
// y draw
// z win!

const valueMap = {
  A: {
    X: 3,
    Y: 1,
    Z: 2,
  },
  B: {
    X: 1,
    Y: 2,
    Z: 3,
  },
  C: {
    X: 2,
    Y: 3,
    Z: 1,
  },
};

const getPointForTrying = (your, theirs) => {
  return outcomeMap2[your] + valueMap[theirs][your];
};

const doThing = async () => {
  const lr = CreateLineReader("./input2.txt");

  let points = 0;

  for await (const line of lr) {
    const [theirs, your] = line.split(" ");
    points += getPointForTrying(your, theirs);
  }
  console.log("points: ", points);
};

doThing();
