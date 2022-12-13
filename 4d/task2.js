const { CreateLineReader } = require("../_util/LineReader");

const parseStartAndEnd = (text) => {
  const [a, b] = text.split("-");
  return [parseInt(a), parseInt(b)];
};

const aIsInB = (a, b) => {
  return (a[0] >= b[0] && a[0] <= b[1]) || (a[1] >= b[0] && a[1] <= b[1]);
};
const doThing = async () => {
  const lr = CreateLineReader("./input.txt");

  const allLines = [];

  let sum = 0;
  let other = 0;

  for await (const line of lr) {
    const [first, second] = line.split(",");
    const a = parseStartAndEnd(first);
    const b = parseStartAndEnd(second);

    if (aIsInB(a, b)) {
      sum++;
    } else if (aIsInB(b, a)) {
      sum++;
    } else {
      other++;
    }
  }
  console.log("sum: ", sum);
  console.log("other: ", other);
};

doThing();
