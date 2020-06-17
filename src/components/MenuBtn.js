/* MenuBtn.js
 * exports the component MenuBtn
 * allows user to return to the main menu from anywhere in one click
*/



// external imports
import React from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-feather";



/* MenuBtn
 * displays a button/link
 * when clicked it returns the user to the "/" route
 * takes no props
*/
function MenuBtn() {
    return (
        <Link
            className="returnToMenuBtn"
            to="/"
        >
            <Icon.ArrowLeft color="#2C2A26" size={28}/>
            Return to menu
        </Link>
    );
}



// export the component so it can be imported elsewhere
export default MenuBtn