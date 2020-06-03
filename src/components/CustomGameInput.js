import React from "react";
import { Redirect } from "react-router-dom";



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



export default CustomGameInput;