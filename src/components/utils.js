
export const getActiveCells = (allCells) => {
    const allKeys = Object.keys(allCells);
    const activeCells = allKeys.filter(k => allCells[k].isActive)
    return activeCells;
}

export const getNeighbours = (cell, granularity, width, height) => {
    const [x, y] = cell.split('-').map(c => Number(c));
    let neighbours = [
        [x, y - granularity],
        [x + granularity, y - granularity],
        [x + granularity, y],
        [x + granularity, y + granularity],
        [x, y + granularity],
        [x - granularity, y + granularity],
        [x - granularity, y],
        [x - granularity, y - granularity],
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
const findNewLiveCells = (uniqueDeadCells, liveCells, granularity, width, height) => {
    const newLiveCells = []
    for (const deadCell of uniqueDeadCells) {
        const neighbours = getNeighbours(deadCell, granularity, width, height);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        if (liveNeighbors.length === 3) {
            newLiveCells.push(deadCell)
        }
    }
    return newLiveCells;
}

export const getNewLiveCells = (allCells, granularity, width, height) => {
    const liveCells = getActiveCells(allCells, width, height);
    const stillLive = []
    let deadCells = [];
    for (const liveCell of liveCells) {
        const neighbours = getNeighbours(liveCell, granularity, width, height);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        const deadNeighbors = neighbours.filter(n => !liveCells.includes(n));
        if (liveNeighbors.length === 3 || liveNeighbors.length === 2) {
            stillLive.push(liveCell)
        }
        deadCells = [...deadCells, ...deadNeighbors]
    }
    const uniqueDeadCells = Array.from(new Set(deadCells));
    const newLiveCells = findNewLiveCells(uniqueDeadCells, liveCells, granularity, width, height)
    return [...stillLive, ...newLiveCells];
}

export const getKeyOfClickedPosition = ({ clientX, clientY, left, top, keys, granularity, width, height }) => {
    const x = clientX - left;
    const y = clientY - top;
    let keysX = keys.map(m => Number(m.split('-')[0]))
    let keysY = keys.map(m => Number(m.split('-')[1]))
    keysX = Array.from(new Set(keysX))
    keysY = Array.from(new Set(keysY))
    let xRect = 0
    let yRect = 0
    for (let idx = 0; idx <= keysX.length; idx++) {
        if (keysX[idx] > x) {
            xRect = keysX[idx - 1]
            break
        }
    }
    for (let idx = 0; idx <= keysY.length; idx++) {
        if (keysY[idx] > y) {
            yRect = keysY[idx - 1]
            break
        }
    }
    return `${xRect}-${yRect}`;
}