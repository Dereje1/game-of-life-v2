import React, { Component } from 'react';
import { ControlTop, ControlBottom } from './Control';
import { getActiveCells, getNewLiveCells, getKeyOfClickedPosition } from './utils'

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            granularity: 20,
            refreshRate: 140
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
        this.setState({ refresh: false }, this.setGrid)
    }

    onClear = () => {
        this.setState({ refresh: false }, () => this.setGrid(true))
    }

    onGranularity = ({ target: { value } }) => {
        this.setState({ refresh: false, granularity: value }, this.loadCanvas)
    }

    onRefreshRate = ({ target: { value } }) => {
        clearTimeout(this.timeoutId);
        this.setState({ refreshRate: value }, this.updateCells)
    }

    refreshCells = () => {
        const { cells, granularity, canvasWidth: width, canvasHeight: height } = this.state;
        const newLiveCells = getNewLiveCells(cells, granularity, width, height);
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
        this.setState({ cells: obj }, this.updateCells)
    }

    updateCells = () => {
        const { cells, canvasWidth, canvasHeight, refresh, granularity, refreshRate } = this.state;
        const context = this.canvasContext
        const activeCells = getActiveCells(cells, canvasWidth, canvasHeight);
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        activeCells.forEach(cell => {
            const [x, y] = cell.split('-');
            context.fillStyle = "#ff0000";
            context.fillRect(x, y, granularity, granularity)
        })
        this.refreshGrid();
        if (refresh && activeCells.length) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(this.refreshCells, refreshRate);
        }
    }

    processClick = ({ clientX, clientY }) => {
        const { cells, granularity, canvasWidth: width, canvasHeight: height } = this.state
        const Canvas = this.Canvas.current;
        const { left, top } = Canvas.getBoundingClientRect();
        const keys = Object.keys(cells);
        const key = getKeyOfClickedPosition({ clientX, clientY, left, top, keys, granularity, width, height })
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

    setGrid = (empty = false) => {
        const { canvasWidth, canvasHeight, granularity } = this.state;
        const obj = {}
        for (let x = 0; x <= canvasWidth; x += granularity) {
            for (let y = 0; y <= canvasHeight; y += granularity) {
                obj[`${x}-${y}`] = {
                    isActive: empty ? false : Math.random() < 0.5
                }
            }
        }
        this.setState({ cells: obj }, this.updateCells)
    }

    refreshGrid = () => {
        const context = this.canvasContext
        const { canvasWidth, canvasHeight, granularity } = this.state;
        for (let x = 0; x <= canvasWidth; x += granularity) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
            context.strokeStyle = "#3b3b3b";
            context.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += granularity) {
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
        const { granularity } = this.state
        const cellWidth = Math.floor((innerWidth * 0.8) / granularity);
        const cellHeight = Math.floor((innerHeight * 0.8) / granularity);
        const canvasWidth = cellWidth * granularity;
        const canvasHeight = cellHeight * granularity

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
        const { canvasWidth, canvasHeight, canvasTop, canvasLeft, refresh, granularity, refreshRate } = this.state;
        console.log(this.state.cells && Object.keys(this.state.cells).length)
        return (
            <div style={{ paddingLeft: canvasLeft }}>
                <ControlTop
                    width={canvasWidth}
                    height={canvasTop}
                    isRefreshing={refresh}
                    onRefresh={this.onRefresh}
                    onPause={() => this.setState({ refresh: false })}
                    onReset={this.onReset}
                    onClear={this.onClear}
                />
                <canvas
                    ref={this.Canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                    tabIndex="0"
                    onClick={this.processClick}
                />
                <ControlBottom
                    width={canvasWidth}
                    height={canvasTop}
                    granularity={granularity}
                    refreshRate={refreshRate}
                    onGranularity={this.onGranularity}
                    onRefreshRate={this.onRefreshRate}
                />
            </div>
        )
    }
}

export default Home