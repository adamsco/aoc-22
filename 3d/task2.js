const { CreateLineReader } = require("../_util/LineReader");

const getPriority = (char) => {
  const charCode = char.charCodeAt(0);
  if (charCode > 96) {
    return charCode - 96;
  }
  return charCode - 38;
};

const allStuffs = [[]];

const goToWork = () => {
  let sum = 0;
  allStuffs.forEach((threeBags) => {
    const [first, second, third] = threeBags;
    console.log("threeBags", threeBags);
    const remaining = [...first].filter(
      (f) => [...second].some((s) => s === f) && [...third].some((t) => t === f)
    );
    sum += getPriority(remaining[0]);
  });
  console.log("sum: ", sum);
};

const doThing = async () => {
  const lr = CreateLineReader("./input.txt");
  let currentPos = 0;
  let index = 0;
  for await (const line of lr) {
    const pos = Math.floor(index / 3);
    if (currentPos !== pos) {
      allStuffs.push([]);
      currentPos++;
    }
    allStuffs[pos].push(line);

    index++;
  }
  console.log(allStuffs.length);

  goToWork();
};

doThing();
