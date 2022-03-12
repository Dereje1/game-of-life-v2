const addCellAscending = (resurrectedCells, cell) => {
    // add cell by keeping sort order
    for (let i = 0; i < resurrectedCells.length; i++) {
        if (cell < resurrectedCells[i]) {
            return [
                ...resurrectedCells.slice(0, i),
                cell,
                ...resurrectedCells.slice(i)
            ]
        }
    }
    return [...resurrectedCells, cell];
}
// checks for dead cells
const canResurrectCell = ({ liveCells, ...args }) => {
    const neighbours = getNeighbours({ ...args });
    let liveNeighbors = 0;
    for (let n = 0; n < neighbours.length; n++) {
        const neighbourIsLive = binarySearch({ arr: liveCells, x: neighbours[n], end: liveCells.length - 1 })
        if (neighbourIsLive) {
            liveNeighbors++
        }
        if (liveNeighbors > 3) break;
    }
    if (liveNeighbors === 3) return true
    return false;
}

const binarySearch = function ({ arr, x, start = 0, end }) {
    // Base Condition
    if (start > end) return false;

    // Find the middle index
    let mid = Math.floor((start + end) / 2);

    // Compare mid with given key x
    if (arr[mid] === x) return true;

    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid] > x)
        return binarySearch({ arr, x, start, end: mid - 1 });
    else
        // If element at mid is smaller than x,
        // search in the right half of mid
        return binarySearch({ arr, x, start: mid + 1, end });
}

const getNeighbours = ({ cell, cellSize, width, height }) => {
    const [x, y] = cell.split('-').map(c => Number(c));

    let neighbours = [
        [x, y - cellSize],
        [x + cellSize, y - cellSize],
        [x + cellSize, y],
        [x + cellSize, y + cellSize],
        [x, y + cellSize],
        [x - cellSize, y + cellSize],
        [x - cellSize, y],
        [x - cellSize, y - cellSize],
    ]
    // transform for out of bounds and stringify
    neighbours = neighbours.map(([x, y]) => {
        let u = x, v = y;
        if (x >= width) {
            u = x - width
        }
        if (x < 0) {
            u = width - (Math.abs(x))
        }
        if (y >= height) {
            v = y - height
        }
        if (y < 0) {
            v = height - (Math.abs(y))
        }
        return `${u}-${v}`
    })

    return neighbours
}

const processCell = ({
    resurrectedCells,
    ...args
}) => {
    const { oldCells } = args;
    const neighbours = getNeighbours({ ...args });
    let liveNeighbors = 0;
    let updatedResurrectedCells = resurrectedCells;
    for (const neighbour of neighbours) {
        const neighbourIsLive = binarySearch({ arr: oldCells, x: neighbour, end: oldCells.length - 1 })
        if (neighbourIsLive) {
            liveNeighbors++
        } else {
            // check if dead neighbor has already been resurrected
            const resurrectedCellExists = binarySearch({
                arr: resurrectedCells,
                x: neighbour,
                end: resurrectedCells.length - 1
            });
            if (!resurrectedCellExists) {
                // check if dead neighbor can be resurrected and update list if so
                const isResurrected = canResurrectCell({ ...args, cell: neighbour, liveCells: oldCells })
                if (isResurrected) {
                    updatedResurrectedCells = addCellAscending(updatedResurrectedCells, neighbour)
                }
            }
        }
    }

    if (liveNeighbors === 3 || liveNeighbors === 2) {
        return {
            isStillLive: true,
            updatedResurrectedCells
        }
    }

    return {
        isStillLive: false,
        updatedResurrectedCells
    }
}

export const getLiveCells = (args) => {
    const { oldCells } = args;
    const stillLive = []
    let resurrectedCells = [];
    oldCells.sort()
    for (const oldCell of oldCells) {
        const { isStillLive, updatedResurrectedCells } = processCell({ cell: oldCell, resurrectedCells, ...args });
        resurrectedCells = updatedResurrectedCells;
        if (isStillLive) {
            stillLive.push(oldCell)
        }
    }
    return [...stillLive, ...resurrectedCells];
}

export const getPattern = ({ pattern, cellSize, canvasWidth, canvasHeight }) => {
    const trueX = Math.floor(canvasWidth / 2);
    const trueY = Math.floor(canvasHeight / 2);
    let midX = Math.floor(trueX / cellSize) * cellSize
    let midY = Math.floor(trueY / cellSize) * cellSize
    let cells = [];

    if (pattern === 'random') {
        for (let x = 0; x < canvasWidth; x += cellSize) {
            for (let y = 0; y < canvasHeight; y += cellSize) {
                if (Math.random() < 0.5) {
                    cells.push(`${x}-${y}`)
                }
            }
        }
    }

    if (pattern === 'blinker') {
        cells = [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`
        ]
    }
    if (pattern === 'glider') {
        cells = [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX + cellSize}-${midY - cellSize}`,
            `${midX}-${midY - (2 * cellSize)}`
        ]
    }
    if (pattern === 'toad') {
        cells = [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX}-${midY - cellSize}`,
            `${midX + cellSize}-${midY - cellSize}`,
            `${midX + (2 * cellSize)}-${midY - cellSize}`
        ]
    }
    if (pattern === 'beacon') {
        cells = [
            `${midX}-${midY}`,
            `${midX - cellSize}-${midY}`,
            `${midX - cellSize}-${midY - cellSize}`,
            `${midX}-${midY - cellSize}`,
            `${midX + cellSize}-${midY + cellSize}`,
            `${midX + (2 * cellSize)}-${midY + cellSize}`,
            `${midX + (2 * cellSize)}-${midY + (2 * cellSize)}`,
            `${midX + cellSize}-${midY + (2 * cellSize)}`,
        ]
    }

    if (pattern === 'pulsar') {
        midY = midY + (2 * cellSize)
        midX = midX - (cellSize)
        cells = [
            `${midX}-${midY}`,
            `${midX - cellSize}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX}-${midY - cellSize}`,
            `${midX}-${midY - (6 * cellSize)}`,
            `${midX - cellSize}-${midY - (6 * cellSize)}`,
            `${midX + cellSize}-${midY - (6 * cellSize)}`,
            `${midX}-${midY - (7 * cellSize)}`,
        ]
    }

    if (pattern === 'pentaDecathlon') {
        midY = midY + (2 * cellSize)
        midX = midX - (cellSize)
        cells = [
            `${midX}-${midY}`,
            `${midX - cellSize}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX}-${midY + cellSize}`,
            `${midX}-${midY - (5 * cellSize)}`,
            `${midX - cellSize}-${midY - (5 * cellSize)}`,
            `${midX + cellSize}-${midY - (5 * cellSize)}`,
            `${midX}-${midY - (6 * cellSize)}`,
        ]
    }

    if (pattern === 'spaceShip') {
        cells = [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX - (2 * cellSize)}-${midY}`,
            `${midX - (2 * cellSize)}-${midY - cellSize}`,
            `${midX - (2 * cellSize)}-${midY - (2 * cellSize)}`,
            `${midX - (cellSize)}-${midY - (3 * cellSize)}`,
            `${midX + (2 * cellSize)}-${midY - (3 * cellSize)}`,
            `${midX + (2 * cellSize)}-${midY - (cellSize)}`,
        ]
    }
    return { cells }
}

export const getIndexFromCoordinates = ({ x, y, width, cellSize }) => {
    const cellsPerRow = width / cellSize;
    const xPos = Math.floor(x / cellSize);
    const yPos = Math.floor(y / cellSize);
    const index = xPos + yPos * cellsPerRow
    return index;
}

export const getCoordinatesFromIndex = ({ index, width, cellSize }) => {
    const cellsPerRow = width / cellSize;
    const row = Math.floor(index / cellsPerRow)
    const column = index % cellsPerRow
    const x = column * cellSize;
    const y = row * cellSize;
    return [x, y]
}

export const neighborTest = ({ index, width, height, cellSize }) => {
    const cellsPerRow = width / cellSize;
    const cellsPerColumn = height / cellSize;
    const offsets = getOffsets({ index, width, height, cellSize })
    let neighbours = [
        index - cellsPerRow, //north
        index - cellsPerRow + 1, //north east
        index + 1, // east
        index + cellsPerRow + 1, //southeast
        index + cellsPerRow, // south
        index + cellsPerRow - 1, // south west
        index - 1, // west
        index - cellsPerRow - 1, // northwest
    ]

    if (offsets) {
        offsets.forEach(offset => {
            if (offset === 'left') {
                neighbours[5] = neighbours[5] + cellsPerRow;
                neighbours[6] = neighbours[6] + cellsPerRow;
                neighbours[7] = neighbours[7] + cellsPerRow;
            } 
            if (offset === 'top') {
                neighbours[0] = neighbours[0] + (cellsPerColumn * cellsPerRow);
                neighbours[1] = neighbours[1] + (cellsPerColumn * cellsPerRow);
                neighbours[7] = neighbours[7] + (cellsPerColumn * cellsPerRow);
            } 
            if (offset === 'right') {
                neighbours[1] = neighbours[1] - cellsPerRow;
                neighbours[2] = neighbours[2] - cellsPerRow;
                neighbours[3] = neighbours[3] - cellsPerRow;
            }
            if (offset === 'bottom') {
                neighbours[3] = neighbours[3] - (cellsPerColumn * cellsPerRow);
                neighbours[4] = neighbours[4] - (cellsPerColumn * cellsPerRow);
                neighbours[5] = neighbours[5] - (cellsPerColumn * cellsPerRow);
            }
        })
    }

    return neighbours

}
const getOffsets = ({ index, width, height, cellSize }) => {
    const cellsPerRow = width / cellSize;
    const cellsPerColumn = height / cellSize;
    const row = Math.floor(index / cellsPerRow)
    const column = index % cellsPerRow
    let offset = []
    if (row === 0) {
        offset = [...offset, 'top']
    }
    if (column === 0) {
        offset = [...offset, 'left']
    }

    if (column === cellsPerRow - 1) {
        offset = [...offset, 'right']
    }

    if (row === cellsPerColumn - 1) {
        offset = [...offset, 'bottom']
    }

    return Boolean(offset.length) && offset
}