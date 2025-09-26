import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Home, Search, User as UserIcon, ShoppingCart } from "lucide-react";
import { supabaseClient } from "../../utils.js"; // Make sure this is correctly exported

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const toggleSearch = () => setSearchOpen(true);
  const toggleProfile = () => setProfileOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(e.target) &&
      searchText.trim() === ""
    ) {
      setSearchOpen(false);
    }

    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchText]);

 const handleLogout = async () => {
  const { error } = await supabaseClient.auth.signOut();
  
  if (error) {
    console.error("Logout failed:", error.message);
    return;
  }

  setProfileOpen(false);
  navigate("/login", { replace: true });
};


  const hideNavbarRoutes = ["/login", "/vendor-login", "/admin-login" ];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        <div
          className={`navbar-search-container ${searchOpen ? "active" : ""}`}
          ref={searchRef}
        >
          <input
            type="text"
            placeholder="Search..."
            className={searchOpen ? "input-active" : ""}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Search
            className={`icon search-icon ${searchOpen ? "active-icon" : ""}`}
            onClick={toggleSearch}
            title="Search"
          />
        </div>

        <Home className="icon" title="Home" onClick={() => navigate("/")} />
        <ShoppingCart className="icon" title="Cart" onClick={() => navigate("/cart")} />

        <div className="profile-container" ref={profileRef}>
          <UserIcon
            className={`icon profile-icon ${profileOpen ? "active-icon" : ""}`}
            onClick={toggleProfile}
            title="Profile"
          />
          <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
            <ul>
              <li onClick={() => { navigate("/orders"); setProfileOpen(false); }}>Orders</li>
              <li onClick={() => { navigate("/profile"); setProfileOpen(false); }}>Profile</li>
              <li>
  <button className="logout-text" onClick={handleLogout}>
    Logout
  </button>
</li>

            </ul>
          </div>
        </div>
      </div>
    </nav>
  );   
};

export default Navbar;
