import React from "react";
import * as Icon from "react-feather";



class Draw extends React.Component {
    constructor(props) {
        super(props);
        const { drawMax, drawMin } = this.props.settings;

        this.state = {
            // fill array with numbers from drawMin to drawMax
            remainingBalls: Array(drawMax + 1 - drawMin)
                .fill(drawMin)
                .map((x, y) => x + y),
            drawnBalls: [],
            review: false
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
        const { name, drawAmount, drawMax, drawMin } = this.props.settings;


        let output = [<div className="gameTitle">{name}</div>];


        if (!this.state.review) {
            output.push(
                <div>
                    <div className="drawingLabel">
                        Drawing
                        <b> {drawAmount} </b> 
                        balls from 
                        <b> {drawMin} </b>
                        to
                        <b> {drawMax} </b>
                    </div>

                    <div className="drawFocusContainer">
                        <div className="drawFocusContainerLeft">
                            <div className="currentBallLabel">
                                Ball
                                {' ' + this.state.drawnBalls.length + ' '} 
                                of
                                {' ' + drawAmount}
                            </div>

                            <div 
                                className="nextBallBtn" 
                                onClick={this.drawBall}
                            >
                                <p>
                                    {this.state.drawnBalls.length ? this.state.drawnBalls.length < drawAmount ? 'Next ball' : 'Extra ball' : 'Draw ball'}
                                </p>
                                
                                <Icon.Shuffle size={29} color="#2C2A26"/>
                                
                            </div>
                        </div>

                        <div className="focusedBall">
                            <div>
                                {this.state.drawnBalls.length ? this.state.drawnBalls[this.state.drawnBalls.length - 1] : ' '}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        return <div className="gameContainer">{output}</div>;

        return (
            <div className="gameContainer">

                <div className="gameTitle">{name}</div>

                <div className="drawingLabel">
                    Drawing
                    <b> {drawAmount} </b> 
                    balls from 
                    <b> {drawMin} </b>
                    to
                    <b> {drawMax} </b>
                </div>


                <div className="drawFocusContainer">
                    <div className="drawFocusContainerLeft">
                        <div className="currentBallLabel">
                            Ball
                            {' ' + this.state.drawnBalls.length + ' '} 
                            of
                            {' ' + drawAmount}
                        </div>

                        <div 
                            className="nextBallBtn" 
                            onClick={this.drawBall}
                        >
                            <p>
                                {this.state.drawnBalls.length ? this.state.drawnBalls.length < drawAmount ? 'Next ball' : 'Extra ball' : 'Draw ball'}
                            </p>
                            
                            <Icon.Shuffle size={29} color="#2C2A26"/>
                            
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



export default Draw;