import "./User.css"
import React from "react";
import {useSession} from "../../utils.js";
import {Link} from "react-router-dom";

const User = () => {
    const session = useSession();

    if (session === null) {
        return (
            <Link to="/login">
                <button>sign in</button>
            </Link>
        );
    }
    return (
        <Link to="/profile">
            <img
                src="/pfp.jpg"
                width="125"
                height="125"
                alt="avatar"
            />
        </Link>
    );

};

export default User;
