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

// Custom modulo function to handle negative numbers
function mod(n, m) {
  return ((n % m) + m) % m;
}

// Helper function to get the neighbor indices of a cell
const getNeighbours = ({ cell, cellsPerRow, cellsPerColumn }) => {
  const neighbours = [
    cell - cellsPerRow, // North
    cell - cellsPerRow + 1, // North-East
    cell + 1, // East
    cell + cellsPerRow + 1, // South-East
    cell + cellsPerRow, // South
    cell + cellsPerRow - 1, // South-West
    cell - 1, // West
    cell - cellsPerRow - 1 // North-West
  ];

  return neighbours.map((neighbour) => {
    let nRow = mod(Math.floor(neighbour / cellsPerRow), cellsPerColumn);
    let nCol = mod(neighbour % cellsPerRow, cellsPerRow);

    return nCol + nRow * cellsPerRow;
  });
};

// Main function to compute the next generation of live cells
export const getLiveCells = ({ oldCells, cellSize, width, height }) => {
  const liveCells = new Set(oldCells);
  const neighborCounts = new Map();
  const cellsPerRow = Math.floor(width / cellSize);
  const cellsPerColumn = Math.floor(height / cellSize);
  const newLiveCells = new Set();

  for (const cell of liveCells) {
    const neighbours = getNeighbours({ cell, cellsPerRow, cellsPerColumn });

    for (const neighbor of neighbours) {
      // Increment neighbor count
      const count = neighborCounts.get(neighbor) || 0;
      neighborCounts.set(neighbor, count + 1);
    }
  }

  // Determine new live cells
  for (const [cell, count] of neighborCounts.entries()) {
    if (liveCells.has(cell)) {
      // Live cell survives if it has 2 or 3 live neighbors
      if (count === 2 || count === 3) {
        newLiveCells.add(cell);
      }
    } else {
      // Dead cell becomes alive if it has exactly 3 live neighbors
      if (count === 3) {
        newLiveCells.add(cell);
      }
    }
  }

  // Convert the Set back to a sorted array if needed
  const newLiveCellsArray = Array.from(newLiveCells);
  newLiveCellsArray.sort((a, b) => a - b);

  return newLiveCellsArray;
};

export const getPattern = ({ activePattern, cellSize, width, height }) => {
  const middleX = Math.floor(width / 2);
  const middleY = Math.floor(height / 2);
  const cellsPerRow = width / cellSize;
  const centerIndex = getIndexFromCoordinates({
    x: middleX,
    y: middleY,
    width,
    cellSize
  });
  let liveCells = [];
  if (activePattern === "random") {
    let index = 0;
    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        if (Math.random() < 0.5) {
          liveCells.push(index);
        }
        index++;
      }
    }
  }
  if (activePattern === "blinker") {
    liveCells = [centerIndex, centerIndex - 1, centerIndex + 1];
  }
  if (activePattern === "glider") {
    liveCells = [
      centerIndex,
      centerIndex - 1,
      centerIndex + 1,
      centerIndex + 1 - cellsPerRow,
      centerIndex - 2 * cellsPerRow
    ];
  }
  if (activePattern === "toad") {
    liveCells = [
      centerIndex,
      centerIndex - 1,
      centerIndex + 1,
      centerIndex - cellsPerRow,
      centerIndex - cellsPerRow + 1,
      centerIndex - cellsPerRow + 2
    ];
  }
  if (activePattern === "beacon") {
    liveCells = [
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
  if (activePattern === "pulsar") {
    const top = centerIndex - cellsPerRow * 3;
    const bottom = centerIndex + cellsPerRow * 3;
    liveCells = [
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
  if (activePattern === "pentaDecathlon") {
    const top = centerIndex - cellsPerRow * 2;
    const bottom = centerIndex + cellsPerRow * 3;
    liveCells = [
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
  if (activePattern === "spaceShip") {
    liveCells = [
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
  if (activePattern === "rPentomino") {
    liveCells = [
      centerIndex - 1,
      centerIndex,
      centerIndex + cellsPerRow,
      centerIndex + cellsPerRow + 1,
      centerIndex - cellsPerRow
    ];
  }
  liveCells.sort((a, b) => a - b);
  return { liveCells };
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

export const buildInformation = ({ ...state }) => {
  const { liveCells, generationsPerSecond, canvasWidth, canvasHeight, cellSize } = state;
  const totalElements = (canvasWidth / cellSize) * (canvasHeight / cellSize);
  return [
    { title: "Total Cells", value: totalElements },
    { title: "Live Cells", value: liveCells.length },
    { title: "Dead Cells", value: totalElements - liveCells.length },
    { title: "Generations / second (actual)", value: generationsPerSecond.toFixed(2) }
  ];
};
