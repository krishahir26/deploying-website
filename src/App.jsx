import React from "react"
import Navbar from "./components/Navbar/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home/Home"
import Restaurants from "./pages/Restaurants/Restaurants"
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";

function App() {
    return (
        <>
            <div className='app'>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/restaurants" element={<Restaurants/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                </Routes>
            </div>
        </>
    )
}

export default App
