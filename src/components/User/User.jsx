import "./User.css"
import React, {useEffect, useState} from "react";
import {supabaseClient} from "../../utils.js";
import {Link} from "react-router-dom";


const User = () => {
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


    if (session === null) {
        return (
            <Link to="/login">
                <button>sign in</button>
            </Link>
        )
    } else {
        return (
            <Link to="/profile">
                <img
                    src="/pfp.jpg"
                    width="150"
                    height="150"
                    alt="avatar"
                />
            </Link>
        )
    }
}

export default User