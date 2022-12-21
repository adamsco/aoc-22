const { CreateLineReader } = require("../_util/LineReader");

const monkeyMap = {};
const ROOT = "root";
const HMN_KEY = "humn";

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [rawname, first, operation, second] = line.split(" ");
    const name = rawname.substring(0, rawname.length - 1);

    const isFirstNumber = !isNaN(parseInt(first));
    if (name === HMN_KEY) {
      console.log("adds human key");
      monkeyMap[name] = {
        value: "undefined",
      };
    } else if (isFirstNumber) {
      // final monkey
      monkeyMap[name] = {
        value: parseInt(first),
      };
    } else {
      // duo monkey op
      monkeyMap[name] = {
        a: first,
        b: second,
        operation,
      };
    }
  }
};

let humanVal = 150;
const getValue = (key) => {
  const mapVal = monkeyMap[key];

  if (key === ROOT) {
    const a = getValue(mapVal.a);
    const b = getValue(mapVal.b);
    console.log({ a, b, diff: a - b, humanVal });
    return a - b;
  }
  if (key === HMN_KEY) {
    return humanVal;
  }

  if (mapVal.value) {
    return mapVal.value;
  }

  if (mapVal.operation === "+") {
    return getValue(mapVal.a) + getValue(mapVal.b);
  }
  if (mapVal.operation === "-") {
    return getValue(mapVal.a) - getValue(mapVal.b);
  }
  if (mapVal.operation === "*") {
    return getValue(mapVal.a) * getValue(mapVal.b);
  }
  if (mapVal.operation === "/") {
    return getValue(mapVal.a) / getValue(mapVal.b);
  }
  console.log("end");
};

const doStuff = async () => {
  await parse();

  let i = 0;
  while (true) {
    humanVal = i;

    const diff = getValue("root");
    if (diff === 0) {
      console.log("success", diff, humanVal);
      break;
    }
    if (Math.abs(diff / 1000) >= 1) {
      i += Math.round(diff / 1000);
    } else if (Math.abs(diff / 100) >= 1) {
      i += Math.round(diff / 100);
    } else if (Math.abs(diff / 10) >= 1) {
      i += Math.round(diff / 10);
    } else {
      i += Math.round(diff);
    }
  }
};

doStuff();
