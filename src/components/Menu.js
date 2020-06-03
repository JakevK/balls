import React from "react";
import * as Icon from "react-feather";
import { Link } from "react-router-dom"



function Menu() {
    return (
        <div className="menuList">
            <Link to="/select-game" className="menuItem">
                <Icon.Play/>
                Start game
            </Link>
            
            <Link to="/presets" className="menuItem">
                <Icon.Sliders/>
                Edit presets
            </Link>
        </div>
    );
}



export default Menu;