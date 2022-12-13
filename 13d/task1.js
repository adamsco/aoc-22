const { CreateLineReader } = require("../_util/LineReader");

const pairs = [];

const isNumber = (c) => {
  return !["[", "]", ","].some((s) => c === s);
};

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  let prevLine = undefined;
  for await (const line of lr) {
    const rawLine = line.split("");
    if (rawLine.length === 0) {
      continue;
    }
    const lineWithJoinedNumbers = [];
    let i = 0;
    while (true) {
      if (i >= rawLine.length) {
        break;
      }
      if (i < rawLine.length - 1) {
        if (isNumber(rawLine[i]) && isNumber(rawLine[i + 1])) {
          const joined = rawLine[i] + rawLine[i + 1];
          console.log("joined", joined);
          lineWithJoinedNumbers.push(joined);
          i += 2;
          continue;
        }
      }
      lineWithJoinedNumbers.push(rawLine[i]);
      i++;
    }
    const newLine = lineWithJoinedNumbers
      .filter((c) => c && c !== ",")
      .map((c) => (c === "[" || c === "]" ? c : parseInt(c)));

    if (newLine.length === 0) {
      continue;
    }
    const trimmedLine = newLine;
    if (prevLine === undefined) {
      prevLine = trimmedLine;
    } else {
      pairs.push({ left: [...prevLine], right: [...trimmedLine] });
      prevLine = undefined;
    }
  }
  // parsed
};

const comparePair = (pair) => {
  // lets assume both have a lenght
  const left = [...pair.left];
  const right = [...pair.right];
  let i = 0;
  while (true) {
    const l = left[i];
    const r = right[i];
    let didSplice = false;

    if (l === undefined || r === undefined) {
      console.log("ERRORROROROROR", { l, r });
    }

    if (l === "]" && r !== "]") {
      return true;
    }
    if (r === "]" && l !== "]") {
      return false;
    }

    if (typeof l === "number" && typeof r === "number") {
      if (l < r) {
        return true;
      } else if (r < l) {
        return false;
      }
    } else if (typeof l === "number" || typeof r === "number") {
      if (typeof l === "number") {
        left.splice(i, 1, "[", l, "]");
      } else {
        right.splice(i, 1, "[", r, "]");
      }
      didSplice = true;
      continue; // seems to work..
    }
    if (!didSplice) {
      console.log("++ing", { l, r });
      i++;
    }
  }
};

const doStuff = async () => {
  await parse();

  let okIndices = [];

  pairs.forEach((pair, i) => {
    if (comparePair(pair)) {
      okIndices.push(i + 1);
    }
  });

  let sum = 0;
  okIndices.forEach((i) => {
    sum += i;
  });
  console.log("sum", sum);
};

doStuff();
