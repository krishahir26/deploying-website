import React from 'react'
import "./Login.css"
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {supabaseClient} from "../../utils.js";
import {Auth} from "@supabase/auth-ui-react";

const Login = () => {
    return (
        <div className="login">
            <div className="supabase-auth">
                <Auth
                    supabaseClient={supabaseClient}
                    appearance={{theme: ThemeSupa}}
                    providers={["google"]}
                    onlyThirdPartyProviders={true}
                    redirectTo={window.location.origin + "/profile"}
                />
            </div>
        </div>
    )
}
export default Login