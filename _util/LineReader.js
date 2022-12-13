const fs = require("fs");
const readline = require("readline");

module.exports = {
  CreateLineReader: (input) => {
    const fileStream = fs.createReadStream(input);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    return rl;
  },
};
