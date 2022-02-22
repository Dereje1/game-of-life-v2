export const getActiveCells = (allCells) => {
    const allKeys = Object.keys(allCells);
    return allKeys.filter(k => allCells[k].isActive)
}

export const getNeighbours = (cell, GRANULARITY) => {
    const [x, y] = cell.split('-').map(c => Number(c));
    return [
        `${x}-${y - GRANULARITY}`,
        `${x + GRANULARITY}-${y - GRANULARITY}`,
        `${x + GRANULARITY}-${y}`,
        `${x + GRANULARITY}-${y + GRANULARITY}`,
        `${x}-${y + GRANULARITY}`,
        `${x - GRANULARITY}-${y + GRANULARITY}`,
        `${x - GRANULARITY}-${y}`,
        `${x - GRANULARITY}-${y - GRANULARITY}`,
    ]
}

export const findResurrectedCells = (uniqueDeadCells, liveCells, GRANULARITY) => {
    const newLiveCells = []
    for (const deadCell of uniqueDeadCells) {
        const neighbours = getNeighbours(deadCell, GRANULARITY);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        if (liveNeighbors.length === 3) {
            newLiveCells.push(deadCell)
        }
    }
    return newLiveCells;
}

export const getNewLiveCells = (allCells, GRANULARITY) => {
    const liveCells = getActiveCells({ ...allCells });
    const stillLive = []
    let deadCells = [];
    for (const liveCell of liveCells) {
        const neighbours = getNeighbours(liveCell, GRANULARITY);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        const deadNeighbors = neighbours.filter(n => !liveCells.includes(n));
        if (liveNeighbors.length === 3 || liveNeighbors.length === 2) {
            stillLive.push(liveCell)
        }
        deadCells = [...deadCells, ...deadNeighbors]
    }
    const uniqueDeadCells = Array.from(new Set(deadCells));
    const newLiveCells = findResurrectedCells(uniqueDeadCells, liveCells, GRANULARITY)
    return [...stillLive, ...newLiveCells];
}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getKeyOfClickedPosition = ({clientX, clientY, left, top, keys}) => {
    
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