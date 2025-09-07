import "./Profile.css"
import {returnSession, supabaseClient} from "../../utils.js";
import {useNavigate} from "react-router";

const Profile = () => {
    const session = returnSession();
    const navigate = useNavigate();
    const logOut = () => {
        supabaseClient.auth.signOut();
    }
    if (session === null) return navigate("/login");
    console.log("session", session)
    return (
        <div className="logout-button">
            <button onClick={logOut}>log out</button>
        </div>
    );
}

export default Profile