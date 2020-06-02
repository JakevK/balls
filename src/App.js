import React from "react";
import "./App.css";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

import Draw from "./components/Draw"
import SelectGameType from "./components/SelectGameType"
import CustomGameInput from "./components/CustomGameInput"



export default function App() {
  return (
    <Router>
        <Switch>

            <Route path="/play" 
                render={
                    (props) => 
                        <Draw settings={props.location.state.settings}/>
                }
            />


            <Route path="/preset-game">
                <GameSetup form={SelectGameType} />
            </Route>

            <Route path="/custom-game">
                <GameSetup form={CustomGameInput} />
            </Route>


            <Route path="/">
                <Menu />
            </Route>

        </Switch>
    </Router>
  );
}



function Menu() {
    return (
        <div>
            <Link to="/preset-game">Preset game</Link>
            <Link to="/custom-game">Custom game</Link>
        </div>
    );
}




class GameSetup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            complete: false,
            settings: {}
        };
    }


    setRedirect = (settings) => {
        this.setState({
            complete: true,
            settings: settings
        });
    }


    render() {
        if (this.state.complete) {
            return <Redirect 
                to={{
                    pathname: '/play',
                    state: {
                        settings: this.state.settings
                    }
                }}
                push
            />
        }

        const Form = this.props.form;

        return <Form submit={this.setRedirect}/>
    }
}