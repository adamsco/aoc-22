const { CreateLineReader } = require("../_util/LineReader");

const parseStartAndEnd = (text) => {
  const [a, b] = text.split("-");
  return [parseInt(a), parseInt(b)];
};

const aFitsInB = (a, b) => {
  return a[0] >= b[0] && a[1] <= b[1];
};
const doThing = async () => {
  const lr = CreateLineReader("./input.txt");

  let sum = 0;

  for await (const line of lr) {
    const [first, second] = line.split(",");
    const a = parseStartAndEnd(first);
    const b = parseStartAndEnd(second);
    if (aFitsInB(a, b)) {
      sum++;
    } else if (aFitsInB(b, a)) {
      sum++;
    }
  }
  console.log("sum: ", sum);
};

doThing();
