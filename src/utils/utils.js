let checkedCells = [];
const binarySearch = function ({ arr, x, start = 0, end }) {
  // Base Condition
  if (start > end) return false;

  // Find the middle index
  let mid = Math.floor((start + end) / 2);

  // Compare mid with given key x
  if ((arr[mid] ^ x) == 0) return true;

  // If element at mid is greater than x,
  // search in the left half of mid
  if (arr[mid] > x) return binarySearch({ arr, x, start, end: mid - 1 });
  // If element at mid is smaller than x,
  // search in the right half of mid
  else return binarySearch({ arr, x, start: mid + 1, end });
};

export const binaryInsert = (cells, cell) => {
  // add cell by keeping sort order
  let start = 0;
  let end = cells.length - 1;
  // handle boundary cases
  if (end < 0) return [cell];
  if (cell < cells[start]) return [cell, ...cells];
  if (cell > cells[end]) return [...cells, cell];
  // if not boundary case....
  while (start <= end) {
    const mid = Math.floor((end + start) / 2);
    // search in right or left half of mid respectively
    if (cells[mid] < cell) start = mid + 1;
    else end = mid - 1;
  }
  // Insert cell
  cells.splice(end + 1, 0, cell);
  return cells;
};

const canResurrectCell = ({ liveCells, ...args }) => {
  const neighbours = getNeighbours({ ...args });
  let liveNeighbors = 0;
  for (let n = 0; n < neighbours.length; n++) {
    const neighbourIsLive = binarySearch({
      arr: liveCells,
      x: neighbours[n],
      end: liveCells.length - 1
    });
    if (neighbourIsLive) {
      liveNeighbors++;
    }
    if (liveNeighbors > 3) break;
  }
  if (liveNeighbors === 3) return true;
  return false;
};

const getNeighbours = ({ cell, cellSize, width, height }) => {
  const cellsPerRow = ~~(width / cellSize);
  const edges = cellIsOnEdge({ index: cell, width, height, cellSize });
  /* order of neigbbours - clockwise
        0: north
        1: north east
        2: east
        3: southeast
        4: south
        5: south west
        6: west
        7: northwest
    */
  let neighbours = [
    cell - cellsPerRow,
    cell - cellsPerRow + 1,
    cell + 1,
    cell + cellsPerRow + 1,
    cell + cellsPerRow,
    cell + cellsPerRow - 1,
    cell - 1,
    cell - cellsPerRow - 1
  ];

  // to wrap cells around edges
  if (edges) {
    const cellsPerColumn = ~~(height / cellSize);
    const totalElements = cellsPerRow * cellsPerColumn;
    edges.forEach((edge) => {
      if (edge === "left") {
        neighbours[5] = neighbours[5] + cellsPerRow;
        neighbours[6] = neighbours[6] + cellsPerRow;
        neighbours[7] = neighbours[7] + cellsPerRow;
      }
      if (edge === "top") {
        neighbours[0] = neighbours[0] + totalElements;
        neighbours[1] = neighbours[1] + totalElements;
        neighbours[7] = neighbours[7] + totalElements;
      }
      if (edge === "right") {
        neighbours[1] = neighbours[1] - cellsPerRow;
        neighbours[2] = neighbours[2] - cellsPerRow;
        neighbours[3] = neighbours[3] - cellsPerRow;
      }
      if (edge === "bottom") {
        neighbours[3] = neighbours[3] - totalElements;
        neighbours[4] = neighbours[4] - totalElements;
        neighbours[5] = neighbours[5] - totalElements;
      }
    });
  }

  return neighbours;
};

const processCell = ({ newLiveCells, ...args }) => {
  const { oldCells } = args;
  const neighbours = getNeighbours({ ...args });
  let liveNeighbors = 0;
  let updatedLiveCells = newLiveCells;
  for (const neighbour of neighbours) {
    const neighbourIsLive = binarySearch({
      arr: oldCells,
      x: neighbour,
      end: oldCells.length - 1
    });
    if (neighbourIsLive) {
      liveNeighbors++;
    } else {
      // check if dead neighbor has already been tested
      const alreadyChecked = binarySearch({
        arr: checkedCells,
        x: neighbour,
        end: checkedCells.length - 1
      });
      if (!alreadyChecked) {
        // check if dead neighbor can be resurrected and update list if so
        const isResurrectable = canResurrectCell({
          ...args,
          cell: neighbour,
          liveCells: oldCells
        });
        if (isResurrectable) {
          updatedLiveCells = binaryInsert(updatedLiveCells, neighbour);
        }
        checkedCells = binaryInsert(checkedCells, neighbour);
      }
    }
  }
  // condition for keeping cell alive
  if (liveNeighbors === 3 || liveNeighbors === 2) {
    updatedLiveCells = binaryInsert(updatedLiveCells, args.cell);
  }
  return updatedLiveCells;
};

export const getLiveCells = (args) => {
  const { oldCells } = args;
  let newLiveCells = [];
  // reset already checked cells list
  checkedCells = [];
  for (const oldCell of oldCells) {
    newLiveCells = processCell({
      cell: oldCell,
      newLiveCells,
      ...args
    });
  }
  return newLiveCells;
};

export const getPattern = ({ patternName, cellSize, width, height }) => {
  const middleX = Math.floor(width / 2);
  const middleY = Math.floor(height / 2);
  const cellsPerRow = width / cellSize;
  const centerIndex = getIndexFromCoordinates({
    x: middleX,
    y: middleY,
    width,
    cellSize
  });
  let cells = [];
  if (patternName === "random") {
    let index = 0;
    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        if (Math.random() < 0.5) {
          cells.push(index);
        }
        index++;
      }
    }
  }
  if (patternName === "blinker") {
    cells = [centerIndex, centerIndex - 1, centerIndex + 1];
  }
  if (patternName === "glider") {
    cells = [
      centerIndex,
      centerIndex - 1,
      centerIndex + 1,
      centerIndex + 1 - cellsPerRow,
      centerIndex - 2 * cellsPerRow
    ];
  }
  if (patternName === "toad") {
    cells = [
      centerIndex,
      centerIndex - 1,
      centerIndex + 1,
      centerIndex - cellsPerRow,
      centerIndex - cellsPerRow + 1,
      centerIndex - cellsPerRow + 2
    ];
  }
  if (patternName === "beacon") {
    cells = [
      centerIndex,
      centerIndex - 1,
      centerIndex - 1 - cellsPerRow,
      centerIndex - cellsPerRow,
      centerIndex + cellsPerRow + 1,
      centerIndex + cellsPerRow + 2,
      centerIndex + 1 + 2 * cellsPerRow,
      centerIndex + 2 + 2 * cellsPerRow
    ];
  }
  if (patternName === "pulsar") {
    const top = centerIndex - cellsPerRow * 3;
    const bottom = centerIndex + cellsPerRow * 3;
    cells = [
      top,
      top - 1,
      top + 1,
      top + cellsPerRow,
      bottom,
      bottom - 1,
      bottom + 1,
      bottom - cellsPerRow
    ];
  }
  if (patternName === "pentaDecathlon") {
    const top = centerIndex - cellsPerRow * 2;
    const bottom = centerIndex + cellsPerRow * 3;
    cells = [
      top,
      top - 1,
      top + 1,
      top - cellsPerRow,
      bottom,
      bottom - 1,
      bottom + 1,
      bottom + cellsPerRow
    ];
  }
  if (patternName === "spaceShip") {
    cells = [
      centerIndex,
      centerIndex + 1,
      centerIndex + 2,
      centerIndex + 3,
      centerIndex + 4 - cellsPerRow,
      centerIndex - cellsPerRow,
      centerIndex - 2 * cellsPerRow,
      centerIndex - 3 * cellsPerRow + 1,
      centerIndex + 4 - 3 * cellsPerRow
    ];
  }
  cells.sort((a, b) => a - b);
  return { cells };
};

export const getIndexFromCoordinates = ({ x, y, width, cellSize }) => {
  const cellsPerRow = width / cellSize;
  const xPos = Math.floor(x / cellSize);
  const yPos = Math.floor(y / cellSize);
  const index = xPos + yPos * cellsPerRow;
  return index;
};

export const getCoordinatesFromIndex = ({ index, width, cellSize }) => {
  const cellsPerRow = width / cellSize;
  const row = Math.floor(index / cellsPerRow);
  const column = index % cellsPerRow;
  const x = column * cellSize;
  const y = row * cellSize;
  return [x, y];
};

const cellIsOnEdge = ({ index, width, height, cellSize }) => {
  const cellsPerRow = width / cellSize;
  const cellsPerColumn = height / cellSize;
  const row = Math.floor(index / cellsPerRow);
  const column = index % cellsPerRow;
  let edges = [];
  if (row === 0) {
    edges = [...edges, "top"];
  }

  if (row === cellsPerColumn - 1) {
    edges = [...edges, "bottom"];
  }

  if (column === 0) {
    edges = [...edges, "left"];
  }

  if (column === cellsPerRow - 1) {
    edges = [...edges, "right"];
  }
  return Boolean(edges.length) && edges;
};

export const buildInformation = ({ ...state }) => {
  const { cells, generationsPerSecond, canvasWidth, canvasHeight, cellSize } = state;
  const totalElements = (canvasWidth / cellSize) * (canvasHeight / cellSize);
  return [
    { title: "Total Cells", value: totalElements },
    { title: "Live Cells", value: cells.length },
    { title: "Dead Cells", value: totalElements - cells.length },
    { title: "Generations / second (actual)", value: generationsPerSecond.toFixed(2) }
  ];
};
