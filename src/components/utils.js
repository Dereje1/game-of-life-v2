
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

let binarySearch = function (arr, x, start, end) {
    // Base Condition
    if (start > end) return false;
  
    // Find the middle index
    let mid=Math.floor((start + end)/2);
  
    // Compare mid with given key x
    if (arr[mid]===x) return true;
         
    // If element at mid is greater than x,
    // search in the left half of mid
    if(arr[mid] > x)
        return binarySearch(arr, x, start, mid-1);
    else
 
        // If element at mid is smaller than x,
        // search in the right half of mid
        return binarySearch(arr, x, mid+1, end);
}
// checks for dead cells
const findNewLiveCells = (deadCells, liveCells, cellSize, width, height) => {
   
    const newLive = []
    for (let i = 0; i < deadCells.length; i++) {
        const neighbours = getNeighbours(deadCells[i], cellSize, width, height);
        let live = 0;
        for (let n = 0; n < neighbours.length; n++) {
            const isFound = binarySearch(liveCells,neighbours[n],0,liveCells.length -1)
            if (isFound) {
                live++
            }
            if (live > 3) break;
        }
        if (live === 3) newLive.push(deadCells[i])
    }
    
    return newLive;
}

export const getNewLiveCells = (liveCells, cellSize, width, height) => {
    const start = Date.now()
    const stillLive = []
    let deadCells = [];
    liveCells.sort()
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
    console.log('getNewLiveCells', Date.now() - start)
    return [...stillLive, ...newLiveCells];
}