import "./VendorProfile.css"
import { getShopInfo, ifNotVendorRedirect, useSession, vendorHasShop} from "../../utils";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import VendorProfileWithoutShop from "../../components/VendorProfile/VendorProfileWithoutShop";
import VendorProfileWithShop from "../../components/VendorProfile/VendorProfileWithShop";

const VendorProfile = () => {
    const session = useSession();
    const navigate = useNavigate();
    const [vendorId, setVendorId] = useState(undefined);
    const [shopId, setShopId] = useState(undefined);
    const [shopInfo, setShopInfo] = useState(undefined);
    
    useEffect(() => {
        if (!session) return;
        ifNotVendorRedirect(session, navigate).catch(console.error);
    }, [navigate, session]);
    
    useEffect(() => {
        if (!session) return;
        vendorHasShop(session).then(({shop_id, vendor_id}) => {
            setShopId(shop_id);
            setVendorId(vendor_id)
        }).catch(console.error);
    }, [session]);

    useEffect(() => {
        getShopInfo(shopId).then(info => setShopInfo(info)).catch(console.error);
    }, [shopId]);
    if (!session || shopInfo === undefined) return (<p>Loading...</p>);
    if (shopId === null) return (<VendorProfileWithoutShop vendorId={vendorId}/>); // if no shop show shop setup form
    else return (<VendorProfileWithShop shopId={shopId} shopInfo={shopInfo}/>);
}
export default VendorProfile;