const { CreateLineReader } = require("../_util/LineReader");

let mainOrder = [];
const parseStartPosition = async () => {
  const order = Array.from({ length: 9 }, (_, i) => []);

  const lr = CreateLineReader("./start.txt");

  for await (const line of lr) {
    for (let i = 0; i < 9; i++) {
      const val = line.substring(4 * i, 4 * i + 3).trim();
      if (val) {
        order[i].push(val);
      }
    }
  }

  for (let i = 0; i < 9; i++) {
    order[i].reverse();
  }
  mainOrder = order;
};

const performInstructions = (amount, startPos, endPos) => {
  const items = mainOrder[startPos].splice(mainOrder[startPos].length - amount);
  mainOrder[endPos].push(...items);
};

const getTopItems = () => {
  const topItems = [];
  for (let i = 0; i < 9; i++) {
    if (mainOrder[i].length) {
      topItems.push(mainOrder[i][mainOrder[i].length - 1].substring(1, 2));
    } else {
      console.log("position i no items", i);
    }
  }
  const parsedTop = topItems.join("");
  console.log("parsedTop", parsedTop);
};

const doInstructions = async () => {
  await parseStartPosition();

  const lr = CreateLineReader("./input.txt");
  console.log("main", mainOrder);

  for await (const line of lr) {
    const [move, howMany, from, start, to, end] = line.split(" ");
    const amount = parseInt(howMany);
    const startPos = parseInt(start) - 1;
    const endPos = parseInt(end) - 1;
    performInstructions(amount, startPos, endPos);
    getTopItems();
  }

  getTopItems();
};

doInstructions();
