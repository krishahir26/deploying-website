import React from "react"
import Navbar from "./components/Navbar/Navbar"
import {Route, Routes} from "react-router-dom"
import Home from "./pages/Home/Home"
import Restaurants from "./pages/Restaurants/Restaurants"
import Login from "./pages/Login/Login";
import VendorLogin from "./pages/Login/VendorLogin";
import AdminLogin from "./pages/Login/AdminLogin";
import FourOhFour from "./pages/Error/404";
import Unauthorized from "./pages/Error/Unauthorized";
import Profile from "./pages/Profile/Profile";
import VendorProfile from "./pages/Profile/VendorProfile";
import AdminProfile from "./pages/Profile/AdminProfile";

function App() {
    return (
        <>
            <div className='app'>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>

                    <Route path="/login" element={<Login/>}/>
                    <Route path="/vendor-login" element={<VendorLogin/>}/>
                    <Route path="/admin-login" element={<AdminLogin/>}/>

                    <Route path="/restaurants" element={<Restaurants/>}/>

                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/vendor-profile" element={<VendorProfile/>}/>
                    <Route path="/admin-profile" element={<AdminProfile/>}/>

                    <Route path="/unauthorized" element={<Unauthorized/>}/>
                    <Route path="*" element={<FourOhFour/>}/>
                </Routes>
            </div>
        </>
    )
}

export default App
