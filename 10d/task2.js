const { CreateLineReader } = require("../_util/LineReader");

let cc = 0;
let x = 1;

const drawing = [];

// 0-39
const drawCC = () => {
  const screenpos = cc % 40;
  if (x <= screenpos + 1) {
    if (x >= screenpos - 1) {
      drawing.push("#");
      return;
    }
  }
  drawing.push(".");
};

const parseAddx = (number) => {
  incCC();
  incCC();
  x += number;
};

const incCC = () => {
  drawCC();
  cc++;
};

const printDrawing = () => {
  const ds = drawing.join("");
  let pos = 0;

  while (pos <= ds.length - 39) {
    const endpos = pos + 39;
    console.log(ds.substring(pos, endpos));
    pos += 40;
  }
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [key, n] = line.split(" ");
    if (key === "noop") {
      incCC();
    } else {
      const number = parseInt(n);
      parseAddx(number);
    }
  }

  printDrawing();
};

doStuff();
