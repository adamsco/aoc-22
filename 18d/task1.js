const { CreateLineReader } = require("../_util/LineReader");

const rawCubes = [];
const parse = async () => {
  const lr = CreateLineReader("./input.txt");
  for await (const line of lr) {
    const [x, y, z] = line.split(",").map((l) => parseInt(l));
    rawCubes.push({ x, y, z });
  }
};

const checkSurfaceVsList = (cube, list) => {
  const dict = ["x", "y", "z"];
  let openSurfaces = 6;

  for (let dir = 0; dir < 3; dir++) {
    for (let offset = -1; offset <= 1; offset += 2) {
      const ltr = dict[dir];
      const pos = { ...cube, [ltr]: cube[ltr] + offset };
      if (
        list.some((c2) => c2.x === pos.x && c2.y === pos.y && c2.z === pos.z)
      ) {
        openSurfaces--;
      }
    }
  }
  return openSurfaces;
};

const doStuff = async () => {
  await parse();
  let sum = 0;

  rawCubes.forEach((cube) => {
    sum += checkSurfaceVsList(cube, rawCubes);
  });
  console.log("sum", sum);
};

doStuff();
