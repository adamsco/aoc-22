const { CreateLineReader } = require("../_util/LineReader");

const pairs = [];

const isTest = false;
const realInput = "./input.txt";
const testInput = "./input2.txt";
const input = isTest ? testInput : realInput;

const calcValue = 4000000;

const difference = function (a, b) {
  return Math.abs(a - b);
};

const sensorsRanges = [];
const getManhattanDistance = (pos1, pos2) => {
  const xDist = difference(pos1.x, pos2.x);
  const yDist = difference(pos1.y, pos2.y);

  return xDist + yDist;
};

const comboCalc = ({ sensor, beacon }) => {
  console.log("sensorbe", { sensor, beacon });
  const mhDist = getManhattanDistance(sensor, beacon);

  sensorsRanges.push({ pos: { x: sensor.x, y: sensor.y }, range: mhDist });
};

const getTuningFrequency = (pos) => {
  return pos.x * calcValue + pos.y;
};

const getSpotDiff = (pos) => {
  let margin = -1;

  sensorsRanges.forEach((sr) => {
    const diff = sr.range - getManhattanDistance(pos, sr.pos);
    if (diff > margin) {
      margin = diff;
    }
  });
  return margin;
};

const findSpot = () => {
  for (let i = 0; i <= calcValue; i++) {
    if (i % 100 === 0) {
      console.log(i);
    }
    for (let j = 0; j <= calcValue; j++) {
      const pos = { x: j, y: i };

      const diff = getSpotDiff(pos);
      if (diff > 0) {
        j = Math.min(j + diff, calcValue);
      } else if (diff < 0) {
        const tf = getTuningFrequency(pos);

        console.log("______FOUND IT!!!", { pos, tf, diff });
        i = calcValue;

        return;
      }
    }
  }
};

const doStuff = async () => {
  const lr = CreateLineReader(input);

  for await (const line of lr) {
    const [sr, at, x1, y1, closest, bc, is, at2, x2, y2] = line.split(" ");
    const combo = {
      sensor: {
        x: parseInt(x1.substring(2, x1.length - 1)),
        y: parseInt(y1.substring(2, y1.length - 1)),
      },
      beacon: {
        x: parseInt(x2.substring(2, x2.length - 1)),
        y: parseInt(y2.substring(2, y2.length)),
      },
    };
    pairs.push(combo);
  }

  pairs.forEach((pair) => {
    comboCalc(pair);
  });
  findSpot();
};

doStuff();
