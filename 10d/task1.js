const { CreateLineReader } = require("../_util/LineReader");

let cc = 0;
let x = 1;

let historyX = [1];

const parseAddx = (number) => {
  incCC();
  incCC();
  x += number;
};

const incCC = () => {
  cc++;
  historyX.push(x);
};

const importantValues1 = [20, 60, 100, 140, 180, 220];
const importantValues = [20, 60, 100, 140, 180, 220];
const verifiers = [21, 19, 18, 21, 16, 18];
const calculateSignal = (cycle, xVal) => {
  return cycle * xVal;
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [key, n] = line.split(" ");
    if (key === "noop") {
      incCC();
    } else {
      const number = parseInt(n);
      parseAddx(number);
    }
  }

  const testval = importantValues[5];
  const twenty = {
    t: historyX[testval],
    ar: {
      b: historyX[testval - 1],
      a: historyX[testval + 1],
    },
  };
  const xVals = importantValues.map((v) => historyX[v]);
  const pickedValues = importantValues.map((v) =>
    calculateSignal(v, historyX[v])
  );
  const sum = pickedValues.reduce((partialSum, a) => partialSum + a, 0);
  console.log("pickdeV", { sum, pickedValues, xVals, twenty, cc });
  if (twenty.t !== 18) {
    console.log("--- ERROR ---");
  }

  importantValues.forEach((v, i) => {
    const res = historyX[v];
    const expected = verifiers[i];
    if (res === expected) {
      console.log("success", { i, expected, res });
    } else {
      console.log("ERROR", { i, expected, res });
    }
  });
};

doStuff();

// 15400 2 high
