import { useEffect, useState } from "react";
import { getMenuItems, sha256sum, supabaseClient } from "../../utils";
import "./VendorProfileWithShop.css";

function VendorProfileWithShop({ shopId, shopInfo }) {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [extraImages, setExtraImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editAvailable, setEditAvailable] = useState(true);
  const [editNonVeg, setEditNonVeg] = useState(false);
  const [editTime, setEditTime] = useState(0);

  // Fetch menu items and extra images
  useEffect(() => {
    if (!shopInfo) return;
    const menuId = shopInfo.menu_id || null;
    if (menuId) getMenuItems(menuId).then(setMenuItems).catch(console.error);
    if (shopInfo.extraImages) setExtraImages(shopInfo.extraImages);
  }, [shopInfo]);

  // Add new menu item
  const submitMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!shopInfo) throw new Error("Shop info not loaded");
      const form = new FormData(e.target);
      const menuId = shopInfo.menu_id || sha256sum(`${shopId}:menu`);
      const itemName = form.get("item-name");
      const itemPrice = parseFloat(form.get("item-price"));
      const itemAvailable = form.get("item-available") === "on";
      const itemNonVeg = form.get("item-non-veg") === "on";
      const itemTime = parseInt(form.get("item-time"));
      const itemId = `${shopId}:${itemName}:${Date.now()}`;

      const { error } = await supabaseClient.from("menu").insert({
        menu_id: menuId,
        item_id: itemId,
        item_name: itemName,
        price: itemPrice,
        available: itemAvailable,
        non_veg: itemNonVeg,
        time: itemTime,
      });
      if (error) throw error;

      if (!shopInfo.menu_id) {
        const { error: shopError } = await supabaseClient
          .from("shops")
          .update({ menu_id: menuId })
          .eq("shop_id", shopId);
        if (shopError) console.error(shopError);
      }

      const items = await getMenuItems(menuId);
      setMenuItems(items);
      e.target.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const deleteMenuItem = async (itemId) => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.from("menu").delete().eq("item_id", itemId);
      if (error) throw error;
      if (shopInfo?.menu_id) {
        const items = await getMenuItems(shopInfo.menu_id);
        setMenuItems(items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Save updated menu item
  const saveMenuItem = async (itemId) => {
    setLoading(true);
    try {
      const { error } = await supabaseClient
        .from("menu")
        .update({ price: editPrice, available: editAvailable, non_veg: editNonVeg, time: editTime })
        .eq("item_id", itemId);
      if (error) throw error;

      if (shopInfo?.menu_id) {
        const items = await getMenuItems(shopInfo.menu_id);
        setMenuItems(items);
      }
      setEditingItemId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const uploadedUrls = files.map((file) => URL.createObjectURL(file));
    setExtraImages((prev) => [...prev, ...uploadedUrls]);
  };

  if (!shopInfo) return <div>Loading shop info...</div>;

  const filteredMenuItems = menuItems.filter((item) =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vendor-profile-with-shop">
      {/* Shop Info */}
      <div className="vendor-shop">
        <h2>{shopInfo.name || "Shop Name"}</h2>
        {shopInfo.iconUrl && <img src={shopInfo.iconUrl} alt="shop icon" width={150} height={150} />}
        <p>{shopInfo.description || "Shop Description"}</p>
        {shopInfo.bannerUrl && <img src={shopInfo.bannerUrl} alt="shop banner" width={360} height={250} />}

        <label>
          Upload Extra Images:
          <input type="file" multiple accept="image/*" onChange={handleExtraImages} />
        </label>
        <div className="extra-images">
          {extraImages.map((url, idx) => (
            <img key={idx} src={url} alt={`extra ${idx}`} width={100} height={100} />
          ))}
        </div>
      </div>

      {/* Add Menu Item */}
      <div className="vendor-menu-setup">
        <form className="menu-editor" onSubmit={submitMenuItem}>
          <fieldset disabled={loading}>
            <label>Item Name: <input name="item-name" type="text" required /></label>
            <label>Price: <input name="item-price" type="number" min="0" required /></label>
            <label>Available: <input name="item-available" type="checkbox" /></label>
            <label>Non-Veg: <input name="item-non-veg" type="checkbox" /></label>
            <label>Prep Time (mins): <input name="item-time" type="number" min="1" max="60" required /></label>
            <button type="submit">{loading ? "Submitting..." : "Add Item"}</button>
          </fieldset>
        </form>
      </div>

      {/* Menu Items Table */}
      <div className="vendor-menu-items">
        <h3>Menu Items</h3>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredMenuItems.length > 0 ? (
          <table className="menu-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Type</th> {/* Veg/Non-Veg column */}
                <th>Available</th>
                <th>Time (mins)</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredMenuItems.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.item_name}</td>
                  <td>
                    {editingItemId === item.item_id ? (
                      <span>
                        ₹
                        <input
                          type="number"
                          value={editPrice}
                          min="0"
                          onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                          style={{ width: "70px", marginLeft: "5px" }}
                        />
                      </span>
                    ) : (
                      <>₹{item.price}</>
                    )}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {editingItemId === item.item_id ? (
                      <select value={editNonVeg ? "non-veg" : "veg"} onChange={(e) => setEditNonVeg(e.target.value === "non-veg")}>
                        <option value="veg">VEG</option>
                        <option value="non-veg">NON-VEG</option>
                      </select>
                    ) : item.non_veg ? (
                      <span className="non-veg-symbol">NON-VEG</span>
                    ) : (
                      <span className="veg-symbol">VEG</span>
                    )}
                  </td>
                  <td>
                    {editingItemId === item.item_id ? (
                      <input
                        type="checkbox"
                        checked={editAvailable}
                        onChange={(e) => setEditAvailable(e.target.checked)}
                      />
                    ) : item.available ? "Available" : "Not Available"}
                  </td>
                  <td>
                    {editingItemId === item.item_id ? (
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={editTime}
                        onChange={(e) => setEditTime(parseInt(e.target.value))}
                        style={{ width: "60px" }}
                      />
                    ) : (
                      item.time
                    )}
                  </td>
                  <td>
                    {editingItemId === item.item_id ? (
                      <>
                        <button className="edit-btn" onClick={() => saveMenuItem(item.item_id)}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditingItemId(null)}>Cancel</button>
                      </>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingItemId(item.item_id);
                          setEditPrice(item.price);
                          setEditAvailable(item.available);
                          setEditNonVeg(item.non_veg);
                          setEditTime(item.time);
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteMenuItem(item.item_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
}

export default VendorProfileWithShop;