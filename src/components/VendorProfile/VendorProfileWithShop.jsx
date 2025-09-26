import { useEffect, useState } from 'react'
import { getMenuItems, sha256sum, supabaseClient } from "../../utils";

function VendorProfileWithShop({ shopId, shopInfo }) {
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState(undefined);

    // fetch menu items 
    useEffect(() => {
        if (shopInfo === undefined) return;
        if (shopInfo.menu_id === null) return;
        getMenuItems(shopInfo.menu_id).then(items => setMenuItems(items)).catch(console.error);
    }, [shopInfo]);

    const submitMenuItem = async (e) => {
        console.log(loading);
        e.preventDefault();
        setLoading(true);
        const form = new FormData(e.target);
        const menuId = shopInfo.menu_id === null ? sha256sum(`${shopId}:menu`) : shopInfo.menu_id;
        const itemName = form.get("item-name");
        const itemPrice = form.get("item-price");
        const itemAvailable = form.get("item-available") === "on";
        const itemNonVeg = form.get("item-non-veg") === "on";
        const itemTime = form.get("item-time");
        const itemId = crypto.randomUUID();

        const insertMenuItem = await supabaseClient.from("menu").insert({
            menu_id: menuId,
            item_id: itemId,
            item_name: itemName,
            price: itemPrice,
            available: itemAvailable,
            non_veg: itemNonVeg,
            time: itemTime
        });
        if (insertMenuItem.error) {
            console.error(insertMenuItem.error);
            e.target.reset();
        } else {
            setLoading(false);
            e.target.reset();
        }
        // always assume menu_id is null and update it
        const updateShopMenuId = await supabaseClient.from("shops")
            .update({ menu_id: menuId })
            .eq("shop_id", shopId);
        if (updateShopMenuId.error) {
            console.error(updateShopMenuId.error);
        }
        // refresh menu items
        const items = await getMenuItems(menuId);
        setMenuItems(items);
    }
    let menu = (
        <div>
            <form className="menu-editor" onSubmit={submitMenuItem}>
                <fieldset disabled={loading}>
                    <label htmlFor="item-name">
                        item name:
                        <input
                            id="item-name"
                            name="item-name"
                            type="text"
                            required
                        />
                    </label><br />
                    <label htmlFor="item-price">
                        item price:
                        <input
                            id="item-price"
                            name="item-price"
                            type="number"
                            required
                        />
                    </label><br />
                    <label htmlFor="item-available">
                        available:
                        <input
                            id="item-available"
                            name="item-available"
                            type="checkbox"
                            checked
                            required
                        />
                    </label><br />
                    <label htmlFor="item-non-veg">
                        non-veg:
                        <input
                            id="item-non-veg"
                            name="item-non-veg"
                            type="checkbox"
                        />
                    </label><br />
                    <label htmlFor="item-time">
                        time (in minutes):
                        <input
                            id="item-time"
                            name="item-time"
                            type="number"
                            min="1"
                            max="60"
                            required
                        />
                    </label><br />
                    <button type="submit">submit</button>
                </fieldset>
            </form>
        </div>
    );
    if (shopInfo) return (
        <div className="vendor-profile-with-shop">
            <div className="vendor-shop">
                <div id="shop-name">[{shopInfo.name}] is the shop's name</div>
                <div id="shop-icon"><img src={shopInfo.iconUrl} alt="shop icon" height={150} width={150} /></div>
                <br />
                <div id="shop-description">[{shopInfo.description}] is the shop's description</div>
                <div id="shop-banner"><img src={shopInfo.bannerUrl} alt="shop banner" width={360} height={250} /></div>
                <br />
                now here are the extra images
                {shopInfo.extraImages.map(url => (<div><img src={url} alt="" width={100} height={100} /></div>))}
            </div>
            <div className="vendor-menu-setup">
                {menu}
            </div>
            <div className="vendor-menu-items">
                // todo: show menu items here
                {console.log(menuItems)}
            </div>
        </div>
    );
}

export default VendorProfileWithShop