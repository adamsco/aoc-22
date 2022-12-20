const { CreateLineReader } = require("../_util/LineReader");

const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
  }
};

const doStuff = async () => {
  await parse();
};

doStuff();
