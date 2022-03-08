const addResurrectedCell = (resurrectedCells, cell) => {
    if (!resurrectedCells.length) return [cell];

    const resurrectedCellExists = binarySearch(resurrectedCells, cell, 0, resurrectedCells.length - 1);
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
const findResurrectedCell = (deadCell, liveCells, cellSize, width, height) => {
    const neighbours = getNeighbours(deadCell, cellSize, width, height);
    let liveNeighbors = 0;
    for (let n = 0; n < neighbours.length; n++) {
        const isFound = binarySearch(liveCells, neighbours[n], 0, liveCells.length - 1)
        if (isFound) {
            liveNeighbors++
        }
        if (liveNeighbors > 3) break;
    }
    if (liveNeighbors === 3) return true
    return false;
}

const binarySearch = function (arr, x, start, end) {
    // Base Condition
    if (start > end) return false;

    // Find the middle index
    let mid = Math.floor((start + end) / 2);

    // Compare mid with given key x
    if (arr[mid] === x) return true;

    // If element at mid is greater than x,
    // search in the left half of mid
    if (arr[mid] > x)
        return binarySearch(arr, x, start, mid - 1);
    else

        // If element at mid is smaller than x,
        // search in the right half of mid
        return binarySearch(arr, x, mid + 1, end);
}

const getNeighbours = (cell, cellSize, width, height) => {

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

const processCell = (cell, cellSize, resurrectedCells, liveCells, width, height) => {
    const neighbours = getNeighbours(cell, cellSize, width, height);
    let liveNeighbors = 0;
    //let updatedDeadCells = resurrectedCells;
    for (const neighbour of neighbours) {
        const stillLive = binarySearch(liveCells, neighbour, 0, liveCells.length - 1)
        if (stillLive) {
            liveNeighbors++
        } else {
            const isResurrectedCell = findResurrectedCell(neighbour, liveCells, cellSize, width, height)
            if (isResurrectedCell) {
                resurrectedCells = addResurrectedCell(resurrectedCells, neighbour)
            }
        }
    }

    if (liveNeighbors === 3 || liveNeighbors === 2) {
        return {
            isStillLive: true,
            updatedDeadCells: resurrectedCells
        }
    }

    return {
        isStillLive: false,
        updatedDeadCells: resurrectedCells
    }
}

export const getLiveCells = (liveCells, cellSize, width, height) => {
    const stillLive = []
    let resurrectedCells = [];
    liveCells.sort()
    for (const liveCell of liveCells) {
        const { isStillLive, updatedDeadCells } = processCell(liveCell, cellSize, resurrectedCells, liveCells, width, height);
        resurrectedCells = updatedDeadCells;
        if (isStillLive) {
            stillLive.push(liveCell)
        }
    }
    return [...stillLive, ...resurrectedCells];
}