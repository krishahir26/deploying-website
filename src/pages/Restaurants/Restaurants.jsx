import "./Restaurants.css"
import {useEffect, useState} from "react";
import {getAllShopImages, getAllShopInfo} from "../../utils.js";

const Restaurants = () => {
    const [shopInfos, setShopInfos] = useState(undefined);
    useEffect(() => {
        if (shopInfos) return;
        getAllShopInfo().then(res => setShopInfos(res)).catch(console.error);
    }, []);
    if (!shopInfos) return (<h1>Loading...</h1>);
    if (shopInfos.length === 0) {
        return (
            <div className="restaurants">
                No restaurants found!
            </div>
        )
    }
    let res = undefined;
    for (const info of shopInfos) {
        // todo: build the list of restaurants with pretty tiles
        console.log(info);
    }
    return res;
}

export default Restaurants