import "./Profile.css"
import {supabaseClient, useSession} from "../../utils.js";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const Profile = () => {
    const session = useSession();
    const navigate = useNavigate();
    useEffect(() => {
        if (session === null) {
            navigate("/login", {replace: true});
        }
    }, [navigate, session]);
    if (session === undefined) return <p>Loading...</p>;
    return (
        <div className="logout-button">
            <button
                onClick={async () => {
                    await supabaseClient.auth.signOut();
                    navigate("/", {replace: true});
                }}>
                log out
            </button>
        </div>
    );
}
export default Profile