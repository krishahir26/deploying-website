import "./Restaurants.css"
import {useEffect, useState} from "react";
import {getAllShopImages} from "../../utils.js";

const Restaurants = () => {
    const [shopImages, setShopImages] = useState(undefined);
    useEffect(() => {
        if (shopImages) return;
        getAllShopImages().then(res => setShopImages(res)).catch(console.error);
    }, [shopImages])
    if (!shopImages) return (<h1>Loading...</h1>);
    if (shopImages.length === 0) {
        return (
            <div className="restaurants">
                No restaurants found!
            </div>
        )
    }
    let res = undefined;
    for (const shopImage of shopImages) {
        // todo: build the list of restaurants with pretty tiles
        console.log(shopImage);
    }
    return res;
}

export default Restaurants