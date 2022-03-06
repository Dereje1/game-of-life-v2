import React, { Component } from 'react';
import { ControlTop, ControlBottom } from './components/Controls';
import { getNewLiveCells } from './components/utils'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            cellSize: 20,
            refreshRate: 140,
            generations: 0,
            empty: false
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
        clearTimeout(this.timeoutId);
        this.setState({ refresh: false, generations: 0 }, this.setGrid)
    }

    onClear = () => {
        clearTimeout(this.timeoutId);
        this.setState({ refresh: false, generations: 0, empty: true }, this.setGrid)
    }

    handleCellSize = ({ target: { value } }) => {
        clearTimeout(this.timeoutId);
        this.setState({ refresh: false, cellSize: value, generations: 0 }, this.loadCanvas)
    }

    onRefreshRate = ({ target: { value } }) => {
        clearTimeout(this.timeoutId);
        this.setState({ refreshRate: value }, this.updateCells)
    }

    refreshCells = () => {
        const { cells: oldCells, cellSize, canvasWidth: width, canvasHeight: height, generations } = this.state;
        const newLiveCells = getNewLiveCells(oldCells, cellSize, width, height);
        this.setState({ cells: newLiveCells, generations: generations + 1 }, this.updateCells)
    }

    updateCells = () => {
        const { cells, canvasWidth, canvasHeight, refresh, cellSize, refreshRate } = this.state;
        const context = this.canvasContext
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        cells.forEach(cell => {
            const [x, y] = cell.split('-');
            context.fillStyle = "#ff0000";
            context.fillRect(x, y, cellSize, cellSize)
        })
        this.refreshGrid();
        if (refresh && cells.length) {
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
        const xFloor = Math.floor(trueX / cellSize) * cellSize
        const yFloor = Math.floor(trueY / cellSize) * cellSize
        const key = `${xFloor}-${yFloor}`

        let newCells = [];
        if (cells.includes(key)) {
            newCells = cells.filter(c => c !== key)
        } else {
            newCells = [...cells, key]
        }
        this.setState({ cells: newCells }, this.updateCells)
    }

    setGrid = () => {
        const { canvasWidth, canvasHeight, cellSize, empty } = this.state;
        const cells = []
        for (let x = 0; x < canvasWidth; x += cellSize) {
            for (let y = 0; y < canvasHeight; y += cellSize) {
                if (!empty && Math.random() < 0.5) {
                    cells.push(`${x}-${y}`)
                }
            }
        }
        this.setState({ cells, empty: false }, this.updateCells)
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
        const { innerWidth, innerHeight } = window;
        const { cellSize } = this.state
        const cellWidth = Math.floor(innerWidth / cellSize);
        const cellHeight = Math.floor((innerHeight * 0.8) / cellSize);
        const canvasWidth = cellWidth * cellSize;
        const canvasHeight = cellHeight * cellSize

        const canvas = this.Canvas.current;
        canvas.style.backgroundColor = 'black';
        this.canvasContext = canvas.getContext('2d');

        this.setState({
            canvasWidth,
            canvasHeight,
            canvasTop: (innerHeight - canvasHeight) / 2,
            canvasLeft: (innerWidth - canvasWidth) / 2
        }, this.setGrid);

    }

    render() {
        const {
            canvasWidth, canvasHeight, canvasLeft,
            cellSize, refreshRate,
            refresh, generations
        } = this.state;
        return (
            <>
                <>
                    <ControlTop
                        width={canvasWidth}
                        height={window.innerHeight * 0.1}
                        isRefreshing={refresh}
                        onRefresh={this.onRefresh}
                        onPause={() => this.setState({ refresh: false })}
                        onReset={this.onReset}
                        onClear={this.onClear}
                        generations={generations} />


                    <ControlBottom
                        width={canvasWidth}
                        height={window.innerHeight * 0.1}
                        cellSize={cellSize}
                        refreshRate={refreshRate}
                        handleCellSize={this.handleCellSize}
                        onRefreshRate={this.onRefreshRate} />
                </>
                <div style={{ paddingLeft: canvasLeft }}>
                    <canvas
                        ref={this.Canvas}
                        width={canvasWidth}
                        height={canvasHeight}
                        tabIndex="0"
                        onClick={this.handleCanvasClick} />
                </div>
            </>
        )
    }
}

export default App