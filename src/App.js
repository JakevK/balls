import React from 'react';
import './App.css';



function readStorage(endpoint, onReturn) {
    fetch('/storage/' + endpoint).then(response => response.json()).then(data => {
        onReturn(data);
    });
}

function writeStorage(endpoint, data) {
    console.log(data);
    fetch('/storage/' + endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(response => {console.log(response)})
}





class DrawBalls extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // fill array with numbers from drawMin to drawMax
            remainingBalls: Array(props.drawMax + 1 - props.drawMin)
                .fill(props.drawMin)
                .map((x, y) => x + y),
            drawnBalls: [],
       }
    }


    drawBall = () => {
        // generate random index from the remainingBalls array
        const ballIndex = Math.floor(Math.random() * this.state.remainingBalls.length);
        
        if (this.state.remainingBalls.length) {
            this.setState({
                remainingBalls: this.state.remainingBalls.filter((a, i) => i !== ballIndex),
                drawnBalls: [...this.state.drawnBalls, this.state.remainingBalls[ballIndex]]
            });
        }
    }


    render() {
        return (
            <div className="gameContainer">

                <div className="gameTitle">{this.props.title}</div>

                <div className="drawingLabel">
                    Drawing <b>{this.props.drawAmount}</b> balls 
                    from <b>{this.props.drawMin}</b> to <b>{this.props.drawMax}</b>
                </div>


                <div className="drawFocusContainer">
                    <div className="drawFocusContainerLeft">
                        <div className="currentBallLabel">
                            Ball
                            {' ' + this.state.drawnBalls.length + ' '} 
                            of
                            {' ' + this.props.drawAmount}
                        </div>

                        <div 
                            className="nextBallBtn" 
                            onClick={this.drawBall}
                        >
                            <p>
                                {this.state.drawnBalls.length ? this.state.drawnBalls.length < this.props.drawAmount ? 'Next ball' : 'Extra ball' : 'Draw ball'}
                                <i data-feather="circle"></i>
                            </p>
                            
                            
                        </div>
                    </div>

                    <div className="focusedBall">
                        <div>
                            {this.state.drawnBalls.length ? this.state.drawnBalls[this.state.drawnBalls.length - 1] : ' '}
                        </div>
                    </div>
                </div>


                <div className="drawnBallsLabel">
                    {this.state.drawnBalls.length > 1 ? "Previously drawn balls..." : ""}
                </div>
                
                <div className="drawnBallsContainer">
                    {
                        this.state.drawnBalls
                            .slice(
                                0, 
                                this.state.drawnBalls.length - 1
                            )
                            
                            .map((value) => (
                                <div key={value} className="ball">
                                    <div>
                                        {value}
                                    </div>
                                </div>
                            ))
                    }
                </div>
            </div>
        );
    }
}



class CustomGameInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            drawAmount: "",
            drawMin: "",
            drawMax: "",
            save: 0
        }
    }


    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        })
    }

    handleDrawAmountChange = (event) => {
        this.setState({
            drawAmount: +event.target.value 
        })
    }

    handleDrawMinChange = (event) => {
        this.setState({
            drawMin: +event.target.value 
        })
    }

    handleDrawMaxChange = (event) => {
        this.setState({
            drawMax: +event.target.value 
        })
    }


    handleChangeSave = (event) => {
        this.setState({
            save: !this.state.save
        });
    }


    handleSubmit = () => {
        if (this.state.save) {
            // write the new custom presets to storage
            readStorage('presets', (presets) => {
                presets[this.state.title] = {
                    drawAmount: this.state.drawAmount,
                    drawMin: this.state.drawMin,
                    drawMax: this.state.drawMax
                }
                writeStorage('presets', presets);
            });
        }


        this.props.onSubmit(
            this.state.title,
            {
                drawAmount: this.state.drawAmount,
                drawMin: this.state.drawMin,
                drawMax: this.state.drawMax
            }
        )
    }


    render() {
        return (
            <div>
                <h1>Custom game</h1>
                <p>
                    Title: 
                    <input 
                        type="text" 
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                    />
                </p>

                <p>
                    Draw
                    <input 
                        type="number" 
                        value={this.state.drawAmount}
                        onChange={this.handleDrawAmountChange}
                    />
                    balls from
                    <input 
                        type="number" 
                        value={this.state.drawMin}
                        onChange={this.handleDrawMinChange}
                    />
                    to
                    <input 
                        type="number" 
                        value={this.state.drawMax}
                        onChange={this.handleDrawMaxChange}
                    />
                </p>

                <input 
                    type="checkbox" 
                    value={this.state.save} 
                    name="saveCheck"
                    onClick={this.handleChangeSave}
                />
                <label htmlFor="saveCheck">Save as preset</label>

                <br/>
                <button onClick={this.handleSubmit}>
                    Start game
                </button>
            </div>
        );
    }
}



class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            presets: {}
        }
    }

    componentDidMount() {
        fetch('/storage/presets')
            .then(result => result.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        presets: result.presets
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            )
    }

    startDraw = (title, drawParams) => {
        this.setState({
            content: <DrawBalls 
                title={title} 
                drawAmount={drawParams.drawAmount} 
                drawMin={drawParams.drawMin} 
                drawMax={drawParams.drawMax}/>
        });
    }

    startCustomGameInput = () => {
        this.setState({content: <CustomGameInput onSubmit={this.startDraw}/>})
    }

    render() {
        return (
            <div>
                <h3>Select a game type</h3>

                {Object.keys(this.state.presetGames).map((name) =>
                    <button key={name} onClick={() => 
                            this.startDraw(
                                name, 
                                presetGames[name]
                            )}>
                        {name}
                    </button>
                )}

                <button onClick={this.startCustomGameInput}>
                    Custom game
                </button>
            </div>
        );
    }
}




export default Root;