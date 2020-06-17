/* Menu.js
 * exports component Menu
 * the main menu from which the program is navigated
*/



// external imports
import React from "react";
import * as Icon from "react-feather";
import { Link } from "react-router-dom"



/* Menu
 * displays links to different parts of the app
 * takes no props
*/
function Menu() {
    return (
        <div className="menuContainer">
            {/* Header/main title */}
            <div className="menuHeader">
                Balls.
            </div>

            {/* List of links */}
            <div className="menuList">
                {/* link for beginning the game setup process */}
                <Link to="/select-game" className="menuItem">
                    <Icon.Play size={25}/>
                    Start game
                </Link>
                
                {/* link for editing presets */}
                <Link to="/presets" className="menuItem">
                    <Icon.Sliders size={25}/>
                    Edit presets
                </Link>
            </div>
        </div>
    );
}



// export the component so it can be imported elsewhere
export default Menu;