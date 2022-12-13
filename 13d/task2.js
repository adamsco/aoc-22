const { CreateLineReader } = require("../_util/LineReader");

const pairs = [];

const allPackets = [];

const isNumber = (c) => {
  return !["[", "]", ","].some((s) => c === s);
};

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
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
    allPackets.push([...trimmedLine]);
  }
  // parsed
};

const comparePair = (originalLeft, originalRight) => {
  // lets assume both have a length
  const left = [...originalLeft];
  const right = [...originalRight];
  let i = 0;
  while (true) {
    const l = left[i];
    const r = right[i];
    let didSplice = false;

    if (l === undefined || r === undefined) {
      console.log("ERRORROROROROR", { l, r });
    }

    if (l === "]" && r !== "]") {
      return -1;
    }
    if (r === "]" && l !== "]") {
      return 1;
    }

    if (typeof l === "number" && typeof r === "number") {
      if (l < r) {
        return -1;
      } else if (r < l) {
        return 1;
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
      i++;
    }
  }
};

const dividers = [
  ["[", "[", 2, "]", "]"],
  ["[", "[", 6, "]", "]"],
];

const matchesDivider = (packet, divider) => {
  if (packet.length !== divider.length) {
    return false;
  }

  return !packet.some((element, i) => element !== divider[i]);
};

const doStuff = async () => {
  await parse();
  allPackets.sort(comparePair);

  console.log("sortedPackets", allPackets);

  const pos1 = allPackets.findIndex((val) => matchesDivider(val, dividers[0]));
  const pos2 = allPackets.findIndex((val) => matchesDivider(val, dividers[1]));

  console.log("poses", { pos1, pos2 });
  console.log("answer", (pos1 + 1) * (pos2 + 1));
};

doStuff();
