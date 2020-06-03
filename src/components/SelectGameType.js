import React from "react";
import { Redirect } from "react-router-dom"



class SelectGameType extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            presets: [],
            redirect: null
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
                    });
                }
            );
    }

    

    render() {
        const { error, isLoaded, presets, redirect } = this.state;

        
        if (error) {
            return <div>Error: {error}</div>
        }

        else if (!isLoaded) {
            return <div>Loading presets...</div>
        }

        else if (redirect) {
            return <Redirect to={redirect} push/>
        }


        else {
            return (
                <div>
                    <h3>Select a game type</h3>

                    {presets.map((preset) =>
                        <button 
                            key={preset.name} 
                            onClick={() => 
                                this.props.submit(preset)
                            }
                        >

                            {preset.name}
                        </button>
                    )}
                    <button onClick={() => this.setState({redirect: "/custom"})}>
                        Custom game
                    </button>
                </div>
            )
        }
    }
}



export default SelectGameType;