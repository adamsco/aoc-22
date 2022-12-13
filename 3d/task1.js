const { CreateLineReader } = require("../_util/LineReader");

const getPriority = (char) => {
  const charCode = char.charCodeAt(0);
  if (charCode > 96) {
    return charCode - 96;
  }
  return charCode - 38;
};

const splitString = (value) => {
  const half1 = value.substring(0, value.length / 2);
  const half2 = value.substring(value.length / 2);
  return [[...half1], [...half2]];
};

const doThing = async () => {
  const lr = CreateLineReader("./input.txt");
  let sum = 0;

  for await (const line of lr) {
    const [first, second] = splitString(line.toString());
    let howMany = 0;
    let which = [];
    first.forEach((item) => {
      const isMatch = second.some((i) => i === item);
      if (isMatch && !howMany) {
        sum += getPriority(item);
        howMany++;
        which.push(item);
      }
    });
  }
  console.log(sum);
};

doThing();
