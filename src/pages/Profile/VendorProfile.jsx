import "./VendorProfile.css"
import {isVendor, useSession, vendorHasShop} from "../../utils.js";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const VendorProfile = () => {
    const session = useSession();
    const navigate = useNavigate();
    const [hasShop, setHasShop] = useState(false);
    useEffect(() => {
        if (!session) return;
        isVendor(session, navigate).then().catch(console.error);
        vendorHasShop(session).then(ok => setHasShop(ok)).catch(console.error);
    }, [navigate, session]);
    if (session === undefined) return (<p>Loading...</p>);
    if (session === null) {
        navigate("/unauthorized");
        return;
    }
    if (hasShop) return (
        <div className="vendor-profile-with-shop">
            ts guy has a shop
        </div>
    ); else return (
        <div className="vendor-profile-without-shop">
            ts guy shopless
        </div>
    )
}
export default VendorProfile;