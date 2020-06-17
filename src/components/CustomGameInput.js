import React from "react";
import { Redirect } from "react-router-dom";
import * as Icon from "react-feather";



class CustomGameInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            drawAmount: "",
            drawMin: "",
            drawMax: "",
            save: 0,
            submit: null,
            errorMsg: ""
        }
    }


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

    checkForErrors = () => {
        const validation = {
            title: {
                name: "title",
                additional: " characters long",
                value: (a) => a.length,
                min: 3,
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

        for (let key in validation) {
            if (!this.state[key]) {
                return "Please enter a value for the " + validation[key].name + "."
            }
        }
        for (let key in validation) {
            const item = validation[key];
            const value = "value" in item ? item.value(this.state[key]) : this.state[key];

            if (value < item.min || value > item.max) {
                const additional = "additional" in item ? item.additional : "";
                return "The " + item.name + " must be between " + item.min + " and " + item.max + additional + ".";
            }
        }

        if (this.state.drawMin > this.state.drawMax) {
            return "The \"from\" value cannot be greater than the \"to\" value.";
        }
        if (this.state.drawAmount > this.state.drawMax - this.state.drawMin - 1) {
            return "The amount to draw is too high.";
        }

    }



    handleSubmit = () => {

        const error = this.checkForErrors();
        if (error) {
            // update the error message in component state
            this.setState({
                errorMsg: error
            });
            // don't run the rest of the function
            return;
        }

        const settings = {
            name: this.state.title,
            drawAmount: this.state.drawAmount,
            drawMin: this.state.drawMin,
            drawMax: this.state.drawMax
        }

        if (this.state.save) {
            // write the new custom presets to storage
            fetch('/storage/presets')
                .then(result => result.json())
                .then(
                    (result) => {
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

        this.setState({
            submit: settings
        })
    }


    render() {
        const {
            title,
            drawAmount, 
            drawMin, 
            drawMax, 
            save, 
            submit, 
            errorMsg
        } = this.state;

        if (submit) {
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



export default CustomGameInput;