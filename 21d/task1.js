const { CreateLineReader } = require("../_util/LineReader");

const monkeyMap = {};
const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [rawname, first, operation, second] = line.split(" ");
    const name = rawname.substring(0, rawname.length - 1);

    const isFirstNumber = !isNaN(parseInt(first));
    if (isFirstNumber) {
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

const getValue = (key) => {
  const mapVal = monkeyMap[key];
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
};

const doStuff = async () => {
  await parse();
  const rootVal = getValue("root");
  console.log("YELL", { rootVal });
};

doStuff();
