import React, { Component } from 'react';
import Control from './Control';
import { getActiveCells, delay, getNewLiveCells, getKeyOfClickedPosition } from './utils'

const GRANULARITY = 30;

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { refresh: false };
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

    refreshCells = async () => {
        if (!getActiveCells({ ...this.state.cells }).length) {
            return null;
        }
        await delay(50)
        const { cells } = this.state;
        const newLiveCells = getNewLiveCells({ ...cells }, GRANULARITY);
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
        const { canvasWidth, canvasHeight, refresh } = this.state;
        const context = this.canvasContext
        const activeCells = getActiveCells({ ...this.state.cells });
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        activeCells.forEach(cell => {
            const [x, y] = cell.split('-');
            context.fillStyle = "#ff0000";
            context.fillRect(x, y, GRANULARITY, GRANULARITY)
        })
        this.refreshGrid();
        if (refresh) {
            this.refreshCells();
        }
    }

    processClick = ({ clientX, clientY }) => {
        const { cells } = this.state
        const Canvas = this.Canvas.current;
        const { left, top } = Canvas.getBoundingClientRect();
        const keys = Object.keys(cells);
        const key = getKeyOfClickedPosition({ clientX, clientY, left, top, keys })
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
        const { canvasWidth, canvasHeight } = this.state;
        const obj = {}
        for (let x = 0; x <= canvasWidth; x += GRANULARITY) {
            for (let y = 0; y <= canvasHeight; y += GRANULARITY) {
                obj[`${x}-${y}`] = {
                    isActive: empty ? false : Math.random() < 0.5
                }
            }
        }
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
        //console.log(Date.now())
        const { canvasWidth, canvasHeight, canvasTop, canvasLeft, refresh } = this.state;
        return (
            <div style={{ paddingLeft: canvasLeft }}>
                <Control
                    width={canvasWidth}
                    height={canvasTop}
                    onRefresh={this.onRefresh}
                    onPause={() => this.setState({ refresh: false })}
                    isRefreshing={refresh}
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
            </div>
        )
    }
}

export default Home