const { CreateLineReader } = require("../_util/LineReader");

const pairs = [];

const isTest = false;
const realTarget = 2000000;
const testTarget = 10;
const realInput = "./input.txt";
const testInput = "./input2.txt";
const input = isTest ? testInput : realInput;
const target = isTest ? testTarget : realTarget;

let sum = 0;

const intervals = [];

const difference = function (a, b) {
  return Math.abs(a - b);
};
const sensorAndMh = (sensor, manhattanDistance, beacon) => {
  const yDiff = difference(sensor.y, target);

  const remainingMHD = manhattanDistance - yDiff;

  if (remainingMHD >= 0) {
    intervals.push({
      start: sensor.x - remainingMHD,
      end: sensor.x + remainingMHD,
    });
  }

  if (remainingMHD > 0) {
    sum += remainingMHD * 2;
  }
};

const toString = (number) => {
  const abs = Math.abs(number);
  return number < 0 ? "N" + abs : number + "";
};

const comboCalc = ({ sensor, beacon }) => {
  console.log("sensorbe", { sensor, beacon });
  const xDist = difference(sensor.x, beacon.x);
  const yDist = difference(sensor.y, beacon.y);

  const mhDist = xDist + yDist;

  sensorAndMh(sensor, mhDist, beacon);
};

const diffusePositions = [];
const other = {};
const workIntervals = () => {
  intervals.forEach((interval) => {
    let i = interval.start;
    while (true) {
      other[toString(i)] = 1;
      i++;
      if (i > interval.end) {
        break;
      }
    }
  });
  diffusePositions.forEach((pos) => {
    delete other[toString(pos)];
  });
  console.log("otherRes", Object.keys(other).length);
  console.log("potential", sum);
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
    if (combo.beacon.y === target) {
      diffusePositions.push(combo.beacon.x);
    }
    pairs.push(combo);
  }

  pairs.forEach((pair) => {
    comboCalc(pair);
  });

  workIntervals();
};

doStuff();
