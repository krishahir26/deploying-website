import React, {useEffect} from 'react'
import "./VendorLogin.css"
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {supabaseClient, useSession} from "../../utils.js";
import {Auth} from "@supabase/auth-ui-react";
import {useNavigate} from "react-router-dom";

const VendorLogin = () => {
    const session = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!session) return;
        const isVendor = async () => {
            const {data, error} = await supabaseClient
                .from("vendor_emails")
                .select("email")
                .eq("email", session.user.email)
                .limit(1);
            if (error) {
                console.error(error);
                return;
            }
            if (!data || data.length === 0) {
                await supabaseClient.auth.signOut();
                navigate("/unauthorized", {replace: true});
            } else {
                navigate("/404", {replace: true});
            }
            // console.log(data);
        }
        isVendor().then().catch(console.error);
    }, [navigate, session]);
    if (session === undefined) return (<p>Loading...</p>);
    if (session === null) return (
        <div className="supabase-auth-vendor">
            <Auth
                supabaseClient={supabaseClient}
                appearance={{theme: ThemeSupa}}
                providers={["google"]}
                onlyThirdPartyProviders={true}
                redirectTo={window.location.origin + "/vendor-login"}
            />
        </div>
    )
    return (<div>checking access...</div>);

}
export default VendorLogin