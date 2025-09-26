import "./Restaurants.css";
import { useEffect, useState } from "react";
import { getAllShopInfo } from "../../utils.js";
import { Link } from "react-router-dom";

const Restaurants = () => {
  const [shopInfos, setShopInfos] = useState(undefined);

  useEffect(() => {
    if (shopInfos) return;
    getAllShopInfo()
      .then((res) => setShopInfos(res))
      .catch(console.error);
  }, [shopInfos]);

  if (!shopInfos) return <h1 className="loading">Loading...</h1>;

  if (shopInfos.length === 0) {
    return (
      <div className="restaurants no-data">
        <h2>No restaurants found!</h2>
      </div>
    );
  }

  return (
    <div className="restaurants">
      <h1 className="restaurants-title">Available Restaurants</h1>
      <div className="restaurants-grid">
        {shopInfos.map((shop) => (
          <div className="restaurant-card" key={shop.shop_id}>
            <div className="restaurant-image">
              <img src={shop.iconUrl} alt={shop.name} />
              <div className="restaurant-overlay">
                <h2 className="restaurant-name">{shop.name}</h2>
              </div>
            </div>
            <div className="restaurant-content">
              <p className="restaurant-desc">{shop.description}</p>
              <Link to={`/restaurants/${shop.shop_id}`} className="view-menu-btn">
                View Menu
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
