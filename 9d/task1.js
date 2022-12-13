const { CreateLineReader } = require("../_util/LineReader");

const startingPos = 25;

const visitedPositions = {
  [startingPos + "-" + startingPos]: 1,
};

const head = { x: startingPos, y: startingPos };
const prevHead = { x: startingPos, y: startingPos };

const lastTailIndex = 8;

const tails = Array.from({ length: lastTailIndex + 1 }, () => {
  return { x: startingPos, y: startingPos };
});
const prevTails = Array.from({ length: lastTailIndex + 1 }, () => {
  return { x: startingPos, y: startingPos };
});

const moveHeadOnce = (dir) => {
  switch (dir) {
    case "U":
      head.y += 1;
      break;
    case "D":
      head.y -= 1;
      break;
    case "L":
      head.x -= 1;
      break;
    case "R":
      head.x += 1;
      break;
    default:
      console.log(`Sorry, we are out of ${dir}.`);
  }

  if (head.x < 0 || head.y < 0) {
    console.log("warning 2 small", head);
  }
};

const isOff = (tail, follows) => {
  return Math.abs(follows.x - tail.x) > 1 || Math.abs(follows.y - tail.y) > 1;
};

const moveLinear = (tail, follows) => {
  const xScore = Math.abs(follows.x - tail.x);
  const yScore = Math.abs(follows.y - tail.y);

  // account for prev!!
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
  } else {
    // complicated..
    console.log("this happens..", { xScore, yScore });
  }
};

const recordPosition = () => {
  const tail = tails[lastTailIndex];
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
  getScore(tail, follows);
  if (isOff(tail, follows)) {
    moveLinear(tail, follows);
  }
};

const moveAllTails = () => {
  tails.forEach((tail, i) => {
    if (i === 0) {
      moveTailMaybe(tail, head, i);
    } else {
      moveTailMaybe(tail, tails[i - 1], i);
    }
  });
};

const updatePrevHead = () => {
  prevHead.x = head.x;
  prevHead.y = head.y;
};

const move = (dir, steps) => {
  let movedSteps = 0;
  while (true) {
    moveHeadOnce(dir);
    moveAllTails();
    updatePrevHead();

    recordPosition();

    movedSteps++;
    if (movedSteps >= steps) {
      break;
    }
  }
};

const doStuff = async () => {
  const lr = CreateLineReader("./input2.txt");

  for await (const line of lr) {
    const [dir, steps] = line.split(" ");

    move(dir, parseInt(steps));
  }
  const visitedNames = Object.keys(visitedPositions);
  const amountVisited = visitedNames.length;
  console.log("complete", { visitedNames, amountVisited });
};

doStuff();

// I messed up this one and didnt copy it before I altered, so this doesnt solve 1 anymore (or 2)
