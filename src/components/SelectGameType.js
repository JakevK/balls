import React from "react";



class SelectGameType extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            presets: []
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
        const { error, isLoaded, presets, custom } = this.state;

        
        if (error) {
            return <div>Error: {error}</div>
        }

        else if (!isLoaded) {
            return <div>Loading presets...</div>
        }

        else if (custom) {

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
                </div>
            )
        }
    }
}



export default SelectGameType;