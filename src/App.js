import React from "react";
import "./App.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import Draw from "./components/Draw"
import SelectGameType from "./components/SelectGameType"
import CustomGameInput from "./components/CustomGameInput"
import Menu from "./components/Menu"
import MenuBtn from "./components/MenuBtn"



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


            <Route path="/" exact>
                <Menu />
            </Route>

            <Route path="/">
                <MenuBtn/>
                404: page not found
            </Route>

        </Switch>
    </Router>
  );
}

