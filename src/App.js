/* App.js
 * The main file to be run
 * connects everything together with routing
*/



// external imports
import React from "react";
import "./App.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

// import components from ./components
import Draw from "./components/Draw";
import SelectGameType from "./components/SelectGameType";
import CustomGameInput from "./components/CustomGameInput";
import Menu from "./components/Menu";
import MenuBtn from "./components/MenuBtn";
import EditPresets from "./components/EditPresets";



/* App
 * main app component to be rendered
*/
export default function App() {
  return (
    // react router
    <Router>
        <Switch>

            {/* /play
              * route for playing a game 
              * renders the Draw component 
              * with props passed through a redirect component
            */}
            <Route path="/play" exact 
                render={
                    (props) => ( 
                        <div>
                            <MenuBtn/>
                            <Draw settings={props.location.state.settings}/>
                        </div>
                    )
                }
            />


            {/* /select-game
              * route for selecting a game type
              * renders the SelectGameType component
            */}
            <Route path="/select-game" exact>
                <MenuBtn/>
                <SelectGameType/>
            </Route>


            {/* /custom
              * route for creating a custom game
              * renders the CustomGameInput component
            */}
            <Route path="/custom" exact>
                <MenuBtn/>
                <CustomGameInput/>
            </Route>

            
            {/* /presets
              * route for editing preset game configurations
              * renders the EditPresets component
            */}
            <Route path="/presets" exact>
                <MenuBtn/>
                <EditPresets/>
            </Route>


            {/* /
              * route for the home page / main menu
              * renders the Menu component
              * no MenuBtn component is needed here
            */}
            <Route path="/" exact>
                <Menu />
            </Route>


            {/* 404 page
              * matches with any path that hasn't been specified
              * renders a simple 404 message
            */}
            <Route path="/">
                <MenuBtn/>
                <div className="menuContainer">
                    <div className="menuHeader">
                        404: not found
                    </div>
                </div>
            </Route>

        </Switch>
    </Router>
  );
}

