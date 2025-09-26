import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Home, Search, User as UserIcon, ShoppingCart, LogIn } from "lucide-react";
import { supabaseClient } from "../../utils.js";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

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

  // Check auth session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setUser(data?.session?.user ?? null);
    };

    getUser();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const hideNavbarRoutes = ["/login", "/vendor-login", "/admin-login", "/profile"];
  if (hideNavbarRoutes.includes(location.pathname)) return null;

  // Pages where Search, Home, Cart icons should disappear
  const hideIconsOnPages = ["/vendor-profile", "/admin-profile"];
  const showIcons = !hideIconsOnPages.includes(location.pathname);

  // Whether to show "Orders" option in dropdown
  const hideOrdersOnPages = ["/vendor-profile", "/admin-profile"];
  const showOrdersOption = !hideOrdersOnPages.includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>

      <div className="navbar-right">
        {showIcons && (
          <>
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
          </>
        )}

        {user ? (
          <div className="profile-container" ref={profileRef}>
            <UserIcon
              className={`icon profile-icon ${profileOpen ? "active-icon" : ""}`}
              onClick={toggleProfile}
              title="Profile"
            />
            <div className={`profile-dropdown ${profileOpen ? "open" : ""}`}>
              <ul>
                {showOrdersOption && (
                  <li
                    onClick={() => {
                      navigate("/orders");
                      setProfileOpen(false);
                    }}
                  >
                    Orders
                  </li>
                )}
                <li
                  onClick={() => {
                    navigate("/profile");
                    setProfileOpen(false);
                  }}
                >
                  Profile
                </li>
                <li>
                  <button className="logout-text" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <LogIn
            className="icon"
            title="Login"
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
