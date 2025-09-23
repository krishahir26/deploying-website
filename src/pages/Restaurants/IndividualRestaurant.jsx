import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getShop, getShopInfo} from "../../utils.js";

const IndividualRestaurant = () => {
    const {shopId} = useParams();
    const [shop, setShop] = useState(undefined);
    const navigate = useNavigate();
    const [shopInfo, setShopInfo] = useState(undefined);
    // if shop not found, show 404
    useEffect(() => {
        if (shop === null) navigate("/404")
    }, [navigate, shop]);

    useEffect(() => {
        getShop(shopId).then(s => setShop(s)).catch(console.error);
    }, [shopId]);
    useEffect(() => {
        getShopInfo(shopId).then(s => setShopInfo(s)).catch(console.error);
    }, [shopId]);
    console.log(shopInfo);
    return (<div><pre><code>{JSON.stringify(shopInfo, null, 2)}</code></pre></div>);
}

export default IndividualRestaurant;