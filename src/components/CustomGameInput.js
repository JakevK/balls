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
            submit: null
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
        if (this.state.submit) {
            return <Redirect 
                to={{
                    pathname: "/play",
                    state: {
                        settings: this.state.submit
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
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                    />
                </p>

                <p>
                    Draw
                    <input 
                        className="numberInput"
                        type="number" 
                        value={this.state.drawAmount}
                        onChange={this.handleDrawAmountChange}
                    />
                    balls from
                    <input 
                        className="numberInput"
                        type="number" 
                        value={this.state.drawMin}
                        onChange={this.handleDrawMinChange}
                    />
                    to
                    <input 
                        className="numberInput"
                        type="number" 
                        value={this.state.drawMax}
                        onChange={this.handleDrawMaxChange}
                    />
                </p>

                <div 
                    onClick={this.handleChangeSave}
                    className="checkInput"
                >
                    {this.state.save ? <Icon.CheckSquare/> : <Icon.Square/>}
                    Save as preset
                </div>

                <br/>
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