import React, {useEffect} from 'react'
import "./VendorLogin.css"
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {isVendor, supabaseClient, useSession} from "../../utils.js";
import {Auth} from "@supabase/auth-ui-react";
import {useNavigate} from "react-router-dom";

const VendorLogin = () => {
    const session = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!session) return;
        isVendor(session, navigate).then().catch(console.error);
    }, [navigate, session]);
    if (session === undefined) return (<p>Loading...</p>);
    if (session === null) return (
        <div className="vendor-login">
            <div className="supabase-auth-vendor">
                <Auth
                    supabaseClient={supabaseClient}
                    appearance={{theme: ThemeSupa}}
                    providers={["google"]}
                    onlyThirdPartyProviders={true}
                    redirectTo={window.location.origin + "/vendor-profile"}
                />
            </div>
        </div>
    )
    return (<div>checking access...</div>);

}
export default VendorLogin