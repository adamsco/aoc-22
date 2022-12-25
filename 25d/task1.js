const { CreateLineReader } = require("../_util/LineReader");

const inputNumbers = [];
const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    inputNumbers.push(line.split("").reverse());
  }
};

const SnafCharToDec = (char) => {
  if (char === "=") {
    return -2;
  }
  if (char === "-") {
    return -1;
  }
  if (char === "0") {
    return 0;
  }
  if (char === "1") {
    return 1;
  }
  if (char === "2") {
    return 2;
  }
};

const revSnafuToDec = (rs) => {
  let res = 0;
  rs.forEach((char, i) => {
    res += SnafCharToDec(char) * 5 ** i;
  });
  return res;
};

const sumUp = () => {
  let sum = 0;
  inputNumbers.forEach((snafuRow) => {
    sum += revSnafuToDec(snafuRow);
  });
  return sum;
};

const DecToSnafu = (number) => {
  let snafuChars = [];

  let start = 0;

  let i = 0;
  while (true) {
    const factor = (1 * 5) ** i;
    if (number < factor) {
      start = i - 1;
      break;
    }
    i++;
  } // find highest i to start with

  const incMap = {
    "=": "-",
    "-": "0",
    0: "1",
    1: "2",
  };

  const increaseAt = (index) => {
    if (index < 0) {
      snafuChars.splice(0, 0, "1");
      return;
    }
    const char = snafuChars[index];
    const newChar = incMap[char];
    if (newChar !== undefined) {
      snafuChars.splice(index, 1, newChar);
    } else {
      snafuChars.splice(index, 1, "=");
      increaseAt(index - 1);
    }
  };

  // need to do it in reverse to get proper modulo lower than 5
  let adjustedNumber = number;
  for (let x = start; x >= 0; x--) {
    const factor = 5 ** x;

    let howMany = Math.floor(adjustedNumber / factor);

    if (howMany > 2) {
      if (howMany > 4) {
      } else {
        if (howMany === 4) {
          increaseAt(snafuChars.length - 1);
          snafuChars.push("-");
        }
        if (howMany === 3) {
          increaseAt(snafuChars.length - 1);
          snafuChars.push("=");
        }
      }
    } else {
      snafuChars.push(howMany + "");
    }
    const rest = adjustedNumber % factor;
    adjustedNumber = rest;
  }

  return snafuChars.join("");
};

const doStuff = async () => {
  await parse();
  const decSum = sumUp();
  console.log("total sum", decSum);
  const res = DecToSnafu(parseInt(decSum));
  console.log("snafuSum", { res });
};

doStuff();
