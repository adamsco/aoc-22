const { CreateLineReader } = require("../_util/LineReader");

const allChars = [];

const isSequence = (index, length, originalIndex) => {
  let i = index - length;
  while (true) {
    i++;
    if (i == index) {
      break;
    }
    if (allChars[i] === allChars[index]) {
      return false;
    }
  }
  if (length > 1) {
    console.log("loop");
    return isSequence(index - 1, length - 1, originalIndex);
  }
  console.log("correct", originalIndex + 1);
  return true;
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const val = line.split("");
    allChars.push(...val);
    console.log("line");
  }
  console.log(allChars.slice(0, 19));

  for (let i = 3; i < allChars.length; i++) {
    const isSeq = isSequence(i, 14, i);
    if (isSeq) {
      break;
    }
  }
  console.log("end");
};

doStuff();
