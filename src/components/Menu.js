import React from "react";
import * as Icon from "react-feather";
import { Link } from "react-router-dom"



function Menu() {
    return (
        <div className="menuContainer">
            <div className="menuHeader">
                Balls.
            </div>

            <div className="menuList">
                <Link to="/select-game" className="menuItem">
                    <Icon.Play size={25}/>
                    Start game
                </Link>
                
                <Link to="/presets" className="menuItem">
                    <Icon.Sliders size={25}/>
                    Edit presets
                </Link>
            </div>
        </div>
    );
}



export default Menu;