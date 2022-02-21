import React, { Component } from 'react';

const GRANULARITY = 20;
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { canvasLoaded: false };
        this.Canvas = React.createRef();
    }

    componentDidMount() {
        this.loadCanvas()
    }

    updateCell = () => {
        const { canvasWidth, canvasHeight } = this.state;
        const context = this.canvasContext
        const activeCells = Object.keys(this.state).filter(c => this.state[c].isActive)
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        activeCells.forEach(a => {
            const [x, y] = a.split('-');
            context.fillStyle = "green";
            context.fillRect(Number(x), Number(y), GRANULARITY, GRANULARITY)
        })
        this.refreshGrid();
    }
    getClick = (event) => {
        const modelKeys = Object.keys(this.state);
        const Canvas = this.Canvas.current;
        const rect = Canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        let modelX = modelKeys.map(m => Number(m.split('-')[0]))
        let modelY = modelKeys.map(m => Number(m.split('-')[1]))
        modelX = Array.from(new Set(modelX))
        modelY = Array.from(new Set(modelY))
        let xRect = 0
        let yRect = 0
        for (let idx = 0; idx <= modelX.length; idx++) {
            if (modelX[idx] > x) {
                xRect = modelX[idx - 1]
                break
            }
        }
        for (let idx = 0; idx <= modelX.length; idx++) {
            if (modelY[idx] > y) {
                yRect = modelY[idx - 1]
                break
            }
        }
        const key = `${xRect}-${yRect}`;

        this.setState({
            [key]: {
                isActive: !this.state[key].isActive
            }
        }, this.updateCell)

    }

    setGrid = () => {
        const { canvasWidth, canvasHeight } = this.state;
        for (let x = 0; x <= canvasWidth; x += GRANULARITY) {
            for (let y = 0; y <= canvasHeight; y += GRANULARITY) {
                this.setState({
                    [`${x}-${y}`]: {
                        isActive: false
                    }
                })
            }
        }
        this.refreshGrid()
    }

    refreshGrid = () => {
        const context = this.canvasContext
        const { canvasWidth, canvasHeight } = this.state;
        for (let x = 0; x <= canvasWidth; x += GRANULARITY) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
            context.strokeStyle = "white";
            context.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += GRANULARITY) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
            context.strokeStyle = "white";
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
            Canvas.focus();
            Canvas.style.backgroundColor = 'black';
            this.canvasContext = Canvas.getContext('2d');
            this.Canvas.current.focus();
            this.setState({
                canvasWidth,
                canvasHeight,
                canvasTop: (innerHeight - canvasHeight) / 2,
                canvasLeft: (innerWidth - canvasWidth) / 2
            }, this.setGrid);
        }
    }

    render() {
        const { canvasWidth, canvasHeight, canvasTop, canvasLeft } = this.state;
        return (
            <div style={{ paddingTop: canvasTop, paddingLeft: canvasLeft }}>
                <canvas
                    ref={this.Canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                    tabIndex="0"
                    onClick={this.getClick}
                />
            </div>
        )
    }
}

export default Home