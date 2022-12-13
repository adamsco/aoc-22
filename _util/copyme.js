const { CreateLineReader } = require("../_util/LineReader");

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
  }
};

doStuff();
