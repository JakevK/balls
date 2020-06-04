import React from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-feather";



class SelectGameType extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            isLoaded: false,
            presets: [],
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
        const { error, isLoaded, presets } = this.state;

        
        if (error) {
            return <div>Error: {error}</div>
        }

        else if (!isLoaded) {
            return (
                <div className="menuContainer">
                    <div className="menuHeader">
                        Loading presets...
                    </div>
                </div>
            );
        }



        else {
            return (
                <div className="menuContainer">
                    <div className="menuTitle">Select a game type</div>

                    <div className="menuList">
                        {presets.map((preset) =>
                            <Link
                                className="menuItem" 
                                key={preset.name} 
                                to={{
                                    pathname: "/play",
                                    state: {
                                        settings: preset
                                    }
                                }}
                            >
                                <Icon.ChevronRight color="#2C2A26"/>
                                {preset.name}
                            </Link>
                        )}

                        <Link
                            className="menuItem"
                            to="/custom"
                        >
                            <Icon.AlignLeft color="#2C2A26"/>
                            Custom game
                        </Link>
                    </div>
                </div>
            )
        }
    }
}



export default SelectGameType;