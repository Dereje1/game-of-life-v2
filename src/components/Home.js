import React, { Component } from 'react';
import { ControlTop, ControlBottom } from './Control';
import { getActiveCells, getNewLiveCells } from './utils'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            cellSize: 20,
            refreshRate: 140,
            generations: 0
        };
        this.Canvas = React.createRef();
    }

    componentDidMount() {
        this.loadCanvas()
    }

    onRefresh = () => {
        this.setState({ refresh: true }, this.refreshCells)
    }

    onReset = () => {
        this.setState({ refresh: false, generations: 0 }, this.setGrid)
    }

    onClear = () => {
        this.setState({ refresh: false, generations: 0 }, () => this.setGrid(true))
    }

    onGranularity = ({ target: { value } }) => {
        this.setState({ refresh: false, cellSize: value }, this.loadCanvas)
    }

    onRefreshRate = ({ target: { value } }) => {
        clearTimeout(this.timeoutId);
        this.setState({ refreshRate: value }, this.updateCells)
    }

    refreshCells = () => {
        const { cells, cellSize, canvasWidth: width, canvasHeight: height, generations } = this.state;
        const newLiveCells = getNewLiveCells(cells, cellSize, width, height);
        const keys = Object.keys(cells);
        const obj = {};
        for (const cell of keys) {
            if (newLiveCells.includes(cell)) {
                obj[cell] = {
                    isActive: true
                }
            } else {
                obj[cell] = {
                    isActive: false
                }
            }
        }
        this.setState({ cells: obj, generations: generations + 1 }, this.updateCells)
    }

    updateCells = () => {
        const { cells, canvasWidth, canvasHeight, refresh, cellSize, refreshRate } = this.state;
        const context = this.canvasContext
        const activeCells = getActiveCells(cells);
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        activeCells.forEach(cell => {
            const [x, y] = cell.split('-');
            context.fillStyle = "#ff0000";
            context.fillRect(x, y, cellSize, cellSize)
        })
        this.refreshGrid();
        if (refresh && activeCells.length) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(this.refreshCells, refreshRate);
        }
    }

    handleCanvasClick = ({ clientX, clientY }) => {
        const { cells, cellSize } = this.state
        const Canvas = this.Canvas.current;
        const { left, top } = Canvas.getBoundingClientRect();
        const trueX = clientX - left;
        const trueY = clientY - top;
        const x = Math.floor(trueX / cellSize) * cellSize
        const yFloor = Math.floor(trueY / cellSize) * cellSize
        const key = `${x}-${yFloor}`
        this.setState({
            cells: {
                ...cells,
                [key]: {
                    isActive: !cells[key].isActive
                }
            }
        }, this.updateCells)
    }

    setGrid = (empty = false) => {
        const { canvasWidth, canvasHeight, cellSize } = this.state;
        const obj = {}
        for (let x = 0; x <= canvasWidth; x += cellSize) {
            for (let y = 0; y <= canvasHeight; y += cellSize) {
                obj[`${x}-${y}`] = {
                    isActive: empty ? false : Math.random() < 0.5
                }
            }
        }
        this.setState({ cells: obj }, this.updateCells)
    }

    refreshGrid = () => {
        const context = this.canvasContext
        const { canvasWidth, canvasHeight, cellSize } = this.state;
        for (let x = 0; x <= canvasWidth; x += cellSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
            context.strokeStyle = "#3b3b3b";
            context.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += cellSize) {
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
        const { cellSize } = this.state
        const cellWidth = Math.floor((innerWidth * 0.8) / cellSize);
        const cellHeight = Math.floor((innerHeight * 0.8) / cellSize);
        const canvasWidth = cellWidth * cellSize;
        const canvasHeight = cellHeight * cellSize

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
        const {
            canvasWidth, canvasHeight,
            canvasTop, canvasLeft,
            cellSize, refreshRate,
            refresh, generations
        } = this.state;
        return (
            <div style={{ paddingLeft: canvasLeft }}>
                {
                    canvasWidth && <ControlTop
                        width={canvasWidth}
                        height={canvasTop}
                        isRefreshing={refresh}
                        onRefresh={this.onRefresh}
                        onPause={() => this.setState({ refresh: false })}
                        onReset={this.onReset}
                        onClear={this.onClear}
                        generations={generations}
                    />
                }
                <canvas
                    ref={this.Canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                    tabIndex="0"
                    onClick={this.handleCanvasClick}
                />
                {
                    canvasWidth && <ControlBottom
                        width={canvasWidth}
                        height={canvasTop}
                        cellSize={cellSize}
                        refreshRate={refreshRate}
                        onGranularity={this.onGranularity}
                        onRefreshRate={this.onRefreshRate}
                    />
                }
            </div>
        )
    }
}

export default Home