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

let ongoing = 0;

const doAction = (
  position,
  minute,
  openedValves,
  currentFlowRate,
  totalFlowRate,
  prevRoom,
  visitedRooms
) => {
  const newTotalFlow = totalFlowRate + currentFlowRate;

  if (minute >= 29) {
    // end
    if (newTotalFlow > bestFlow) {
      bestFlow = newTotalFlow;
      bestPath = openedValves;
      bestPath2 = visitedRooms;
    }
    ongoing--;
    return;
  }
  const room = rooms.find((r) => r.name === position);
  if (!room) {
    console.log("fatal error", position);
  }
  const newMinute = minute + 1;
  // lets try
  if (!openedValves.some((v) => v === position)) {
    if (room.flowRate > 0) {
      ongoing++;
      doAction(
        position,
        newMinute,
        [...openedValves, position],
        currentFlowRate + room.flowRate,
        newTotalFlow,
        undefined,
        [...visitedRooms, position]
      );
    }
  }
  room.connectedTo.forEach((newRoom) => {
    if (newRoom !== prevRoom) {
      doAction(
        newRoom,
        newMinute,
        [...openedValves],
        currentFlowRate,
        newTotalFlow,
        position,
        [...visitedRooms, newRoom]
      );
    }
    ongoing++;
  });
};

const doStuff = async () => {
  await parse();
  doAction("AA", 0, [], 0, 0, undefined, []);
  console.log("DONE bestflow, bestPath", { bestFlow, bestPath, bestPath2 });
  //.. just trial and error?
  if (isTesting && bestFlow !== 1651) {
    console.log("TEST FAILED");
  }
};
// 1917 -> 2 high
// starting point was AA, not first... 1720

doStuff();

// good morning
