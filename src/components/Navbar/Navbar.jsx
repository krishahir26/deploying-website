import React from 'react'
import "./Navbar.css"
import logo from "../../assets/logo.gif"
import svg from "../../assets/react.svg"
import User from "../User/User";

const Navbar = () => {
    return (
        <div className='navbar'>
            <img src={logo} alt="Logo" className='logo'/>
            <div className="navbar-right">
                <img src={svg} alt="ts for search"/>
                <div className="navbar-search">
                    <img src={svg} alt="basket ts"/>
                    <div className='dot'></div>
                </div>
                <User/>
            </div>
        </div>
    )
}

export default Navbar