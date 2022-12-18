const { CreateLineReader } = require("../_util/LineReader");

const isTesting = false;
const input = isTesting ? "./input2.txt" : "./input.txt";

let startingPoint = undefined;

const rooms = [];
// Valve DF has flow rate=0; tunnels lead to valves BO, HK
const parse = async () => {
  const lr = CreateLineReader(input);
  for await (const line of lr) {
    let pre,
      valves = undefined;
    if (line.search("valves") > 0) {
      [pre, valves] = line.split("valves ");
    } else {
      // ...singular, damn it
      [pre, valves] = line.split("valve ");
    }
    const [v, valveName, has, flow, rate] = pre.split(" ");
    startingPoint = startingPoint ?? valveName;
    const flowRate = rate.substring(5, rate.length - 1);
    const connectedValves = valves?.split(", ");

    const room = {
      name: valveName,
      flowRate: parseInt(flowRate),
      connectedTo: connectedValves,
    };
    // console.log("room", room);
    rooms.push(room);
  }
};

let bestFlow = 0;
let bestPath = undefined;
let bestPath2 = undefined;
let bestPath3 = undefined;

let completedPaths = 0;

const MAX_ROOM_VISITS = 100;

const getValueDownPath = ({ path, visited }) => {
  return 1;
  const room = rooms.find((r) => r.name === path);
  const potentialConnects = [...room.connectedTo].filter(
    (r) => !visited.some((v) => v === r)
  );

  const potentialValues = potentialConnects.map((pc) =>
    getValueDownPath({ path: pc, visited: [...visited, path] })
  );
  const maxValue =
    potentialValues.length > 0 ? Math.max(...potentialValues) : 0;

  return room.flowRate + maxValue;
};

const flowMap = {};
const scoreMap = {};
let maxFlowMinute = 0;
const flowToString = (hp, ep, minutes, totalFlow, currentFlow) => {
  if (currentFlow === maxFlowMinute) {
    return `maxedatm${minutes}`;
  }
  return `h${hp}e${ep}m${minutes}t${totalFlow}`;
};
const scoreToString = (hp, ep, minutes, totalFlow, currentFlow) => {
  if (currentFlow === maxFlowMinute) {
    return `maxedatm${minutes}`;
  }
  return `h${hp}e${ep}m${minutes}t${currentFlow}`;
};

const checkValue = ({ hp, ep, minutes, totalFlow, currentFlow }) => {
  if (minutes <= 5) {
    return true;
  }
  return true;
  // const currentFlowScore = totalFlow + currentFlow * (26 - minutes);
  const scoreKey = scoreToString(hp, ep, minutes, totalFlow, currentFlow);
  const flowKey = flowToString(hp, ep, minutes, totalFlow, currentFlow);
  const flowVal = flowMap[flowKey] ?? 0;
  const scoreVal = scoreMap[scoreKey] ?? 0;
  if (flowVal > currentFlow && scoreVal > totalFlow) {
    // console.log("false");
    return false;
  }
  if (flowVal < currentFlow) {
    flowMap[flowKey] = currentFlow;
  }
  if (scoreVal < totalFlow) {
    scoreMap[scoreKey] = totalFlow;
  }
  return true;
};

const roomsWithGoodValves = [];
const checkIfAllAreOpen = (openedValves) => {
  const allAreOpen = roomsWithGoodValves.every((r) =>
    openedValves.some((ov) => ov === r)
  );
  return allAreOpen;
};

let earliestMax = 30;

const goatflows = {};

const checkFlow = (flow, minute) => {
  if (minute < 5) {
    return true;
  }
  const key = (minute += "");
  const bestFlow = goatflows[key] ?? 0;
  const treshhold = bestFlow * 0.75;
  if (flow < treshhold) {
    return false;
  }
  if (flow > bestFlow) {
    goatflows[key] = flow;
  }
  return true;
};

const doAction = ({
  position,
  elephantPosition,
  minute,
  openedValves,
  currentFlowRate,
  totalFlowRate,
  prevRoom,
  elephantPrevRoom,
  visitedRooms,
  elephantVisitedRooms,
}) => {
  if (!checkFlow(currentFlowRate, minute)) {
    return;
  }
  // console.log("m", minute);
  const newTotalFlow = totalFlowRate + currentFlowRate;
  const newMinute = minute + 1;

  if (minute >= 25) {
    // time to end
    completedPaths++;
    if (completedPaths % 100000 === 0) {
      console.log("completed 100 000 paths");
      completedPaths = 0;
    }
    // console.log("completedPath", bestFlow);
    // end

    if (newTotalFlow > bestFlow) {
      console.log("completedPath", bestFlow, completedPaths);

      bestFlow = newTotalFlow;
      bestPath = openedValves;
      bestPath2 = visitedRooms;
      bestPath3 = elephantVisitedRooms;
    }
    return;
  }
  // time to rest
  if (checkIfAllAreOpen(openedValves)) {
    // console.log("allOpen");

    if (earliestMax > minute) {
      earliestMax = minute;
    }
    const isOk = checkValue({
      hp: position,
      ep: elephantPosition,
      minutes: minute,
      totalFlow: newTotalFlow,
      currentFlow: currentFlowRate,
    });
    if (isOk) {
      // console.log("test1", openedValves);
      doAction({
        position,
        elephantPosition,
        minute: newMinute,
        openedValves,
        currentFlowRate,
        totalFlowRate: newTotalFlow,
        prevRoom: undefined,
        elephantPrevRoom: undefined,
        visitedRooms,
        elephantVisitedRooms,
      });
    }
    // console.log("q0");

    return;
  }
  if (minute > earliestMax + 1) {
    // console.log("q1");
    return;
  }

  const humanRoom = rooms.find((r) => r.name === position);
  const elephantRoom = rooms.find((r) => r.name === elephantPosition);

  let humanPaths = [];
  let elephantTravelPaths = [];
  let remainingValves = roomsWithGoodValves.filter(
    (r) => !openedValves.some((ov) => ov === r)
  );
  // lets try
  // need to find combos for elefant + person
  if (!openedValves.some((v) => v === position)) {
    if (humanRoom.flowRate > 0) {
      humanPaths.push({
        position,
        minute: newMinute,
        openedValves: [...openedValves, position],
        flowDiff: humanRoom.flowRate,
        prevRoom: undefined,
        visitedRooms: [...visitedRooms, position],
        totalFlowRate: newTotalFlow,
      });
      // remainingValves = remainingValves.filter((rv) => rv !== position);
    }
  }

  // for human

  const reasonableHumanNextRooms = remainingValves.map(
    (rv) => nextStepMap[position + rv] ?? rv
  );
  const reasonableElephantNextRooms = remainingValves.map(
    (rv) => nextStepMap[elephantPosition + rv] ?? rv
  );

  humanRoom.connectedTo.forEach((newRoom) => {
    if (reasonableHumanNextRooms.some((r) => r === newRoom)) {
      // const timesVisited = visitedRooms.filter((r) => r === newRoom).length;

      // const valueOnPath = getValueDownPath({
      //   path: newRoom,
      //   visited: prevRoom ? [...openedValves, prevRoom] : [...openedValves],
      // });

      humanPaths.push({
        position: newRoom,
        minute: newMinute,
        openedValves: [...openedValves],
        flowDiff: 0,
        prevRoom: position,
        visitedRooms: [...visitedRooms, newRoom],
        totalFlowRate: newTotalFlow,
      });
    }
  });
  elephantRoom.connectedTo.forEach((newRoom) => {
    const shouldVisit = reasonableElephantNextRooms.some((r) => r === newRoom);

    if (shouldVisit) {
      elephantTravelPaths.push({
        elephantPosition: newRoom,
        elephantPrevRoom: elephantPosition,
        elephantVisitedRooms: [...elephantVisitedRooms, newRoom],
        // visitedRooms: [...visitedRooms, position]
      });
    }
  });
  // console.log("paths", {
  //   humanPaths: humanPaths.length,
  //   epat: elephantTravelPaths.length,
  // });
  let increment = 0;
  const isFirstRound = minute === 0;
  humanPaths = humanPaths.filter((p) => p.position !== prevRoom);
  elephantTravelPaths = elephantTravelPaths.filter(
    (p) => p.elephantPosition !== elephantPrevRoom
  );

  // console.log("reason", {
  //   reasonableElephantNextRooms,
  //   availableElephantNextRooms: elephantRoom.connectedTo,
  //   reasonableHumanNextRooms,
  //   availableHumanNextRooms: humanRoom.connectedTo,
  //   actualHp: humanPaths.map((hp) => hp.position),
  //   actualEp: elephantTravelPaths.map((hp) => hp.elephantPosition),
  //   remainingValves,
  //   position,
  //   prevRoom,
  //   elephantPosition,
  //   elephantPrevRoom,
  //   roomsWithGoodValves,
  //   openedValves,
  // });
  humanPaths.forEach((humanPath) => {
    if (isFirstRound) {
      console.log("startPath", increment);
    }

    if (
      elephantRoom.flowRate > 0 &&
      !humanPath.openedValves.some((v) => v === elephantPosition)
    ) {
      if (isFirstRound) {
        increment++;
      }
      // elephant can open where they are

      doAction({
        ...humanPath,
        openedValves: [...humanPath.openedValves, elephantPosition],
        elephantPosition: elephantPosition,
        elephantPrevRoom: undefined,
        elephantVisitedRooms: [...elephantVisitedRooms, elephantPosition],
        currentFlowRate:
          currentFlowRate + humanPath.flowDiff + elephantRoom.flowRate,
      });
      if (isFirstRound) {
        console.log("increment", increment);
      }
    }
    elephantTravelPaths.forEach((elephantPath) => {
      increment++;

      doAction({
        ...humanPath,
        ...elephantPath,
        openedValves: [...humanPath.openedValves],
        currentFlowRate: currentFlowRate + humanPath.flowDiff,
      });
      if (isFirstRound) {
        console.log("increment", increment);
      }
    });

    if (checkIfAllAreOpen(humanPath.openedValves)) {
      // just move human then..
      // console.log
      doAction({
        ...humanPath,
        elephantPosition,
        elephantPrevRoom,
        elephantVisitedRooms,
        openedValves: [...humanPath.openedValves],
        currentFlowRate: currentFlowRate + humanPath.flowDiff,
      });
    }
  });
};

const nextStepMap = {};

let shortestPath = [];
const findPath = (room, target, visited) => {
  if (shortestPath.length > 0 && visited.length > shortestPath) {
    return;
  }
  if (room.name === target) {
    if (shortestPath.length === 0 || shortestPath.length > visited.length) {
      shortestPath = [...visited];
    }
    return;
  }
  // console.log("params", { room, target, visited });

  const roomsToVisit = [...room.connectedTo].filter(
    (cr) => !visited.some((v) => v === cr)
  );
  roomsToVisit.forEach((nr) => {
    const nextRoom = rooms.find((n) => nr === n.name);
    findPath(nextRoom, target, [...visited, nextRoom.name]);
  });
};

const getNextStep = (room, target) => {
  shortestPath = [];
  findPath(room, target, [room.name]);
  // console.log("shortestPath", shortestPath);
  return shortestPath;
  // return next room in shortest path to room
};

const generateNextStepMap = () => {
  // getNextStep(
  //   rooms.find((r) => r.name === "AA"),
  //   "BB"
  // );
  rooms.forEach((r) => {
    roomsWithGoodValves.forEach((targetName) => {
      const sp = getNextStep(r, targetName);
      if (!r.connectedTo.some((ct) => ct === sp[1])) {
        console.log("fail", { path: sp, start: r.name, targetName });
      } else {
        nextStepMap[r.name + targetName] = sp[1];
      }
    });
  });
};

const doStuff = async () => {
  await parse();

  const goodRooms = rooms.filter((r) => r.flowRate > 0).map((r) => r.name);
  roomsWithGoodValves.push(...goodRooms);
  goodRooms.forEach((r) => {
    maxFlowMinute += r.flowRate;
  });
  let totval = 0;
  rooms.filter((r) => r.flowRate > 0).forEach((r) => (totval += r.flowRate));
  // console.log("totval", totval);
  generateNextStepMap();
  console.log(nextStepMap);
  console.log("TEST CCHH", nextStepMap["CCHH"]);
  // return;
  doAction({
    position: "AA",
    elephantPosition: "AA",
    minute: 0,
    openedValves: [],
    currentFlowRate: 0,
    totalFlowRate: 0,
    prevRoom: undefined,
    elephantPrevRoom: undefined,
    visitedRooms: [],
    elephantVisitedRooms: [],
  });
  console.log("DONE bestflow, bestPath", {
    bestFlow,
    bestPath,
    bestPath2,
    bestPath3,
    earliestMax,
    totval,
  });
  //.. just trial and error?
  if (isTesting && bestFlow !== 1707) {
    console.log("TEST FAILED");
  }
};
// 2230 -> 2 low, my solution is both overoptimized whilst so slow this might just be finished by dec 25th

doStuff();

// this was a shameful attempt
