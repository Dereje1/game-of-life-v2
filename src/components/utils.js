
export const getActiveCells = (allCells) => {
    const allKeys = Object.keys(allCells);
    const activeCells = allKeys.filter(k => allCells[k].isAlive)
    return activeCells;
}

export const getNeighbours = (cell, cellSize, width, height) => {
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

// checks for dead cells
const findNewLiveCells = (deadCells, liveCells, cellSize, width, height) => {
    const newLiveCells = deadCells.reduce((newCells, deadCell) => {
        const neighbours = getNeighbours(deadCell, cellSize, width, height);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        if (liveNeighbors.length === 3) {
            return [...newCells, deadCell]
        }
        return newCells
    }, [])

    return newLiveCells;
}

export const getNewLiveCells = (allCells, cellSize, width, height) => {
    const liveCells = getActiveCells(allCells);
    const stillLive = []
    let deadCells = [];
    for (const liveCell of liveCells) {
        const neighbours = getNeighbours(liveCell, cellSize, width, height);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        const deadNeighbors = neighbours.filter(n => !liveCells.includes(n));
        if (liveNeighbors.length === 3 || liveNeighbors.length === 2) {
            stillLive.push(liveCell)
        }
        deadCells = [...deadCells, ...deadNeighbors]
    }
    const uniqueDeadCells = Array.from(new Set(deadCells));
    const newLiveCells = findNewLiveCells(uniqueDeadCells, liveCells, cellSize, width, height)
    return [...stillLive, ...newLiveCells];
}