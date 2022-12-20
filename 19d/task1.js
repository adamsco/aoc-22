const { CreateLineReader } = require("../_util/LineReader");

const TIME_LIMIT = 24;
const bluePrints = [];

const parseOreToBlueprint = (rawOre, bluePrint) => {
  const [empty, type, robot, costs, amount1, ore1, and, amount2, ore2] =
    rawOre.split(" ");
  const allCosts = [];
  if (amount2 == null) {
    allCosts.push({
      type: ore1.substring(0, ore1.length - 1),
      amount: parseInt(amount1),
    });
  } else {
    allCosts.push({
      type: ore1,
      amount: parseInt(amount1),
    });
    allCosts.push({
      type: ore2.substring(0, ore2.length - 1),
      amount: parseInt(amount2),
    });
  }

  bluePrint[type] = allCosts;
};

const parse = async () => {
  // newOreState[whatToBuild + "Vel"] += 1;
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const oreData = line.split("Each");
    oreData.splice(0, 1);
    const bluePrint = {};
    oreData.forEach((rawOre) => parseOreToBlueprint(rawOre, bluePrint));
    bluePrints.push(bluePrint);
  }
};

const whatCanBeBuiltEventually = ({ oreState, bluePrint }) => {
  // filter if can ev build geo faster

  let possibilities = [];
  Object.entries(bluePrint).forEach((entry) => {
    const [key, costs] = entry;
    const cantDoIt = costs.some((c) => {
      return oreState[c.type + "Vel"] === 0;
    });
    if (!cantDoIt) {
      possibilities.push(key);
    }
  });

  const futurePossibilities = possibilities.map((p) => {
    let time = 0;
    bluePrint[p].forEach((c) => {
      const x = (c.amount - oreState[c.type]) / oreState[c.type + "Vel"];
      time = Math.max(Math.ceil(x), time);
    });

    return { type: p, time };
  });

  let all = [...futurePossibilities].reverse();
  const withGeo = all.find((v) => v.type === "geode");
  if (withGeo) {
    all = all.filter((v) => v.type === withGeo.type || v.time < withGeo.time);
  }
  return all;
};

let bestGeodeResult = 0;

let costMap = {};
const mapHighestCost = (bluePrint) => {
  Object.entries(bluePrint).forEach((entry) => {
    const [key, costs] = entry;
    let newCost = 0;

    Object.entries(bluePrint).forEach((entry2) => {
      const [key2, costs2] = entry2;
      costs2.forEach((c) => {
        if (c.type === key) {
          newCost = c.amount;
        }
      });

      if (key !== key2) {
        costMap[key] = Math.max(costMap[key] ?? 0, newCost);
      }
    });
  });
};

const getHighestCostforType = (type) => {
  if (type === "geode") {
    return 99;
  }
  return costMap[type];
};

let geodeCount = 0;
const hasPotential = (oreState, curIndex) => {
  let potentialGeodes = oreState.geode;
  let vel = oreState.geodeVel;
  for (let i = curIndex; i <= TIME_LIMIT; i++) {
    potentialGeodes += vel;
    vel++;
  }
  return potentialGeodes > geodeCount;
};

let iteration = 0;
// bruteforce this shiet
const iterateOreState = ({ oreState, bluePrint, i: curIndex, whatToBuild }) => {
  if (!hasPotential(oreState, curIndex)) {
    return;
  }

  const maxCost = getHighestCostforType(whatToBuild);
  if (oreState[whatToBuild + "Vel"] >= maxCost) {
    return;
  }

  if (curIndex > TIME_LIMIT) {
    return;
  }
  iteration++;

  let newOreState = { ...oreState };

  // build
  const costs = bluePrint[whatToBuild];
  costs.forEach((c) => {
    newOreState[c.type] = newOreState[c.type] - c.amount;
    if (newOreState[c.type] < 0) {
      console.log("FAIL");
      return;
    }
  });
  newOreState.ore += newOreState.oreVel;
  newOreState.clay += newOreState.clayVel;
  newOreState.obsidian += newOreState.obsidianVel;
  newOreState.geode += newOreState.geodeVel;

  // new robot is ready

  if (curIndex === TIME_LIMIT) {
    if (newOreState.geode > bestGeodeResult) {
      bestGeodeResult = newOreState.geode;
    }
    return;
  }
  newOreState[whatToBuild + "Vel"] += 1;

  const potentialNextSteps = whatCanBeBuiltEventually({
    oreState: newOreState,
    bluePrint,
  });

  const remainingTime = TIME_LIMIT - curIndex;

  if (!potentialNextSteps.some((v) => v.time < remainingTime)) {
    const eventualGeodes =
      newOreState.geode + newOreState.geodeVel * remainingTime;

    if (eventualGeodes > bestGeodeResult) {
      bestGeodeResult = eventualGeodes;
    }
    return;
  }
  potentialNextSteps.forEach((fp) => {
    if (
      curIndex > TIME_LIMIT - 4 &&
      (fp.type === "ore" || fp.type === "clay")
    ) {
      // just dont
    } else {
      const nextIndex = curIndex + fp.time + 1;

      if (nextIndex <= TIME_LIMIT) {
        const multiplier = Math.max(0, fp.time);
        const oreState2 = {
          ore: newOreState.ore + newOreState.oreVel * multiplier,
          oreVel: newOreState.oreVel,
          clay: newOreState.clay + newOreState.clayVel * multiplier,
          clayVel: newOreState.clayVel,
          obsidian: newOreState.obsidian + newOreState.obsidianVel * multiplier,
          obsidianVel: newOreState.obsidianVel,
          geode: newOreState.geode + newOreState.geodeVel * multiplier,
          geodeVel: newOreState.geodeVel,
        };

        iterateOreState({
          oreState: oreState2,
          bluePrint,
          i: nextIndex,
          whatToBuild: fp.type,
        });
      }
    }
  });
};

const calculateBlueprint = (bluePrint) => {
  valueMap = {};
  mapHighestCost(bluePrint);
  const oreState = {
    ore: 0,
    oreVel: 1,
    clay: 0,
    clayVel: 0,
    obsidian: 0,
    obsidianVel: 0,
    geode: 0,
    geodeVel: 0,
  };

  const futPos = whatCanBeBuiltEventually({ oreState, bluePrint });

  futPos.forEach((fp) => {
    const oreState2 = {
      ...oreState,
      ore: oreState.ore + oreState.oreVel * fp.time,
      clay: oreState.clay + oreState.clayVel * fp.time,
      obsidian: oreState.obsidian + oreState.obsidianVel * fp.time,
      geode: oreState.geode + oreState.geodeVel * fp.time,
    };
    iterateOreState({
      oreState: oreState2,
      bluePrint,
      i: 1 + fp.time,
      whatToBuild: fp.type,
    });
  });

  return bestGeodeResult;
};

const doStuff = async () => {
  await parse();
  const res = [];
  let realValue = 0;
  bluePrints.forEach((bp, i) => {
    const start = Date.now();
    calculateBlueprint(bp);
    const end = (Date.now() - start) / 1000;
    res.push(bestGeodeResult);
    realValue += bestGeodeResult * (i + 1);
    console.log("completed BP", {
      index: i + 1,
      res: bestGeodeResult,
      time: end,
    });
    bestGeodeResult = 0;
    visitedMap = {};
  });

  console.log("sum", { res, target: [9, 12], realValue, iteration });

  // dont forget to multiple qlevel
};

// 1343 - low
// 1344 - low & lazy
// 1365!!!
doStuff();

// 13980.. too high..
