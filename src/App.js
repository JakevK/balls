import React from "react";
import "./App.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Draw from "./components/Draw";
import SelectGameType from "./components/SelectGameType";
import CustomGameInput from "./components/CustomGameInput";
import Menu from "./components/Menu";
import MenuBtn from "./components/MenuBtn";
import EditPresets from "./components/EditPresets";



export default function App() {
  return (
    <Router>
        <Switch>

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


            <Route path="/select-game" exact>
                <MenuBtn/>
                <SelectGameType/>
            </Route>

            <Route path="/custom" exact>
                <MenuBtn/>
                <CustomGameInput/>
            </Route>

            
            <Route path="/presets" exact>
                <MenuBtn/>
                <EditPresets/>
            </Route>


            <Route path="/" exact>
                <Menu />
            </Route>

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

