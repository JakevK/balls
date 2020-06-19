/* Draw.js
 * exports component Draw
 * plays a random ball drawing game 
 * uses specified settings passed in as props
*/



// external imports
import React from "react";
import * as Icon from "react-feather";



/* Draw
 * takes props of:
 *     settings:
 *         name:       a title given to the game
 *         drawAmount: number of balls to be selected (before extras)
 *         drawMin:    minimum of range from which balls are drawn
 *         drawMax:    maximum of range from which balls are drawn
*/
class Draw extends React.Component {
    constructor(props) {
        super(props);
        
        // read the props
        const { drawMax, drawMin } = this.props.settings;

        // initialize state
        this.state = {
            // fill array with numbers from drawMin to drawMax
            remainingBalls: Array(drawMax + 1 - drawMin)
                .fill(drawMin)
                .map((x, y) => x + y),
            // will be filled with numbers of balls that have been drawn
            drawnBalls: [],
            // whether or not to finish the game and only review drawn balls
            review: false
       }
    }


    /* drawBall()
     * draws a random ball
     * takes no parameters
    */
    drawBall = () => {
        // generate random index from the remainingBalls array
        const ballIndex = Math.floor(Math.random() * this.state.remainingBalls.length);
        
        // check that there are still some remaining balls
        if (this.state.remainingBalls.length) {
            // update state
            this.setState({
                // remove the index ballIndex from remainingBalls
                remainingBalls: this.state.remainingBalls.filter((a, i) => i !== ballIndex),
                // append the value removed from remainingBalls to drawnBalls
                drawnBalls: [...this.state.drawnBalls, this.state.remainingBalls[ballIndex]]
            });
        }
    }



    render() {
        // store state values in variables ot reduce repetition of this.state
        const { name, drawAmount, drawMax, drawMin } = this.props.settings;

        // create an array to store output, starting with the title
        let output = [<div key="title" className="gameTitle">{name}</div>];


        if (!this.state.review) {
            // add the content for drawing more balls to the output array
            output.push(
                <div key="no review">
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

                            { /* change the button for drawing balls to
                               * one for finishing the game and reviewing
                               * if there are no more balls to draw 
                              */
                                this.state.remainingBalls.length ? (
                                    <div 
                                        className="nextBallBtn" 
                                        onClick={this.drawBall}
                                    >
                                        <p>
                                            {/* customize the button message based on game progress */}
                                            {
                                                this.state.drawnBalls.length ? 
                                                    this.state.drawnBalls.length < drawAmount ? 
                                                        'Next ball' : 
                                                        'Extra ball' : 
                                                        'Draw ball'}
                                        </p>
                                        
                                        <Icon.Shuffle size={29} color="#2C2A26"/>
                                        
                                    </div>
                                ) : (
                                    <div
                                        className="nextBallBtn noIconBtn"
                                        onClick={() => 
                                            //change state to enter review mode
                                            this.setState({
                                                review: true
                                            })
                                        }
                                    >
                                        <p>
                                            Finish game
                                        </p>
                                    </div>
                                )
                            }
                        </div>

                        <div className="focusedBall">
                            <div>
                                {this.state.drawnBalls.length ? 
                                    this.state.drawnBalls[this.state.drawnBalls.length - 1] : ' '
                                }
                            </div>
                        </div>
                    </div>

                    {   /* display a "Finish game" button
                         * if one hasn't been added earlier
                        */
                        this.state.remainingBalls.length ? (
                            <div
                                className="nextBallBtn noIconBtn"
                                onClick={() => 
                                    //change state to enter review mode
                                    this.setState({
                                        review: true
                                    })
                                }
                            >
                                <p>
                                    Finish game
                                </p>
                            </div>
                        ) : ""
                    }

                    <div className="drawnBallsLabel">
                        {/* add a heading to the review if there are drawn balls to review */}
                        {this.state.drawnBalls.length > 1 ? "Previously drawn balls..." : ""}
                    </div>
                </div>
            );
        }

        else {
            // add the titles for only reviewing balls to the content
            output.push(
                <div key="review">
                    <div className="drawingLabel">
                        {!this.state.remainingBalls.length ? "All " : ""}
                        <b>{this.state.drawnBalls.length} </b>
                        balls were drawn from
                        <b> {drawMin} </b>
                        to
                        <b> {drawMax} </b>
                    </div>
                    <div className="drawnBallsLabel">
                        Drawn balls...
                    </div>
                </div>
            );
        }



        // add a review of all drawn balls to the content
        output.push(
            <div key="drawn" className="drawnBallsContainer">
                {
                    this.state.drawnBalls
                        .slice(
                            0, 
                            this.state.drawnBalls.length - (this.state.review ? 0 : 1)
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
        );


        // render everything added to output
        return <div className="gameContainer">{output}</div>;

    }
}



// export the component so it can be imported elsewhere
export default Draw;