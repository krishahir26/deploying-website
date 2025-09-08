import "./AdminLogin.css"
import {isSuperAdmin, supabaseClient, useSession} from "../../utils.js";
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import {Auth} from "@supabase/auth-ui-react";
import {ThemeSupa} from "@supabase/auth-ui-shared";

const AdminLogin = () => {
    const session = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (!session) return;
        isSuperAdmin(session, navigate).then().catch(console.error);
    }, [navigate, session]);
    if (session === undefined) return (<p>Loading...</p>);
    if (session === null) return (
        <div className="admin-login">
            <div className="supabase-auth-admin">
                <Auth
                    supabaseClient={supabaseClient}
                    appearance={{theme: ThemeSupa}}
                    providers={["google"]}
                    onlyThirdPartyProviders={true}
                    redirectTo={window.location.origin + "/admin-profile"}
                />
            </div>
        </div>
    )
    return (<div>checking access...</div>)
}

export default AdminLogin;