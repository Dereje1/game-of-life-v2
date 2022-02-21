import React, { Component } from 'react';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = { canvasLoaded: false };
        this.Canvas = React.createRef();
    }

    componentDidMount() {
        this.loadCanvas()
    }

    loadCanvas = () => {
        // loads canvas once on game mount
        const Canvas = this.Canvas.current;
        const { innerWidth, innerHeight } = window
        console.log(Canvas)
        if (Canvas) {
            Canvas.focus();
            Canvas.style.backgroundColor = 'black';
            this.canvasContext = Canvas.getContext('2d');
            this.Canvas.current.focus();
            this.setState({
                canvasWidth: innerWidth * 0.8,
                canvasHeight: innerHeight * 0.8,
                canvasTop: innerHeight * 0.1,
                canvasLeft: innerWidth * 0.1
            });
        }
    }

    render() {
        const { canvasWidth, canvasHeight, canvasTop, canvasLeft } = this.state;
        console.log()
        return (
            <div style={{ paddingTop: canvasTop, paddingLeft: canvasLeft }}>
                <canvas
                    ref={this.Canvas}
                    width={canvasWidth}
                    height={canvasHeight}
                    tabIndex="0"
                    onKeyDown={e => ({})}
                    onKeyUp={e => ({})}
                />
            </div>
        )
    }
}

export default Home