const addResurrectedCell = (resurrectedCells, cell) => {
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
                    updatedResurrectedCells = addResurrectedCell(updatedResurrectedCells, neighbour)
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
    const midX = Math.floor(trueX / cellSize) * cellSize
    const midY = Math.floor(trueY / cellSize) * cellSize
    if (pattern === 'Blinker') {
        return [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`
        ]
    }
    if (pattern === 'Glider') {
        return [
            `${midX - cellSize}-${midY}`,
            `${midX}-${midY}`,
            `${midX + cellSize}-${midY}`,
            `${midX + cellSize}-${midY - cellSize}`,
            `${midX}-${midY - (2 * cellSize)}`
        ]
    }
    return []
}