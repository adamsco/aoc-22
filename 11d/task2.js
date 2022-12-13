const { CreateLineReader } = require("../_util/LineReader");

const monkeys = [];

const inspectionCount = [];

const lowestDenominator = BigInt(9699690); // product of all tests

const createMonkey = () => {
  monkeys.push({
    items: [],
    operation: (input) => input,
    test: () => false,
    passMap: {
      passed: 0,
      failed: 0,
    },
  });
  inspectionCount.push(BigInt(0));
};

const getLastMonkey = () => {
  return monkeys[monkeys.length - 1];
};

const addStartingItems = (inputArgs) => {
  const rawItems = inputArgs.slice(2);

  const items = rawItems.map((i) => BigInt(parseInt(i.replace("/,", "/"))));
  getLastMonkey().items = items;
};

const addOperation = (inputArgs) => {
  const rawOperator = inputArgs[4]; // + / *
  const raw2 = inputArgs[5]; // old or number

  const operation = (input) => {
    const secondValue = raw2 === "old" ? input : BigInt(parseInt(raw2));
    if (rawOperator === "+") {
      return input + secondValue;
    } else {
      return input * secondValue;
    }
  };
  getLastMonkey().operation = operation;
};

const translateBool = (bool) => (bool ? "passed" : "failed");

const addTest = (inputArgs) => {
  const divisableBy = BigInt(parseInt(inputArgs[3]));
  getLastMonkey().test = (input) => input % divisableBy === BigInt(0);
};

const addToPassMap = (inputArgs) => {
  const where = translateBool(inputArgs[1] === "true:");
  const target = parseInt(inputArgs[5]);

  getLastMonkey().passMap[where] = target;
};

/// end of parsing;

const doItemThing = (monkeyIndex, initialWorryLevel) => {
  inspectionCount[monkeyIndex]++;
  const monkey = monkeys[monkeyIndex];
  // start inspection
  let worry = monkey.operation(initialWorryLevel);
  // get bored
  // will now overflow..
  // console.log("oldWorry", worry);

  worry = worry % lowestDenominator;
  // console.log("newWorry", worry);

  // throw
  const test = translateBool(monkey.test(worry));
  const target = monkey.passMap[test];
  // if (target == 6) {
  //   console.log("passing to", {
  //     initialWorryLevel,
  //     worry,
  //     target,
  //     monkeyIndex,
  //   });
  // }
  monkeys[target].items.push(worry);
};

const startRound = () => {
  monkeys.forEach((monkey, monkeyIndex) => {
    const items = [...monkey.items]; // copy to avoid mutations
    // if (monkeyIndex === 6) {
    //   console.log("items,", items);
    // }
    items.forEach((item) => {
      doItemThing(monkeyIndex, item);
    });

    // all items are thrown;
    monkey.items = [];
  });
};

const getTwoHighest = (arr) => {
  return arr.reduce(
    (acc, rec) => {
      return rec > acc[1] ? [acc[1], rec] : rec > acc[0] ? [rec, acc[1]] : acc;
    },
    [0, 0]
  );
};
const printMonkeyBusinessLevel = () => {
  const topTwo = getTwoHighest(inspectionCount);
  const business = topTwo[0] * topTwo[1];

  console.log("RESULTS ARE IN", { topTwo, business });
};

const doRounds = (amount) => {
  for (let i = 0; i < amount; i++) {
    console.log("progress: ", i);
    startRound();
  }
  console.log("inspectionCount", inspectionCount);
  printMonkeyBusinessLevel();
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const inputArgs = line.split(" ").filter((v) => v);
    const first = inputArgs[0];

    if (first === "Monkey") {
      createMonkey();
    }
    if (first === "Starting") {
      addStartingItems(inputArgs);
    }
    if (first === "Operation:") {
      addOperation(inputArgs);
    }
    if (first === "Test:") {
      addTest(inputArgs);
    }
    if (first === "If") {
      addToPassMap(inputArgs);
    }
  }

  // now -> to monkeyBusiness

  // console.log("myMonkeys", monkeys);
  doRounds(10000);
};

doStuff();
// 2713310158 (sample)
// 14402520020 2 low
// 14401320024
// 15693274740
// 14400119970...
