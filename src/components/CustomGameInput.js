/* CustomGameInput.js
 * exports component CustomGameInput
 * allows the user to input settings for a custom game
 * then redirects to start the custom game
*/



// external imports
import React from "react";
import { Redirect } from "react-router-dom";
import * as Icon from "react-feather";



/* CustomGameInput
 * takes no props
*/
class CustomGameInput extends React.Component {
    constructor(props) {
        super(props);

        // initialize state
        this.state = {
            // title/display name for the game
            title: "",
            // number of balls to be drawn
            drawAmount: "",
            // minimum of range from which balls will be drawn
            drawMin: "",
            // maximum of range from which balls will be drawn
            drawMax: "",
            // bool for whether or not the preferences should be saved as a preset
            save: 0,
            // will be populated with props to pass on through
            // a redirect to the draw component when submitted
            submit: null,
            // error message to be displayed as feedback
            errorMsg: ""
        }
    }



    /* updateSetting()
     * takes parameters of:
     *     event:   the user event that triggered the function
     *     setting: the key of the setting in state to change (string)
     *     type:    data type of input - "int", "str" or "toggle"
    */
    updateSetting = (event, setting, type="str") => {
        // use the given type to convert the event data into the correct form
        const value = {
            // convert to a number
            "int": Number,
            // convert to a string
            "str": String,
            // toggle an existing boolean
            "toggle": () => !this.state[setting]
        }[type](event.target.value);

        // update the state with the new value
        this.setState({
            [setting]: value
        })
    }


    /* checkForErrors()
     * checks the settings stored in state are valid
     * returns a string of user feedback
     * pertaining to the most relevant error
     * or null if no error is found
     * takes no parameters
    */
    checkForErrors = () => {
        // validation rules to specify valid ranges for values
        const validation = {
            // key corresponds to key of the same setting in the component state
            title: {
                // name of input to display in error message
                name: "title",
                // additional string to add to range errors
                additional: " characters long",
                // function to return the value to measure/compare against range
                value: (a) => a.length,
                // minimum acceptable value
                min: 3,
                // maximum acceptable value
                max: 40
            },
            drawAmount: {
                name: "amount to draw",
                min: 1,
                max: 100
            },
            drawMin: {
                name: "\"from\" value",
                min: 1,
                max: 100
            },
            drawMax: {
                name: "\"to\" value",
                min: 1,
                max: 100
            }
        }


        // check for empty fields
        for (let key in validation) {
            if (!this.state[key]) {
                return "Please enter a value for the " + validation[key].name + "."
            }
        }

        // check for values outside of the acceptable range
        for (let key in validation) {
            const item = validation[key];
            const value = "value" in item ? item.value(this.state[key]) : this.state[key];

            if (value < item.min || value > item.max) {
                const additional = "additional" in item ? item.additional : "";
                return "The " + item.name + " must be between " + item.min + " and " + item.max + additional + ".";
            }
        }

        // check that maximum is greater than minimum
        if (this.state.drawMin > this.state.drawMax) {
            return "The \"from\" value cannot be greater than the \"to\" value.";
        }
        // check that the amount to draw is not too high for the range specified
        if (this.state.drawAmount > this.state.drawMax - this.state.drawMin - 1) {
            return "The amount to draw is too high.";
        }


        // no errors were found
        return null;
    }



    /* handleSubmit()
     * triggered when the user submits the form
     * checks for errors, saves preset and sets redirect status accordingly
     * takes no parameters
    */
    handleSubmit = () => {
        // check for errors
        const error = this.checkForErrors();

        if (error) {
            // update the error message in component state
            this.setState({
                errorMsg: error
            });
            // don't run the rest of the function
            return;
        }


        // the settings to be saved and/or used to play
        const settings = {
            name: this.state.title,
            drawAmount: this.state.drawAmount,
            drawMin: this.state.drawMin,
            drawMax: this.state.drawMax
        }

        // write the new custom presets to storage
        if (this.state.save) {
            // get existing presets
            fetch('/storage/presets')
                .then(result => result.json())
                .then(
                    (result) => {
                        // post modified presets to storage api
                        fetch("/storage/presets", {
                            method : "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                presets: [
                                    ...result.presets,
                                    settings
                                ]
                            })
                        })
                    }
                )
        }


        // it's time to redirect to /play to start the game!
        this.setState({
            submit: settings
        })
    }



    render() {
        // store state values in variables to reduce repetition of this.state
        const {
            title,
            drawAmount, 
            drawMin, 
            drawMax, 
            save, 
            submit, 
            errorMsg
        } = this.state;


        // The form has been successfully submitted
        if (submit) {
            // redirect to the /play route, passing the submitted settings as props
            return <Redirect 
                to={{
                    pathname: "/play",
                    state: {
                        settings: submit
                    }
                }}
                push
            />
        }


        // return the form
        return (
            <div className="menuContainer">
                <div className="menuTitle">Custom game</div>
                <p>
                    Title: 
                    <input 
                        className="titleInput"
                        type="text" 
                        value={title}
                        onChange={(event) => this.updateSetting(event, "title")}
                    />
                </p>

                <p>
                    Draw
                    <input 
                        className="numberInput"
                        type="number" 
                        value={drawAmount}
                        onChange={(event) => this.updateSetting(event, "drawAmount", "int")}
                        min="1"
                        max={drawMax && drawMin ? drawMax - drawMin : 100}
                    />
                    balls from
                    <input 
                        className="numberInput"
                        type="number" 
                        value={drawMin}
                        onChange={(event) => this.updateSetting(event, "drawMin", "int")}
                        min="1"
                        max={drawMax - 1 || 100}
                    />
                    to
                    <input 
                        className="numberInput"
                        type="number" 
                        value={drawMax}
                        onChange={(event) => this.updateSetting(event, "drawMax", "int")}
                        min={drawMin + 1 || 1}
                        max="100"
                    />
                </p>

                <div 
                    onClick={(event) => this.updateSetting(event, "save", "toggle")}
                    className="checkInput"
                >
                    {save ? <Icon.CheckSquare/> : <Icon.Square/>}
                    Save as preset
                </div>

                <div className="errorMsg">
                    {errorMsg}
                </div>


                <div
                    className="nextBallBtn"
                    onClick={this.handleSubmit}
                >
                    <p>
                        Start
                    </p>
                    <Icon.Play size={29} color="#2C2A26"/>
                </div>
            </div>
        );
    }
}



// export the component so it can be imported elsewhere
export default CustomGameInput;