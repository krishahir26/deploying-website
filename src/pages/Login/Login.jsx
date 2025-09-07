import React, {useEffect, useState} from 'react'
import "./Login.css"
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {supabaseClient} from "../../utils.js";
import {Auth} from "@supabase/auth-ui-react";
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [session, setSession] = useState(null);
    useEffect(() => {
        supabaseClient.auth.getSession().then(({data: {session}}) => {
            setSession(session)
        })
        const {data: {subscription},} = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        return () => subscription.unsubscribe()
    }, []);
    const navigate = useNavigate();
    if (session === null) return (
        <div className="supabase-auth">
            <Auth supabaseClient={supabaseClient} appearance={{theme: ThemeSupa}}
                  providers={["google"]}/>
        </div>
    )
    else return navigate("/restaurants")
}

export default Login