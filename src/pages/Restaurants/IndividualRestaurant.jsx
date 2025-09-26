import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShop, getShopInfo } from "../../utils.js";
import styles from "./IndividualRestaurant.module.css"; // ✅ Scoped CSS

const IndividualRestaurant = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(undefined);
  const navigate = useNavigate();
  const [shopInfo, setShopInfo] = useState(undefined);

  // Redirect if shop not found
  useEffect(() => {
    if (shop === null) navigate("/404");
  }, [navigate, shop]);

  // Fetch shop details
  useEffect(() => {
    getShop(shopId).then((s) => setShop(s)).catch(console.error);
  }, [shopId]);

  useEffect(() => {
    getShopInfo(shopId).then((s) => setShopInfo(s)).catch(console.error);
  }, [shopId]);

  if (!shopInfo) {
    return <h2 className={styles.loading}>Loading restaurant...</h2>;
  }

  return (
    <div className={styles.restaurantPage}>
      {/* Banner */}
      <div
        className={styles.restaurantBanner}
        style={{ backgroundImage: `url(${shopInfo.bannerUrl})` }}
      >
        <div className={styles.restaurantOverlay}>
          <img
            src={shopInfo.iconUrl}
            alt={shopInfo.name}
            className={styles.restaurantIcon}
          />
          <div>
            <h1 className={styles.restaurantTitle}>{shopInfo.name}</h1>
            <p className={styles.restaurantDesc}>{shopInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Extra Images Gallery */}
      {shopInfo.extraImages && shopInfo.extraImages.length > 0 && (
        <div className={styles.restaurantGallery}>
          <h2>Gallery</h2>
          <div className={styles.galleryGrid}>
            {shopInfo.extraImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`extra-${idx}`}
                className={styles.galleryImg}
              />
            ))}
          </div>
        </div>
      )}

      {/* Menu Button */}
      <div className={styles.restaurantActions}>
        <button className={styles.viewMenuBtn}>View Menu</button>
      </div>
    </div>
  );
};

export default IndividualRestaurant;
