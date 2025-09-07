import React from 'react'
import "./Header.css"
import {Link} from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
          <h2>Order your favourite food here</h2>
          <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest chefs.</p>
          <button>
              <Link to="/restaurants">View Available Restaurants</Link>
          </button>
      </div>
    </div>
  )
}

export default Header