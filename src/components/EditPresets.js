/* EditPresets.js
 * exports component EditPresets
 * displays an interface for editing, saving and deleting game presets
*/



// external imports
import React from "react";
import * as Icon from "react-feather";



/* EditPresets
 * takes no props
*/
class EditPresets extends React.Component {
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
            // preset currently being edited
            currentPreset: null,
            // index of preset currently being edited
            currentPresetIndex: null,
            // error message/feedback to be displayed on invalid input
            errorMsg: ""
        }
    }



    /* loadPresets()
     * retreieves preset games from storage and updates state accordingly
     * takes no parameters
     * doesn't return anything
    */
    loadPresets = () => {
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


    // runs once when the component mounts
    componentDidMount() {
        this.loadPresets();
    }


    /* updatePreset()
     * updates the currentPreset in state with values from an input
     * takes parameters of:
     *     event:   the user event that triggered the function
     *     setting: the key of this setting to changetate
     *     type:    data type of input - "int" or "str"
    */
    updatePreset = (event, setting, type="str") => {
        // use the given type to convert the event data into the correct form
        const value = {
            // convert to a number
            "int": Number,
            // convert to a string
            "str": String,

        }[type](event.target.value);

        // update the state with the new value
        let updatedPreset = {...this.state.currentPreset};
        updatedPreset[setting] = value;

        this.setState({
            currentPreset: updatedPreset
        })
    }

    
    /* checkForErrors()
     * checks that the settings of the currentPreset in state are valid
     * returns a string of user feedback
     * pertaining to the most relevant error
     * or null if no error is found
     * takes no parameters
    */
    checkForErrors = () => {
        // validation rules to specify valid ranges for values
        const validation = {
            // key corresponds to key of the same setting in the component state
            name: {
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
            if (!this.state.currentPreset[key]) {
                return "Please enter a value for the " + validation[key].name + "."
            }
        }

        // check for values outside of the acceptable range
        for (let key in validation) {
            const item = validation[key];
            const value = "value" in item ? item.value(this.state.currentPreset[key]) : this.state.currentPreset[key];

            if (value < item.min || value > item.max) {
                const additional = "additional" in item ? item.additional : "";
                return "The " + item.name + " must be between " + item.min + " and " + item.max + additional + ".";
            }
        }

        // check that maximum is greater than minimum
        if (this.state.currentPreset.drawMin > this.state.currentPreset.drawMax) {
            return "The \"from\" value cannot be greater than the \"to\" value.";
        }
        // check that the amount to draw is not too high for the range specified
        if (this.state.currentPreset.drawAmount > this.state.currentPreset.drawMax - this.state.currentPreset.drawMin + 1) {
            return "The amount to draw is too high.";
        }


        // no errors were found
        return null;
    }


    /* savePreset()
     * updates the presets in state with the currentPreset
     * then saves the updated presets with the storage api
     * takes no parameters
    */
    savePreset = () => {
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
        else {
            // no errors: no error message to display
            this.setState({errorMsg: ""});
        }


        // make a copy of the presets from state
        let newPresetsList = [...this.state.presets];
        const insertionIndex = this.state.currentPresetIndex;
        
        if (insertionIndex === null) {
            // preset needs to be added to the preset list
            newPresetsList.push(this.state.currentPreset);
            this.setState({currentPresetIndex: newPresetsList.length - 1})
        }
        else {
            // preset already exists in preset list
            // update the exisiting value
            newPresetsList[insertionIndex] = this.state.currentPreset;
        }

        // send post request to presets endpoint of storage api with presets to be saved
        fetch("/storage/presets", {
            method : "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                presets: newPresetsList
            })
        })
        // update the component with presets
        this.loadPresets();

    }


    /* deletePreset()
     * removes the currentPreset in state from the presets
     * then saves the updated presets with the storage api
     * takes no parameters
    */
    deletePreset = () => {
        if (!this.state.currentPresetIndex) {
            // current preset has not been added to presets list in state
            // no need to modify presets list or storage, only the current preset
            this.setState({
                currentPreset: null
            });
        }
        else {
            // create new list from presets
            let newPresetList = [...this.state.presets];
            // remove the current preset from this list
            newPresetList.splice(this.state.currentPresetIndex, 1);
            
            // update state with the updates presets
            this.setState({
                presets: newPresetList,
                // currentPreset and currentPresetIndex shouldn't exist anymore
                currentPreset: null,
                currentPresetIndex: null
            });

            // post updated presets to storage api
            fetch("/storage/presets", {
                method : "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    presets: newPresetList
                })
            })
            this.loadPresets();
        }

    }



    render() {
        // store state values in variables to reduce repetition of this.state
        const { error, isLoaded, presets, currentPreset, currentPresetIndex, errorMsg } = this.state;


        // an error occurred in retrieving the presets data
        if (error) {
            // return an error message
            return <div>Error: {error}</div>
        }


        // presets data has not been loaded yet
        if (!isLoaded) {
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
        let display = [
            <div key="floatingMenu" className={currentPreset ? "leftFloat" : ""}>
                <div className={"menuContainer"}>
                    <div className="menuTitle">Presets</div>
                    
                    <div className="menuList">
                        {presets.map((preset, i) =>
                            <div
                                className="menuItem"
                                key={preset.name}
                                onClick={() => {
                                    if (i !== this.state.currentPresetIndex) {
                                        this.setState({
                                            currentPreset: {...preset},
                                            currentPresetIndex: i
                                        });
                                    }
                                }}
                            >
                                {currentPresetIndex === i ? <Icon.CheckCircle color="#2C2A26"/> : <Icon.Circle color="#2C2A26"/>}
                                {preset.name}
                            </div>
                        )}
                        <div
                            className="menuItem"
                            key="new"
                            onClick={() => {
                                //let newPresetsList = [...this.state.presets];
                                const newPreset = {
                                    "drawAmount": "",
                                    "drawMax": "",
                                    "drawMin": "",
                                    "name": ""
                                }
                                //newPresetsList.push(newPreset);

                                this.setState({
                                    //presets: newPresetsList,
                                    currentPresetIndex: null,//newPresetsList.length - 1,
                                    currentPreset: newPreset
                                });


                            }}
                        >
                            <Icon.Plus color="#2C2A26"/>
                            New preset
                        </div>
                    </div>
                </div>
            </div>
        ];


        // check if a preset is currently open for editing
        if (currentPreset) {
            // store state values in variables to reduce repetition of this.state
            const { name, drawAmount, drawMin, drawMax } = this.state.currentPreset;

            // add a form for editing preset values to the display
            display.push(
                <div key="editor" className="menuContainer rightFloat">
                    <p>
                        Title: 
                        <input 
                            className="titleInput"
                            type="text" 
                            value={name}
                            onChange={(event) => this.updatePreset(event, "name")}
                        />
                    </p>

                    <p>
                        Draw
                        <input 
                            className="numberInput"
                            type="number" 
                            value={drawAmount}
                            onChange={(event) => this.updatePreset(event, "drawAmount", "int")}
                            min="1"
                            max={drawMax && drawMin ? drawMax - drawMin : 100}
                        />
                        balls from
                        <input 
                            className="numberInput"
                            type="number" 
                            value={drawMin}
                            onChange={(event) => this.updatePreset(event, "drawMin", "int")}
                            min="1"
                            max={drawMax - 1 || 100}
                        />
                        to
                        <input 
                            className="numberInput"
                            type="number" 
                            value={drawMax}
                            onChange={(event) => this.updatePreset(event, "drawMax", "int")}
                            min={drawMin + 1 || 1}
                            max="100"
                        />
                    </p>

                    <div className="errorMsg">
                        {errorMsg}
                    </div>


                    <div
                        className="nextBallBtn leftFloat"
                        onClick={this.savePreset}
                    >
                        <p>
                            Save
                        </p>
                        <Icon.Save size={29} color="#2C2A26"/>
                    </div>

                    
                    <div
                        className="nextBallBtn rightFloatBtn"
                        onClick={this.deletePreset}
                    >
                        <p>
                            Delete
                        </p>
                        <Icon.Trash size={29} color="#2C2A26"/>
                    </div>
                </div>
            )
        }


        // return everything that has been added to the display to be rendered
        return display;
    }
}



// export the component so it can be imported elsewhere
export default EditPresets;