const addResurrectedCell = (resurrectedCells, cell) => {
    if (!resurrectedCells.length) return [cell];

    const resurrectedCellExists = binarySearch({ arr: resurrectedCells, x: cell, end: resurrectedCells.length - 1 });
    if (resurrectedCellExists) return resurrectedCells

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
const canResurrectCell = ({ neighbour: deadCell, liveCells, cellSize, width, height }) => {
    const neighbours = getNeighbours({ cell: deadCell, cellSize, width, height });
    let liveNeighbors = 0;
    for (let n = 0; n < neighbours.length; n++) {
        const isFound = binarySearch({ arr: liveCells, x: neighbours[n], end: liveCells.length - 1 })
        if (isFound) {
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
    // transform for out of bounds
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
            const isResurrected = canResurrectCell({ neighbour, liveCells: oldCells, ...args })
            if (isResurrected) {
                updatedResurrectedCells = addResurrectedCell(updatedResurrectedCells, neighbour)
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