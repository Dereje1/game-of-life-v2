import React, { Component } from 'react';

const GRANULARITY = 30;

const getActiveCells = (allCells) => {
    const allKeys = Object.keys(allCells);
    return allKeys.filter(k => allCells[k].isActive)
}

const getNeighbours = (cell) => {
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

const findResurrectedCells = (liveCells, allCells) => {
    let deadCells = [];
    const newLiveCells = []
    for (const liveCell of liveCells) {
        const neighbours = getNeighbours(liveCell);
        const deadNeighbors = neighbours.filter(n => !liveCells.includes(n));
        deadCells = [...deadCells, ...deadNeighbors]
    }
    const uniqueDeadCells = Array.from(new Set(deadCells));

    for (const deadCell of uniqueDeadCells) {
        const neighbours = getNeighbours(deadCell);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        if (liveNeighbors.length === 3) {
            newLiveCells.push(deadCell)
        }
    }
    return newLiveCells;
}

const stillLiveCells = (allCells) => {
    const liveCells = getActiveCells({ ...allCells });
    const stilLive = []
    for (const liveCell of liveCells) {
        const neighbours = getNeighbours(liveCell);
        const liveNeighbors = neighbours.filter(n => liveCells.includes(n));
        if (liveNeighbors.length === 3 || liveNeighbors.length === 2) {
            stilLive.push(liveCell)
        }
    }
    return stilLive;

}

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { canvasLoaded: false };
        this.Canvas = React.createRef();
    }

    componentDidMount() {
        this.loadCanvas()
    }

    refreshCells = async () => {
        if (!getActiveCells({ ...this.state.cells }).length) {
            return null;
        }
        await delay(1000)
        const { cells } = this.state;
        const stillLivingCells = stillLiveCells({ ...cells });
        const newLiveCells = findResurrectedCells(stillLivingCells);
        const allLiveCells = [...stillLivingCells, ...newLiveCells];
        const keys = Object.keys(cells);
        const obj = {};
        for (const cell of keys) {
            if (allLiveCells.includes(cell)) {
                obj[cell] = {
                    isActive: true
                }
            } else {
                obj[cell] = {
                    isActive: false
                }
            }
        }
        this.setState({ cells: obj }, this.updateCells)
    }

    updateCells = () => {
        const { canvasWidth, canvasHeight } = this.state;
        const context = this.canvasContext
        const activeCells = getActiveCells({ ...this.state.cells });
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        activeCells.forEach(cell => {
            const [x, y] = cell.split('-');
            context.fillStyle = "#ff0000";
            context.fillRect(x, y, GRANULARITY, GRANULARITY)
        })
        this.refreshGrid();
        this.refreshCells();
    }

    processClick = ({ clientX, clientY }) => {
        const { cells } = this.state
        const keys = Object.keys(cells);
        const Canvas = this.Canvas.current;
        const { left, top } = Canvas.getBoundingClientRect();
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
        const key = `${xRect}-${yRect}`;
        this.setState({
            cells: {
                ...cells,
                [key]: {
                    isActive: !cells[key].isActive
                }
            }
        }, () => {
            this.updateCells()
        })
    }

    setGrid = () => {
        const { canvasWidth, canvasHeight } = this.state;
        const obj = {}
        let count = 0;
        for (let x = 0; x <= canvasWidth; x += GRANULARITY) {
            for (let y = 0; y <= canvasHeight; y += GRANULARITY) {
                obj[`${x}-${y}`] = {
                    isActive: Math.random() < 0.5
                }
                count++;
            }
        }
        console.log({ totalCells: count })
        this.setState({ cells: obj }, this.updateCells)
    }

    refreshGrid = () => {
        const context = this.canvasContext
        const { canvasWidth, canvasHeight } = this.state;
        for (let x = 0; x <= canvasWidth; x += GRANULARITY) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
            context.strokeStyle = "#3b3b3b";
            context.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += GRANULARITY) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
            context.strokeStyle = "#3b3b3b";
            context.stroke();
        }
    }
    loadCanvas = () => {
        const Canvas = this.Canvas.current;
        const { innerWidth, innerHeight } = window;
        const cellWidth = Math.floor((innerWidth * 0.8) / GRANULARITY);
        const cellHeight = Math.floor((innerHeight * 0.8) / GRANULARITY);
        const canvasWidth = cellWidth * GRANULARITY;
        const canvasHeight = cellHeight * GRANULARITY

        if (Canvas) {
            Canvas.style.backgroundColor = 'black';
            this.canvasContext = Canvas.getContext('2d');
            this.setState({
                canvasWidth,
                canvasHeight,
                canvasTop: (innerHeight - canvasHeight) / 2,
                canvasLeft: (innerWidth - canvasWidth) / 2
            }, this.setGrid);
        }
    }

    render() {
        console.log(Date.now())
        const { canvasWidth, canvasHeight, canvasTop, canvasLeft } = this.state;
        return (
            <div style={{ paddingTop: canvasTop, paddingLeft: canvasLeft }}>
                <canvas
                    ref={this.Canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                    tabIndex="0"
                    onClick={this.processClick}
                />
            </div>
        )
    }
}

export default Home