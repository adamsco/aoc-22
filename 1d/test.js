const fs = require("fs");
const readline = require("readline");

async function processLineByLine() {
  const fileStream = fs.createReadStream("./input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let maxLine = 0;
  let curLine = 0;
  let topThree = [0, 0, 0];

  const sort = () => {
    newList = [];
    if (topThree[0] >= topThree[1] && topThree[0] >= topThree[2]) {
      newList.push(topThree[0]);
      topThree.splice(0, 1);
    } else if (topThree[1] >= topThree[0] && topThree[1] >= topThree[2]) {
      newList.push(topThree[1]);
      topThree.splice(1, 1);
    } else {
      newList.push(topThree[2]);
      topThree.splice(2, 1);
    }
    if (topThree[0] >= topThree[1]) {
      newList.push(...topThree);
    } else {
      newList.push(...topThree.reverse());
    }
    topThree = newList;
  };

  const addIfLarger = (contestant) => {
    if (contestant > topThree[2]) {
      topThree.pop();
      topThree.push(contestant);
      sort();
    }
  };

  for await (const line of rl) {
    if (line) {
      line.trimEnd();

      curLine += Number.parseInt(line);
    } else {
      addIfLarger(curLine);
      curLine = 0;
    }
    // Each line in input.txt will be successively available here as `line`.
  }
  const sum = topThree[0] + topThree[1] + topThree[2];
  console.log(sum);
  console.log(topThree);
}

processLineByLine();
