const { CreateLineReader } = require("../_util/LineReader");

const startingPos = 25;

const visitedPositions = {
  [startingPos + "-" + startingPos]: 1,
};

const lastTailIndex = 9;

const tails = Array.from({ length: lastTailIndex + 1 }, () => {
  return { x: startingPos, y: startingPos };
});

const moveHeadOnce = (dir) => {
  tails[0];
  switch (dir) {
    case "U":
      tails[0].y += 1;
      break;
    case "D":
      tails[0].y -= 1;
      break;
    case "L":
      tails[0].x -= 1;
      break;
    case "R":
      tails[0].x += 1;
      break;
    default:
      console.log(`Sorry, we are out of ${dir}.`);
  }

  if (tails[0].x < 0 || tails[0].y < 0) {
    console.log("warning 2 small", tails[0]);
  }
};

const isOff = (tail, follows) => {
  return Math.abs(follows.x - tail.x) > 1 || Math.abs(follows.y - tail.y) > 1;
};

const moveTail = (tail, follows) => {
  const xScore = Math.abs(follows.x - tail.x);
  const yScore = Math.abs(follows.y - tail.y);
  const tot = xScore + yScore;

  if (tot > 2) {
    if (follows.x > tail.x) {
      tail.x++;
    } else {
      tail.x--;
    }
    if (follows.y > tail.y) {
      tail.y++;
    } else {
      tail.y--;
    }
    return;
  }
  if (xScore > yScore) {
    if (follows.x > tail.x) {
      tail.x++;
    } else {
      tail.x--;
    }
  } else if (yScore > xScore) {
    if (follows.y > tail.y) {
      tail.y++;
    } else {
      tail.y--;
    }
  }
};

const recordPosition = () => {
  const tail = tails[tails.length - 1];
  visitedPositions[tail.x + "-" + tail.y] = 1;
};

const getScore = (tail, follows) => {
  const xScore = Math.abs(follows.x - tail.x);
  const yScore = Math.abs(follows.y - tail.y);
  const tot = xScore;
  if (tot > 2) {
    console.log("high score!!", { tot, xScore, yScore });
  }
  return { xScore, yScore };
};
const moveTailMaybe = (tail, follows, tailIndex) => {
  if (isOff(tail, follows)) {
    moveTail(tail, follows);
  }
};

const moveAllTails = () => {
  tails.forEach((tail, i) => {
    if (i === 0) {
      // moveTailMaybe(tail, head, i); its head
    } else {
      moveTailMaybe(tail, tails[i - 1], i);
    }
  });
};

const move = (dir, steps) => {
  let movedSteps = 0;
  while (true) {
    moveHeadOnce(dir);
    moveAllTails();

    recordPosition();

    movedSteps++;
    if (movedSteps >= steps) {
      break;
    }
  }
};

const doStuff = async () => {
  const lr = CreateLineReader("./input.txt");

  for await (const line of lr) {
    const [dir, steps] = line.split(" ");
    console.log("processing ", { dir, steps: parseInt(steps) });
    move(dir, parseInt(steps));
  }
  const visitedNames = Object.keys(visitedPositions);
  const amountVisited = visitedNames.length;
  console.log("complete", { visitedNames, amountVisited, tails });
};

doStuff();

// 2496 2 high
// solve for sample...
// I never read the rules
