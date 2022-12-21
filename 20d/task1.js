const { isObject } = require("util");
const { CreateLineReader } = require("../_util/LineReader");

const indicesToCheck = [1000, 2000, 3000];
const rawInput = [];
const formattedInput = [];

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  let id = 0;
  for await (const line of lr) {
    rawInput.push(parseInt(line));
    formattedInput.push({ v: parseInt(line), id });
    id++;
  }
};

const toString = (inp) => {
  let str = "";
  inp.forEach((i) => (str += i + ", "));
  return str.substring(0, str.length - 1);
};

const doStuff = async () => {
  await parse();

  const input = [...formattedInput];
  const length = input.length;

  // ... of course there are duplicates...Todo!

  formattedInput.forEach((refInput) => {
    if (refInput.v === 0) {
    } else {
      const index = input.findIndex((v) => v.id === refInput.id);

      const iObj = input.splice(index, 1)[0];
      let newIndex = index + iObj.v;
      if (newIndex === 0 || newIndex === index.length - 1) {
        input.push(iObj);
      } else {
        if (newIndex < 0) {
          const diff = length - 1 + newIndex;
          newIndex = diff % (length - 1);
        } else if (newIndex > length - 1) {
          newIndex = (newIndex - length + 1) % (length - 1);
        }
        input.splice(newIndex, 0, iObj);
      }
    }
  });

  // const start = input.findIndex((v) => v.v === 0) - 1;
  const start = input.findIndex((v) => v.v === 0);
  const res = [];
  let sum = 0;

  const max = Math.max(...indicesToCheck);

  // manual check, since I just cant.
  for (let i = start; i <= max + start; i++) {
    if (indicesToCheck.some((ix) => ix === i - start)) {
      sum += input[i % input.length].v;
    }
  }

  console.log("result", { sum, res, input });
};

doStuff();

// 8991 - high
// 5792 - low
8164;
