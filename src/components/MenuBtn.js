import React from "react";
import { Link } from "react-router-dom";
import * as Icon from "react-feather";



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



export default MenuBtn