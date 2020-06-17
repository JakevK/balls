/* SelectGameType.js
 * exports component SelectGameType
 * allows the user to select a game type
 * then redirects to start a game of that type
*/



// external imports
import React from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-feather";



/* SelectGameType
 * loads game presets from storage
 * and presets them for the user to make a selection
 * in order to start a game of that type
 * takes no props
*/
class SelectGameType extends React.Component {
    constructor(props) {
        super(props);

        // initialize state
        this.state = {
            // for handling errors in retrieving from storage
            error: null,
            // bool to show if data has loaded from storage
            isLoaded: false,
            // array to store the game presets once loaded
            presets: [],
        }
    }


    // runs once when the component mounts
    componentDidMount() {
        // send get request to presets endpoint of storage api
        fetch('/storage/presets')
            .then(result => result.json())
            .then(
                // update state with retrieved data and set status to loaded
                (result) => {
                    this.setState({
                        isLoaded: true,
                        presets: result.presets
                    });
                },

                // handle an error in retrieving the data
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    

    render() {
        // store state values in variables to reduce repetition of this.state
        const { error, isLoaded, presets } = this.state;


        // an error occurred in retrieving the presets data
        if (error) {
            // return an error message
            return <div>Error: {error}</div>
        }


        // presets data has not been loaded yet
        else if (!isLoaded) {
            // display loading message
            return (
                <div className="menuContainer">
                    <div className="menuHeader">
                        Loading presets...
                    </div>
                </div>
            );
        }


        // presets data has been successfully loaded
        else {
            // display a list of options
            return (
                <div className="menuContainer">
                    <div className="menuTitle">Select a game type</div>

                    <div className="menuList">
                        {/* map retrieved presets into renderable links 
                          * to start a game with those presets
                        */}
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

                        {/* add a link to the /custom route
                          * for the creation of a custom game 
                        */}
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



// export the component so it can be imported elsewhere
export default SelectGameType;